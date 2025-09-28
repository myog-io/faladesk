# F924 — Electron Packaging & Desktop

## Objetivo
Preparar build desktop (Electron) reaproveitando app Ionic Angular, com integração básica a notificações e atualização automática futura.

## Escopo
1. Setup Electron:
   - Adicionar dependências (`electron`, `electron-builder`, `@capacitor-community/electron` ou template oficial Ionic).
   - Criar pasta `electron/` com `main.ts`, config menu, preload para IPC seguro.
2. Integração Angular:
   - Ajustar `capacitor.config.ts` para build Electron.
   - Criar service `ElectronBridgeService` centralizando IPC (ex.: abrir link, notificações desktop).
3. Scripts build/package:
   - `npm run electron:start`, `npm run electron:build` (gerar `.exe`/`.dmg` stub).
   - Configurar auto-update stub (somente log).
4. Ajustes UI: detectar plataforma (`PlatformService`) para mostrar diferenças (ex.: menu desktop, atalhos).

## Testes
- `npm run electron:start` (dev) sem erros.
- `npm run electron:build` gerando binário inicial.

## Checklist ao concluir
- ✅ Electron rodando em dev e buildando.
- ✅ README principal atualizado com instruções desktop.
- ✅ README plano atualizado.

## Referências
- Documentação Capacitor/Electron oficial.
