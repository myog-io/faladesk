# F918 — Digest & Centro de Notificações Avançado

## Objetivo
Criar tela para visualizar digests (resumos) e histórico de notificações críticas, integrando com analytics/gamificação.

## Escopo
1. View `NotificationDigest` exibindo resumos (diário/semanal) com seções (conversas, tickets, automations, kudos).
2. Centro avançado: filtros (categoria, prioridade), busca por texto, marcar tudo como lido.
3. Estado/API:
   - Store `notificationCenterSlice` (`fetchInbox`, `fetchDigest`, `bulkUpdate`, `archiveNotification`).
4. Export: permitir baixar digest em PDF/HTML (opcional stub).
5. Integração com analytics: registrar evento `notification.digest.opened`.

## Testes
- `npm run test` — `NotificationDigest.test.tsx`, `NotificationCenter.test.tsx`.
- Teste manual com backend seeds.

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Centro de notificações funciona com filtros/busca.
- ✅ README plano atualizado.
- ✅ Caso endpoints backend sejam necessários, atualizar OpenAPI (B003).

## Referências
- `docs/modules/notifications.md`
- `docs/modules/analytics.md`
