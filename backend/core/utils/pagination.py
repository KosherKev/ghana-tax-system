"""
Pagination utilities for ghana-tax-system.
Used by all list endpoints to standardise page/skip/limit handling.
"""

from typing import Tuple


DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


def get_pagination_params(request) -> dict:
    """
    Extract and validate pagination parameters from a DRF request.
    Returns a dict with: page, page_size, skip, limit.
    """
    try:
        page = max(1, int(request.query_params.get("page", 1)))
    except (ValueError, TypeError):
        page = 1

    try:
        page_size = min(
            MAX_PAGE_SIZE,
            max(1, int(request.query_params.get("page_size", DEFAULT_PAGE_SIZE))),
        )
    except (ValueError, TypeError):
        page_size = DEFAULT_PAGE_SIZE

    skip = (page - 1) * page_size

    return {
        "page": page,
        "page_size": page_size,
        "skip": skip,
        "limit": page_size,
    }


def paginate_queryset(items: list, skip: int, limit: int) -> list:
    """
    Apply pagination to an in-memory list (use MongoDB skip/limit for large sets).
    """
    return items[skip : skip + limit]
