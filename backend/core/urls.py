"""
Root URL configuration for ghana-tax-system backend.
"""

from django.urls import path, include

urlpatterns = [
    # Auth endpoints
    path("api/auth/", include("apps.auth_app.urls")),
    # Registration & TIN
    path("api/", include("apps.registration.urls")),
    path("api/tin/", include("apps.tin.urls")),
    # Admin-facing APIs
    path("api/reports/", include("apps.reports.urls")),
    path("api/audit-logs/", include("apps.audit.urls")),
    path("api/admin/", include("apps.auth_app.admin_urls")),
    # USSD webhook
    path("ussd/", include("apps.ussd.urls")),
]
