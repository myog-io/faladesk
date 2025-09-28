# B603 — Engine de Notificações

## Objetivo
Implementar pipeline de notificações (preferências, regras, fila, envio multi canal) e integração com eventos principais.

## Escopo
1. Services em `notifications.engine`:
   - `enqueue_notification(rule, tenant_user, payload)` → cria `NotificationQueue` considerando preferências/quiet hours.
   - `dispatch_notification(queue_item)` → renderiza template, envia via canal (in-app/push/email) utilizando adapters (stub inicial para e-mail console e in-app).
   - `send_digest(tenant_user, period)` — agrega eventos pendentes.
2. Celery tasks:
   - `notifications.tasks.process_queue` (consume pending), `notifications.tasks.send_digest_daily` (Celery beat para digest).
3. In-app inbox: atualizar `NotificationInbox` (CRUD para `estado`), endpoint `PATCH /notifications/{id}/read`.
4. Integrar com modules:
   - Expor helper `notify(event_type, context)` para ser usado em Messaging/Tickets/Automation/Gamification.
   - Seeds default de regras/templates (SLA, assign, analytics alert, kudos).
5. Web push/email stubs: usar console e `print` por enquanto; registrar `notification_channel_token` (mock de device token).

## Testes
- `docker compose exec backend pytest notifications/tests/test_engine.py` — preferências, quiet hours, dedupe.
- `docker compose exec backend pytest notifications/tests/test_tasks.py` — queue e digest.
- `docker compose exec backend pytest notifications/tests/test_api.py` — inbox endpoints.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Seeds executáveis (`seed_notifications_defaults`).
- ✅ README plano atualizado + docs (`docs/modules/notifications.md`).
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/notifications.md`
