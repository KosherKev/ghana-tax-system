"""
USSD webhook view — POST /ussd/callback
Receives Africa's Talking USSD webhook payload and routes through
the USSDStateMachine. Returns plain-text CON/END responses.
"""

import logging

from django.http import HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit

from apps.audit.repository import AuditRepository
from apps.ussd.state_machine import USSDStateMachine

logger = logging.getLogger(__name__)

_state_machine = USSDStateMachine()
_audit_repo = AuditRepository()


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(ratelimit(key="ip", rate="100/m", method="POST", block=True), name="dispatch")
class USSDCallbackView(View):
    """
    Africa's Talking sends a POST with form-encoded body:
      sessionId     — unique session identifier
      serviceCode   — shortcode that was dialled
      phoneNumber   — caller's MSISDN (+233XXXXXXXXX)
      text          — *-delimited input history (empty string on first dial)

    Response must be:
      Content-Type: text/plain
      Body: CON <menu text>   or   END <terminal text>
    """

    def post(self, request) -> HttpResponse:
        session_id = request.POST.get("sessionId", "")
        service_code = request.POST.get("serviceCode", "")
        msisdn = request.POST.get("phoneNumber", "")
        text = request.POST.get("text", "")

        logger.info(
            "USSD callback | session=%s phone=%s text_len=%d",
            session_id, msisdn, len(text),
        )

        # Basic guard: reject obviously malformed requests
        if not session_id or not msisdn:
            logger.warning("USSD callback missing sessionId or phoneNumber")
            return HttpResponse(
                "END Invalid request.",
                content_type="text/plain",
                status=400,
            )

        try:
            response_text = _state_machine.process(
                session_id=session_id,
                msisdn=msisdn,
                text=text,
            )
        except Exception as exc:
            logger.exception("Unhandled USSD error for session %s: %s", session_id, exc)
            response_text = "END An error occurred. Please try again."

        return HttpResponse(response_text, content_type="text/plain")
