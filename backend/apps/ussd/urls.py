"""
USSD URL configuration — mounted at /ussd/ in core/urls.py
"""

from django.urls import path
from apps.ussd.views import USSDCallbackView

urlpatterns = [
    path("callback/", USSDCallbackView.as_view(), name="ussd-callback"),
]
