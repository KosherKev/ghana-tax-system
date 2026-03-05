"""
Audit URL configuration — mounted at /api/audit-logs/ in core/urls.py
"""

from django.urls import path
from apps.audit.views import AuditLogListView

urlpatterns = [
    path("", AuditLogListView.as_view(), name="audit-log-list"),
]
