"""
AdminRepository — MongoDB read/write layer for the admins collection.
All business logic lives in services.py; this class only talks to the DB.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from core.utils.mongo import get_collection, ADMINS

logger = logging.getLogger(__name__)


class AdminRepository:
    """CRUD operations for the admins collection."""

    def _col(self):
        return get_collection(ADMINS)

    # ── Reads ──────────────────────────────────────────────────────────────────

    def find_by_email(self, email: str) -> Optional[dict]:
        """Return admin document by email (case-insensitive) or None."""
        return self._col().find_one(
            {"email": {"$regex": f"^{email}$", "$options": "i"}},
            {"_id": 0},
        )

    def find_by_id(self, admin_id: str) -> Optional[dict]:
        """Return admin document by admin_id (uuid string) or None."""
        return self._col().find_one({"admin_id": admin_id}, {"_id": 0})

    def list_all(self) -> list[dict]:
        """Return all admin documents, newest first, passwords excluded."""
        cursor = self._col().find(
            {},
            {"password_hash": 0, "_id": 0},
        ).sort("created_at", -1)
        return list(cursor)

    # ── Writes ─────────────────────────────────────────────────────────────────

    def create(self, admin_data: dict) -> dict:
        """
        Insert a new admin document.
        Expects admin_data to already contain password_hash (not plain password).
        Returns the inserted document (without _id).
        """
        now = datetime.now(timezone.utc)
        doc = {**admin_data, "created_at": now, "updated_at": now, "last_login_at": None}
        self._col().insert_one(doc)
        doc.pop("_id", None)
        doc.pop("password_hash", None)
        return doc

    def update(self, admin_id: str, updates: dict) -> Optional[dict]:
        """
        Patch an admin document by admin_id.
        Returns the updated document (without password_hash) or None if not found.
        """
        updates["updated_at"] = datetime.now(timezone.utc)
        result = self._col().find_one_and_update(
            {"admin_id": admin_id},
            {"$set": updates},
            return_document=True,  # return the updated doc
            projection={"password_hash": 0, "_id": 0},
        )
        return result

    def update_last_login(self, admin_id: str) -> None:
        """Stamp last_login_at with current UTC time."""
        self._col().update_one(
            {"admin_id": admin_id},
            {"$set": {"last_login_at": datetime.now(timezone.utc)}},
        )
