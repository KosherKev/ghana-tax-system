"""
USSD input validators — shared across state machine steps.
"""

import re

_GHANA_PHONE_RE = re.compile(
    r"^(\+233|233|0)([2-9][0-9]{8})$"
)


def validate_ussd_name(value: str) -> tuple[bool, str]:
    """Return (is_valid, error_message). Name: 3–60 chars, non-empty."""
    stripped = value.strip()
    if not stripped:
        return False, "Name cannot be empty."
    if len(stripped) < 3:
        return False, "Name must be at least 3 characters."
    if len(stripped) > 60:
        return False, "Name must be 60 characters or fewer."
    return True, ""


def validate_ussd_market(value: str) -> tuple[bool, str]:
    """Market / community name: non-empty, max 80 chars."""
    stripped = value.strip()
    if not stripped:
        return False, "Market/community name cannot be empty."
    if len(stripped) > 80:
        return False, "Market name must be 80 characters or fewer."
    return True, ""


def validate_ussd_phone(value: str) -> tuple[bool, str]:
    """Ghana phone validation for USSD CHECK_TIN step."""
    stripped = value.strip()
    if not stripped:
        return False, "Phone number cannot be empty."
    if not _GHANA_PHONE_RE.match(stripped):
        return False, "Enter a valid Ghana phone number (e.g., 0244123456)."
    return True, ""


def normalise_phone(phone: str) -> str:
    """Normalise any Ghana phone format to +233XXXXXXXXX."""
    stripped = phone.strip()
    match = _GHANA_PHONE_RE.match(stripped)
    if not match:
        return phone
    return f"+233{match.group(2)}"
