"""
PyMongo connection singleton for ghana-tax-system.
Full implementation in Phase 2. This stub provides the interface
so all app modules can import from here without breaking.
"""

import logging
from typing import Optional
from django.conf import settings

logger = logging.getLogger(__name__)

# Collection name constants — used across all repository classes
TRADERS = "traders"
BUSINESSES = "businesses"
LOCATIONS = "locations"
ADMINS = "admins"
AUDIT_LOGS = "audit_logs"
USSD_SESSIONS = "ussd_sessions"

_client = None
_db = None


def get_client():
    """Return the singleton MongoClient. Implemented fully in Phase 2."""
    global _client
    if _client is None:
        # Phase 2 will implement retry logic and proper error handling
        try:
            from pymongo import MongoClient
            _client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
            logger.info("MongoDB client initialized")
        except Exception as exc:
            logger.error("Failed to connect to MongoDB: %s", exc)
            raise
    return _client


def get_db():
    """Return the primary database instance."""
    global _db
    if _db is None:
        _db = get_client()[settings.MONGO_DB_NAME]
    return _db


def get_collection(name: str):
    """Convenience helper — returns a named collection."""
    return get_db()[name]
