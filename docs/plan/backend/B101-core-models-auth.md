# B101 — Modelos Core e Autenticação

## Objetivo
Implementar modelos fundamentais (tenant, tenant_domain, user, tenant_user, tenant_setting, tenant_subscription, tenant_invitation, service_account, service_account_key, audit_log) e autenticação passwordless conforme `development_guidelines.md`.

## Escopo
1. Criar models/migrations em `core`:
   - `Tenant`, `TenantDomain`, `TenantSetting`, `TenantSubscription`, `TenantInvitation`.
   - `User` (custom), `TenantUser`, `TenantUserPreference`.
   - `ServiceAccount`, `ServiceAccountKey`.
   - `LoginToken` (magic link), `AuditLog`.
2. Implementar serializers e admin minimalista para gestão básica (somente CRUD essencial).
3. Adicionar lógica de magic link auth:
   - Endpoint `POST /auth/magic-link` (gera token + envia e-mail console/log).
   - Endpoint `POST /auth/token` (troca magic link por JWT) — usar `djangorestframework-simplejwt` (adicionar dependência se necessário).
   - Middleware/auth backend para `tenant_slug` via subdomínio (mock inicial: header `X-Tenant` enquanto subdomínios não estiverem mapeados).
4. Seeds iniciais (fixtures/management command) criando tenant demo + admin + service account default.
5. Atualizar `settings` para suportar modelo custom de usuário e JWT config.

## Testes
- `pytest core/tests/test_models.py` cobrindo criação de tenant/user e constraints multi-tenant.
- `pytest core/tests/test_auth.py` cobrindo fluxo magic link (solicitação + troca por token).
- Rodar `python manage.py makemigrations` / `migrate` para validar migrations.

## Checklist ao concluir
- ✅ Tests passando (`pytest core`).
- ✅ Seeds/fixtures executáveis (`python manage.py loaddata` ou comando custom).
- ✅ Documentar no `docs/plan/backend/README.md` (marcar tarefa como concluída e registrar comandos executados).
- ✅ Atualizar `docs/03-modelo-dados.md` se houver mudanças relevantes (ex.: campos adicionais).

## Referências
- `docs/development_guidelines.md`
- `docs/05-plano-construcao.md`
- `docs/modules/notifications.md` (para lembrar de seeds padrão ao enviar magic link, se aplicável)
