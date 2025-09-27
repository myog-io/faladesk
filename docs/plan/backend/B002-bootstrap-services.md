# B002 — Configurar Serviços de Suporte

## Objetivo
Configurar infraestrutura básica de serviços (Celery, Channels, serviços seeds) para suportar módulos tempo real/eventos.

## Tarefas
1. Configurar Celery (`celery.py`, `app.conf`, `CELERY_BROKER_URL`) e tasks dummy para health-check.
2. Configurar Django Channels (`ASGI`, `channel_layers`, Redis backend) e rota inicial de teste.
3. Criar scripts seed iniciais para:
   - Gamificação (regras/níveis/badges padrão).
   - Notificações (templates/regras padrão).
   - Automation intake flow básico.
4. Atualizar `docker-compose` com workers (celery worker/beat) e channel layer.
5. Adicionar comandos `make`/scripts para iniciar stack: `make start-backend`, `make start-workers`.

## Pontos de Atenção
- Respeitar seeds obrigatórios descritos em `development_guidelines.md` (Gamificação, Notificações, Automation).
- Garantir idempotência dos seeds (safe re-run).
- Validar que stack sobe via `docker-compose up` executando workers + backend.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/gamification.md`
- `docs/modules/notifications.md`
- `docs/modules/automation.md`
