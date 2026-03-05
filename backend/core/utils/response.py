"""
Standard API response helpers for ghana-tax-system.
Ensures all endpoints return a consistent JSON envelope.
"""

from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework import status


def success_response(data=None, message: str = "", http_status: int = 200) -> Response:
    """Return a successful API response."""
    payload = {"success": True, "message": message, "data": data}
    return Response(payload, status=http_status)


def created_response(data=None, message: str = "Created successfully") -> Response:
    """Return a 201 Created response."""
    return success_response(data=data, message=message, http_status=status.HTTP_201_CREATED)


def error_response(
    message: str,
    errors=None,
    http_status: int = 400,
) -> Response:
    """Return an error API response."""
    payload = {"success": False, "message": message, "errors": errors or {}}
    return Response(payload, status=http_status)


def paginated_response(
    data: list,
    total: int,
    page: int,
    page_size: int,
    message: str = "",
) -> Response:
    """Return a paginated list response."""
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1
    payload = {
        "success": True,
        "message": message,
        "data": data,
        "pagination": {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        },
    }
    return Response(payload, status=status.HTTP_200_OK)


def custom_exception_handler(exc, context) -> Response:
    """
    DRF exception handler — normalises all errors into the standard envelope.
    """
    response = exception_handler(exc, context)

    if response is not None:
        message = str(exc)
        errors = response.data if isinstance(response.data, dict) else {}
        response.data = {
            "success": False,
            "message": message,
            "errors": errors,
        }

    return response
