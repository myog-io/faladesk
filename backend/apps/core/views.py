"""Views relacionadas ao domínio core."""

from __future__ import annotations

import logging

import django_filters
from django.conf import settings
from django.db.models import Q
from rest_framework import decorators, mixins, permissions, response, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from shared.utils.tenant import TenantNotFoundError, resolve_request_tenant

from shared.mixins import MultiTenantQuerysetMixin

from .models import AuditLog, Permission, Role, RoleAssignment
from .permissions import HasTenantPermission
from .serializers import (
    AuditLogSerializer,
    MagicLinkRequestSerializer,
    PermissionSerializer,
    RoleAssignmentCreateSerializer,
    RoleAssignmentSerializer,
    RoleSerializer,
    TokenExchangeSerializer,
)
from .services.audit import log_event
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


class AuditLogFilterSet(django_filters.FilterSet):
    event = django_filters.CharFilter(method="filter_event")
    actor = django_filters.CharFilter(method="filter_actor")
    date = django_filters.DateFilter(field_name="recorded_at", lookup_expr="date")

    class Meta:
        model = AuditLog
        fields = ["event", "actor", "date"]

    def filter_event(self, queryset, name, value):
        if not value:
            return queryset
        events = [item.strip() for item in value.split(",") if item.strip()]
        if not events:
            return queryset
        return queryset.filter(event__in=events)

    def filter_actor(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(actor_user_id=value) | Q(actor_service_account_id=value)
        )


class AuditLogViewSet(MultiTenantQuerysetMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = AuditLog.objects.select_related("actor_user", "actor_service_account").order_by(
        "-recorded_at"
    )
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, HasTenantPermission]
    permission_required = {"list": "audit.view"}
    tenant_field = "tenant"
    filterset_class = AuditLogFilterSet
    http_method_names = ["get"]


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
        role = serializer.save(tenant=tenant)
        log_event(
            tenant_id=tenant,
            actor=self.request.user,
            event="core.roles.created",
            payload={
                "role_id": str(role.id),
                "name": role.name,
                "slug": role.slug,
                "permissions": list(role.permissions.values_list("code", flat=True)),
            },
            request=self.request,
        )

    def perform_destroy(self, instance: Role) -> None:
        if instance.is_system:
            raise ValidationError("Papéis do sistema não podem ser removidos.")
        payload = {
            "role_id": str(instance.id),
            "slug": instance.slug,
            "name": instance.name,
        }
        super().perform_destroy(instance)
        log_event(
            tenant_id=self.get_tenant(),
            actor=self.request.user,
            event="core.roles.deleted",
            payload=payload,
            request=self.request,
        )

    @decorators.action(methods=["post"], detail=True, url_path="assign")
    def assign(self, request, *args, **kwargs):
        role = self.get_object()
        serializer = RoleAssignmentCreateSerializer(
            data=request.data,
            context={"role": role, "request": request},
        )
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        created_flag = getattr(serializer, "_created", False)
        log_event(
            tenant_id=self.get_tenant(),
            actor=self.request.user,
            event=(
                "core.roles.assignment.created"
                if created_flag
                else "core.roles.assignment.updated"
            ),
            payload={
                "assignment_id": str(assignment.id),
                "role_id": str(role.id),
                "tenant_user_id": str(assignment.tenant_user_id),
                "scope_type": assignment.scope_type,
                "scope_id": assignment.scope_id,
            },
            request=self.request,
        )
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

    def perform_destroy(self, instance: RoleAssignment) -> None:
        payload = {
            "assignment_id": str(instance.id),
            "role_id": str(instance.role_id),
            "tenant_user_id": str(instance.tenant_user_id),
            "scope_type": instance.scope_type,
            "scope_id": instance.scope_id,
        }
        super().perform_destroy(instance)
        log_event(
            tenant_id=self.get_tenant(),
            actor=self.request.user,
            event="core.roles.assignment.deleted",
            payload=payload,
            request=self.request,
        )
