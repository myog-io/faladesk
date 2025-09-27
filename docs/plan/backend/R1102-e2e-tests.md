# R1102 — Testes E2E Integrados

## Objetivo
Configurar suíte de testes ponta-a-ponta cobrindo fluxos críticos (ingestão mensagem → atendimento → ticket → notificações/gamificação) usando Playwright ou Cypress.

## Escopo
1. Ferramenta: escolher Playwright (recomendado). Adicionar deps e scripts (`npm run e2e`).
2. Cenários obrigatórios:
   - `e2e/conversation_intake.spec`: simula inbound message (via webhook mock), verifica inbox atualiza, responde, encerra.
   - `e2e/ticket_workflow.spec`: cria ticket, muda status, registra worklog, fecha, verifica notificações/gamificação.
   - `e2e/knowledge_portal.spec`: publica artigo, consulta portal público, registra feedback.
   - `e2e/internal_chat.spec`: troca mensagens internas, DM, voice stub join/leave.
3. Fixtures: scripts para seed ambiente antes de rodar (usar seeds existentes). Config `PLAYWRIGHT_BASE_URL`.
4. Integrar e2e na pipeline (workflow `ci-e2e.yml`) que sobe stack via docker-compose e roda `npm run e2e`.

## Testes
- Rodar local (`npm run e2e`) apontando para docker-compose up.
- Garantir pipeline CI executa e2e (talvez nightly se pesado).

## Checklist ao concluir
- ✅ e2e rodando local.
- ✅ Pipeline e2e configurado.
- ✅ README plano atualizado + docs (talvez `docs/testing.md`).

## Referências
- `docs/development_guidelines.md`
