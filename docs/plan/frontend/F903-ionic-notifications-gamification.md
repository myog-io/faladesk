# F903 — Notificações & Gamificação (Ionic Angular)

## Objetivo
Implementar centro de notificações in-app/push e dashboard gamificação (pontos, badges, leaderboard) consumindo APIs de notifications/gamification.

## Escopo
1. Estado (NgRx):
   - Feature `NotificationsState` (`inbox`, `unreadCount`, `loading`). Effects para `loadInbox`, `markAsRead`, `archiveNotification`, `loadDigest` usando endpoints `/notifications`.
   - Feature `GamificationState` (`profile`, `leaderboard`, `challenges`). Effects `loadProfile`, `loadLeaderboard`, `sendPeerFeedback`.
2. Serviços:
   - `NotificationsService` (REST) e `NotificationsSocketService` (WebSocket `ws/{tenant_slug}/notifications`).
   - `GamificationService` consumindo `/gamification/profile/me`, `/gamification/leaderboards/current`, `/gamification/feedback`.
3. Componentes:
   - `notification-bell`, `notification-center`, `notification-detail` (com filtros, busca, mark all).
   - `gamification-dashboard`, `gamification-challenges`, `leaderboard-widget`.
   - Integrar push notifications (Capacitor) via service `PushService` (stub em ambiente dev).
4. UX/i18n:
   - i18n PT/EN/ES, a11y (ARIA), animações leves para conquistas.
   - Banner no inbox quando alerta SLA ou kudos chegar.

## Testes
- `npm run lint`, `npm run test` com specs `notification-center.component.spec.ts`, `gamification-dashboard.component.spec.ts`, `notifications.effects.spec.ts`, `gamification.effects.spec.ts`.
- Teste manual integrando backend seeds.

## Checklist ao concluir
- ✅ Tests/lint no container `frontend`.
- ✅ WebSocket/push (stub) funcionando.
- ✅ README plano atualizado.
- ✅ Caso novos endpoints backend sejam criados/alterados, atualizar documentação OpenAPI (B003) e demais docs.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/notifications.md`
- `docs/modules/gamification.md`
