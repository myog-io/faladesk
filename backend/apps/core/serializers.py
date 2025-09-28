"""Serializers principais do módulo core."""

from __future__ import annotations

from django.utils import timezone
from rest_framework import serializers

from .models import (
    LoginToken,
    Permission,
    Role,
    RoleAssignment,
    ServiceAccount,
    ServiceAccountKey,
    Tenant,
    TenantInvitation,
    TenantSetting,
    TenantSubscription,
    TenantUser,
    TenantUserPreference,
    User,
)


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = (
            "id",
            "name",
            "slug",
            "schema_name",
            "timezone",
            "default_language",
            "plan",
            "is_active",
            "status",
            "metadata",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "schema_name")


class TenantSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantSetting
        fields = ("id", "tenant", "key", "value", "description", "created_at")
        read_only_fields = ("id", "created_at")


class TenantSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantSubscription
        fields = (
            "id",
            "tenant",
            "plan",
            "seats",
            "status",
            "billing_email",
            "started_at",
            "renews_at",
        )
        read_only_fields = ("id", "started_at")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "full_name",
            "first_name",
            "last_name",
            "language",
            "avatar_url",
            "is_active",
            "date_joined",
        )
        read_only_fields = ("id", "date_joined")


class TenantUserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantUserPreference
        fields = (
            "id",
            "tenant_user",
            "theme",
            "notifications",
            "locale_overrides",
            "updated_at",
        )
        read_only_fields = ("id", "updated_at")


class TenantUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    preferences = TenantUserPreferenceSerializer(read_only=True)

    class Meta:
        model = TenantUser
        fields = (
            "id",
            "tenant",
            "user",
            "status",
            "title",
            "joined_at",
            "last_active_at",
            "preferences",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "joined_at")


class TenantInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantInvitation
        fields = (
            "id",
            "tenant",
            "email",
            "token",
            "status",
            "expires_at",
            "accepted_at",
            "role_slug",
            "metadata",
            "created_at",
        )
        read_only_fields = (
            "id",
            "token",
            "status",
            "created_at",
            "accepted_at",
        )


class ServiceAccountKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceAccountKey
        fields = (
            "id",
            "service_account",
            "name",
            "key_id",
            "hashed_secret",
            "last_used_at",
            "expires_at",
            "created_at",
        )
        read_only_fields = ("id", "key_id", "hashed_secret", "created_at")


