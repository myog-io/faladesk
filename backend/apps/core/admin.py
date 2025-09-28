from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import (
    AuditLog,
    LoginToken,
    ServiceAccount,
    ServiceAccountKey,
    Tenant,
    TenantDomain,
    TenantInvitation,
    TenantSetting,
    TenantSubscription,
    TenantUser,
    TenantUserPreference,
    User,
)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "full_name", "language", "is_staff", "is_active")
    search_fields = ("email", "username", "first_name", "last_name", "full_name")
    fieldsets = (
        (None, {"fields": ("email", "password", "username")}),
        (
            "Informações pessoais",
            {"fields": ("first_name", "last_name", "full_name", "language", "avatar_url")},
        ),
        (
            "Permissões",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Datas importantes", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "schema_name", "status", "plan", "is_active")
    search_fields = ("name", "slug", "schema_name")
    list_filter = ("status", "plan", "is_active")
    ordering = ("name",)


@admin.register(TenantDomain)
class TenantDomainAdmin(admin.ModelAdmin):
    list_display = ("domain", "tenant", "is_primary", "created_at")
    search_fields = ("domain", "tenant__name")
    list_filter = ("is_primary",)


@admin.register(TenantSetting)
class TenantSettingAdmin(admin.ModelAdmin):
    list_display = ("tenant", "key", "created_at", "updated_at")
    search_fields = ("key", "tenant__name")
    list_filter = ("tenant",)


@admin.register(TenantSubscription)
class TenantSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("tenant", "plan", "status", "seats", "started_at", "renews_at")
    list_filter = ("status", "plan")
    search_fields = ("tenant__name", "plan")


class TenantUserPreferenceInline(admin.StackedInline):
    model = TenantUserPreference
    extra = 0


@admin.register(TenantUser)
class TenantUserAdmin(admin.ModelAdmin):
    list_display = ("tenant", "user", "status", "title", "joined_at")
    list_filter = ("status", "tenant")
    search_fields = ("user__email", "user__full_name", "tenant__name")
    inlines = [TenantUserPreferenceInline]


@admin.register(TenantInvitation)
class TenantInvitationAdmin(admin.ModelAdmin):
    list_display = ("tenant", "email", "status", "expires_at", "accepted_at")
    list_filter = ("status", "tenant")
    search_fields = ("email", "tenant__name")


class ServiceAccountKeyInline(admin.TabularInline):
    model = ServiceAccountKey
    extra = 0
    readonly_fields = ("key_id", "hashed_secret", "last_used_at")


@admin.register(ServiceAccount)
class ServiceAccountAdmin(admin.ModelAdmin):
    list_display = ("tenant", "name", "status", "created_at")
    list_filter = ("status", "tenant")
    search_fields = ("name", "tenant__name")
    inlines = [ServiceAccountKeyInline]


@admin.register(LoginToken)
class LoginTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant", "purpose", "expires_at", "used_at")
    list_filter = ("purpose", "tenant")
    search_fields = ("user__email", "token")
    readonly_fields = ("token", "created_at", "updated_at")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("tenant", "event", "actor_user", "recorded_at")
    list_filter = ("tenant", "event")
    search_fields = ("event", "actor_user__email", "tenant__name")
    readonly_fields = (
        "tenant",
        "actor_user",
        "actor_service_account",
        "event",
        "payload",
        "recorded_at",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
    )
