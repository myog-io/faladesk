from __future__ import annotations

from django.core.management.base import BaseCommand
from django.db import connection, transaction
from django_tenants.utils import get_tenant_domain_model, get_tenant_model


DEV_TENANT_SCHEMA = "dev"
DEV_TENANT_DEFAULTS = {
    "name": "Faladesk Dev",
    "slug": "faladesk-dev",
    "timezone": "UTC",
    "plan": "dev",
    "is_active": True,
    "onboarding_completed": True,
}

DEV_DOMAINS = [
    {"domain": "localhost", "is_primary": True},
    {"domain": "127.0.0.1", "is_primary": False},
    {"domain": "testserver", "is_primary": False},
]


class Command(BaseCommand):
    help = "Cria tenant e domínios padrão para desenvolvimento local."

    def handle(self, *args: object, **options: object) -> None:
        connection.set_schema_to_public()

        tenant_model = get_tenant_model()
        domain_model = get_tenant_domain_model()

        with transaction.atomic():
            tenant, created = tenant_model.objects.get_or_create(
                schema_name=DEV_TENANT_SCHEMA,
                defaults=DEV_TENANT_DEFAULTS,
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Tenant '{tenant.name}' criado com schema '{tenant.schema_name}'."
                    )
                )
            else:
                updated_fields: list[str] = []
                for field, value in DEV_TENANT_DEFAULTS.items():
                    if getattr(tenant, field) != value:
                        setattr(tenant, field, value)
                        updated_fields.append(field)

                if updated_fields:
                    tenant.save(update_fields=updated_fields)
                    self.stdout.write(
                        self.style.WARNING(
                            "Tenant de desenvolvimento existente atualizado: "
                            + ", ".join(updated_fields)
                        )
                    )
                else:
                    self.stdout.write(
                        f"Tenant '{tenant.name}' já estava configurado."
                    )

            for domain_config in DEV_DOMAINS:
                domain, domain_created = domain_model.objects.update_or_create(
                    domain=domain_config["domain"],
                    defaults={
                        "tenant": tenant,
                        "is_primary": domain_config["is_primary"],
                    },
                )

                if domain_created:
                    message_style = self.style.SUCCESS
                    message_suffix = "criado"
                else:
                    message_style = self.style.WARNING
                    message_suffix = "atualizado"

                self.stdout.write(
                    message_style(
                        f"Domínio '{domain.domain}' {message_suffix} "
                        f"(tenant={domain.tenant.schema_name}, primary={'sim' if domain.is_primary else 'não'})."
                    )
                )

        self.stdout.write(self.style.SUCCESS("Seed de desenvolvimento concluído."))
