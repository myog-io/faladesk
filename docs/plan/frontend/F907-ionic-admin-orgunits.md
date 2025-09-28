# F907 — Admin de OrgUnits & RBAC (Ionic Angular)

## Objetivo
Implementar painel administrativo para gerenciar unidades organizacionais, horários e papéis/permissions seguindo o modelo do backend.

## Escopo
1. Views/Rotas:
   - Página `admin-org-units` exibindo árvore/hierarquia (`org-unit-tree` component) com ações (criar, editar, arquivar).
   - Formulário Reactive Forms para SLA (`Schedule` + `SlaPolicy`) em tabs.
   - Página `admin-roles` (listas de roles/permissões, modal assignment).
2. Estado/API:
   - Feature NgRx `AdminOrgState` consumindo endpoints B203 (`/org-units`, `/sla-policies`, `/roles`).
   - Effects `loadOrgUnits`, `createOrgUnit`, `updateSlaPolicy`, `assignRole` etc.
3. UX/Validações:
   - Drag-and-drop opcional (pode ser stub) ou ordenação com botões.
   - Alertas ao alterar SLA (informar impacto).
   - Export JSON da configuração atual (botão -> download)
4. Testes UI com Angular TestBed/`@testing-library/angular` + HttpTestingController.

## Testes
- `npm run lint`.
- `npm run test` — `admin-org-units.component.spec.ts`, `admin-roles.component.spec.ts`, `admin-org.effects.spec.ts`.
- Teste manual com backend seeds (`seed_organizations`).

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Fluxo CRUD e atribuições operacionais.
- ✅ README plano atualizado + docs (instruções admin se necessário).
- ✅ Caso novos endpoints/backend sejam necessários, atualizar documentação OpenAPI (B003).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/organizations.md`
- `docs/modules/core.md`
