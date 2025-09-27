# B703 — Contacts Deduplicação & Identidades

## Objetivo
Implementar serviços de deduplicação/merge de contatos (multi-identidade), normalização de identidades e APIs relacionadas.

## Escopo
1. Services em `contacts.services`:
   - `normalize_identity(identity_type, value)` — retorna valor canonical (E.164, lower-case email).
   - `find_potential_duplicates(contact)` — busca identidade semelhantes.
   - `merge_contacts(primary, duplicate)` — move identities/conversations/tickets conforme docs, registra `contact_merge_request` resolvido.
2. API endpoints:
   - `POST /contacts/{id}/merge` (solicitar merge) e `POST /contacts/merge/{merge_request_id}/confirm`.
   - `GET /contacts/{id}/duplicates` (lista potenciais duplicados).
3. Seeds/fixtures: criar contatos demo com identidades múltiplas, gerar merge request default.
4. Integrar com analytics/gamificação (opcional): registrar evento `contact.merged`.

## Testes
- `pytest contacts/tests/test_identity.py` — normalize_identity.
- `pytest contacts/tests/test_merge.py` — find duplicates, merge, garantir transferência de conversas/tickets.
- `pytest contacts/tests/test_api_merge.py` — rotas merge/duplicates.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Seeds dedupe executáveis.
- ✅ README plano atualizado + docs (`docs/modules/contacts.md`).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/contacts.md`
