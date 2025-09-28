# B201 — Models Organizations & SLA Básico

## Objetivo
Implementar modelos e migrations do módulo `organizations` (org_unit, schedules, SLA policies/events) garantindo multi-tenant e seeds padrão.

## Escopo
1. Criar models/migrations:
   - `OrgUnit` (hierarquia, metadata, defaults) + `OrgUnitMembership`, `OrgUnitEscalation` esqueleto (sem regras complexas ainda).
   - `Schedule`, `ScheduleException` para jornada de atendimento.
   - `SlaPolicy`, `SlaTarget`, `SlaEvent` com campos conforme `docs/03-modelo-dados.md`.
2. Implementar signals/services para atualizar `SlaEvent` deadlines ao criar `SlaPolicy/SlaTarget` (apenas stub — lógica completa ficará em automations posteriores).
3. Seeds padrão:
   - Criar org unit “Suporte” + “Comercial” para tenant demo.
   - SlaPolicy default (resposta 15min / resolução 4h) + horario comercial (09-18).
4. Indexes e constraints:
   - Unicidade (`tenant_id`, `slug`) em `OrgUnit`.
   - RLS (consultar guidelines) — garantir QuerySet filtra por `tenant_id`.

## Testes
- `docker compose exec backend pytest organizations/tests/test_models.py` cobrindo criação de OrgUnit, Schedules, SLA, event deadlines.
- `docker compose exec backend pytest organizations/tests/test_seeds.py` validando comando de seed (ou fixture) gera dados default sem duplicar.

## Checklist ao concluir
- ✅ Tests passando (`docker compose exec backend pytest organizations`).
- ✅ Seeds executáveis (`docker compose exec backend python manage.py seed_organizations`).
- ✅ Atualizar `docs/plan/backend/README.md` com status/observações.
- ✅ Ajustar `docs/03-modelo-dados.md` caso algum campo extra seja necessário.
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/organizations.md`
- `docs/03-modelo-dados.md`
