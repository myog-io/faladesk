# B802 — Serviços de Internal Chat (Texto & Voz)

## Objetivo
Implementar serviços de negócio para mensagens internas, presença, sessões de voz/stage e integração com automations/gamificação.

## Escopo
1. Serviços em `internal_chat.services`:
   - `post_message(channel, author, content, tipo)` -> cria mensagem, atualiza presença, emite eventos.
   - `start_voice_session(channel, host, modo)` -> cria session + participants.
   - `end_voice_session(session, reason)` -> encerra, gera gravação (stub).
   - `update_presence(user, status, contexto)` -> atualiza `InternalChatPresence`.
2. Integrações:
   - Enfileirar `notification_queue` (mentions, invites stage).
   - `analytics_event` (participação voz, mensagens).
   - `gamification_event` (participação voz, kudos via reactions especiais).
3. Seeds atualizados para usar serviços (canais e sessions).

## Testes
- `pytest internal_chat/tests/test_services.py` — mensagens, voz, presença.
- Mocks para analytics/notificações/gamificação.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Serviços integrados com seeds.
- ✅ README plano atualizado.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/internal_chat.md`
- `docs/modules/notifications.md`
- `docs/modules/gamification.md`
