"""Helpers utilitários relacionados ao contexto de tenant."""

from __future__ import annotations

from contextlib import contextmanager
from typing import Optional

from django.db import connection
from django.http import HttpRequest
from django_tenants.utils import get_tenant_model, schema_context


class TenantNotFoundError(RuntimeError):
    """Erro lançado quando não foi possível resolver o tenant."""


def get_current_tenant(request: Optional[HttpRequest] = None):
    """Obtém o tenant atual a partir da request ou da conexão."""

    if request is not None and hasattr(request, "tenant"):
        tenant = getattr(request, "tenant")
        if tenant is not None:
            return tenant

    return getattr(connection, "tenant", None)


def activate_tenant(tenant, request: Optional[HttpRequest] = None):
    """Garante que a conexão e a request estejam alinhadas com o tenant."""

    if tenant is None:
        return None

    if request is not None:
        setattr(request, "tenant", tenant)

    current_tenant = getattr(connection, "tenant", None)
    if current_tenant != tenant:
        connection.set_tenant(tenant)

    return tenant


def resolve_request_tenant(
    request: Optional[HttpRequest],
    *,
    header: str = "HTTP_X_TENANT",
    required: bool = False,
    default_schema: Optional[str] = None,
):
    """Resolve o tenant a partir da request, cabeçalho ou schema padrão."""

    tenant = get_current_tenant(request)
    if tenant is not None:
        return activate_tenant(tenant, request=request)

    schema = None
    if request is not None:
        schema = request.META.get(header)
        if schema is None and header.startswith("HTTP_"):
            header_name = header.removeprefix("HTTP_").replace("_", "-")
            schema = request.headers.get(header_name)

    if schema is None:
        schema = default_schema

    if schema is None:
        if required:
            raise TenantNotFoundError("Tenant não identificado na requisição.")
        return None

    TenantModel = get_tenant_model()
    try:
        tenant = TenantModel.objects.get(schema_name=schema)
    except TenantModel.DoesNotExist as exc:  # type: ignore[attr-defined]
        if required:
            raise TenantNotFoundError(
                f"Tenant '{schema}' não encontrado."
            ) from exc
        return None

    return activate_tenant(tenant, request=request)


@contextmanager
def tenant_context(tenant_or_schema):
    """Abre um contexto temporário para operar com o tenant informado."""

    if tenant_or_schema is None:
        yield None
        return

    if hasattr(tenant_or_schema, "schema_name"):
        schema_name = tenant_or_schema.schema_name
    else:
        schema_name = str(tenant_or_schema)

    with schema_context(schema_name):
        yield tenant_or_schema
