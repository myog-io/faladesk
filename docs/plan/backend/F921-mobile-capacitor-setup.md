# F921 — Setup Capacitor Mobile

## Objetivo
Configurar projeto Ionic para builds mobile (iOS/Android) com Capacitor, incluindo plugins essenciais.

## Escopo
1. `npx cap init` (nome/id do app), adicionar plataformas `npx cap add ios` / `android`.
2. Instalar plugins essenciais: App, Browser, Push Notifications (stub), Filesystem, Splash Screen.
3. Configurar `capacitor.config.ts` (server URL, background color, etc.).
4. Scripts npm: `npm run cap:sync`, `cap:ios`, `cap:android`.
5. Documentar requisitos (Xcode, Android Studio), variáveis env para push.

## Testes
- `npm run cap:sync` sem erros.
- Build stub (`npx cap open ios`/`android`, compilar app).

## Checklist ao concluir
- ✅ Projetos iOS/Android gerados.
- ✅ README (principal) atualizado com instruções de build.
- ✅ README plano atualizado.

## Referências
- Capacitor docs oficiais.
