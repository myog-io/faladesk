"""Funções utilitárias compartilhadas."""

from .codes import generate_sequential_code
from .slug import generate_slug
from .tenant import (
    TenantNotFoundError,
    activate_tenant,
    get_current_tenant,
    resolve_request_tenant,
    tenant_context,
)

__all__ = [
    "generate_sequential_code",
    "generate_slug",
    "TenantNotFoundError",
    "activate_tenant",
    "get_current_tenant",
    "resolve_request_tenant",
    "tenant_context",
]
