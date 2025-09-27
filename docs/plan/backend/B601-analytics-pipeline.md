# B601 — Pipeline de Analytics

## Objetivo
Construir ingestão e processamento básico de eventos analytics (`analytics_event`, snapshots, jobs) garantindo publicação em background.

## Escopo
1. Serviços em `analytics.pipeline`:
   - `record_event(module, event_type, payload, tenant_id, occurred_at)` → insere `AnalyticsEvent` + `AnalyticsEventMeta`.
   - `process_event(event_id)` → transforma evento em dados normalizados (stub) e atualiza snapshots.
   - `update_snapshot(tenant_id, scope, dimension_keys, metrics)` → agrega métricas diárias.
2. Celery tasks:
   - `analytics.tasks.enqueue_event` (wrapper para `record_event`).
   - `analytics.tasks.process_event` (worker). Usar queue dedicada.
3. Seeds/config padrão:
   - Registrar dimensões default (channels, org_units) com `analytics_dimension`.
   - Criar job diário `analytics_job` (snapshot_recalc) usando Celery beat.
4. Instrumentar modules core para emitir evento stub (ex.: quando conversa é criada ou ticket resolvido) — use mocks se dependências ainda não prontas.

## Testes
- `pytest analytics/tests/test_pipeline.py` — `record_event`, `process_event`, `update_snapshot` com dados fake.
- `pytest analytics/tests/test_tasks.py` — tasks Celery (usar `celery_worker` fixture ou mock delay).

## Checklist ao concluir
- ✅ Tests analytics passando.
- ✅ Seeds/job scheduler configurados.
- ✅ README plano atualizado e docs se necessário (`docs/modules/analytics.md`).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/analytics.md`
