# B303 — APIs & WebSocket de Messaging

## Objetivo
Expor endpoints REST/WebSocket para inbox unificada, incluindo real-time updates via Channels.

## Escopo
1. API REST:
   - `ConversationViewSet` (`list/retrieve`, filtros por `status`, `org_unit`, `channel`, `tags`).
   - `MessageViewSet` (`list/create`), com validações (in/out/internal) e integrando serviços B302.
   - Endpoints auxiliares: `POST /conversations/{id}/assign`, `POST /conversations/{id}/close`, `POST /conversations/{id}/tags`.
   - Permissões: `HasTenantPermission` (`messaging.view`, `messaging.manage`).
2. WebSocket (Channels):
   - Consumer `ConversationConsumer` (`ws/{tenant_slug}/conversations/{conversation_id}`) enviando eventos em tempo real (mensagens, estado, participantes).
   - `PresenceConsumer` (opcional) para indicar profissionais online.
3. Serializers/responses devem incluir link de contexto (ex.: `action_url`), status timers e queue position.
4. Notificações: ao criar mensagem inbound/outbound, garantir `notification_queue` enfileira alerta para agentes/participantes.
5. Atualizar `ASGI`/routing, registrar `channels_routing.py`.

## Testes
- `pytest messaging/tests/test_api_conversations.py` (CRUD, filtros, permissões, integridade).
- `pytest messaging/tests/test_ws_conversations.py` (Channels LiveServerTestCase ou pytest-asyncio) cobrindo recebimento em tempo real.

## Checklist ao concluir
- ✅ Tests API e WS passando.
- ✅ WebSocket consumer conectado ao serviço B302 (mock/outgoing events).
- ✅ README do plano atualizado e docs (se endpoints são novos, garantir listagem em docs).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/messaging.md`
- `docs/modules/notifications.md`
- `docs/05-plano-construcao.md`
