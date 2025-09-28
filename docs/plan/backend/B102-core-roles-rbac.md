# B102 — RBAC e Escopo Multi-Tenant

## Objetivo
Implementar controle de papéis e permissões seguindo boas práticas (roles customizáveis por tenant, assignments limitados por org_unit/time) conforme `development_guidelines.md`.

## Escopo
1. Models/migrations em `core`:
   - `Role`, `Permission`, `RolePermission`, `RoleAssignment` (incluir `scope_type`, `scope_id` conforme modelo).
   - Seeds padrão (Admin, Supervisor, Agente, Financeiro, Developer) com permissões mínimas predefinidas.
2. Serializers/viewsets DRF:
   - `GET/POST /roles`, `GET /roles/{id}`, `DELETE /roles/{id}` (com salvaguarda para roles `is_system`).
   - Endpoint `POST /roles/{id}/assign` e `DELETE /role-assignments/{id}`.
   - `GET /permissions` (somente leitura, listar catálogo).
3. Permissões DRF:
   - Helper `core.permissions.has_permission(user, "permission.code", scope=None)` para uso centralizado.
   - Permission class `HasTenantPermission` aplicado nas viewsets relevantes.
4. Integração com login: quando `TenantUser` novo é criado, atribuir role padrão `Agente` (a não ser que `tenant_invitation` especifique outro).
5. Atualizar seeds/fixtures (management command) para inserir roles e permissões padrões (idempotente).

## Testes
- `docker compose exec backend pytest core/tests/test_roles.py` cobrindo criação de roles, assignments, limites multi-tenant.
- Testes de permissão em viewsets (permitido/proibido) com `APIClient`.
- Garantir que roles `is_system` não possam ser excluídos.

## Checklist ao concluir
- ✅ Tests passando (`docker compose exec backend pytest core/tests/test_roles.py`).
- ✅ Seeds executáveis sem duplicar dados (`docker compose exec backend python manage.py seed_roles`).
- ✅ Atualizar `docs/plan/backend/README.md` (marcar tarefa, registrar comandos).
- ✅ Revisar se `docs/modules/core.md` e `docs/03-modelo-dados.md` continuam coerentes.
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/core.md`
- `docs/03-modelo-dados.md`
