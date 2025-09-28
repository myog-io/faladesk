# F910 — Automation Builder Canvas

## Objetivo
Construir interface visual estilo n8n para montar fluxos (drag-and-drop) consumindo dados de `automation_flow`.

## Escopo
1. Canvas (d3/React Flow):
   - Exibir nós (`AutomationNodeInstance`) como cards com entradas/saídas.
   - Permitir adicionar nós a partir de palette (trigger, action, condition etc.).
   - Conectar nós via drag, armazenar conexões.
2. Estado/API:
   - Store `automationBuilderSlice` (`fetchFlow(flowId)`, `addNode`, `updateNode`, `connectNodes`, `saveFlow`).
   - Persistir com endpoints B503 (`/automation/flows`, `/automation/nodes`).
3. UI: inspector lateral para editar configurações do nó (schema dinamicamente renderizado). Validar campos obrigatórios.
4. Undo/redo básico (historico in-memory).
5. Documentar atalhos/UX (ex.: delete com tecla, auto-layout opcional).

## Testes
- `npm run test` — unit tests para componentes (mock React Flow) e slice.
- Teste manual salvando fluxo default (intake flow).

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Fluxo default carregando/salvando sem erros.
- ✅ README plano atualizado.
- ✅ Caso novos endpoints/backend sejam necessários, atualizar documentação OpenAPI (B003).

## Referências
- `docs/modules/automation.md`
