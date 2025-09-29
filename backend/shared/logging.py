"""Formatadores de logging compartilhados."""

from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any

from shared.utils.request_context import get_correlation_id, get_request_id
from shared.utils.tenant import get_current_tenant


class JsonLogFormatter(logging.Formatter):
    """Formatter simples que emite logs estruturados em JSON."""

    def format(self, record: logging.LogRecord) -> str:  # type: ignore[override]
        log_payload: dict[str, Any] = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "timestamp": self.formatTime(record, self.datefmt),
        }

        request_id = getattr(record, "request_id", None) or get_request_id()
        correlation_id = getattr(record, "correlation_id", None) or get_correlation_id()
        if request_id:
            log_payload["request_id"] = request_id
        if correlation_id:
            log_payload["correlation_id"] = correlation_id

        tenant = getattr(record, "tenant_id", None) or get_current_tenant()
        if tenant is not None:
            tenant_identifier = getattr(tenant, "schema_name", tenant)
            log_payload["tenant_id"] = str(tenant_identifier)

        standard_attrs = {
            "name",
            "msg",
            "args",
            "levelname",
            "levelno",
            "pathname",
            "filename",
            "module",
            "exc_info",
            "exc_text",
            "stack_info",
            "lineno",
            "funcName",
            "created",
            "msecs",
            "relativeCreated",
            "thread",
            "threadName",
            "processName",
            "process",
        }

        for key, value in record.__dict__.items():
            if key in standard_attrs:
                continue
            if key in {"request_id", "correlation_id", "tenant_id"}:
                continue
            log_payload[key] = value

        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)
        if record.stack_info:
            log_payload["stack"] = record.stack_info

        return json.dumps(log_payload, default=self._json_default)

    @staticmethod
    def _json_default(value: Any) -> Any:
        if isinstance(value, datetime):
            return value.isoformat()
        return str(value)
