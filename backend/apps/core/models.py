from __future__ import annotations

import hashlib
import secrets
import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django_tenants.models import DomainMixin, TenantMixin

from shared.mixins import TimeStampedModel
from shared.utils import generate_slug


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(
        self, email: str, password: str | None, **extra_fields: object
    ) -> "User":
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        email = self.normalize_email(email)
        username = extra_fields.pop("username", None) or email
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(
        self, email: str, password: str | None = None, **extra_fields: object
    ) -> "User":
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(
        self, email: str, password: str, **extra_fields: object
    ) -> "User":
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superusuário precisa de is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superusuário precisa de is_superuser=True.")
        return self._create_user(email, password, **extra_fields)


class Tenant(TenantMixin, TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", _("Ativo")
        SUSPENDED = "suspended", _("Suspenso")
        ARCHIVED = "archived", _("Arquivado")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    timezone = models.CharField(max_length=64, default="UTC")
    default_language = models.CharField(max_length=10, default="pt-br")
    plan = models.CharField(max_length=64, default="free")
    is_active = models.BooleanField(default=True)
    onboarding_completed = models.BooleanField(default=False)
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    metadata = models.JSONField(default=dict, blank=True)

    auto_create_schema = True
    auto_drop_schema = False

    class Meta:
        verbose_name = "Tenant"
        verbose_name_plural = "Tenants"

    def __str__(self) -> str:  # pragma: no cover - representação simples
        return f"{self.name} ({self.schema_name})"


class TenantDomain(DomainMixin, TimeStampedModel):
    class Meta:
        verbose_name = "Domínio do Tenant"
        verbose_name_plural = "Domínios do Tenant"

    def __str__(self) -> str:  # pragma: no cover - representação simples
        return self.domain


class TenantSetting(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        related_name="settings",
        on_delete=models.CASCADE,
    )
    key = models.CharField(max_length=150)
    value = models.JSONField(default=dict, blank=True)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Configuração do Tenant"
        verbose_name_plural = "Configurações do Tenant"
        unique_together = ("tenant", "key")

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.tenant.slug}:{self.key}"


class TenantSubscription(TimeStampedModel):
    class Status(models.TextChoices):
        TRIAL = "trial", _("Teste")
        ACTIVE = "active", _("Ativo")
        PAST_DUE = "past_due", _("Em atraso")
        CANCELED = "canceled", _("Cancelado")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.OneToOneField(
        Tenant,
        related_name="subscription",
        on_delete=models.CASCADE,
    )
    plan = models.CharField(max_length=64)
    seats = models.PositiveIntegerField(default=5)
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.TRIAL,
    )
    billing_email = models.EmailField(blank=True)
    started_at = models.DateTimeField(default=timezone.now)
    renews_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Assinatura do Tenant"
        verbose_name_plural = "Assinaturas do Tenant"


class User(AbstractUser):
    class Languages(models.TextChoices):
        PORTUGUESE_BR = "pt-br", _("Português (Brasil)")
        ENGLISH = "en", _("Inglês")
        SPANISH = "es", _("Espanhol")

    username = models.CharField(max_length=150, unique=True, blank=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    language = models.CharField(
        max_length=10,
        choices=Languages.choices,
        default=Languages.PORTUGUESE_BR,
    )
    avatar_url = models.URLField(blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    objects = UserManager()

    def save(self, *args: object, **kwargs: object) -> None:
        if not self.username:
            self.username = self.email
        if not self.full_name:
            self.full_name = f"{self.first_name} {self.last_name}".strip() or self.email
        super().save(*args, **kwargs)


class TenantUser(TimeStampedModel):
    class Status(models.TextChoices):
        INVITED = "invited", _("Convidado")
        ACTIVE = "active", _("Ativo")
        SUSPENDED = "suspended", _("Suspenso")
        DISABLED = "disabled", _("Desativado")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        related_name="memberships",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="tenant_memberships",
        on_delete=models.CASCADE,
    )
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.INVITED,
    )
    title = models.CharField(max_length=120, blank=True)
    joined_at = models.DateTimeField(default=timezone.now)
    last_active_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Usuário do Tenant"
        verbose_name_plural = "Usuários do Tenant"
        unique_together = ("tenant", "user")

    def activate(self) -> None:
        self.status = self.Status.ACTIVE
        self.last_active_at = timezone.now()
        self.save(update_fields=["status", "last_active_at", "updated_at"])


