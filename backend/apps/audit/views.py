"""
Audit views:
  GET /api/audit-logs — paginated audit log list (SYS_ADMIN only)
"""

import logging
from datetime import datetime, timezone

from rest_framework.views import APIView
from rest_framework.request import Request

from apps.audit.repository import AuditRepository
from apps.audit.serializers import AuditLogQuerySerializer
from apps.auth_app.permissions import IsSysAdmin
from core.utils.response import error_response, paginated_response

logger = logging.getLogger(__name__)

_audit_repo = AuditRepository()


class AuditLogListView(APIView):
    """GET /api/audit-logs — SYS_ADMIN only, paginated."""

    permission_classes = [IsSysAdmin]

    def get(self, request: Request):
        qs = AuditLogQuerySerializer(data=request.query_params)
        if not qs.is_valid():
            return error_response("Invalid query parameters.", errors=qs.errors)

        data = qs.validated_data
        page = data.get("page", 1)
        page_size = data.get("page_size", 20)
        skip = (page - 1) * page_size

        filters: dict = {}
        if data.get("action"):
            filters["action"] = data["action"]
        if data.get("actor_id"):
            filters["actor_id"] = data["actor_id"]
        if data.get("date_from"):
            filters["date_from"] = datetime.combine(
                data["date_from"], datetime.min.time()
            ).replace(tzinfo=timezone.utc)
        if data.get("date_to"):
            filters["date_to"] = datetime.combine(
                data["date_to"], datetime.max.time()
            ).replace(tzinfo=timezone.utc)

        logs, total = _audit_repo.list_with_filters(filters, skip=skip, limit=page_size)

        # Serialise datetime fields
        for entry in logs:
            if isinstance(entry.get("created_at"), datetime):
                entry["created_at"] = entry["created_at"].isoformat()

        return paginated_response(
            data=logs,
            total=total,
            page=page,
            page_size=page_size,
            message="Audit logs retrieved.",
        )
