# B001 — Bootstrap do Projeto Django

## Objetivo
Criar a base do projeto Django multi-tenant seguindo as diretrizes de desenvolvimento.

## Tarefas
1. Criar projeto `faladesk_backend` e apps iniciais (`core`, `organizations`, `channels`, `contacts`, `messaging`, `tickets`, `knowledge`, `automation`, `analytics`, `gamification`, `notifications`, `internal_chat`).
2. Configurar settings multi-tenant: `INSTALLED_APPS`, `MIDDLEWARE`, `AUTH_USER_MODEL`, `DATABASES` (Postgres), `CACHES` (Redis), `CELERY` base.
3. Criar `settings/` modular (dev, prod) e `env.example` com variables padrão.
4. Adicionar `docker-compose` service backend (separado se ainda não existir) com dependências Postgres/Redis.
5. Configurar linting/format (flake8/black/isort) e pytest com coverage básico.

## Pontos de Atenção
- Garantir que `development_guidelines.md` esteja referenciado e aplicado (apps enxutos, seeds padrão).
- Preparar `manage.py` e `django-environ` ou equivalente para variáveis.
- Não adicionar lógica não necessária; foco em scaffolding.

## Referências
- `docs/development_guidelines.md`
- `docs/05-plano-construcao.md` (estrutura Django)
