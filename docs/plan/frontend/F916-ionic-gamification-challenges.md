# F916 — Desafios & Leaderboard Gamificação no Ionic

## Objetivo
Criar telas para visualizar pontos, badges, desafios e leaderboards, além de permitir envio de kudos (peer feedback).

## Escopo
1. Views:
   - `GamificationHome` com cards (pontos atuais, nível, próxima recompensa).
   - `ChallengesList` (ativa, próxima, encerradas) com CTA para participar.
   - `Leaderboard` com filtros (global, org_unit) e destaque do usuário.
2. Estado/API:
   - Store `gamificationSlice` (`fetchProfile`, `fetchChallenges`, `fetchLeaderboards`, `sendPeerFeedback`).
3. UX:
   - Animar conquistas (toast/confete) opcional.
   - Modal “Enviar kudos” (anônimo nas regras). Integrar `POST /gamification/feedback`.
4. Integração com notifications: ao ganhar badge ou challenge completar, mostrar banner.

## Testes
- `npm run test` — `GamificationHome.test.tsx`, `ChallengesList.test.tsx`, `Leaderboard.test.tsx`.
- Teste manual com seeds gamificação.

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Integração com backend (API + notificações) OK.
- ✅ README plano atualizado.
- ✅ Caso endpoints backend sejam necessários, atualizar OpenAPI (B003).

## Referências
- `docs/modules/gamification.md`
- `docs/modules/notifications.md`
