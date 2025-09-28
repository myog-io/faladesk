"""URLs do módulo core."""

from django.urls import path

from .views import MagicLinkRequestView, TokenObtainFromMagicLinkView

app_name = "core"

urlpatterns = [
    path("auth/magic-link", MagicLinkRequestView.as_view(), name="magic-link"),
    path("auth/token", TokenObtainFromMagicLinkView.as_view(), name="token"),
]
