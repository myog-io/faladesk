"""Helpers para emissão de eventos compartilhados."""

from __future__ import annotations

import logging
from typing import Any, Mapping, MutableMapping, Optional

from django.dispatch import Signal
from django.utils import timezone

from shared.utils.tenant import get_current_tenant

logger = logging.getLogger(__name__)

notification_emitted = Signal()
analytics_event_emitted = Signal()


def _build_event(
    event_type: str,
    payload: Optional[Mapping[str, Any]],
    tenant,
    correlation_id: Optional[str],
    metadata: Optional[Mapping[str, Any]],
) -> MutableMapping[str, Any]:
    event: MutableMapping[str, Any] = {
        "event_type": event_type,
        "payload": dict(payload or {}),
        "emitted_at": timezone.now(),
    }

    if tenant is not None:
        event["tenant_id"] = getattr(tenant, "schema_name", tenant)

    if correlation_id:
        event["correlation_id"] = correlation_id

    if metadata:
        event["metadata"] = dict(metadata)

    return event


def emit_notification(
    event_type: str,
    payload: Optional[Mapping[str, Any]] = None,
    *,
    request=None,
    tenant=None,
    correlation_id: Optional[str] = None,
    metadata: Optional[Mapping[str, Any]] = None,
) -> MutableMapping[str, Any]:
    """Encapsula emissão de notificações para filas ou listeners."""

    current_tenant = tenant or get_current_tenant(request)
    event = _build_event(event_type, payload, current_tenant, correlation_id, metadata)

    notification_emitted.send(sender="shared.services.events", event=event)
    logger.info(
        "Notificação emitida",
        extra={
            "event_type": event_type,
            "tenant_id": event.get("tenant_id"),
            "correlation_id": event.get("correlation_id"),
        },
    )

    return event


def emit_analytics_event(
    event_type: str,
    payload: Optional[Mapping[str, Any]] = None,
    *,
    request=None,
    tenant=None,
    correlation_id: Optional[str] = None,
    metadata: Optional[Mapping[str, Any]] = None,
) -> MutableMapping[str, Any]:
    """Encapsula envio de eventos de analytics."""

    current_tenant = tenant or get_current_tenant(request)
    event = _build_event(event_type, payload, current_tenant, correlation_id, metadata)

    analytics_event_emitted.send(sender="shared.services.events", event=event)
    logger.info(
        "Evento de analytics emitido",
        extra={
            "event_type": event_type,
            "tenant_id": event.get("tenant_id"),
            "correlation_id": event.get("correlation_id"),
        },
    )

    return event
