# B203 — APIs de Organizations & Permissões

## Objetivo
Expor endpoints REST para gerenciar org units, horários, SLA e escalonamentos, garantindo permissões baseadas em roles e integração com notificações/analytics.

## Escopo
1. Viewsets/serializers:
   - `OrgUnitViewSet` (`LIST/CREATE/UPDATE/DELETE`), incluir filtros por tipo/status.
   - `ScheduleViewSet`, `SlaPolicyViewSet`, `QueueRuleViewSet`, `OrgUnitEscalationViewSet` (CRUD básico).
   - Serializers devem aplicar validações (ex.: `tempo_resposta <= tempo_resolucao`, `org_unit` pertence ao tenant).
2. Permissões:
   - Usar `HasTenantPermission` (B102) com códigos padrão (`organizations.manage`, `organizations.view`).
   - Garantir que agentes sem permissão vejam apenas `OrgUnit` associadas (talvez via `queryset.filter(memberships)`).
3. Integração com notificações/analytics:
   - Ao criar/alterar `QueueRule` ou `SlaPolicy`, emitir eventos (`analytics_event` com tipo `org_unit.updated`).
   - Notificar supervisores quando escalonamento novo for cadastrado (enfileirar `notification_queue`).
4. Documentar endpoints em DRF schema (OpenAPI) — se `spectacular` usado, atualizar doc.
5. Atualizar seeds/test fixtures conforme novos endpoints (ex.: roles com `organizations.manage`).

## Testes
- `pytest organizations/tests/test_api_org_units.py` (CRUD + permissões).
- `pytest organizations/tests/test_api_sla.py` (validações e eventos).
- Use `APIClient` com usuários diferentes (Admin vs Agente) para garantir escopo.

## Checklist ao concluir
- ✅ Tests API passando.
- ✅ Eventos emitidos (simular `analytics_event` via assert/patch).
- ✅ README do plano atualizado e, se necessário, docs gerais (ex.: endpoints listados).
- ✅ Conferir `development_guidelines.md` para ver se novas regras precisam ser adicionadas (caso tenha surgido dependência).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/organizations.md`
- `docs/modules/notifications.md`
- `docs/modules/analytics.md`
