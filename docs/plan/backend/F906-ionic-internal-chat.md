# F906 — Internal Chat & Voz no Ionic

## Objetivo
Implementar UI do chat interno (texto, DMs, canais de voz/stage) com integração realtime (WebSocket/WebRTC stub).

## Escopo
1. Views/Componentes:
   - `internal-chat` layout (lista de canais, DMs, busca, presença) + `channel-sidebar`, `dm-list` components.
   - `chat-room` (mensagens, threads, reactions, anexos stub) e `message-composer` (Angular reactive forms).
   - `voice-room` / `stage-room` interface com lista speakers/listeners, botão raise hand, mute/unmute.
2. Estado/API:
   - NgRx feature `InternalChatState` para canais, mensagens, voz (session status, participants).
   - Actions/effects: `loadChannels`, `loadMessages`, `sendMessage`, `joinVoice`, `leaveVoice` (WebSocket/REST B803).
   - Integrar com notifications (mentions/invites) e gamificação (kudos/com participação voz).
3. Signalização WebRTC (stub):
   - Utilizar `VoiceSignalConsumer` WebSocket para trocar mensagens (SDP/ICE placeholders). Focar em UI + logging; real WebRTC será implementado em sprint futura.
4. i18n e A11y: suportar PT/EN/ES, roles ARIA para chat (list) e voz (speakers/listeners).

## Testes
- `npm run test` — `internal-chat.component.spec.ts`, `chat-room.component.spec.ts`, `voice-room.component.spec.ts` (mock WebSocket/NgRx).
- Teste manual (com backend seeds) — trocar mensagens, simular convite voice.

## Checklist ao concluir
- ✅ Tests UI passando (container `frontend`).
- ✅ WebSocket UI funcional (mesmo com stubs).
- ✅ README plano atualizado + docs (se necessário).
- ✅ Caso novos endpoints/backend sejam criados para suportar funcionalidades, atualizar documentação OpenAPI (B003) e módulos correspondentes.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/internal_chat.md`
- `docs/modules/notifications.md`
- `docs/modules/gamification.md`
