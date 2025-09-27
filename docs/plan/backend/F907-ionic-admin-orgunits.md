# F907 — Admin de OrgUnits & RBAC no Ionic

## Objetivo
Implementar painel administrativo para gerenciar unidades organizacionais, horários e roles/papéis diretamente pelo app.

## Escopo
1. Views/Rotas:
   - `AdminOrgUnits` listando unidades (árvore/hierarquia) com ações (criar, editar, arquivar).
   - Formulário de SLA/hora de atendimento (Schedule + SLA Policy) com tabs.
   - Tela `AdminRoles` para visualizar roles, permissões e assignments.
2. Estado/API:
   - Store `adminOrgSlice` consumindo endpoints B203 (`/org-units`, `/sla-policies`, `/roles`).
   - Ações para `createOrgUnit`, `updateOrgUnit`, `assignUser`, `updateSlaPolicy`.
3. UX/Validações:
   - Árvore com drag-and-drop (opcional, pode ser stub) ou reorganização via actions.
   - Alertas ao alterar SLA (informar impacto).
   - Permitir export (JSON) da configuração atual.
4. Testes UI com Testing Library e snapshots (mocks API).

## Testes
- `npm run test` — `AdminOrgUnits.test.tsx`, `AdminRoles.test.tsx`.
- Teste manual conectando ao backend seeds para CRUD completo.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Fluxo CRUD e atribuições operacionais.
- ✅ README plano atualizado + docs (se preciso, instruções admin).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/organizations.md`
- `docs/modules/core.md`
