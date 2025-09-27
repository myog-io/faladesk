# B402 — Serviços de Workflow de Tickets

## Objetivo
Criar serviços responsáveis por fluxo de tickets (criação a partir de conversa, transições de status, worklogs, integração SLA) e emissão de eventos.

## Escopo
1. Serviços principais em `tickets.services.workflow`:
   - `create_ticket_from_conversation(conversation, data)` → cria ticket, vincula conversation, gera status history inicial, emite `analytics_event` + `notification_queue`.
   - `change_ticket_status(ticket, new_status, motivo, actor)` → atualiza status, gera history, dispara notificações/SLA updates.
   - `assign_ticket(ticket, tenant_user, motivo, tipo)` → cria `TicketAssignment`, encerra assignment anterior, notifica novo responsável.
   - `add_worklog(ticket, tenant_user, tempo_minutos, descricao)` → atualiza `TicketWorklog`, recalcula métricas.
2. Integrar com SLA:
   - Atualizar/encerrar `SlaEvent` correspondente quando status muda para `resolved/closed`.
3. Integrar com gamificação:
   - Ao resolver ticket com CSAT alto (quando disponível), gerar `gamification_event` (stub — permitir flag no serviço).
4. Seeds demo: usar serviços para gerar ticket de exemplo (consistencia com messaging seeds).

## Testes
- `pytest tickets/tests/test_workflow.py` cobrindo criação, mudança status, assign, worklog (mocks para analytics/notifications/gamification).
- Garantir idempotência do fluxo `create_ticket_from_conversation` (não duplicar tickets para mesma conversation se já existe).

## Checklist ao concluir
- ✅ Tests passando (`pytest tickets/tests/test_workflow.py`).
- ✅ Emissão de eventos validada via mocks/asserts.
- ✅ README do plano atualizado.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/tickets.md`
- `docs/modules/notifications.md`
- `docs/modules/gamification.md`
