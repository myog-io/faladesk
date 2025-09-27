FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements /tmp/requirements

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r /tmp/requirements/dev.txt

COPY backend /app

ENV DJANGO_SETTINGS_MODULE=faladesk_backend.settings.dev

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
