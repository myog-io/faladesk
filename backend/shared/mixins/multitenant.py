"""Mixins relacionados a multi-tenant."""

from __future__ import annotations

from django.core.exceptions import ImproperlyConfigured
from django.db.models import QuerySet

from shared.utils.tenant import get_current_tenant


class MultiTenantQuerysetMixin:
    """Filtra querysets automaticamente pelo tenant atual."""

    tenant_field = "tenant"

    def get_tenant(self):  # type: ignore[override]
        tenant = get_current_tenant(getattr(self, "request", None))
        if tenant is None:
            raise ImproperlyConfigured(
                "Tenant não identificado para executar a consulta."
            )
        return tenant

    def filter_queryset_by_tenant(self, queryset: QuerySet) -> QuerySet:
        tenant = self.get_tenant()
        return queryset.filter(**{self.tenant_field: tenant})

    def get_queryset(self) -> QuerySet:  # type: ignore[override]
        queryset = super().get_queryset()
        return self.filter_queryset_by_tenant(queryset)
