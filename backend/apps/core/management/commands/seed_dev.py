"""Seeds de desenvolvimento para ambiente local."""

from django.apps import apps
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import connection, transaction
from django_tenants.utils import get_tenant_domain_model, get_tenant_model

from shared.utils.tenant import tenant_context


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
    help = "Cria tenant, domínios e usuários padrão para desenvolvimento local."

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

        with tenant_context(tenant):
            self._ensure_default_admin(tenant)
            self._ensure_default_service_account(tenant)

        self.stdout.write(self.style.SUCCESS("Seed de desenvolvimento concluído."))

    def _ensure_default_admin(self, tenant):
        UserModel = get_user_model()
        admin_user, user_created = UserModel.objects.get_or_create(
            email="admin@faladesk.dev",
            defaults={
                "full_name": "Faladesk Admin",
                "language": "pt-br",
                "is_staff": True,
                "is_superuser": True,
            },
        )

        if user_created:
            admin_user.set_unusable_password()
            admin_user.save()
            self.stdout.write(
                self.style.SUCCESS(
                    "Usuário admin padrão criado (admin@faladesk.dev)."
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING("Usuário admin já existente reutilizado.")
            )

        TenantUser = apps.get_model("core", "TenantUser")
        tenant_user, membership_created = TenantUser.objects.get_or_create(
            tenant=tenant,
            user=admin_user,
            defaults={
                "status": TenantUser.Status.ACTIVE,
                "title": "Administrador",
            },
        )

        if membership_created:
            tenant_user.activate()
            self.stdout.write(
                self.style.SUCCESS("Associação do admin ao tenant criada.")
            )

    def _ensure_default_service_account(self, tenant):
        ServiceAccount = apps.get_model("core", "ServiceAccount")
        ServiceAccountKey = apps.get_model("core", "ServiceAccountKey")

        admin_user = get_user_model().objects.filter(
            email="admin@faladesk.dev"
        ).first()

        service_account, _ = ServiceAccount.objects.get_or_create(
            tenant=tenant,
            name="default-api",
            defaults={
                "description": "Conta padrão para integrações",
                "status": ServiceAccount.Status.ACTIVE,
                "created_by": admin_user,
            },
        )

        if not service_account.keys.exists():
            key = ServiceAccountKey(service_account=service_account, name="default")
            secret = key.set_secret()
            key.save()
            self.stdout.write(
                self.style.SUCCESS(
                    "Chave padrão criada para conta de serviço 'default-api'."
                )
            )
            self.stdout.write(
                self.style.WARNING(
                    "Anote o segredo da conta de serviço (exibido uma única vez): "
                    f"{key.key_id}:{secret}"
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    "Conta de serviço padrão já possuía chaves configuradas."
                )
            )
