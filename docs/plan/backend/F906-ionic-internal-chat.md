# F906 — Internal Chat & Voz no Ionic

## Objetivo
Implementar UI do chat interno (texto, DMs, canais de voz/stage) com integração realtime (WebSocket/WebRTC stub).

## Escopo
1. Views/Componentes:
   - `InternalChat` layout (lista de canais, DMs, busca, presença).
   - `ChatRoom` (mensagens, threads, reactions, anexos stub).
   - `VoiceRoom` / `StageRoom` interface com lista speakers/listeners, botão raise hand, mute/unmute.
2. Estado/API:
   - Store `internalChatSlice` para canais, mensagens, voz (status session, participants).
   - Actions: `fetchChannels`, `fetchMessages`, `sendMessage`, `joinVoice`, `leaveVoice` (WebSocket/REST B803).
   - Integrar com notifications (mentions/invites) e gamificação (kudos/com participação voz).
3. Signalização WebRTC (stub):
   - Utilizar `VoiceSignalConsumer` WebSocket para trocar mensagens (SDP/ICE placeholders). Focar em UI + logging; real WebRTC será implementado em sprint futura.
4. i18n e A11y: suportar PT/EN/ES, roles ARIA para chat (list) e voz (speakers/listeners).

## Testes
- `npm run test` — `InternalChat.test.tsx`, `ChatRoom.test.tsx`, `VoiceRoom.test.tsx` (mock WebSocket/ store).
- Teste manual (com backend seeds) — trocar mensagens, simular convite voice.

## Checklist ao concluir
- ✅ Tests UI passando.
- ✅ WebSocket UI funcional (mesmo com stubs).
- ✅ README plano atualizado.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/internal_chat.md`
- `docs/modules/notifications.md`
- `docs/modules/gamification.md`
