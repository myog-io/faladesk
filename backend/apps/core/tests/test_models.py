"""Testes para modelos core."""

from __future__ import annotations

import pytest
from django.db import IntegrityError

from apps.core.models import (
    LoginToken,
    ServiceAccount,
    ServiceAccountKey,
    TenantSetting,
    TenantUser,
)
from shared.utils.tenant import tenant_context


@pytest.mark.django_db
def test_tenant_user_unique_constraint(tenant, tenant_user):
    with tenant_context(tenant):
        with pytest.raises(IntegrityError):
            TenantUser.objects.create(
                tenant=tenant,
                user=tenant_user.user,
                status=TenantUser.Status.ACTIVE,
            )


@pytest.mark.django_db
def test_tenant_setting_unique_key_per_tenant(tenant):
    with tenant_context(tenant):
        setting = TenantSetting.objects.create(
            tenant=tenant,
            key="branding.theme",
            value={"color": "#000"},
        )
        assert setting.pk is not None

        with pytest.raises(IntegrityError):
            TenantSetting.objects.create(
                tenant=tenant,
                key="branding.theme",
                value={"color": "#fff"},
            )


@pytest.mark.django_db
def test_service_account_key_secret_hashing(tenant, tenant_user):
    with tenant_context(tenant):
        service_account = ServiceAccount.objects.create(
            tenant=tenant,
            name="Webhook",
            created_by=tenant_user.user,
        )
        key = ServiceAccountKey(service_account=service_account, name="default")
        secret = key.set_secret("segredo-super-seguro")
        key.save()

        assert secret == "segredo-super-seguro"
        assert key.verify_secret("segredo-super-seguro")
        assert not key.verify_secret("outro")


@pytest.mark.django_db
def test_login_token_defaults(tenant, tenant_user):
    with tenant_context(tenant):
        token = LoginToken.objects.create(tenant=tenant, user=tenant_user.user)
        assert token.token is not None
        assert token.is_valid()
        token.mark_used()
        assert token.used_at is not None
