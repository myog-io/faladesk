"""Serviços para autenticação passwordless no domínio core."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import AuditLog, LoginToken, Tenant, TenantUser


@dataclass
class MagicLinkIssueResult:
    """Retorno da emissão de um magic link."""

    login_token: LoginToken
    magic_link: str


class MagicLinkTenantMismatch(Exception):
    """Exceção para tokens utilizados em tenants diferentes."""


def issue_magic_link(
    *,
    tenant: Tenant,
    email: str,
    scheme: str,
    host: str,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> Optional[MagicLinkIssueResult]:
    """Gera token de login e registra auditoria para envio de magic link."""

    tenant_user = (
        TenantUser.objects.select_related("user")
        .filter(tenant=tenant, user__email=email)
        .first()
    )
    if tenant_user is None:
        return None

    login_token = LoginToken.objects.create(
        tenant=tenant,
        user=tenant_user.user,
        user_agent=user_agent or "",
        ip_address=ip_address,
    )
    magic_link = f"{scheme}://{host}/auth/magic?token={login_token.token}"

    AuditLog.objects.create(
        tenant=tenant,
        actor_user=tenant_user.user,
        event="auth.magic_link_requested",
        payload={"email": tenant_user.user.email, "link": magic_link},
        ip_address=login_token.ip_address,
        user_agent=login_token.user_agent,
    )

    return MagicLinkIssueResult(login_token=login_token, magic_link=magic_link)


def exchange_magic_link_token(*, tenant: Tenant, login_token: LoginToken) -> dict[str, float | str]:
    """Converte magic link em tokens JWT e registra auditoria."""

    if login_token.tenant and login_token.tenant != tenant:
        raise MagicLinkTenantMismatch()

    refresh = RefreshToken.for_user(login_token.user)
    refresh["tenant"] = str(tenant.id)
    refresh["tenant_slug"] = tenant.slug

    tenant_user = TenantUser.objects.filter(tenant=tenant, user=login_token.user).first()
    if tenant_user:
        tenant_user.activate()

    AuditLog.objects.create(
        tenant=tenant,
        actor_user=login_token.user,
        event="auth.magic_link_exchanged",
        payload={"token_id": str(login_token.id)},
        ip_address=login_token.ip_address,
        user_agent=login_token.user_agent,
    )

    access_token = refresh.access_token
    return {
        "refresh": str(refresh),
        "access": str(access_token),
        "token_type": "Bearer",
        "expires_in": access_token.lifetime.total_seconds(),
    }
