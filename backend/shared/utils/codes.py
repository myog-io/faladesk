"""Helpers para geração de códigos sequenciais."""

from __future__ import annotations

from typing import Optional

from django.db.models import QuerySet


def _extract_sequence(prefix: str, code: str) -> int:
    try:
        return int(code[len(prefix) :])
    except (TypeError, ValueError):
        return 0


def generate_sequential_code(
    prefix: str,
    queryset: Optional[QuerySet] = None,
    *,
    code_field: str = "code",
    padding: int = 6,
    last_code: Optional[str] = None,
) -> str:
    """Gera um código incremental com prefixo e padding configuráveis."""

    normalized_prefix = prefix.upper()
    sequence = 0

    if last_code:
        sequence = _extract_sequence(normalized_prefix, last_code)

    if sequence == 0 and queryset is not None:
        lookup = {f"{code_field}__startswith": normalized_prefix}
        try:
            latest = (
                queryset.filter(**lookup)
                .order_by(f"-{code_field}")
                .values_list(code_field, flat=True)
                .first()
            )
        except AttributeError:
            latest = None

        if latest:
            sequence = _extract_sequence(normalized_prefix, latest)

    next_value = sequence + 1
    return f"{normalized_prefix}{next_value:0{padding}d}"