class TenantUserPreference(TimeStampedModel):
    THEME_CHOICES = (
        ("system", "Padrão do sistema"),
        ("light", "Claro"),
        ("dark", "Escuro"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_user = models.OneToOneField(
        TenantUser,
        related_name="preferences",
        on_delete=models.CASCADE,
    )
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default="system")
    notifications = models.JSONField(default=dict, blank=True)
    locale_overrides = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "Preferência do Usuário"


class TenantInvitation(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", _("Pendente")
        ACCEPTED = "accepted", _("Aceito")
        EXPIRED = "expired", _("Expirado")
        REVOKED = "revoked", _("Revogado")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        related_name="invitations",
        on_delete=models.CASCADE,
    )
    email = models.EmailField()
    token = models.CharField(max_length=64, unique=True, editable=False)
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        related_name="sent_invitations",
        on_delete=models.SET_NULL,
    )
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.PENDING,
    )
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)
    role_slug = models.SlugField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "Convite do Tenant"
        verbose_name_plural = "Convites do Tenant"
        unique_together = ("tenant", "email", "status")

    def save(self, *args: object, **kwargs: object) -> None:
        if not self.token:
            self.token = get_random_string(40)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def mark_accepted(self) -> None:
        self.status = self.Status.ACCEPTED
        self.accepted_at = timezone.now()
        self.save(update_fields=["status", "accepted_at", "updated_at"])


class Permission(TimeStampedModel):
    class Category(models.TextChoices):
        AUTH = "auth", _("Autenticação")
        MESSAGING = "messaging", _("Mensageria")
        TICKETS = "tickets", _("Tickets")
        AUTOMATION = "automation", _("Automações")
        ANALYTICS = "analytics", _("Analytics")
        ADMIN = "admin", _("Administração")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(
        max_length=32,
        choices=Category.choices,
        default=Category.AUTH,
    )

    class Meta:
        verbose_name = "Permissão"
        verbose_name_plural = "Permissões"

    def __str__(self) -> str:  # pragma: no cover - representação simples
        return self.code


class Role(TimeStampedModel):
    class Scope(models.TextChoices):
        GLOBAL = "global", _("Global")
        DEPARTMENT = "department", _("Departamento")
        TEAM = "team", _("Equipe")
        TICKET_QUEUE = "ticket_queue", _("Fila de tickets")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        related_name="roles",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=150)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    scope = models.CharField(
        max_length=32,
        choices=Scope.choices,
        default=Scope.GLOBAL,
    )
    is_system = models.BooleanField(default=False)
    permissions = models.ManyToManyField(
        Permission,
        through="RolePermission",
        related_name="roles",
    )

    class Meta:
        verbose_name = "Papel"
        verbose_name_plural = "Papéis"
        unique_together = (("tenant", "slug"), ("tenant", "name"))

    def save(self, *args: object, **kwargs: object) -> None:
        if self.tenant_id and not self.slug:
            queryset = Role.objects.filter(tenant=self.tenant)
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            self.slug = generate_slug(self.name, queryset=queryset)
        super().save(*args, **kwargs)

    def __str__(self) -> str:  # pragma: no cover - representação simples
        return f"{self.name} ({self.tenant.slug})"


