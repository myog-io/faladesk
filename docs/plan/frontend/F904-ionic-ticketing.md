# F904 — Tickets & Workflow no Ionic

## Objetivo
Implementar telas e fluxos do módulo de tickets (lista, detalhe, comentários, worklogs, SLA) no app Ionic.

## Escopo
1. Views/Rotas:
   - `TicketsList` (filtros: status, org_unit, prioridade, agente, tags).
   - `TicketDetail` (tabs: atividade, comentários, worklogs, SLA timeline).
   - Componentes para comentários, anexos (upload stub), worklog entry.
2. Estado/API:
   - Store `ticketsSlice` com actions `fetchTickets`, `fetchTicketDetail`, `addComment`, `changeStatus`, `assignTicket` (chamar endpoints B403).
   - Integração com WebSocket/notifications para atualizar detalhe em tempo real (ticket updates).
3. UX:
   - Indicadores SLA (barra/progress), badges de prioridade, histórico collapsible.
   - Botões rápidos (atribuir para mim, transferir, registrar worklog).
4. i18n: todos labels/traduções (PT/EN/ES, reusar strings do backend docs quando possível).
5. Documentar comandos no README (como rodar `npm run test`, etc.).

## Testes
- `npm run test` — testes para `TicketsList.test.tsx`, `TicketDetail.test.tsx` (mocks store/API).
- Teste manual com backend rodando (seed ticket demo) garantindo CRUD.

## Checklist ao concluir
- ✅ Tests UI passando (container `frontend`).
- ✅ Integração com notifications/gamificação (exibir kudos etc.) quando aplicável.
- ✅ README do plano atualizado + docs (se screenshots ou instruções extras).
- ✅ Caso novos endpoints/backend sejam necessários, atualizar documentação OpenAPI (B003) e módulos correspondentes.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/tickets.md`
- `docs/modules/notifications.md`
