# F908 — Admin de Conectores & Contas no Ionic

## Objetivo
Implementar interface administrativa para configurar conectores de canal, contas, tokens e health checks.

## Escopo
1. Views:
   - `AdminChannels` com tabela de conectores (status, último heartbeat, capabilities). Ações: ativar/desativar, refresh token, editar config.
   - `ChannelAccountDetail` para contas individuais (org unit, intake flow, webhooks).
2. Estado/API:
   - Store `adminChannelSlice` consumindo endpoints B701/B702 (`/channels/connectors`, `/channels/accounts`, `/channels/health`, `/channels/webhooks`).
   - Actions: `refreshToken`, `runHealthCheck`, `updateAccountConfig`, `toggleAccountStatus`.
3. UX:
   - Formularios com validação (ex.: campos JSON com editor/textarea, check de assinatura webhook).
   - Exibir logs recentes (health checks) e uso (`ChannelUsageLog`).
4. Testes UI (Testing Library) e mocks API.

## Testes
- `npm run test` — `AdminChannels.test.tsx`, `ChannelAccountDetail.test.tsx`.
- Teste manual com backend seeds (`seed_channels_defaults`).

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Fluxos admin concluídos (refresh, health, update).
- ✅ README plano atualizado.

## Referências
- `docs/modules/channels.md`
- `docs/modules/automation.md` (intake flow)
