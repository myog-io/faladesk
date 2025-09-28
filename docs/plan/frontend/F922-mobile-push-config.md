# F922 — Push Notifications Mobile

## Objetivo
Configurar push notifications reais (FCM/APNs) para apps mobile, integrando com módulo de notificações.

## Escopo
1. Backend: garantir endpoints `notification_channel_token` suportam device tokens (FCM/APNs) e categorização.
2. Frontend mobile:
   - Registrar device token (Capacitor Push) -> enviar para `/notifications/channel-tokens`.
   - Handlers para receber push e exibir local notification (Capacitor Local Notifications).
3. Configuração plataformas:
   - iOS: certificates / APNs key (documentar, stub se sem conta Apple).
   - Android: `google-services.json`, registrar FCM project.
4. Ambiente dev: fallback (exibir toast) se push não configurado.

## Testes
- Teste manual com FCM (Android) e APNs sandbox (iOS) se possível; caso não, simular via local notifications.
- Garantir backend registra tokens e evita duplicados.

## Checklist ao concluir
- ✅ Tokens registrados com sucesso via API.
- ✅ Push recebido em device (ou simulado com logs).
- ✅ README principal atualizado com instruções push.
- ✅ README plano atualizado.

## Referências
- Capacitor Push Notifications docs.
- `docs/modules/notifications.md`
