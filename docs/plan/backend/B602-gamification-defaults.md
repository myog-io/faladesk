# B602 — Gamificação com Seeds Default

## Objetivo
Garantir que o módulo de gamificação funcione out-of-the-box com seeds padrão, serviços de pontuação e integração com feedbacks.

## Escopo
1. Seeds/fixtures:
   - Regras default (`peer_kudos`, `customer_csat`, `sla_on_time`, `voice_participation`).
   - Níveis Bronze/Prata/Ouro/Platino, badges básicos, challenge semanal.
   - Comando `python manage.py seed_gamification_defaults` idempotente.
2. Serviços em `gamification.services`:
   - `award_points(rule_code, receiver, context)` que resolve regra, cria event/transaction e atualiza profile.
   - `record_feedback(feedback_data)` → cria `GamificationFeedback` + evento.
   - `update_leaderboards()` stub (agenda via Celery beat).
3. Integrar com notificações/analytics: ao conceder badge ou evento importante, emitir `notification_queue` + `analytics_event`.
4. API mínima:
   - `POST /gamification/feedback` (peer/customer) anônimo quando apropriado.
   - `GET /gamification/profile/me` (pontuação atual, badges, ranking).

## Testes
- `pytest gamification/tests/test_seeds.py` — seeds idempotentes.
- `pytest gamification/tests/test_services.py` — award_points, record_feedback, leaderboards stub.
- `pytest gamification/tests/test_api.py` — feedback endpoint e profile.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Seeds executáveis (`seed_gamification_defaults`).
- ✅ README plano atualizado + docs (se ajustes).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/gamification.md`
