"""Helpers e permission classes para RBAC multi-tenant."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any, Optional

from django.utils import timezone
from rest_framework.permissions import BasePermission

from shared.utils.tenant import get_current_tenant


def _normalize_scope(scope: Any) -> tuple[Optional[str], Optional[str]]:
    if scope is None:
        return None, None
    if isinstance(scope, Mapping):
        scope_type = scope.get("type") or scope.get("scope_type")
        scope_id = scope.get("id") or scope.get("scope_id")
        if scope_id is not None:
            scope_id = str(scope_id)
        return scope_type, scope_id
    if isinstance(scope, Sequence) and not isinstance(scope, (str, bytes, bytearray)):
        items = list(scope)
        if not items:
            return None, None
        scope_type = items[0]
        scope_id = str(items[1]) if len(items) > 1 and items[1] is not None else None
        return scope_type, scope_id
    if isinstance(scope, str):
        return scope, None
    return None, None


def has_permission(user, code: str, *, tenant=None, scope: Any = None) -> bool:
    """Valida se o usuário possui a permissão solicitada para o tenant atual."""

    if user is None or not getattr(user, "is_authenticated", False):
        return False
    if getattr(user, "is_superuser", False):
        return True

    from .models import RoleAssignment, TenantUser  # Import tardio para evitar ciclos

    if tenant is None:
        tenant = get_current_tenant()
    if tenant is None:
        return False

    try:
        membership = TenantUser.objects.get(
            tenant=tenant,
            user=user,
            status=TenantUser.Status.ACTIVE,
        )
    except TenantUser.DoesNotExist:
        return False

    scope_type, scope_id = _normalize_scope(scope)
    now = timezone.now()

    assignments = (
        membership.role_assignments.select_related("role")
        .prefetch_related("role__permissions")
        .filter(role__tenant=tenant)
    )

    for assignment in assignments:
        if assignment.effective_from and assignment.effective_from > now:
            continue
        if assignment.effective_to and assignment.effective_to < now:
            continue
        if assignment.scope_type and assignment.scope_type != scope_type:
            continue
        if assignment.scope_id and scope_id and str(assignment.scope_id) != scope_id:
            continue
        if assignment.scope_type and not assignment.scope_id and scope_id:
            continue
        if any(permission.code == code for permission in assignment.role.permissions.all()):
            return True

    return False


class HasTenantPermission(BasePermission):
    """Permission class que consulta `has_permission` centralizado."""

    message = "Você não tem permissão para executar esta ação."

    def _resolve_required_permission(self, request, view) -> Optional[str]:
        required = getattr(view, "permission_required", None)
        if required is None:
            return None
        if isinstance(required, Mapping):
            action = getattr(view, "action", request.method.lower())
            return required.get(action)
        return required

    def _resolve_scope(self, request, view) -> Any:
        if hasattr(view, "get_permission_scope"):
            scope_callable = getattr(view, "get_permission_scope")
            if callable(scope_callable):
                return scope_callable(request)
        scope = getattr(view, "permission_scope", None)
        if callable(scope):
            return scope(request)
        return scope

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        if not request.user or not request.user.is_authenticated:
            return False
        code = self._resolve_required_permission(request, view)
        if code is None:
            return True
        tenant = get_current_tenant(request)
        scope = self._resolve_scope(request, view)
        return has_permission(request.user, code, tenant=tenant, scope=scope)

    def has_object_permission(self, request, view, obj) -> bool:  # type: ignore[override]
        return self.has_permission(request, view)
