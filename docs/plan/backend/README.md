# Plano de Desenvolvimento Backend

Este diretório agrupa tarefas pequenas e autonomas para guiar a implementação do backend, seguindo as **Diretrizes** descritas em `docs/development_guidelines.md`.

## Organização
- Tarefas numeradas (`B001`, `B002`, ...) priorizadas em fases.
- Cada arquivo `.md` descreve objetivo, subtarefas, pontos de atenção e referências.
- Sempre revisar `development_guidelines.md` antes de iniciar qualquer tarefa.
- Garanta que a stack Docker (`docker-compose up`) esteja rodando; use os containers para executar testes, lint, builds e validações descritas em cada tarefa.
- Gere migrations sempre dentro do container backend com `python manage.py makemigrations`; não criar arquivos de migration manualmente.

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

## Fase 5 — Knowledge & Automations
- `B501-knowledge-models.md`
- `B502-knowledge-api-portal.md`
- `B503-automation-engine.md`

## Fase 6 — Analytics, Gamification & Notifications
- `B601-analytics-pipeline.md`
- `B602-gamification-defaults.md`
- `B603-notifications-engine.md`

## Fase 7 — Channels & Contacts
- `B701-channels-connectors.md`
- `B702-channels-webhooks.md`
- `B703-contacts-dedup.md`

## Fase 8 — Internal Chat & Voice
- `B801-internal-chat-models.md`
- `B802-internal-chat-services.md`
- `B803-internal-chat-api-ws.md`

## Fase 9 — Frontend (Ionic)
- `F901-ionic-bootstrap.md`
- `F902-ionic-inbox.md`
- `F903-ionic-notifications-gamification.md`

## Fase 10 — Frontend (Tickets, Knowledge, Chat)
- `F904-ionic-ticketing.md`
- `F905-ionic-knowledge-portal.md`
- `F906-ionic-internal-chat.md`

## Fase 12 — Frontend (Admin & Config)
- `F907-ionic-admin-orgunits.md`
- `F908-ionic-admin-channels.md`
- `F909-ionic-tenant-settings.md`

## Fase 13 — Frontend (Automation Builder)
- `F910-ionic-automation-canvas.md`
- `F911-ionic-automation-nodes.md`
- `F912-ionic-automation-monitor.md`

## Fase 14 — Frontend (Analytics & Dashboards)
- `F913-ionic-analytics-dashboard.md`
- `F914-ionic-analytics-alerts.md`
- `F915-ionic-analytics-export.md`

## Fase 15 — Frontend (Gamificação & Notificações Avançadas)
- `F916-ionic-gamification-challenges.md`
- `F917-ionic-notifications-preferences.md`
- `F918-ionic-notifications-digest.md`

## Fase 16 — Frontend (Contacts & CRM 360)
- `F919-ionic-contacts-360.md`
- `F920-ionic-contacts-merge.md`

## Fase 17 — Mobile Packaging & Deploy
- `F921-mobile-capacitor-setup.md`
- `F922-mobile-push-config.md`
- `F923-mobile-release.md`

## Fase 11 — Release & Testes Integrados
- `R1101-ci-cd-pipeline.md`
- `R1102-e2e-tests.md`
- `R1103-release-plan.md`

### Documentação & Dev Experience
- `DX01-openapi-swagger.md`

> Após concluir cada tarefa, atualizar este README com status (✅/⏳) e garantir que testes/documentação foram executados conforme instruções de cada arquivo.
