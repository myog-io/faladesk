from django.urls import path

from apps.core import consumers as core_consumers

websocket_urlpatterns = [
    path("ws/health/", core_consumers.HealthCheckConsumer.as_asgi()),
]
