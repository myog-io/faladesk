# Faladesk

Backend multi-tenant em Django com suporte a tempo real via Channels, Celery para tarefas assíncronas e infraestrutura pronta para desenvolvimento colaborativo.

## Pré-requisitos
- Docker e Docker Compose v2+
- Arquivo de variáveis copiado de `.env.example` para `.env`

```bash
cp .env.example .env
```

## Subindo o ambiente

1. **Construir a imagem do backend (apenas na primeira vez):**
   ```bash
   docker compose build backend
   ```
2. **Iniciar serviços principais (Postgres/Redis) e API (ASGI com Channels):**
   ```bash
   docker compose up -d postgres redis backend
   ```
3. **Aplicar migrações e seeds padrão:**
   ```bash
   docker compose exec backend python manage.py migrate
   docker compose exec backend python manage.py seed_defaults
   ```
4. **(Opcional) Iniciar workers Celery:**
   ```bash
   docker compose up -d celery_worker celery_beat
   ```

> O backend (Daphne/ASGI) fica disponível em `http://localhost:8000`. Logs em tempo real podem ser acompanhados com `docker compose logs -f <service>`.

## Testes e Qualidade

```bash
# Executar suíte de testes
docker compose exec backend pytest

# Checar formatação e lint
docker compose exec backend black --check .
docker compose exec backend isort --check-only .
docker compose exec backend flake8 .
```

## Tarefas úteis
- Criar superusuário: `docker compose exec backend python manage.py createsuperuser`
- Shell Django: `docker compose exec backend python manage.py shell`
- Verificar task Celery: `docker compose exec backend python manage.py shell -c "from apps.core.tasks import health_check; print(health_check())"`

## Documentação
- Plano detalhado de tarefas: `docs/plan/backend/README.md`
- Diretrizes de desenvolvimento: `docs/development_guidelines.md`
- Especificações por módulo: diretório `docs/modules/`
- Contexto geral e papel do agente: `AGENT.md`

## Roteiro imediato
- Concluir tarefas listadas em `docs/plan/backend/README.md` seguindo o status (✅/⏳).
- Atualizar documentação e rodar os testes apresentados sempre que finalizar uma tarefa.
