"""
Audit serializers — query param parsing for the audit log list endpoint.
"""

from rest_framework import serializers


class AuditLogQuerySerializer(serializers.Serializer):
    action = serializers.CharField(required=False, allow_blank=True)
    actor_id = serializers.CharField(required=False, allow_blank=True)
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    page = serializers.IntegerField(min_value=1, default=1)
    page_size = serializers.IntegerField(min_value=1, max_value=100, default=20)
