"""
seed_demo_data management command — stub for Phase 1.
Full implementation in Phase 2.

Usage:
    python manage.py seed_demo_data
"""

import logging
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Seed the database with demo data (admins, traders, audit logs)"

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING(
                "seed_demo_data: stub only — full implementation in Phase 2."
            )
        )
