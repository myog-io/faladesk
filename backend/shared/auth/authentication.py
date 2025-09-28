"""Rotinas de autenticação compartilhadas."""

from __future__ import annotations

from typing import Any, Optional, Tuple

from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication

from shared.utils.tenant import TenantNotFoundError, resolve_request_tenant


class TenantAwareAuthentication(TokenAuthentication):
    """Autenticação baseada em token com validação de tenant."""

    tenant_header = "HTTP_X_TENANT"

    def authenticate(self, request: Request) -> Optional[Tuple[Any, Any]]:
        """Garante que a autenticação inclua um tenant ativo."""

        auth_result = super().authenticate(request)
        if auth_result is None:
            return None

        try:
            resolve_request_tenant(
                request,
                header=self.tenant_header,
                required=True,
            )
        except TenantNotFoundError as exc:
            raise AuthenticationFailed(str(exc)) from exc

        return auth_result


class TenantAwareJWTAuthentication(JWTAuthentication):
    """Autenticação JWT que valida o tenant informado no header."""

    tenant_header = "HTTP_X_TENANT"

    def authenticate(self, request: Request):  # type: ignore[override]
        auth_result = super().authenticate(request)
        if auth_result is None:
            return None

        user, token = auth_result

        try:
            tenant = resolve_request_tenant(
                request,
                header=self.tenant_header,
                required=True,
            )
        except TenantNotFoundError as exc:
            raise AuthenticationFailed(str(exc)) from exc

        token_tenant = token.payload.get("tenant") if hasattr(token, "payload") else None
        if token_tenant and str(token_tenant) != str(getattr(tenant, "id", "")):
            raise AuthenticationFailed("Token não pertence ao tenant informado.")

        return user, token
