"""
USSDSessionStore — persists USSD session state across webhook calls.
Strategy: try Redis first (fast, TTL-native); fall back to MongoDB ussd_sessions
collection if Redis is unavailable. Both backends are fully transparent to callers.
"""

import json
import logging
from datetime import datetime, timezone
from typing import Optional

from django.conf import settings

logger = logging.getLogger(__name__)

_redis_client = None


def _get_redis():
    """Lazy-initialise the Redis client. Returns None if Redis is unavailable."""
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    try:
        import redis as redis_lib
        client = redis_lib.from_url(settings.REDIS_URL, decode_responses=True, socket_timeout=2)
        client.ping()
        _redis_client = client
        logger.info("USSD session store: Redis backend active")
    except Exception as exc:
        logger.warning("Redis unavailable — falling back to MongoDB sessions: %s", exc)
        _redis_client = None
    return _redis_client


class USSDSessionStore:
    """
    Session key format: ussd:session:{session_id}
    Stored value: JSON-serialised dict with keys:
      - step: current state name string
      - phone_number: msisdn
      - collected: dict of values gathered so far
      - last_activity_at: ISO8601 string
    """

    _KEY_PREFIX = "ussd:session:"
    _DEFAULT_TTL = 1800  # 30 minutes

    def _redis_key(self, session_id: str) -> str:
        return f"{self._KEY_PREFIX}{session_id}"

    # ── Public API ─────────────────────────────────────────────────────────────

    def get(self, session_id: str) -> Optional[dict]:
        """Return session data dict or None if not found / expired."""
        redis = _get_redis()
        if redis:
            return self._redis_get(redis, session_id)
        return self._mongo_get(session_id)

    def set(self, session_id: str, data: dict, ttl: int = _DEFAULT_TTL) -> None:
        """Persist session data with a TTL (seconds)."""
        data["last_activity_at"] = datetime.now(timezone.utc).isoformat()
        redis = _get_redis()
        if redis:
            self._redis_set(redis, session_id, data, ttl)
        else:
            self._mongo_set(session_id, data, ttl)

    def delete(self, session_id: str) -> None:
        """Remove a session (called after successful registration or timeout)."""
        redis = _get_redis()
        if redis:
            try:
                redis.delete(self._redis_key(session_id))
            except Exception as exc:
                logger.warning("Redis delete failed: %s", exc)
        self._mongo_delete(session_id)

    # ── Redis backend ──────────────────────────────────────────────────────────

    def _redis_get(self, redis, session_id: str) -> Optional[dict]:
        try:
            raw = redis.get(self._redis_key(session_id))
            return json.loads(raw) if raw else None
        except Exception as exc:
            logger.warning("Redis GET failed: %s", exc)
            return None

    def _redis_set(self, redis, session_id: str, data: dict, ttl: int) -> None:
        try:
            redis.setex(self._redis_key(session_id), ttl, json.dumps(data, default=str))
        except Exception as exc:
            logger.warning("Redis SET failed, falling back to Mongo: %s", exc)
            self._mongo_set(session_id, data, ttl)

    # ── MongoDB backend ────────────────────────────────────────────────────────

    def _mongo_get(self, session_id: str) -> Optional[dict]:
        from core.utils.mongo import get_collection, USSD_SESSIONS
        try:
            doc = get_collection(USSD_SESSIONS).find_one(
                {"session_id": session_id}, {"_id": 0}
            )
            return doc
        except Exception as exc:
            logger.error("Mongo session GET failed: %s", exc)
            return None

    def _mongo_set(self, session_id: str, data: dict, ttl: int) -> None:
        from core.utils.mongo import get_collection, USSD_SESSIONS
        try:
            get_collection(USSD_SESSIONS).update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "session_id": session_id,
                        **data,
                        "last_activity_at": datetime.now(timezone.utc),
                    }
                },
                upsert=True,
            )
        except Exception as exc:
            logger.error("Mongo session SET failed: %s", exc)

    def _mongo_delete(self, session_id: str) -> None:
        from core.utils.mongo import get_collection, USSD_SESSIONS
        try:
            get_collection(USSD_SESSIONS).delete_one({"session_id": session_id})
        except Exception as exc:
            logger.warning("Mongo session DELETE failed: %s", exc)
