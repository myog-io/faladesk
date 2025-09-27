# B103 — Auditoria Estruturada

## Objetivo
Implementar logging/auditoria estruturada (`AuditLog`) para registrar eventos importantes (auth, roles, seeds) e preparar integração com analytics/notifications.

## Escopo
1. Criar serviço utilitário `core.services.audit` com função `log_event(tenant_id, actor, event, payload)` usando `AuditLog`.
2. Integrar auditoria nos fluxos:
   - Magic link (solicitação/envio e consumo).
   - Criação/edição de roles, assignments, service accounts.
   - Seeds (registrar `initial_seed`).
3. Middleware/Signal opcional para registrar `request_id`/`correlation_id` e anexar ao payload.
4. Expor endpoint `GET /audit/logs` (paginado, filtros por `event`, `actor`, `date`), protegido por permissão `audit.view`.
5. Configurar logging estruturado (JSON) com `tenant_id`, `correlation_id` (utilizar `structlog` ou Python logging + formatter).

## Testes
- `pytest core/tests/test_audit.py` validando log_event, filtro multi-tenant, proteção de endpoint.
- Confirmar que eventos principais geram linha de auditoria (testes integrados em auth/roles).

## Checklist ao concluir
- ✅ Tests audit passando (`pytest core/tests/test_audit.py`).
- ✅ Endpoint `/audit/logs` funcional e protegido.
- ✅ Documentar no README do plano (status + comandos) e, se necessário, em docs adicionais.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/core.md`
