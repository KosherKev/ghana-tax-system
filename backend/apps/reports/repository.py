"""
ReportsRepository — MongoDB aggregation pipelines for the reports app.
All queries target the traders collection. Pipelines are optimised to use
existing indexes (channel, created_at, region/district).
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

from pymongo import ASCENDING

from core.utils.mongo import get_collection, TRADERS

logger = logging.getLogger(__name__)


def _date_match(date_filter: Optional[dict]) -> dict:
    """Build a $match stage from an optional {$gte, $lte} date filter dict."""
    if date_filter:
        return {"$match": {"created_at": date_filter}}
    return {"$match": {}}


class ReportsRepository:
    """Aggregation-based reporting queries against the traders collection."""

    def _col(self):
        return get_collection(TRADERS)

    # ── KPI totals ────────────────────────────────────────────────────────────

    def kpi_totals(self) -> dict:
        """Return total trader count and today's count."""
        col = self._col()
        total = col.count_documents({})

        today_start = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        today = col.count_documents({"created_at": {"$gte": today_start}})

        channel_counts = {}
        for doc in col.aggregate([
            {"$group": {"_id": "$channel", "count": {"$sum": 1}}}
        ]):
            channel_counts[doc["_id"]] = doc["count"]

        return {
            "total_traders": total,
            "today_registrations": today,
            "web_registrations": channel_counts.get("web", 0),
            "ussd_registrations": channel_counts.get("ussd", 0),
        }

    # ── Breakdowns ────────────────────────────────────────────────────────────

    def summary_by_channel(self, date_filter: Optional[dict] = None) -> list[dict]:
        pipeline = [
            _date_match(date_filter),
            {"$group": {"_id": "$channel", "count": {"$sum": 1}}},
            {"$project": {"channel": "$_id", "count": 1, "_id": 0}},
            {"$sort": {"count": -1}},
        ]
        return list(self._col().aggregate(pipeline))

    def summary_by_location(self, date_filter: Optional[dict] = None) -> list[dict]:
        pipeline = [
            _date_match(date_filter),
            {
                "$group": {
                    "_id": {"region": "$region", "district": "$district"},
                    "count": {"$sum": 1},
                }
            },
            {
                "$project": {
                    "region": "$_id.region",
                    "district": "$_id.district",
                    "count": 1,
                    "_id": 0,
                }
            },
            {"$sort": {"count": -1}},
        ]
        return list(self._col().aggregate(pipeline))

    def summary_by_business_type(self, date_filter: Optional[dict] = None) -> list[dict]:
        pipeline = [
            _date_match(date_filter),
            {"$group": {"_id": "$business_type", "count": {"$sum": 1}}},
            {"$project": {"type": "$_id", "count": 1, "_id": 0}},
            {"$sort": {"count": -1}},
        ]
        return list(self._col().aggregate(pipeline))

    def daily_registrations(self, days: int = 30) -> list[dict]:
        """Return [{date: 'YYYY-MM-DD', count: N}] for the last `days` days."""
        since = datetime.now(timezone.utc) - timedelta(days=days)
        pipeline = [
            {"$match": {"created_at": {"$gte": since}}},
            {
                "$group": {
                    "_id": {
                        "year": {"$year": "$created_at"},
                        "month": {"$month": "$created_at"},
                        "day": {"$dayOfMonth": "$created_at"},
                    },
                    "count": {"$sum": 1},
                }
            },
            {
                "$project": {
                    "date": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": {
                                "$dateFromParts": {
                                    "year": "$_id.year",
                                    "month": "$_id.month",
                                    "day": "$_id.day",
                                }
                            },
                        }
                    },
                    "count": 1,
                    "_id": 0,
                }
            },
            {"$sort": {"date": ASCENDING}},
        ]
        return list(self._col().aggregate(pipeline))

    # ── Export ────────────────────────────────────────────────────────────────

    def export_traders_csv(self, filters: Optional[dict] = None) -> list[dict]:
        """
        Return all matching traders formatted for CSV export.
        Uses the same filter logic as TraderRepository.list_with_filters.
        """
        from apps.registration.repository import TraderRepository
        repo = TraderRepository()
        query = repo._build_query(filters or {})
        cursor = self._col().find(
            query,
            {
                "_id": 0,
                "tin_number": 1,
                "name": 1,
                "phone_number": 1,
                "business_type": 1,
                "region": 1,
                "district": 1,
                "market_name": 1,
                "channel": 1,
                "created_at": 1,
            },
        ).sort("created_at", -1)
        return list(cursor)
