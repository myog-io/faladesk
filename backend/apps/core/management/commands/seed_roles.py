from __future__ import annotations

from django.core.management.base import BaseCommand

from apps.core.models import Tenant
from apps.core.seeders import seed_core_rbac


class Command(BaseCommand):
    help = "Aplica seeds de permissões e papéis padrão por tenant."

    def add_arguments(self, parser):  # type: ignore[override]
        parser.add_argument(
            "--tenant",
            dest="tenant_slug",
            help="Slug do tenant específico para aplicar os seeds.",
        )

    def handle(self, *args, **options):  # type: ignore[override]
        tenant_slug = options.get("tenant_slug")
        tenant = None
        if tenant_slug:
            try:
                tenant = Tenant.objects.get(slug=tenant_slug)
            except Tenant.DoesNotExist:
                self.stderr.write(self.style.ERROR(f"Tenant '{tenant_slug}' não encontrado."))
                return

        results = seed_core_rbac(tenant=tenant)
        for result in results:
            if result.skipped:
                self.stdout.write(self.style.WARNING(result.message()))
            else:
                self.stdout.write(self.style.SUCCESS(result.message()))

        self.stdout.write(self.style.SUCCESS("Seeds de RBAC processados."))
