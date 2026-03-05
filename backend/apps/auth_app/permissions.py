"""
DRF permission classes for ghana-tax-system.
Three levels of access:
  IsAdminAuthenticated — any valid admin JWT
  IsTaxAdmin           — TAX_ADMIN or SYS_ADMIN
  IsSysAdmin           — SYS_ADMIN only
"""

import logging

from rest_framework.permissions import BasePermission

logger = logging.getLogger(__name__)


class IsAdminAuthenticated(BasePermission):
    """
    Allows access to any authenticated admin regardless of role.
    Requires JWTAuthentication to have already run and attached request.admin.
    """

    message = "Authentication credentials were not provided or are invalid."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user is not None
            and hasattr(request, "admin")
            and request.admin is not None
        )


class IsTaxAdmin(BasePermission):
    """
    Allows access to TAX_ADMIN and SYS_ADMIN roles.
    SYS_ADMIN is a superset of TAX_ADMIN.
    """

    message = "TAX_ADMIN or SYS_ADMIN role required."

    def has_permission(self, request, view) -> bool:
        if not hasattr(request, "admin") or not request.admin:
            return False
        return request.admin.get("role") in ("TAX_ADMIN", "SYS_ADMIN")


class IsSysAdmin(BasePermission):
    """
    Allows access to SYS_ADMIN only.
    """

    message = "SYS_ADMIN role required."

    def has_permission(self, request, view) -> bool:
        if not hasattr(request, "admin") or not request.admin:
            return False
        return request.admin.get("role") == "SYS_ADMIN"
