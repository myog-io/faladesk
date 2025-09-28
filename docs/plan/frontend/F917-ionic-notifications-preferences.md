# F917 — Preferências de Notificação no Ionic

## Objetivo
Adicionar tela para que usuários configurem preferências de notificação (canal, quiet hours, digest) consumindo API de notifications.

## Escopo
1. View `NotificationPreferences`:
   - Lista de categorias (conversation, ticket, SLA...) com toggles por canal (in-app, push, email, chat bot).
   - Configuração de quiet hours (time picker) e timezone.
   - Opção digest (daily/weekly) e botão “Enviar teste”.
2. Estado/API:
   - Store `notificationSettingsSlice` (`fetchPreferences`, `updatePreference`, `sendTestNotification`).
3. UX:
   - Mostrar resumo (ex.: “Você receberá push entre 7h-22h”).
   - Validar ranges quiet hours; se `start > end`, considerar overnight.

## Testes
- `npm run test` — `NotificationPreferences.test.tsx` (mock API).
- Teste manual confirmando updates refletidos no backend.

## Checklist ao concluir
- ✅ Tests passando (container `frontend`).
- ✅ Configurações persistem via API.
- ✅ README plano atualizado.
- ✅ Caso endpoints backend precisem de ajustes, atualizar OpenAPI (B003).

## Referências
- `docs/modules/notifications.md`
