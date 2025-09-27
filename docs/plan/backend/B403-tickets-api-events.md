# B403 — APIs de Tickets & Eventos Externos

## Objetivo
Expor endpoints REST para tickets (CRUD, comentários, anexos, worklogs) e configurar webhooks/integrações externas.

## Escopo
1. API REST (DRF ViewSets/routers):
   - `TicketViewSet` (`list/retrieve/create/update`), filtros avançados (status, prioridade, org_unit, tags, agente responsável).
   - Endpoints aninhados: `POST /tickets/{id}/comments`, `POST /tickets/{id}/attachments`, `POST /tickets/{id}/worklogs`.
   - `TicketAssignmentViewSet` leitura; criação via serviço B402 (expor endpoint `POST /tickets/{id}/assign`).
   - `TicketCustomFieldViewSet` CRUD (admin) e `TicketCustomFieldValueViewSet` (update via ticket).
2. Permissões: usar `HasTenantPermission` com permissões `tickets.view`, `tickets.manage`, `tickets.comment` etc. Garantir agentes só vejam tickets do próprio org_unit (aplicar filtro no queryset).
3. Webhooks/API externas:
   - Endpoint `POST /webhooks/tickets` (ingestão externa) → valida payload → chama `create_ticket_from_conversation` ou `create_ticket_manual` (serviço).
   - Documentar formato (ex.: CRM/ERP) + validação com assinatura opcional (HMAC header).
4. Notificações/Analytics: ao criar/comentar/atribuir/fechar, garantir enfileiramento (`notification_queue`) e evento (`analytics_event`) correspondente.
5. Atualizar OpenAPI/Schema e documentação (`docs/modules/tickets.md` se necessário).

## Testes
- `pytest tickets/tests/test_api_tickets.py` — CRUD, filtros, permissões.
- `pytest tickets/tests/test_api_webhook.py` — ingestão externa com payload válido/inválido.
- Verificar uploads attachments com storage mock/Fake S3.

## Checklist ao concluir
- ✅ Tests API passando.
- ✅ Webhook validado com assinatura opcional (mock).
- ✅ README do plano atualizado e docs (endpoints adicionados).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/tickets.md`
- `docs/modules/notifications.md`
- `docs/modules/analytics.md`
