"""Serviços utilitários para gravação de auditoria."""

from __future__ import annotations

import logging
from collections.abc import Mapping
from typing import Any, Optional

from django.contrib.auth import get_user_model
from django.utils import timezone

from ..models import AuditLog, ServiceAccount, Tenant, TenantUser
from shared.utils.request_context import get_correlation_id, get_request_id
from shared.utils.tenant import get_current_tenant

logger = logging.getLogger(__name__)

UserModel = get_user_model()


def _resolve_tenant(tenant_reference) -> Tenant:
    if tenant_reference is None:
        tenant = get_current_tenant()
        if tenant is None:
            raise ValueError("Tenant não informado para log de auditoria.")
        return tenant
    if isinstance(tenant_reference, Tenant):
        return tenant_reference
    return Tenant.objects.get(pk=tenant_reference)


def _resolve_actor(actor: Any, request=None) -> tuple[Optional[Any], Optional[Any], Optional[str]]:
    actor_user = None
    actor_service_account = None
    actor_label = None

    if actor is None and request is not None:
        actor = getattr(request, "user", None)

    if isinstance(actor, TenantUser):
        actor_user = actor.user
    elif isinstance(actor, UserModel):
        actor_user = actor
    elif isinstance(actor, ServiceAccount):
        actor_service_account = actor
    elif isinstance(actor, Mapping):
        actor_user = actor.get("user")
        actor_service_account = actor.get("service_account")
        actor_label = actor.get("label")
    elif actor is not None:
        actor_label = str(actor)

    return actor_user, actor_service_account, actor_label


def _extract_ip_and_agent(request, ip_address: Optional[str], user_agent: Optional[str]) -> tuple[Optional[str], str]:
    resolved_ip = ip_address
    resolved_agent = user_agent or ""

    if request is not None:
        if resolved_ip is None:
            forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
            if forwarded_for:
                resolved_ip = forwarded_for.split(",")[0].strip()
            else:
                resolved_ip = request.META.get("REMOTE_ADDR")
        if not resolved_agent:
            resolved_agent = request.META.get("HTTP_USER_AGENT", "")

    return resolved_ip, resolved_agent


def log_event(
    tenant_id,
    actor,
    event: str,
    payload: Optional[Mapping[str, Any]] = None,
    *,
    request=None,
    correlation_id: Optional[str] = None,
    request_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> AuditLog:
    """Registra um evento de auditoria persistido no banco de dados."""

    tenant = _resolve_tenant(tenant_id)
    actor_user, actor_service_account, actor_label = _resolve_actor(actor, request=request)
    correlation = correlation_id or get_correlation_id()
    req_id = request_id or get_request_id()
    payload_data = dict(payload or {})

    if actor_label and "actor_label" not in payload_data:
        payload_data["actor_label"] = actor_label
    if req_id and "request_id" not in payload_data:
        payload_data["request_id"] = req_id
    if correlation and "correlation_id" not in payload_data:
        payload_data["correlation_id"] = correlation

    resolved_ip, resolved_agent = _extract_ip_and_agent(request, ip_address, user_agent)

    log_entry = AuditLog.objects.create(
        tenant=tenant,
        actor_user=actor_user,
        actor_service_account=actor_service_account,
        event=event,
        payload=payload_data,
        ip_address=resolved_ip,
        user_agent=resolved_agent,
        recorded_at=timezone.now(),
    )

    logger.info(
        "Audit event recorded",
        extra={
            "event": event,
            "tenant_id": str(getattr(tenant, "id", tenant)),
            "tenant_schema": getattr(tenant, "schema_name", None),
            "actor_user_id": getattr(actor_user, "id", None),
            "actor_service_account_id": getattr(actor_service_account, "id", None),
            "correlation_id": correlation or payload_data.get("correlation_id"),
            "request_id": req_id or payload_data.get("request_id"),
        },
    )

    return log_entry
