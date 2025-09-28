# F902 — Inbox Unificada (Ionic Angular)

## Objetivo
Implementar a tela principal de atendimento (conversas + tickets) com filtros, painel de conversa e atualizações em tempo real via WebSocket.

## Escopo
1. Estado (NgRx):
   - Criar feature `ConversationsState` (`entities`, `selectedId`, `filters`, `loading`, `error`).
   - Effects `loadConversations`, `loadConversationDetail`, `sendMessage`, `assignConversation`, `closeConversation` conectados aos endpoints B303.
   - `ConversationSocketService` ouvindo `ws/{tenant_slug}/conversations/{conversation_id}` e disparando actions `messageReceived`, `participantUpdated`, `statusChanged`.
2. UI/Componentes:
   - `inbox-shell` com sidebar (`inbox-filters`), lista (`conversation-list`), painel (`conversation-panel`).
   - Composer `conversation-composer` com suporte a texto, quick replies (drop-down com `/knowledge/quick-replies`) e anexos stub.
   - Header do painel exibindo info do contato, org unit, SLA (progress bar) e botões rápidos (atribuir, transferir, fechar).
3. Integração backend:
   - Services Angular (`ConversationsApiService`, `TicketsApiService`) para consumir endpoints B303.
   - Utilizar interceptors configurados no F901.
4. UX/adicionais:
   - Skeleton/loading states, empty states, badge de unread.
   - Atalhos (ex.: `r` para responder), quick replies, e banners de alertas (SLA) integrados com notifications store.
   - Responsividade (mobile/tablet) e dark mode.

## Testes
- `npm run lint`.
- `npm run test` com suites `conversation-list.component.spec.ts`, `conversation-panel.component.spec.ts`, `conversation.effects.spec.ts` (mock WebSocket + NgRx).
- Teste manual com backend via Docker (seed demo) validando fluxo inbound/outbound.

## Checklist ao concluir
- ✅ Tests/ lint passando no container `frontend`.
- ✅ WebSocket atualiza store em tempo real.
- ✅ README (plano) atualizado com status/comandos.
- ✅ Caso novos endpoints/backend tenham sido necessários, atualizar documentação OpenAPI (tarefa B003) e demais docs.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/messaging.md`
