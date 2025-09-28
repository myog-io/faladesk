# B301 — Models de Messaging

## Objetivo
Implementar models/migrations do módulo `messaging` (conversations, messages, attachments, deliveries, reactions, timers, queue entry) garantindo alinhamento com `docs/03-modelo-dados.md`.

## Escopo
1. Models/migrations:
   - `Conversation`, `ConversationParticipant`, `ConversationAssignment`, `ConversationState`.
   - `Message`, `MessageSegment`, `MessageAttachment`, `MessageDelivery`, `MessageReaction`.
   - `ConversationEvent`, `ConversationTimer`, `ConversationQueueEntry`, `ConversationTag` (alias `tag_link`).
2. Adicionar constraints/indexes importantes:
   - Unique (`conversation_id`, `tenant_user_id`, `active=True`) para Participant owner.
   - Index por `conversation_id`/`status`/`prioridade`.
3. Seeds/fixtures mínimos:
   - Criar conversa demo (via management command) com mensagens inbound/outbound e attachments fake.
4. Preparar signals para atualização de `Conversation.last_message_at`, `first_response_at`, `closed_at` (sem lógica complexa).

## Testes
- `docker compose exec backend pytest messaging/tests/test_models.py` (criação conversation/message, constraints, state updates).
- Teste de seeds (comando `docker compose exec backend python manage.py seed_messaging_demo`).

## Checklist ao concluir
- ✅ Tests passando (`docker compose exec backend pytest messaging/tests/test_models.py`).
- ✅ Seeds executáveis sem duplicar dados.
- ✅ README do plano atualizado com status/comandos.
- ✅ Atualizar `docs/03-modelo-dados.md` se ajustes forem necessários.
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/messaging.md`
- `docs/modules/notifications.md` (para emissão futura)
