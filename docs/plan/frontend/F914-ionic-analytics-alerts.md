# F914 — Alerts & Configurações Analytics

## Objetivo
Implementar interface para criar/editar alertas (thresholds, destinatários) e visualizar histórico de disparos.

## Escopo
1. Views:
   - `AnalyticsAlerts` listando alertas (tipo, threshold, destinatários, status).
   - Modal `AlertEditor` com formulário (selecionar métricas, janela, canal notificação).
   - `AlertHistory` exibindo disparos recentes com link para notificações correspondentes.
2. Estado/API:
   - Store `analyticsAlertsSlice` consumindo `/analytics/alerts` endpoints (CRUD) e `/analytics/alerts/{id}/history`.
3. Integração com notifications: ao criar alerta, sugerir destinatários (roles) e permitir teste (botão “Enviar teste”).
4. Validar inputs (JSON schema threshold) e i18n.

## Testes
- `npm run test` — `AnalyticsAlerts.test.tsx`, `AlertEditor.test.tsx`.
- Teste manual plugando backend seeds/alerts.

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Fluxos CRUD e histórico funcionando.
- ✅ README plano atualizado.
- ✅ Caso endpoints/backend sejam criados/alterados, atualizar OpenAPI (B003).

## Referências
- `docs/modules/analytics.md`
- `docs/modules/notifications.md`
