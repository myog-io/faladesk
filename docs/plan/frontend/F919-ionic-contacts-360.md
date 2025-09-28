# F919 — Visão 360º de Contatos no Ionic

## Objetivo
Implementar tela unificada de contato, mostrando identidade, histórico, tickets, conversas, notas e gamificação relacionada.

## Escopo
1. View `Contact360` com seções:
   - Perfil (nome, identidades, tags, status, score).
   - Timeline (conversas, tickets, feedbacks) com filtro por tipo/ período.
   - Notas internas e anexos (CRUD).
2. Estado/API:
   - Store `contactsSlice` (`fetchContact`, `fetchTimeline`, `addNote`, `updateIdentity`).
   - Integração com analytics (exibir métricas do contato) e gamificação (pontuação cliente, se aplicável).
3. Ações rápidas: iniciar conversa, criar ticket, merge (link para fluxo B703).
4. UX: cards com ícones, badges LGPD (anonimizar), highlight duplicados.

## Testes
- `npm run test` — `Contact360.test.tsx` (mock API + timeline).
- Teste manual com contato seed.

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Timeline e ações funcionando.
- ✅ README plano atualizado.
- ✅ Caso endpoints backend sejam necessários, atualizar OpenAPI (B003).

## Referências
- `docs/modules/contacts.md`
