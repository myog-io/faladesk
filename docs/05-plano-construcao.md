# 5. Plano de Construção

## 5.1 Arquitetura Django
- **core**: `Tenant`, `TenantDomain`, `User`, `TenantUser`, `Role`, `RoleAssignment`, `AuditLog`.
- **organizations**: `Department`, `Team`, `SlaPolicy`, `SlaEvent`.
- **channels**: `ChannelConnector`, `ChannelAccount`, adapters WhatsApp/Telegram/E-mail/Web Chat.
- **contacts**: `Contact`, `ContactIdentity`, utilitários LGPD.
- **messaging**: `Conversation`, `Message`, `MessageAttachment`, `ConversationParticipant`.
- **tickets**: `Ticket`, `TicketAssignment`, integração SLA.
- **knowledge**: `QuickReply`, `KnowledgeArticle`.
- **automation**: `AutomationFlow`, `AutomationRun`.
- **analytics**: `AnalyticsSnapshot`.
- **internal_chat**: canais e mensagens internas.

## 5.2 APIs & DRF
- Autenticação: `POST /auth/magic-link`, `POST /auth/token` (JWT), refresh, logout.
- Tenants: `GET/POST /tenants`, `POST /tenants/{id}/domains`.
- Usuários: `GET /users/me`, `POST /tenants/{slug}/members`, RBAC com `django-guardian`.
- Departamentos & SLAs: CRUD completo filtrado por `tenant` e `department`.
- Canais: `POST /channels/connectors`, `POST /channels/accounts/{id}/activate`, webhooks `POST /webhooks/{connector}`.
- Conversas: `GET /conversations`, `POST /conversations/{id}/messages`, `POST /conversations/{id}/assign`.
- Tickets: `POST /tickets`, `PATCH /tickets/{id}/status`, `POST /tickets/{id}/transfer`.
- Automação: `POST /flows`, `POST /flows/{id}/publish`, `/preview`.
- Knowledge: `GET /knowledge/articles`, `POST /knowledge/articles`.
- Auditoria: `GET /audit/logs` com filtros por período/evento.

## 5.3 Realtime & Filas
- WebSockets: `ws/{tenant_slug}/conversations/{conversation_id}`, `ws/{tenant_slug}/presence`, `ws/{tenant_slug}/internal-chat/{channel}`.
- Consumers: `ConversationConsumer`, `TicketBoardConsumer`, `InternalChatConsumer`.
- Autorização: tokens + membership + papel/escopo por `org_unit`.
- Celery: filas `default`, `webhooks`, `automations`, `analytics`.
- Tarefas: ingestão de webhooks, sincronização IMAP, cálculo SLA, notificações, antivírus.
- Retentativas: `retry_in (2^n)` + dead-letter.
- Storage: S3 compatível com presigned URLs e ClamAV opcional.

## 5.4 Ionic Frontend
- Apps: `inbox`, `tickets`, `automations`, `analytics`, `settings`.
- Estado: Zustand/Redux Toolkit + web sockets; fallback REST.
- UI: layout inspirado em WhatsApp Business, inbox unificada com filtros rápidos.
- i18n: PT/EN/ES com carregamento preguiçoso.

## 5.5 Testes & Critérios MVP
- Unitários: serializers, roteamento, regras SLA, transforms de webhook.
- Integração: canais externos mockados, login mágico, fluxo de ticket.
- E2E: Cypress/Playwright focando inbox e transferência de conversa.
- Critérios: onboarding novo tenant < 15 min, ingestão 400 conversas/mês/tenant, SLA e notificações ativas, auditoria mínima, `docker-compose up` funcional.

## 5.6 Milestones
1. Semana 1-2: base multi-tenant, auth mágica, RBAC mínimo, docs DX.
2. Semana 3-4: messaging core, Web Chat, tickets, tracking SLA.
3. Semana 5-6: adapters WhatsApp/Telegram (mock), E-mail SMTP/IMAP, auditoria.
4. Semana 7: knowledge base, quick replies, analytics básicos.
5. Semana 8: automação visual MVP, chat interno, hardening e testes.
