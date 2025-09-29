"""Middleware para capturar identificadores de request/correlação."""

from __future__ import annotations

from typing import Callable

from django.http import HttpRequest, HttpResponse

from shared.utils.request_context import (
    clear_request_context,
    ensure_request_identifiers,
)


class RequestContextMiddleware:
    """Popula contextvars com identificadores úteis para auditoria e logs."""

    header_request_id = "X-Request-ID"
    header_correlation_id = "X-Correlation-ID"

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        header_request_id = request.headers.get(self.header_request_id)
        header_correlation_id = request.headers.get(self.header_correlation_id)

        request_id, correlation_id = ensure_request_identifiers(
            request_id=header_request_id,
            correlation_id=header_correlation_id,
        )

        request.request_id = request_id  # type: ignore[attr-defined]
        request.correlation_id = correlation_id  # type: ignore[attr-defined]

        try:
            response = self.get_response(request)
        finally:
            clear_request_context()

        response.setdefault(self.header_request_id, request_id)
        response.setdefault(self.header_correlation_id, correlation_id)
        return response

    def process_exception(self, request: HttpRequest, exception: Exception) -> None:
        # Garante limpeza do contexto mesmo em exceções não tratadas.
        clear_request_context()

