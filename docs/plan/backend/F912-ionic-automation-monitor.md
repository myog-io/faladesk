# F912 — Monitor de Runs de Automação

## Objetivo
Implementar painel para monitorar execuções de flows (runs, steps, erros) com filtros e reprocessamento.

## Escopo
1. Views:
   - `AutomationRuns` lista com filtros (flow, status, data, tenant se admin multi-tenant).
   - `AutomationRunDetail` mostrando steps, logs, payloads, opção retry/cancel.
2. Estado/API:
   - Store `automationMonitorSlice` consumindo `/automation/runs`, `/automation/runs/{id}`, `/automation/jobs` endpoints.
   - Actions: `retryRun`, `cancelRun`, `downloadPayload`.
3. UX: highlight erros com badges, mostrar diff entre payload original e output, link para analytics event.
4. Notificações: se run falhar, permitir reprocessar e registrar notificação (consumindo notifications API).

## Testes
- `npm run test` — `AutomationRuns.test.tsx`, `AutomationRunDetail.test.tsx` (mock API + actions).
- Teste manual com backend seeds (automatização default).

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Monitor funcional com retry/cancel.
- ✅ README plano atualizado.

## Referências
- `docs/modules/automation.md`
- `docs/modules/notifications.md`
