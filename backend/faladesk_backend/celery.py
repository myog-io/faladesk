import os

from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "faladesk_backend.settings.dev")

app = Celery("faladesk_backend")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
