# B503 — Engine de Automations (Fluxo Intake)

## Objetivo
Implementar componentes mínimos do motor de automação (flows, triggers, nodes, runs) focando intake de mensagens e execução básica.

## Escopo
1. Services em `automation.engine`:
   - `execute_flow(flow, context)` — iterar nodes, registrar `AutomationRun`/`AutomationRunStep`.
   - Implementar nodes básicos: `NormalizePayloadNode`, `SpamCheckNode`, `RouteToOrgUnitNode`, `NotifyNode` (stub), `CreateConversationNode`.
   - Suportar triggers `channel_intake`, `webhook_in`, `manual` (API) — registrar em `AutomationTrigger` e enfileirar via Celery.
2. Tarefas Celery:
   - `automation.tasks.run_flow(flow_id, context)` que chama serviço e gerencia retries/backoff.
   - `automation.tasks.evaluate_scheduled_jobs()` para `AutomationJob` (delay/retry).
3. Seeds: publicar flow intake default (normalize + spam check + route + create conversation).
4. API endpoints:
   - `POST /automation/flows/{id}/run` (manual trigger).
   - `POST /automation/webhooks/{slug}` (recebe payload, valida assinatura, enfileira flow).
5. Observabilidade:
   - Garantir `analytics_event` `automation.flow_run` e `notification_queue` quando flow falhar.

## Testes
- `docker compose exec backend pytest automation/tests/test_engine.py` — execuções simples, nodes básicos, registros de run/steps.
- `docker compose exec backend pytest automation/tests/test_api_webhook.py` — ingestão via webhook, assinatura inválida, etc.
- Teste seeds: `docker compose exec backend python manage.py seed_automation_default` — verificar que flow default roda (mock context).

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Seeds executáveis e flow intake funcional.
- ✅ README do plano atualizado e, se necessário, docs (módulo automation).
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/automation.md`
- `docs/modules/notifications.md`
