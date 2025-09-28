# F911 — Editor de Nós & Templates (Automation)

## Objetivo
Fornecer UI para criar/editar templates de nós (configurações, validações) e pré-visualizar execuções.

## Escopo
1. Views:
   - `AutomationNodeTemplates` lista com categorias (trigger/action/condition) e botões para editar/clonar.
   - Modal/Drawer `NodeTemplateEditor` exibindo schema (JSON) com editor (monaco/ace) + validação live.
2. Preview de execução:
   - Permitir input sample e rodar `POST /automation/flows/{id}/run` em modo preview (stub) mostrando output.
3. State/API:
   - Store `automationNodesSlice` consumindo endpoints B503 (`/automation/nodes/templates`).
   - Actions `createTemplate`, `updateTemplate`, `deleteTemplate` (bloquear templates system).
4. Documentar `help` (exibir doc snippet do node, campos obrigatórios). Integrar com i18n.

## Testes
- `npm run test` — `AutomationNodeTemplates.test.tsx`, `NodeTemplateEditor.test.tsx`.
- Mock API para preview (resolver Promise com response fake).

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Editor valida JSON Schema e envia ao backend.
- ✅ README plano atualizado.
- ✅ Caso novos endpoints/backend sejam criados, atualizar OpenAPI (B003).

## Referências
- `docs/modules/automation.md`
