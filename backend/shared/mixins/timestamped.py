"""Modelos base com campos de auditoria."""

from __future__ import annotations

from django.db import models


class TimeStampedModel(models.Model):
    """Modelo abstrato com campos de criação e atualização."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
