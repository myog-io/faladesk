# F915 — Exports & Sharing Analytics

## Objetivo
Permitir export de relatórios (CSV/Excel) e compartilhamento de dashboards (links públicos protegidos).

## Escopo
1. UI:
   - Botões de export (CSV, XLSX) em dashboards/tabelas (usa endpoints `/analytics/export`).
   - Modal para gerar link compartilhado temporário (com expiração, password opcional).
2. Estado/API:
   - Store `analyticsExportSlice` gerenciando requests, progress, erros.
   - Usar downloads streaming (FileSaver) ou `window.location` para links.
3. Integração backend:
   - Garantir endpoints de export (mock se não prontos) — registrar TODO se depender de backend.
   - Logar evento analytics `analytics.export`.

## Testes
- `npm run test` — `AnalyticsExport.test.tsx` (mock API downloads).
- Teste manual downloads/links (ver arquivo gerado).

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Export e links funcionais (ao menos stub).
- ✅ README plano atualizado.
- ✅ Caso endpoints backend sejam criados/ajustados, atualizar OpenAPI (B003).

## Referências
- `docs/modules/analytics.md`
