"""Funções utilitárias relacionadas a slugs."""

from __future__ import annotations

from typing import Callable, Optional

from django.db.models import QuerySet
from django.utils.text import slugify


ExistsCallable = Callable[[str], bool]


def generate_slug(
    value: str,
    queryset: Optional[QuerySet] = None,
    *,
    slug_field: str = "slug",
    exists: Optional[ExistsCallable] = None,
) -> str:
    """Gera um slug único a partir de um valor base."""

    base_slug = slugify(value).strip("-")
    if not base_slug:
        base_slug = "item"

    slug = base_slug

    def slug_exists(candidate: str) -> bool:
        if exists is not None:
            return exists(candidate)
        if queryset is None:
            return False
        return queryset.filter(**{slug_field: candidate}).exists()

    suffix = 1
    while slug_exists(slug):
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    return slug
