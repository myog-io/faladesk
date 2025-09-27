# B401 — Models de Tickets & Categorias

## Objetivo
Implementar modelo de tickets completo (tickets, categorias, assignments, status history, comments, attachments, worklogs, campos customizados, tags) conforme `docs/03-modelo-dados.md`.

## Escopo
1. Models/migrations em `tickets`:
   - `Ticket`, `TicketAssignment`, `TicketParticipant`, `TicketStatusHistory`, `TicketComment`, `TicketAttachment`, `TicketWorklog`, `TicketCustomField`, `TicketCustomFieldValue`, `TicketTag`, `TicketCategory`.
   - Reaproveitar `tag_link` para `TicketTag` se preferir (alias) — manter coerência com docs.
2. Constraints/indexes:
   - Unicidade `ticket.numero` por tenant (usar sequenciador helper).
   - Indexes por `org_unit_id`, `status`, `prioridade`, `created_at`.
   - Foreign keys com `on_delete` adequado (ex.: cascade para status history, restrict para category se necessário).
3. Seeds iniciais:
   - Criar categorias padrão (Suporte, Comercial, Billing) para tenant demo.
   - Criar ticket demo com assignments/comentários.
4. Service helper para gerar número de ticket (`tickets.utils.generate_ticket_number`), usado em `Ticket.save()`.

## Testes
- `pytest tickets/tests/test_models.py` — cria ticket completo, verifica history/assignments/worklogs/custom fields.
- `pytest tickets/tests/test_number_generator.py` — garante formato `TK-YYYY-NNNN` ou similar, sem colisão multi-tenant.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Seeds executáveis (`python manage.py seed_tickets_demo`).
- ✅ README do plano atualizado com status/comandos.
- ✅ Revisar `docs/03-modelo-dados.md` para confirmar alinhamento.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/tickets.md`
- `docs/03-modelo-dados.md`
