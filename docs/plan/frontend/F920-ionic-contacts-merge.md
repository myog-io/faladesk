# F920 — UI de Merge & Deduplicação de Contatos

## Objetivo
Desenvolver fluxo visual para identificar e mesclar contatos duplicados, utilizando APIs B703.

## Escopo
1. View `ContactsMerge`:
   - Lista de potenciais duplicados (cards com similaridade, identidades).
   - Wizard de merge (selecionar primário, resolver conflitos de campos).
2. Estado/API:
   - Actions `fetchDuplicates(contactId)`, `mergeContacts(primaryId, duplicateId)`.
   - Exibir preview de resultado antes de confirmar.
3. Logs e feedback: após merge, exibir resumo e link para timeline; emitir notificação de sucesso.
4. i18n + A11y.

## Testes
- `npm run test` — `ContactsMerge.test.tsx` (mock API duplicates/merge).
- Teste manual com seeds dedupe.

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Merge end-to-end funcional.
- ✅ README plano atualizado.
- ✅ Caso endpoints backend sejam necessários, atualizar OpenAPI (B003).

## Referências
- `docs/modules/contacts.md`
