"""
AuditMiddleware — attaches request metadata to every request object.
Views and services read request.client_ip / request.user_agent when writing
audit log entries, avoiding repetition throughout the codebase.
"""

import logging

logger = logging.getLogger(__name__)


class AuditMiddleware:
    """
    Extracts client IP (honouring X-Forwarded-For for proxied deployments)
    and User-Agent, attaching them to the request for downstream use.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.client_ip = self._get_client_ip(request)
        request.user_agent = request.META.get("HTTP_USER_AGENT", "")[:512]
        response = self.get_response(request)
        return response

    @staticmethod
    def _get_client_ip(request) -> str:
        """
        Return the real client IP.
        Respects X-Forwarded-For when behind a proxy/load balancer.
        Takes only the first (leftmost) IP from the forwarded chain.
        """
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "unknown")
