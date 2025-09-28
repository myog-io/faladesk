# B702 — Webhooks & Intake de Canais

## Objetivo
Implementar ingestão inbound/outbound de canais (webhooks, polling) e integração com automations/messaging.

## Escopo
1. API/Webhooks:
   - Endpoints `POST /channels/webhooks/{connector_slug}` para receber mensagens/status — validar assinatura conforme config.
   - Normalizar payload → chamar `automation.tasks.run_flow` com trigger `channel_intake` (flow default).
2. Serviços:
   - `channels.services.webhook.handle_inbound(connector, payload)` — persistir `ChannelUsageLog`, gerar `AutomationTrigger`.
   - `channels.services.webhook.handle_status_update(connector, payload)` — atualizar `MessageDelivery` (mensagens existentes).
   - Polling stub (Email/IMAP) — Celery task `channels.tasks.poll_email_accounts` (marca como TODO com logs).
3. Notificações/logs:
   - Registrar `ChannelHealthCheck` falha/sucesso ao receber webhook/polling.
   - Em caso de erro parsing, enviar `notification_queue` para admin do tenant.
4. Atualizar seeds para registrar webhooks URLs (mock) e tokens assinaturas.

## Testes
- `docker compose exec backend pytest channels/tests/test_webhooks.py` — inbound message, status update, assinatura inválida.
- `docker compose exec backend pytest channels/tests/test_polling.py` — task de polling (mock).

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Eventos encaminhados para automations (mock Celery delay/assert).
- ✅ README plano atualizado.
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/channels.md`
- `docs/modules/automation.md`
