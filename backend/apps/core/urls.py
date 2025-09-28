"""URLs do módulo core."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    MagicLinkRequestView,
    PermissionViewSet,
    RoleAssignmentViewSet,
    RoleViewSet,
    TokenObtainFromMagicLinkView,
)

app_name = "core"

router = DefaultRouter()
router.register("roles", RoleViewSet, basename="role")
router.register("permissions", PermissionViewSet, basename="permission")
router.register("role-assignments", RoleAssignmentViewSet, basename="role-assignment")

urlpatterns = [
    path("auth/magic-link", MagicLinkRequestView.as_view(), name="magic-link"),
    path("auth/token", TokenObtainFromMagicLinkView.as_view(), name="token"),
    path("", include(router.urls)),
]
