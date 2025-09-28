"""Views relacionadas ao domínio core."""

from __future__ import annotations

import logging

from django.conf import settings
from rest_framework import decorators, mixins, permissions, response, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from shared.utils.tenant import TenantNotFoundError, resolve_request_tenant

from shared.mixins import MultiTenantQuerysetMixin

from .models import Permission, Role, RoleAssignment
from .permissions import HasTenantPermission
from .serializers import (
    MagicLinkRequestSerializer,
    PermissionSerializer,
    RoleAssignmentCreateSerializer,
    RoleAssignmentSerializer,
    RoleSerializer,
    TokenExchangeSerializer,
)
from .services.auth import (
    MagicLinkTenantMismatch,
    exchange_magic_link_token,
    issue_magic_link,
)

logger = logging.getLogger(__name__)


class MagicLinkRequestView(APIView):
    """Gera um link mágico de autenticação."""

    authentication_classes: list = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            tenant = resolve_request_tenant(request, required=True)
        except TenantNotFoundError:
            return response.Response(
                {"detail": "Tenant não identificado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = MagicLinkRequestSerializer(
            data=request.data,
            context={"tenant": tenant},
        )
        serializer.is_valid(raise_exception=True)

        result = issue_magic_link(
            tenant=tenant,
            email=serializer.validated_data["email"],
            scheme=request.scheme,
            host=request.get_host(),
            user_agent=request.META.get("HTTP_USER_AGENT"),
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        if result is None:
            return response.Response(status=status.HTTP_202_ACCEPTED)

        login_token = result.login_token
        logger.info(
            "Magic link gerado",
            extra={
                "tenant": tenant.slug,
                "user": login_token.user.email,
                "token": login_token.token,
            },
        )

        if settings.DEBUG:
            # Em modo debug retornamos o token para facilitar testes automáticos.
            return response.Response(
                {
                    "detail": "Magic link enviado.",
                    "token": login_token.token,
                    "link": result.magic_link,
                },
                status=status.HTTP_201_CREATED,
            )

        return response.Response(status=status.HTTP_202_ACCEPTED)


class TokenObtainFromMagicLinkView(APIView):
    """Troca um link mágico por tokens JWT."""

    authentication_classes: list = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            tenant = resolve_request_tenant(request, required=True)
        except TenantNotFoundError:
            return response.Response(
                {"detail": "Tenant não identificado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = TokenExchangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_token = serializer.save()

        try:
            payload = exchange_magic_link_token(tenant=tenant, login_token=login_token)
        except MagicLinkTenantMismatch:
            return response.Response(
                {"detail": "Token não pertence ao tenant informado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return response.Response(payload, status=status.HTTP_200_OK)


class PermissionViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Permission.objects.all().order_by("code")
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated, HasTenantPermission]
    permission_required = {"list": "core.roles.view"}


class RoleViewSet(MultiTenantQuerysetMixin, viewsets.ModelViewSet):
    queryset = Role.objects.prefetch_related("permissions").select_related("tenant")
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated, HasTenantPermission]
    permission_required = {
        "list": "core.roles.view",
        "retrieve": "core.roles.view",
        "create": "core.roles.manage",
        "destroy": "core.roles.manage",
        "assign": "core.roles.manage",
    }
    tenant_field = "tenant"
    http_method_names = ["get", "post", "delete"]

    def perform_create(self, serializer: RoleSerializer) -> None:
        tenant = self.get_tenant()
        serializer.save(tenant=tenant)

    def perform_destroy(self, instance: Role) -> None:
        if instance.is_system:
            raise ValidationError("Papéis do sistema não podem ser removidos.")
        super().perform_destroy(instance)

    @decorators.action(methods=["post"], detail=True, url_path="assign")
    def assign(self, request, *args, **kwargs):
        role = self.get_object()
        serializer = RoleAssignmentCreateSerializer(
            data=request.data,
            context={"role": role, "request": request},
        )
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        output = RoleAssignmentSerializer(assignment)
        return response.Response(output.data, status=status.HTTP_201_CREATED)


class RoleAssignmentViewSet(
    MultiTenantQuerysetMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet
):
    queryset = RoleAssignment.objects.select_related("role", "tenant_user")
    serializer_class = RoleAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, HasTenantPermission]
    permission_required = {"destroy": "core.roles.manage"}
    tenant_field = "role__tenant"
