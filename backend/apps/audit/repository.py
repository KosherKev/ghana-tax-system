"""
AuditRepository — write and query the audit_logs collection.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from pymongo import DESCENDING

from core.utils.mongo import get_collection, AUDIT_LOGS

logger = logging.getLogger(__name__)


class AuditRepository:
    """Write-heavy repository for audit_logs. Reads used by the admin audit API."""

    def _col(self):
        return get_collection(AUDIT_LOGS)

    def log(self, event_data: dict) -> None:
        """
        Insert an audit log entry. Fire-and-forget — errors are logged but
        not re-raised so that audit failures never break the primary flow.
        """
        try:
            doc = {
                **event_data,
                "created_at": event_data.get("created_at", datetime.now(timezone.utc)),
            }
            self._col().insert_one(doc)
            doc.pop("_id", None)
        except Exception as exc:
            logger.error("Failed to write audit log: %s | data: %s", exc, event_data)

    def list_with_filters(
        self,
        filters: dict,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[dict], int]:
        """Return (page_of_logs, total_matching_count)."""
        query = self._build_query(filters)
        col = self._col()
        total = col.count_documents(query)
        cursor = (
            col.find(query, {"_id": 0})
            .sort("created_at", DESCENDING)
            .skip(skip)
            .limit(limit)
        )
        return list(cursor), total

    @staticmethod
    def _build_query(filters: dict) -> dict:
        query: dict = {}

        if filters.get("action"):
            query["action"] = filters["action"]

        if filters.get("actor_id"):
            query["actor_id"] = filters["actor_id"]

        if filters.get("entity_type"):
            query["entity_type"] = filters["entity_type"]

        date_filter: dict = {}
        if filters.get("date_from"):
            date_filter["$gte"] = filters["date_from"]
        if filters.get("date_to"):
            date_filter["$lte"] = filters["date_to"]
        if date_filter:
            query["created_at"] = date_filter

        return query
