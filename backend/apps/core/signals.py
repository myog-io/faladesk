"""Signals do app core."""

from __future__ import annotations

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Role, RoleAssignment, TenantInvitation, TenantUser


@receiver(post_save, sender=TenantUser)
def assign_default_role(sender, instance: TenantUser, created: bool, **kwargs) -> None:
    """Garante que todo novo usuário receba um papel padrão."""

    if not created:
        return

    role_slug = None
    invitation = (
        TenantInvitation.objects.filter(
            tenant=instance.tenant,
            email__iexact=instance.user.email,
            status=TenantInvitation.Status.ACCEPTED,
        )
        .order_by("-created_at")
        .first()
    )
    if invitation and invitation.role_slug:
        role_slug = invitation.role_slug
    else:
        role_slug = "agent"

    if not role_slug:
        return

    role = Role.objects.filter(tenant=instance.tenant, slug=role_slug).first()
    if role is None:
        return

    RoleAssignment.objects.get_or_create(
        tenant_user=instance,
        role=role,
    )