class ServiceAccountSerializer(serializers.ModelSerializer):
    keys = ServiceAccountKeySerializer(many=True, read_only=True)

    class Meta:
        model = ServiceAccount
        fields = (
            "id",
            "tenant",
            "name",
            "description",
            "status",
            "created_by",
            "created_at",
            "updated_at",
            "keys",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class LoginTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginToken
        fields = (
            "id",
            "tenant",
            "user",
            "token",
            "purpose",
            "expires_at",
            "used_at",
            "created_at",
        )
        read_only_fields = ("id", "token", "created_at", "used_at")


class MagicLinkRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str) -> str:
        tenant = self.context.get("tenant")
        if tenant is None:
            raise serializers.ValidationError("Tenant não identificado.")
        if not TenantUser.objects.filter(tenant=tenant, user__email=value).exists():
            raise serializers.ValidationError("Usuário não encontrado neste tenant.")
        return value


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = (
            "id",
            "code",
            "description",
            "category",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class RoleSerializer(serializers.ModelSerializer):
    permissions = serializers.SlugRelatedField(
        many=True,
        slug_field="code",
        queryset=Permission.objects.all(),
    )

    class Meta:
        model = Role
        fields = (
            "id",
            "tenant",
            "name",
            "slug",
            "description",
            "scope",
            "is_system",
            "permissions",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "slug", "tenant", "created_at", "updated_at", "is_system")

    def create(self, validated_data: dict):
        permissions = validated_data.pop("permissions", [])
        role: Role = super().create(validated_data)
        role.permissions.set(permissions)
        return role

    def update(self, instance: Role, validated_data: dict):
        permissions = validated_data.pop("permissions", None)
        role: Role = super().update(instance, validated_data)
        if permissions is not None:
            role.permissions.set(permissions)
        return role


class RoleAssignmentSerializer(serializers.ModelSerializer):
    role = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = RoleAssignment
        fields = (
            "id",
            "tenant_user",
            "role",
            "scope_type",
            "scope_id",
            "effective_from",
            "effective_to",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "role", "created_at", "updated_at")


class RoleAssignmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleAssignment
        fields = (
            "tenant_user",
            "scope_type",
            "scope_id",
            "effective_from",
            "effective_to",
        )

    def validate_tenant_user(self, value: TenantUser) -> TenantUser:
        role: Role = self.context["role"]
        if value.tenant_id != role.tenant_id:
            raise serializers.ValidationError(
                "Usuário não pertence ao mesmo tenant do papel."
            )
        if value.status != TenantUser.Status.ACTIVE:
            raise serializers.ValidationError("Usuário precisa estar ativo no tenant.")
        return value

    def validate(self, attrs: dict) -> dict:
        role: Role = self.context["role"]
        scope_type = attrs.get("scope_type")
        scope_id = attrs.get("scope_id")

        if role.scope != Role.Scope.GLOBAL:
            if not scope_type:
                raise serializers.ValidationError(
                    {"scope_type": "Este papel requer definição de escopo."}
                )
            if scope_type != role.scope:
                raise serializers.ValidationError(
                    {"scope_type": "Escopo da atribuição precisa coincidir com o papel."}
                )
            if scope_id is None:
                raise serializers.ValidationError(
                    {"scope_id": "Este papel requer identificação do escopo."}
                )
        else:
            if scope_type and scope_type != Role.Scope.GLOBAL:
                raise serializers.ValidationError(
                    {"scope_type": "Papéis globais não aceitam escopos específicos."}
                )

        effective_from = attrs.get("effective_from")
        effective_to = attrs.get("effective_to")
        if effective_from and effective_to and effective_from > effective_to:
            raise serializers.ValidationError(
                {"effective_to": "Data final deve ser posterior à data inicial."}
            )
        return attrs

    def create(self, validated_data: dict):
        role: Role = self.context["role"]
        assignment, _created = RoleAssignment.objects.update_or_create(
            tenant_user=validated_data["tenant_user"],
            role=role,
            scope_type=validated_data.get("scope_type"),
            scope_id=validated_data.get("scope_id"),
            defaults={
                "effective_from": validated_data.get("effective_from"),
                "effective_to": validated_data.get("effective_to"),
            },
        )
        return assignment


class TokenExchangeSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)

    def validate_token(self, value: str) -> str:
        try:
            token = LoginToken.objects.select_related("user", "tenant").get(token=value)
        except LoginToken.DoesNotExist as exc:
            raise serializers.ValidationError("Token inválido.") from exc

        if not token.is_valid():
            raise serializers.ValidationError("Token expirado ou utilizado.")

        self.context["login_token"] = token
        return value

    def save(self, **kwargs):
        token: LoginToken = self.context["login_token"]
        token.mark_used()
        return token


class LoginTokenVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)
    email = serializers.EmailField(required=False)

    def validate(self, attrs):
        token_value = attrs.get("token")
        try:
            token = LoginToken.objects.select_related("user", "tenant").get(token=token_value)
        except LoginToken.DoesNotExist as exc:  # pragma: no cover - fluxo alternativo
            raise serializers.ValidationError({"token": "Token inválido."}) from exc

        if attrs.get("email") and token.user.email != attrs["email"]:
            raise serializers.ValidationError({"email": "E-mail não corresponde ao token."})

        if token.used_at or token.expires_at < timezone.now():
            raise serializers.ValidationError({"token": "Token inválido."})

        attrs["token_instance"] = token
        return attrs
