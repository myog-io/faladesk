"""Mixins reutilizáveis entre apps."""

from .multitenant import MultiTenantQuerysetMixin
from .timestamped import TimeStampedModel

__all__ = ["MultiTenantQuerysetMixin", "TimeStampedModel"]
