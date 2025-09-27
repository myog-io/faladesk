# B801 — Models de Internal Chat

## Objetivo
Construir modelos e migrations do módulo `internal_chat` (canais, threads, mensagens, anexos, voz, call log, status) conforme documentação atualizada.

## Escopo
1. Models/migrations em `internal_chat`:
   - `InternalChatChannel`, `InternalChatChannelMember`, `InternalChatThread`, `InternalChatMessage`, `InternalChatMessageAttachment`, `InternalChatMessageReaction`, `InternalChatPresence`, `InternalChatStatus`.
   - `InternalChatVoiceSession`, `InternalChatVoiceParticipant`, `InternalChatVoiceRecording`, `InternalChatCallLog`.
2. Seeds default:
   - Criar canais “#anuncios”, “#geral”, “#voice-suporte” (voice stage).
   - DMs demo entre usuários seed (core).
   - Configurar voice session exemplo com gravação fake.
3. Constraints/indexes/helpers:
   - Slug único por tenant; validations em voice (max participantes, bitrates).
   - Service helper `generate_channel_slug` e `start_voice_session` stub.

## Testes
- `pytest internal_chat/tests/test_models.py` — criação canais/threads/mensagens/voz, validações.
- `pytest internal_chat/tests/test_seeds.py` — seeds idempotentes.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Seeds executáveis (`python manage.py seed_internal_chat`).
- ✅ README plano atualizado + docs (`docs/modules/internal_chat.md`).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/internal_chat.md`
