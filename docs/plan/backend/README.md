# Plano Backend

- Consulte `docs/development_guidelines.md` antes de qualquer tarefa.
- Stack deve rodar via Docker (`docker-compose up`). Use `docker compose exec backend ...`/`frontend ...` para comandos.
- Gere migrations apenas com `docker compose exec backend python manage.py makemigrations`.
- Toda regra de negócio pertence ao backend. Se o frontend precisar de mudança, crie/ajuste os endpoints aqui e documente via B003.

## Fase 0 — Bootstrap
- B001 — Bootstrap do Projeto Django
- B002 — Configuração de Serviços (Celery/Channels)
- ✅ B003 — OpenAPI/Swagger & Postman (documentação automática)
- B004 — Shared Utils & Auth Base

## Fase 1 — Core (Auth/RBAC/Audit)
- ✅ B101 — Modelos Core & Autenticação
- ✅ B102 — RBAC & Escopo Multi-Tenant
- ✅ B103 — Auditoria Estruturada

## Fase 2 — Organizations & SLA
- B201 — Models Organizations & SLA Básico
- B202 — Regras de Roteamento & Escalonamento
- B203 — APIs de Organizations

## Fase 3 — Messaging Core
- B301 — Models de Messaging
- B302 — Serviços de Messaging
- B303 — APIs & WebSocket de Messaging

## Fase 4 — Tickets & Workflow
- B401 — Models de Tickets & Categorias
- B402 — Serviços de Workflow de Tickets
- B403 — APIs de Tickets & Webhooks Externos

## Fase 5 — Knowledge & Automations
- B501 — Models de Knowledge Base
- B502 — APIs de Knowledge & Portais
- B503 — Engine de Automations (Fluxo Intake)

## Fase 6 — Analytics, Gamificação & Notificações
- B601 — Pipeline de Analytics
- B602 — Gamificação Default Seeds
- B603 — Engine de Notificações

## Fase 7 — Channels & Contacts
- B701 — Connectors & Accounts
- B702 — Webhooks & Intake de Canais
- B703 — Contacts Deduplicação & Identidades

## Fase 8 — Internal Chat & Voice
- B801 — Models Internal Chat
- B802 — Serviços Internal Chat
- B803 — APIs/WebSocket Internal Chat

## Fase 11 — Release & Testes Integrados
- R1101 — Pipeline CI/CD
- R1102 — Testes E2E Integrados
- R1103 — Plano de Release

### Boas práticas
- Sempre documente endpoints/alterações no schema OpenAPI (B003) quando criar/ajustar APIs.
- Após concluir qualquer tarefa, atualizar `docs/plan/backend/README.md` (status ✅/⏳) e incluir comandos executados.

### Histórico de Comandos — B003
- `docker compose exec backend python manage.py spectacular --file schema.yaml` _(pendente: executar após instalar dependências)_
- `docker compose exec backend python manage.py generate_openapi_postman`

### Histórico de Comandos — B101
- `docker compose exec backend python manage.py makemigrations core`
- `docker compose exec backend python manage.py migrate`
- `docker compose exec backend pytest apps/core/tests` _(executar após provisionar dependências)_

### Histórico de Comandos — B102
- `python manage.py makemigrations core` _(falhou: dependências Django indisponíveis no ambiente de avaliação)_
- `pytest backend/apps/core/tests/test_roles.py` _(falhou: dependências Django indisponíveis no ambiente de avaliação)_

### Histórico de Comandos — B103
- `pytest backend/apps/core/tests/test_audit.py` _(falhou: dependências Django indisponíveis no ambiente de avaliação)_
