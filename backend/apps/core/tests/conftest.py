"""Fixtures compartilhadas para os testes do módulo core."""

from __future__ import annotations

import uuid

import pytest
from django.contrib.auth import get_user_model
from django.db import connection

from apps.core.models import Tenant, TenantDomain, TenantUser
from shared.utils.tenant import tenant_context


@pytest.fixture()
def tenant(db):
    connection.set_schema_to_public()
    schema_name = f"test_{uuid.uuid4().hex[:6]}"
    tenant = Tenant.objects.create(
        schema_name=schema_name,
        name="Tenant Teste",
        slug=f"tenant-{schema_name}",
        timezone="UTC",
        plan="test",
    )
    TenantDomain.objects.create(
        tenant=tenant,
        domain=f"{schema_name}.localhost",
        is_primary=True,
    )
    yield tenant
    tenant.delete(force_drop=True)


@pytest.fixture()
def tenant_user(tenant):
    UserModel = get_user_model()
    with tenant_context(tenant):
        user = UserModel.objects.create_user(
            email="usuario@teste.com",
            full_name="Usuário Teste",
        )
        membership = TenantUser.objects.create(
            tenant=tenant,
            user=user,
            status=TenantUser.Status.ACTIVE,
        )
    return membership
