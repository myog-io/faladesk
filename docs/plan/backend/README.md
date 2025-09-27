# Plano de Desenvolvimento Backend

Este diretório agrupa tarefas pequenas e autonomas para guiar a implementação do backend, seguindo as **Diretrizes** descritas em `docs/development_guidelines.md`.

## Organização
- Tarefas numeradas (`B001`, `B002`, ...) priorizadas em fases.
- Cada arquivo `.md` descreve objetivo, subtarefas, pontos de atenção e referências.
- Sempre revisar `development_guidelines.md` antes de iniciar qualquer tarefa.

## Fase 0 — Bootstrap
- `B001-bootstrap-project.md`: Criar estrutura Django multi-app com configuração inicial.
- `B002-bootstrap-services.md`: Configurar Celery, Channels, Redis e seeds padrão.

## Fase 1 — Módulo Core
- `B101-core-models-auth.md`
- `B102-core-roles-rbac.md`
- `B103-core-audit-logging.md`

## Fase 2 — Organizations & SLA
- `B201-organizations-models.md`
- `B202-organizations-routing.md`
- `B203-organizations-api-permissions.md`

## Fase 3 — Messaging Core
- `B301-messaging-models.md`
- `B302-messaging-services.md`
- `B303-messaging-api-websocket.md`

## Fase 4 — Tickets & Workflow
- `B401-tickets-models.md`
- `B402-tickets-services.md`
- `B403-tickets-api-events.md`

> Após concluir cada tarefa, atualizar este README com status (✅/⏳) e garantir que testes/documentação foram executados conforme instruções de cada arquivo.
