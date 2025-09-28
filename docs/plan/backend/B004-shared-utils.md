# B004 — Shared Utils & Auth Base

## Objetivo
Centralizar mixins, helpers, autenticação e utilidades reutilizados entre módulos, preparando o código para eventual divisão em microsserviços.

## Escopo
1. Criar pacote `shared/` (ou `common/`) no backend com subpastas `auth/`, `mixins/`, `utils/`, `services/`.
2. Mover/implementar utilidades comuns:
   - `TenantAwareAuthentication`, helper de contexto de tenant.
   - `MultiTenantQuerysetMixin`, `TimestampedModel`, util `generate_slug`, `generate_sequential_code`.
   - Helpers para emissão de eventos (`emit_notification`, `emit_analytics_event`) que encapsulam chamadas.
3. Atualizar apps existentes (core, organizations, tickets, messaging etc.) para reutilizar essas classes ao invés de duplicar lógica.
4. Documentar no módulo correspondente (ex.: `docs/development_guidelines.md`) para que futuros módulos consumam o pacote.

## Testes
- `pytest shared/tests/test_utils.py` cobrindo helpers.
- Rodar suites impactadas para garantir compatibilidade (core/tickets/messaging).

## Checklist ao concluir
- ✅ Estrutura `shared/` criada.
- ✅ Tests passando.
- ✅ README plano atualizado (status/comandos) + docs se necessário.

## Referências
- `docs/development_guidelines.md`
