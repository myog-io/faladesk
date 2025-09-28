from __future__ import annotations

from celery import shared_task


@shared_task(name="core.health_check")
def health_check() -> str:
    return "ok"
