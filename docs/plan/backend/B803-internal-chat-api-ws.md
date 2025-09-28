# B803 — APIs & WebSockets do Internal Chat

## Objetivo
Expor APIs REST e WebSocket para canais de texto/voz, DMs, e presença, integrando com Channels/WebRTC.

## Escopo
1. API REST:
   - `InternalChatChannelViewSet` (CRUD canais, incluir tipos voice/stage) + endpoint `POST /internal-chat/channels/{id}/invite`.
   - `InternalChatMessageViewSet` (`list/create`), `InternalChatThreadViewSet`.
   - `POST /internal-chat/voice-sessions/{id}/participants` para promover/demover speakers.
   - `PATCH /internal-chat/presence/me` para atualizar status custom.
2. WebSocket/Signalização:
   - Consumer `InternalChatConsumer` (`ws/{tenant_slug}/internal-chat/{channel_slug}`) — broadcast mensagens, reações, status.
   - Consumer `VoiceSignalConsumer` (`ws/{tenant_slug}/internal-chat/voice/{channel_slug}`) — troca de SDP/ICE (stub) e eventos stage.
3. Notifications: mentions, invites stage, call requests — enfileirar via notifications engine.
4. WebRTC integration stub (scripts front) — gerar token temporário, logs.

## Testes
- `docker compose exec backend pytest internal_chat/tests/test_api.py` — canais, DMs, voz endpoints.
- `docker compose exec backend pytest internal_chat/tests/test_ws.py` — websockets (texto/voz) com Channels test client.

## Checklist ao concluir
- ✅ Tests passando (API + WS).
- ✅ Signalização integrada com serviços e notificações.
- ✅ README plano atualizado.
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/internal_chat.md`
- `docs/modules/notifications.md`
