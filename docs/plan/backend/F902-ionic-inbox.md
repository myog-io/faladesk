# F902 — Inbox Unificada no Ionic

## Objetivo
Implementar tela principal de inbox (conversas + tickets), incluindo filtros, painel de conversa e interações básicas.

## Escopo
1. Estado (store):
   - Criar slices para conversations (`list`, `selected`, `loading`, `filters`).
   - Actions para fetch list (`/conversations`) e realtime updates (Channels WebSocket).
2. UI/Componentes:
   - Sidebar com filtros rápidos (status, canal, org_unit, minhas conversas).
   - Lista de conversas com badges (SLA, tags, unread count).
   - Painel principal com header (info contato, org unit), mensagens (chat bubble), composer (texto/quick reply/anexo stub).
3. Integração com backend:
   - Consumir endpoints B303 (`GET /conversations`, `POST /conversations/{id}/messages`).
   - WebSocket: `ws/{tenant_slug}/conversations/{conversation_id}` (renderizar novas mensagens em tempo real).
4. Atalhos/UX:
   - Quick replies (carregar de knowledge API, exibir dropdown).
   - Botões de ação rápida (assign, transfer, close) chamando APIs.
5. Testes UI (Jest/Testing Library) para componentes chave e integrados (mock store + API).

## Testes
- `npm run test` com suites específicas (ex.: `InboxList.test.tsx`, `ConversationPanel.test.tsx`).
- Teste manual: iniciar backend + frontend, validar fluxo completo inbound/outbound.

## Checklist ao concluir
- ✅ Tests UI passando.
- ✅ WebSocket funcionando (ver Logs console/Redux devtools).
- ✅ README plano atualizado e docs se necessário (capturas, instruções).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/messaging.md`
