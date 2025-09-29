"""Utilitários para armazenar contexto de requisições/correlação."""

from __future__ import annotations

import uuid
from contextvars import ContextVar
from typing import Optional

_request_id_ctx: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
_correlation_id_ctx: ContextVar[Optional[str]] = ContextVar("correlation_id", default=None)


def set_request_context(*, request_id: Optional[str], correlation_id: Optional[str]) -> None:
    """Armazena os identificadores de request/correlação no contexto atual."""

    _request_id_ctx.set(request_id)
    _correlation_id_ctx.set(correlation_id or request_id)


def clear_request_context() -> None:
    """Limpa o contexto associado à requisição atual."""

    _request_id_ctx.set(None)
    _correlation_id_ctx.set(None)


def get_request_id() -> Optional[str]:
    """Retorna o identificador da requisição corrente, se houver."""

    return _request_id_ctx.get()


def get_correlation_id() -> Optional[str]:
    """Retorna o identificador de correlação atual."""

    return _correlation_id_ctx.get()


def ensure_request_identifiers(
    *,
    request_id: Optional[str] = None,
    correlation_id: Optional[str] = None,
) -> tuple[str, str]:
    """Garante que existam identificadores válidos para request/correlação."""

    resolved_request_id = request_id or get_request_id() or str(uuid.uuid4())
    resolved_correlation_id = (
        correlation_id
        or get_correlation_id()
        or resolved_request_id
    )
    set_request_context(
        request_id=resolved_request_id,
        correlation_id=resolved_correlation_id,
    )
    return resolved_request_id, resolved_correlation_id
