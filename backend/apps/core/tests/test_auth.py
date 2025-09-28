"""Testes para autenticação passwordless."""

from __future__ import annotations

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from django.db import connection

from apps.core.models import AuditLog, LoginToken, Tenant, TenantDomain, TenantUser
from shared.utils.tenant import tenant_context


@pytest.mark.django_db
def test_magic_link_flow(settings, tenant, tenant_user):
    settings.DEBUG = True
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    response = client.post(
        reverse("core:magic-link"),
        data={"email": tenant_user.user.email},
        format="json",
        **headers,
    )
    assert response.status_code == 201
    token_value = response.data["token"]

    response = client.post(
        reverse("core:token"),
        data={"token": token_value},
        format="json",
        **headers,
    )
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data

    with tenant_context(tenant):
        tenant_user.refresh_from_db()
        assert tenant_user.status == TenantUser.Status.ACTIVE
        assert AuditLog.objects.filter(event="auth.magic_link_exchanged").exists()


@pytest.mark.django_db
def test_magic_link_requires_tenant_header(tenant_user):
    client = APIClient()
    response = client.post(reverse("core:magic-link"), data={"email": tenant_user.user.email})
    assert response.status_code == 400
    assert response.data["detail"] == "Tenant não identificado."


@pytest.mark.django_db
def test_token_rejects_wrong_tenant(settings, tenant, tenant_user):
    settings.DEBUG = True
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    token = client.post(
        reverse("core:magic-link"),
        data={"email": tenant_user.user.email},
        format="json",
        **headers,
    ).data["token"]

    other_headers = {"HTTP_X_TENANT": "outro"}
    response = client.post(
        reverse("core:token"),
        data={"token": token},
        format="json",
        **other_headers,
    )
    assert response.status_code == 400
    assert response.data["detail"] == "Tenant não identificado."

    # valida que o token continua válido
    with tenant_context(tenant):
        login_token = LoginToken.objects.get(token=token)
        assert login_token.is_valid()


@pytest.mark.django_db
def test_token_mismatch_between_header_and_token(settings, tenant, tenant_user):
    settings.DEBUG = True
    client = APIClient()
    headers = {"HTTP_X_TENANT": tenant.schema_name}

    token_value = client.post(
        reverse("core:magic-link"),
        data={"email": tenant_user.user.email},
        format="json",
        **headers,
    ).data["token"]

    connection.set_schema_to_public()
    other_tenant = Tenant.objects.create(
        schema_name="outro_schema",
        name="Outro",
        slug="outro",
        timezone="UTC",
        plan="test",
    )
    TenantDomain.objects.create(
        tenant=other_tenant,
        domain="outro.localhost",
        is_primary=True,
    )

    try:
        mismatch_headers = {"HTTP_X_TENANT": other_tenant.schema_name}
        response = client.post(
            reverse("core:token"),
            data={"token": token_value},
            format="json",
            **mismatch_headers,
        )
        assert response.status_code == 400
        assert response.data["detail"] == "Token não pertence ao tenant informado."
    finally:
        other_tenant.delete(force_drop=True)
