# F913 — Dashboard de Analytics no Ionic

## Objetivo
Criar dashboard principal de analytics exibindo KPIs, gráficos e filtros, consumindo snapshots agregados.

## Escopo
1. Views:
   - `AnalyticsDashboard` com cards KPIs (volume, SLA, CSAT, backlog), gráficos (linha, barra) usando libs (ECharts/Recharts).
   - Filtro global (período, org_unit, canal, agente).
2. Estado/API:
   - Store `analyticsSlice` consumindo `/analytics/snapshots` e `/analytics/materialized-views`.
   - Hooks `useAnalyticsData(filters)` com caching/debounce.
3. UX: tooltips, comparativo vs período anterior, export CSV (gera link para endpoint export).
4. Responsividade, modo dark.

## Testes
- `npm run test` — `AnalyticsDashboard.test.tsx` (mock API + chart snapshot).
- Teste manual com seeds analytics (gerados B601).

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Dashboard responde a filtros e atualiza gráficos.
- ✅ README plano atualizado + docs (se prints).

## Referências
- `docs/modules/analytics.md`
