from __future__ import annotations

from django.db import models
from django_tenants.models import DomainMixin, TenantMixin

from shared.mixins import TimeStampedModel
from shared.utils import generate_slug


class Organization(TenantMixin, TimeStampedModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    timezone = models.CharField(max_length=64, default="UTC")
    plan = models.CharField(max_length=64, default="free")
    is_active = models.BooleanField(default=True)
    onboarding_completed = models.BooleanField(default=False)

    auto_create_schema = True

    class Meta:
        verbose_name = "Organização"
        verbose_name_plural = "Organizações"

    def __str__(self) -> str:
        return self.name

    def save(self, *args: object, **kwargs: object) -> None:
        if not self.slug and self.name:
            queryset = self.__class__.objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)
            self.slug = generate_slug(self.name, queryset=queryset)
        super().save(*args, **kwargs)


class Domain(DomainMixin, TimeStampedModel):
    class Meta:
        verbose_name = "Domínio"
        verbose_name_plural = "Domínios"

    def __str__(self) -> str:
        return self.domain
