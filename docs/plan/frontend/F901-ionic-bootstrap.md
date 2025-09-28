# F901 — Bootstrap Ionic Angular

## Objetivo
Inicializar o projeto **Ionic Angular** (com suporte Capacitor/Electron) integrado ao backend, garantindo autenticação por magic link e estrutura base alinhada às diretrizes.

## Escopo
1. Criar projeto `frontend/` usando Ionic Angular (`ionic start faladesk tabs --type angular`) ou monorepo Nx equivalente.
2. Configurar ambiente:
   - `.env.example` com `API_BASE_URL`, `WS_BASE_URL`, `TENANT_SLUG` (se necessário).
   - `HttpClient` interceptors para anexar JWT + header `X-Tenant` em todas as requests.
   - Internacionalização (Angular i18n ou Transloco) com PT/EN/ES inicial.
   - Estrutura de pastas por módulo: `app/modules/<feature>`, `app/core/`, `app/shared/`, `app/store/` (NgRx).
3. Fluxo de autenticação:
   - Páginas `magic-link-request` e `magic-link-confirm` com Reactive Forms.
   - Services `AuthApiService` e `AuthService` (persistência via Capacitor Storage).
   - Guards/resolvers (`AuthGuard`, `TenantGuard`) e NgRx `AuthState`.
4. Layout & tema:
   - Component `AppShell` (sidebar/header/content) + tema claro/escuro via SCSS variables.
   - Integração Capacitor base (`capacitor.config.ts`) e scripts `npm run start`, `npm run build`, `npm run test`, `npm run lint`.
   - Docker: atualizar `docker-compose.yml` para rodar `frontend` container (`ionic serve --external`).
5. Documentar como rodar via Docker (`docker compose exec frontend npm run start/test`).

## Testes
- `npm run lint`.
- `npm run test` (configurar Jasmine/Karma ou Jest + Testing Library). Criar teste inicial para `MagicLinkRequestComponent`.
- `npm run build` para validar build de produção.

## Checklist ao concluir
- ✅ Projetos/examples rodando em container `frontend`.
- ✅ Tests/lint/build passando.
- ✅ README (plano) atualizado com status e comandos executados.
- ✅ Se novos endpoints/backend foram criados para suportar o front, atualizar documentação OpenAPI (tarefa B003) e demais docs relevantes.

## Referências
- `docs/development_guidelines.md`
- `docs/05-plano-construcao.md`
