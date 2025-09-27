from django.contrib import admin

from .models import Domain, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "schema_name", "plan", "is_active")
    search_fields = ("name", "slug", "schema_name")
    list_filter = ("plan", "is_active")


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ("domain", "tenant", "is_primary")
    search_fields = ("domain",)
    list_filter = ("is_primary",)
