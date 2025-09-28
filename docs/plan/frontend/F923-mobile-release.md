# F923 — Preparação de Release Mobile

## Objetivo
Preparar builds para distribuição (TestFlight, Google Play Internal Testing), incluindo ícones, splash, versão.

## Escopo
1. Branding: gerar ícones/splash (usar `cordova-res` ou Capacitor Assets) e aplicar nas plataformas.
2. Versionamento: configurar `appVersion`/`buildNumber` (capacitor config + platforms) alinhado ao backend release.
3. Builds:
   - iOS: gerar archive (Xcode) e preparar envio para TestFlight (stub se sem conta Apple).
   - Android: gerar `aab` via Gradle, pronto para Play Console.
4. QA checklist mobile: funcional, notificações, offline (básico), deep links.
5. Documentar processo em `docs/release/mobile.md` (passos, requisitos, contatos).

## Testes
- Build iOS/Android sem erros (debug ou release stub).
- Checklist QA preenchido.

## Checklist ao concluir
- ✅ Builds gerados.
- ✅ Documentação release mobile criada.
- ✅ README plano atualizado.

## Referências
- Capacitor deployment docs.
- `docs/release/MVP-release-checklist.md`
