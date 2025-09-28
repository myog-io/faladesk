from __future__ import annotations

import os
from typing import List

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "faladesk_backend.settings.dev")

django_asgi_app = get_asgi_application()

try:
    from faladesk_backend import routing
except ImportError:  # pragma: no cover - fallback durante bootstrap inicial
    websocket_urlpatterns: List = []
else:
    websocket_urlpatterns = getattr(routing, "websocket_urlpatterns", [])

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)
