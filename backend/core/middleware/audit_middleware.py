"""
AuditMiddleware — stub for Phase 1.
Full implementation in Phase 3 (attaches request metadata to audit logs).
"""

import logging

logger = logging.getLogger(__name__)


class AuditMiddleware:
    """
    Middleware stub that will be extended in Phase 3 to:
    - Attach IP address and user-agent to the request object
    - Make audit context available to all views without repetition
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Attach client IP for use in audit logs
        request.client_ip = self._get_client_ip(request)
        request.user_agent = request.META.get("HTTP_USER_AGENT", "")

        response = self.get_response(request)
        return response

    @staticmethod
    def _get_client_ip(request) -> str:
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "")