class RolePermission(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(
        Role,
        related_name="role_permissions",
        on_delete=models.CASCADE,
    )
    permission = models.ForeignKey(
        Permission,
        related_name="role_permissions",
        on_delete=models.CASCADE,
    )
    constraints = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "Permissão de Papel"
        verbose_name_plural = "Permissões de Papel"
        unique_together = ("role", "permission")

    def __str__(self) -> str:  # pragma: no cover - representação simples
        return f"{self.role.slug}:{self.permission.code}"


class RoleAssignment(TimeStampedModel):
    class ScopeType(models.TextChoices):
        GLOBAL = "global", _("Global")
        DEPARTMENT = "department", _("Departamento")
        TEAM = "team", _("Equipe")
        CONVERSATION = "conversation", _("Conversa")
        TICKET = "ticket", _("Ticket")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_user = models.ForeignKey(
        "TenantUser",
        related_name="role_assignments",
        on_delete=models.CASCADE,
    )
    role = models.ForeignKey(
        Role,
        related_name="assignments",
        on_delete=models.CASCADE,
    )
    scope_type = models.CharField(
        max_length=32,
        choices=ScopeType.choices,
        null=True,
        blank=True,
    )
    scope_id = models.UUIDField(null=True, blank=True)
    effective_from = models.DateTimeField(null=True, blank=True)
    effective_to = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Atribuição de Papel"
        verbose_name_plural = "Atribuições de Papel"
        unique_together = ("tenant_user", "role", "scope_type", "scope_id")

    def is_active(self) -> bool:
        now = timezone.now()
        if self.effective_from and self.effective_from > now:
            return False
        if self.effective_to and self.effective_to < now:
            return False
        return True


class ServiceAccount(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", _("Ativa")
        DISABLED = "disabled", _("Desativada")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        related_name="service_accounts",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        related_name="created_service_accounts",
        on_delete=models.SET_NULL,
    )

    class Meta:
        verbose_name = "Conta de Serviço"
        verbose_name_plural = "Contas de Serviço"


class ServiceAccountKey(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service_account = models.ForeignKey(
        ServiceAccount,
        related_name="keys",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=150)
    key_id = models.CharField(max_length=24, unique=True, editable=False)
    hashed_secret = models.CharField(max_length=128, editable=False)
    last_used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Chave de Conta de Serviço"

    def set_secret(self, secret: str | None = None) -> str:
        if secret is None:
            secret = secrets.token_urlsafe(32)
        self.key_id = self.key_id or secrets.token_urlsafe(12)
        self.hashed_secret = hashlib.sha256(secret.encode()).hexdigest()
        return secret

    def verify_secret(self, secret: str) -> bool:
        return self.hashed_secret == hashlib.sha256(secret.encode()).hexdigest()


class LoginToken(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        null=True,
        blank=True,
        related_name="login_tokens",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="login_tokens",
        on_delete=models.CASCADE,
    )
    token = models.CharField(max_length=64, unique=True, editable=False)
    purpose = models.CharField(max_length=32, default="login")
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        verbose_name = "Token de Login"
        verbose_name_plural = "Tokens de Login"

    def save(self, *args: object, **kwargs: object) -> None:
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)

    def is_valid(self) -> bool:
        return self.used_at is None and timezone.now() <= self.expires_at

    def mark_used(self) -> None:
        self.used_at = timezone.now()
        self.save(update_fields=["used_at", "updated_at"])


class AuditLog(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant,
        related_name="audit_logs",
        on_delete=models.CASCADE,
    )
    actor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        related_name="audit_logs",
        on_delete=models.SET_NULL,
    )
    actor_service_account = models.ForeignKey(
        ServiceAccount,
        null=True,
        blank=True,
        related_name="audit_logs",
        on_delete=models.SET_NULL,
    )
    event = models.CharField(max_length=150)
    payload = models.JSONField(default=dict, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Registro de Auditoria"
        verbose_name_plural = "Registros de Auditoria"
        ordering = ["-recorded_at"]

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.event} ({self.recorded_at:%Y-%m-%d %H:%M:%S})"
