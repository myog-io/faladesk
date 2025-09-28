# B202 — Regras de Roteamento & Escalonamento

## Objetivo
Implementar fila de roteamento (`QueueRule`, `OrgUnitEscalation`) e serviço relacionado para determinar próximo destino, preparando integração com automations/messaging.

## Escopo
1. Implementar models adicionais (se ainda não finalizados em B201): `QueueRule`, `OrgUnitTag`.
2. Criar serviço `organizations.services.routing` com função principal `resolve_destination(conversation_context)`:
   - Recebe payload (channel, tags, prioridade, horário) e devolve `org_unit` + metadados.
   - Aplicar regras na ordem (`QueueRule.ordem`) com condições JSON (usar eval seguro ou parser custom simples — ex.: comparações básicas, contain tags).
3. Implementar função `handle_escalation(sla_event)` que busca `OrgUnitEscalation` e decide novo destino.
4. Seeds padrão para queue rules (ex.: WhatsApp -> Suporte, E-mail -> Comercial) e escalonamento (SLA vencido -> Supervisor).
5. Criar command ou Celery task stub `organizations.tasks.evaluate_queue(conversation_id)` chamando serviço (será acionado por automations depois).

## Testes
- `docker compose exec backend pytest organizations/tests/test_routing.py` cobrindo resolução de QueueRule com diferentes contextos.
- `docker compose exec backend pytest organizations/tests/test_escalation.py` cobrindo mudança de org unit ao violar SLA.

## Checklist ao concluir
- ✅ Tests passando (`docker compose exec backend pytest organizations/tests/test_routing.py` etc.).
- ✅ Seeds/fixtures atualizados sem duplicar dados.
- ✅ README do plano atualizado com progresso/comandos executados.
- ✅ Documentar eventuais helpers em `development_guidelines.md` se necessário (ex.: parser de condições).
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/organizations.md`
- `docs/modules/automation.md` (para integração futura)
