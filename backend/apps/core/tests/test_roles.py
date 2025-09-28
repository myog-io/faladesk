from __future__ import annotations

import uuid

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient

from apps.core.models import Role, RoleAssignment, TenantUser
from apps.core.permissions import has_permission
from apps.core.seeders import seed_core_rbac
from shared.utils.tenant import tenant_context


DEFAULT_ROLE_SLUGS = {"admin", "supervisor", "agent", "finance", "developer"}


@pytest.mark.django_db
def test_admin_can_create_role(tenant, tenant_user):
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        RoleAssignment.objects.all().delete()
        admin_role = Role.objects.get(slug="admin")
        RoleAssignment.objects.create(tenant_user=tenant_user, role=admin_role)

    client.force_authenticate(user=tenant_user.user)
    payload = {
        "name": "Coordenador Noturno",
        "description": "Responsável por escalas noturnas.",
        "scope": Role.Scope.GLOBAL,
        "permissions": ["messaging.view", "tickets.view"],
    }

    response = client.post(
        reverse("core:role-list"),
        data=payload,
        format="json",
        **headers,
    )

    assert response.status_code == 201
    assert response.data["slug"].startswith("coordenador-noturno")

    with tenant_context(tenant):
        assert Role.objects.filter(name="Coordenador Noturno").exists()


@pytest.mark.django_db
def test_agent_cannot_create_role(tenant, tenant_user):
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        RoleAssignment.objects.all().delete()
        agent_role = Role.objects.get(slug="agent")
        RoleAssignment.objects.create(tenant_user=tenant_user, role=agent_role)

    client.force_authenticate(user=tenant_user.user)
    response = client.post(
        reverse("core:role-list"),
        data={
            "name": "Auditor",
            "scope": Role.Scope.GLOBAL,
            "permissions": ["analytics.view"],
        },
        format="json",
        **headers,
    )

    assert response.status_code == 403


@pytest.mark.django_db
def test_system_role_cannot_be_deleted(tenant, tenant_user):
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        RoleAssignment.objects.all().delete()
        admin_role = Role.objects.get(slug="admin")
        RoleAssignment.objects.create(tenant_user=tenant_user, role=admin_role)

    client.force_authenticate(user=tenant_user.user)
    response = client.delete(
        reverse("core:role-detail", args=[admin_role.id]),
        **headers,
    )

    assert response.status_code == 400
    assert "Papéis do sistema" in str(response.data)


@pytest.mark.django_db
def test_assign_role_endpoint_creates_assignment(tenant, tenant_user):
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        RoleAssignment.objects.all().delete()
        admin_role = Role.objects.get(slug="admin")
        RoleAssignment.objects.create(tenant_user=tenant_user, role=admin_role)

        UserModel = get_user_model()
        new_user = UserModel.objects.create_user(
            email="colega@teste.com",
            full_name="Colega Teste",
        )
        new_membership = TenantUser.objects.create(
            tenant=tenant,
            user=new_user,
            status=TenantUser.Status.ACTIVE,
        )
        supervisor_role = Role.objects.get(slug="supervisor")

    client.force_authenticate(user=tenant_user.user)
    payload = {
        "tenant_user": str(new_membership.id),
        "scope_type": Role.Scope.TEAM,
        "scope_id": str(uuid.uuid4()),
    }

    response = client.post(
        reverse("core:role-assign", args=[supervisor_role.id]),
        data=payload,
        format="json",
        **headers,
    )

    assert response.status_code == 201

    with tenant_context(tenant):
        assignment = RoleAssignment.objects.get(role=supervisor_role, tenant_user=new_membership)
        assert assignment.scope_type == RoleAssignment.ScopeType.TEAM


@pytest.mark.django_db
def test_seed_roles_idempotent(tenant):
    with tenant_context(tenant):
        first_run = seed_core_rbac(tenant=tenant)
        second_run = seed_core_rbac(tenant=tenant)
        roles = Role.objects.count()

    assert roles == len(DEFAULT_ROLE_SLUGS)
    assert any(result.updated > 0 for result in second_run if not result.skipped)
    assert any(result.created > 0 for result in first_run if not result.skipped)


@pytest.mark.django_db
def test_default_role_assignment_on_new_user(tenant):
    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        UserModel = get_user_model()
        user = UserModel.objects.create_user(email="novo@teste.com", full_name="Novo Teste")
        membership = TenantUser.objects.create(
            tenant=tenant,
            user=user,
            status=TenantUser.Status.ACTIVE,
        )
        agent_role = Role.objects.get(slug="agent")
        assert RoleAssignment.objects.filter(tenant_user=membership, role=agent_role).exists()


@pytest.mark.django_db
def test_has_permission_helper_respects_assignments(tenant, tenant_user):
    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        RoleAssignment.objects.all().delete()
        agent_role = Role.objects.get(slug="agent")
        RoleAssignment.objects.create(tenant_user=tenant_user, role=agent_role)

        assert has_permission(tenant_user.user, "messaging.view", tenant=tenant)
        assert not has_permission(tenant_user.user, "core.roles.manage", tenant=tenant)

