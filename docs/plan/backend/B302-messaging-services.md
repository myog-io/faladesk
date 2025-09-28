# B302 — Serviços de Messaging (Inbox & SLA)

## Objetivo
Implementar serviços core responsáveis por atualizar estado da conversa, calcular timers e preparar dados para automations/notifications.

## Escopo
1. Criar serviço `messaging.services.conversation_flow` com funções:
   - `record_inbound_message(conversation, message_data)` (atualiza `last_inbound_at`, cria mensagem, triggers event).
   - `record_outbound_message(...)` (similar, atualiza `first_response_at` se aplicável).
   - `close_conversation(conversation, reason)` (atualiza status, gera `ConversationEvent`).
2. Timer/Queue helpers:
   - `schedule_timers(conversation)` (cria/atualiza `ConversationTimer` para SLA).
   - `enqueue_conversation(conversation)` que popula `ConversationQueueEntry` usando serviço de routing (B202) e seeds.
3. Emitir eventos para outros módulos:
   - `analytics_event` (ex.: `conversation.message_inbound` / `conversation.closed`).
   - `notification_queue` para atribuição/transferência (usar templates padrão).
4. Atualizar seeds demo para chamar serviços onde fizer sentido (demonstra fluxo real).

## Testes
- `docker compose exec backend pytest messaging/tests/test_services.py` validando funções serviço (usando factories + mocks para analytics/notifications).
- Cobrir casos edge (primeira resposta, reabertura, timers).

## Checklist ao concluir
- ✅ Tests passando (`docker compose exec backend pytest messaging/tests/test_services.py`).
- ✅ Mocks/asserts confirmam emissão de eventos (analytics/notifications/gamification se aplicável).
- ✅ README do plano atualizado.
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/messaging.md`
- `docs/modules/notifications.md`
- `docs/modules/analytics.md`
