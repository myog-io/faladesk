# B701 — Connectors & Accounts de Canais

## Objetivo
Implementar models/serviços do módulo `channels` (connectors, accounts, capabilities, tokens, health checks) com seeds padrão.

## Escopo
1. Models/migrations em `channels`:
   - `ChannelConnector`, `ChannelAccount`, `ChannelCapability`, `ChannelToken`, `ChannelWebhook`, `ChannelHealthCheck`, `ChannelUsageLog`, `ChannelMapping`, `ChannelFallback`.
   - Respeitar campos (org_unit_id/intake_flow_id) conforme docs.
2. Seeds default por tenant demo:
   - Conector WhatsApp oficial/não-oficial, Telegram, Email, Web Chat.
   - Config mock (tokens fake), capabilities básicas (messages, templates, media_upload).
3. Services/helpers:
   - `activate_account(account)` (valida config, registra health check inicial).
   - `record_usage(connector, type, quantidade)` para analytics.
   - `refresh_token(connector)` stub (simular refresh, logs auditáveis).
4. Comando `docker compose exec backend python manage.py seed_channels_defaults` idempotente.

## Testes
- `docker compose exec backend pytest channels/tests/test_models.py` — criação connectors/accounts/capabilities, constraints multi-tenant.
- `docker compose exec backend pytest channels/tests/test_services.py` — activate_account, record_usage, refresh_token (mock external).

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Seeds executáveis.
- ✅ README plano atualizado + docs (`docs/modules/channels.md`).
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/channels.md`
