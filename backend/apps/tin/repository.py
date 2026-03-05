"""
TINRepository — atomic TIN uniqueness checks against the traders collection.
"""

import logging

from core.utils.mongo import get_collection, TRADERS

logger = logging.getLogger(__name__)


class TINRepository:
    """Uniqueness guard for TIN numbers."""

    def _col(self):
        return get_collection(TRADERS)

    def exists(self, tin_number: str) -> bool:
        """Return True if this TIN is already taken."""
        return self._col().count_documents({"tin_number": tin_number}, limit=1) > 0

    def reserve(self, tin_number: str, trader_id: str) -> bool:
        """
        Attempt to atomically claim a TIN for trader_id.
        Uses update_one with upsert=False — the actual reservation happens
        when the full trader document is inserted with the unique index enforced.
        Returns False if the TIN already exists (duplicate key).
        """
        try:
            result = self._col().update_one(
                {"tin_number": tin_number},
                {"$setOnInsert": {"tin_number": tin_number, "trader_id": trader_id}},
                upsert=True,
            )
            # upserted_id is set only when a new document was inserted
            return result.upserted_id is not None
        except Exception as exc:
            logger.warning("TIN reservation failed for %s: %s", tin_number, exc)
            return False
