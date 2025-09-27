# F903 — Notificações & Gamificação no Ionic

## Objetivo
Integrar notificações in-app/push e dashboard gamificação (pontos, badges, leaderboard) na interface Ionic.

## Escopo
1. Notificações:
   - Implementar serviço `useNotifications` consumindo `/notifications/inbox` + WebSocket dedicado (`ws/{tenant_slug}/notifications`).
   - Criar componente `NotificationCenter` (ícone sino com badge, lista dropdown, tela detalhada).
   - Configurar push (Capacitor Push) stub — exibir console log/alerta se push não implementado.
   - Ações (marcar como lido, arquivar) → `PATCH /notifications/{id}/read`.
2. Gamificação:
   - Tela/Widget `GamificationDashboard` mostrando pontos atuais, nível, badges, leaderboard top 5.
   - Consumir `/gamification/profile/me`, `/gamification/leaderboards/current`.
   - Mostrar feedbacks recentes (peer/customer) e CTA para dar kudos.
3. Integração com Inbox:
   - Quando conversa/ticket gera notificação crítica (SLA), exibir banner/alert context na conversa.
4. Internacionalização: garantir textos notificação/gamificação com i18n (PT/EN/ES).
5. UX Tests: garantir acessibilidade (ARIA) no NotificationCenter e Gamification dashboard.

## Testes
- `npm run test` para componentes `NotificationCenter.test.tsx`, `GamificationDashboard.test.tsx` (mocks API/WebSocket).
- Teste manual push stub (capacitador) e confirmações de estilo.

## Checklist ao concluir
- ✅ Tests UI passando.
- ✅ Integração com backend (mock/real) funcional.
- ✅ README plano atualizado + docs (se necessário, instruções de push setup).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/notifications.md`
- `docs/modules/gamification.md`
