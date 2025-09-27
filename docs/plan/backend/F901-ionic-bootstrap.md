# F901 — Bootstrap do Frontend Ionic

## Objetivo
Inicializar projeto Ionic/Capacitor integrado ao backend, com configuração base de autenticação e temas.

## Escopo
1. Criar projeto `faladesk_app` (Ionic React ou Vue conforme decisão — assumir React se nada especificado) com estrutura monorepo ou diretório separado (`frontend/`).
2. Configurar ambiente:
   - `.env.example` com `API_BASE_URL`, `WS_BASE_URL`.
   - Axios (ou fetch wrapper) com interceptors para JWT + header `X-Tenant`.
   - Internacionalização (i18next) com PT/EN/ES inicial.
3. Auth flow:
   - Tela `MagicLinkRequest` (email + tenant slug).
   - Tela `MagicLinkConfirm` (consome token, salva JWT, redireciona inbox).
   - Persistência token (Storage Capacitor/Web) + refresh.
4. UI base:
   - Layout principal (sidebar + header + area de conteúdo).
   - Tema claro/escuro com CSS variables.
5. Scripts `npm run dev`, `npm run build`, `npm run test`. Integrar com Docker compose (serviço `frontend`).

## Testes
- `npm run test` (unit), `npm run lint`. Se usar Vitest/Jest, criar teste simples de AuthView.
- Verificar `npm run build`.

## Checklist ao concluir
- ✅ Tests/lint/build passando.
- ✅ Docker compose atualizado para subir frontend.
- ✅ README plano atualizado (marcar progresso/comandos).
- ✅ Atualizar documentação se necessário (`docs/development_guidelines.md` para frontend?).

## Referências
- `docs/development_guidelines.md`
- `docs/05-plano-construcao.md`
