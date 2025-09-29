import uuid

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.core.models import Role, RoleAssignment
from apps.core.seeders import seed_core_rbac
from apps.core.services.audit import log_event
from shared.utils.tenant import tenant_context


@pytest.mark.django_db
def test_log_event_records_actor_and_context(tenant, tenant_user):
    with tenant_context(tenant):
        log_entry = log_event(
            tenant_id=tenant,
            actor=tenant_user.user,
            event="core.audit.test",
            payload={"foo": "bar"},
            request_id="req-123",
            correlation_id="corr-456",
            ip_address="10.0.0.1",
            user_agent="pytest-agent",
        )

    with tenant_context(tenant):
        log_entry.refresh_from_db()
        assert log_entry.actor_user == tenant_user.user
        assert log_entry.payload["foo"] == "bar"
        assert log_entry.payload["request_id"] == "req-123"
        assert log_entry.payload["correlation_id"] == "corr-456"
        assert log_entry.ip_address == "10.0.0.1"
        assert log_entry.user_agent == "pytest-agent"


@pytest.mark.django_db
def test_audit_endpoint_requires_permission(tenant, tenant_user):
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        RoleAssignment.objects.all().delete()
        agent_role = Role.objects.get(slug="agent")
        RoleAssignment.objects.create(tenant_user=tenant_user, role=agent_role)
        log_event(
            tenant_id=tenant,
            actor=tenant_user.user,
            event="core.roles.created",
            payload={"role_id": str(uuid.uuid4())},
        )

    client.force_authenticate(user=tenant_user.user)
    response = client.get(reverse("core:audit-log-list"), **headers)

    assert response.status_code == 403


@pytest.mark.django_db
def test_audit_endpoint_filters_by_event_and_actor(tenant, tenant_user):
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    with tenant_context(tenant):
        seed_core_rbac(tenant=tenant)
        RoleAssignment.objects.all().delete()
        admin_role = Role.objects.get(slug="admin")
        RoleAssignment.objects.create(tenant_user=tenant_user, role=admin_role)

        first_log = log_event(
            tenant_id=tenant,
            actor=tenant_user.user,
            event="core.roles.created",
            payload={"role_id": str(uuid.uuid4())},
        )
        log_event(
            tenant_id=tenant,
            actor="system",
            event="core.seeds.initial_seed",
            payload={"run": 1},
        )

    client.force_authenticate(user=tenant_user.user)
    response = client.get(
        reverse("core:audit-log-list"),
        data={"event": "core.roles.created", "actor": str(tenant_user.user.id)},
        **headers,
    )

    assert response.status_code == 200
    assert isinstance(response.data, list)
    assert len(response.data) == 1
    assert response.data[0]["id"] == str(first_log.id)

    response = client.get(
        reverse("core:audit-log-list"),
        data={"event": "core.seeds.initial_seed"},
        **headers,
    )
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["payload"]["run"] == 1
