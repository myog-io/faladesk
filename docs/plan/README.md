# Plano Geral

Este diretório reúne o planejamento macro do projeto **Faladesk**. As tarefas estão separadas em dois blocos principais:

- `docs/plan/backend/README.md` — tarefas **Bxxx/Rxxx** (backend, infra, release).
- `docs/plan/frontend/README.md` — tarefas **F9xx–F92x** (frontend Ionic Angular, mobile/desktop).

## Diretrizes Gerais
- Leia `docs/development_guidelines.md` antes de iniciar qualquer tarefa.
- Mantenha a stack Docker rodando (`docker-compose up`) e execute comandos via containers (`docker compose exec backend ...`, `docker compose exec frontend ...`).
- Gere migrations somente dentro do container backend (`python manage.py makemigrations`).
- Toda regra de negócio deve residir no backend; se o frontend precisar de lógica nova, crie/ajuste o endpoint correspondente primeiro.
- Documentação OpenAPI/Swagger deve ser atualizada sempre que endpoints mudarem (tarefa `B003-openapi-swagger.md`).

> Após concluir qualquer tarefa, lembre-se de atualizar o README específico (backend ou frontend) com status (✅/⏳) e registrar comandos executados.
