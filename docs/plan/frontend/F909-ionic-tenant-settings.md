# F909 — Configurações do Tenant (Settings Hub)

## Objetivo
Criar página de configurações gerais (branding, idioma, notificações padrão, gamificação on/off) para administradores do tenant.

## Escopo
1. View `TenantSettings` com seções:
   - Branding (logo upload stub, cores, nome exibido).
   - Idioma/Timezone default.
   - Gamificação/Notificações: toggles para habilitar (usando seeds default).
   - Segurança: políticas de retenção (dias), consentimento mensagens.
2. Estado/API:
   - Store `tenantSettingsSlice` consumindo `core` endpoints (Tenant, TenantSetting, TenantSubscription).
   - Actions `updateBranding`, `updateLocale`, `updateRetention`, `toggleGamification`.
3. Uploads: usar componente de upload (S3 presigned stub) ou fallback base64 (mock).
4. Mostrar preview do portal público (link) e status da assinatura (licenças em uso).

## Testes
- `npm run test` — `TenantSettings.test.tsx` com mocks API/upload.

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Configurações persistem via API.
- ✅ README plano atualizado + docs se necessário.
- ✅ Caso endpoints/backend sejam criados/ajustados, atualizar documentação OpenAPI (B003).

## Referências
- `docs/modules/core.md`
- `docs/modules/gamification.md`
- `docs/modules/notifications.md`
