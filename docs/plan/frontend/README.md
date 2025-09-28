# Plano Frontend

- Frontend é Ionic **Angular** (Capacitor + Electron). Consulte `docs/development_guidelines.md` antes de qualquer tarefa.
- Execute comandos sempre via container `frontend`: `docker compose exec frontend npm run ...`.
- Nenhuma regra de negócio no client; se precisar de endpoint novo, alinhar e criar tarefa backend antes.
- Integração com documentação: se consumir novos endpoints, garantir que backend (B003) esteja atualizado.

## Fase 9 — Base Ionic
- F901 — Bootstrap Ionic Angular
- F902 — Inbox Unificada
- F903 — Notificações & Gamificação

## Fase 10 — Tickets, Knowledge & Chat
- F904 — Tickets & Workflow
- F905 — Knowledge Portal
- F906 — Internal Chat & Voz

## Fase 12 — Admin & Config
- F907 — Admin OrgUnits & RBAC
- F908 — Admin Channels
- F909 — Tenant Settings Hub

## Fase 13 — Automation Builder
- F910 — Automation Builder Canvas
- F911 — Editor de Nós
- F912 — Monitor de Runs

## Fase 14 — Analytics & Dashboards
- F913 — Dashboard Analytics
- F914 — Alerts & Configurações
- F915 — Exports & Sharing

## Fase 15 — Gamificação & Notificações Avançadas
- F916 — Desafios & Leaderboard
- F917 — Preferências de Notificação
- F918 — Digest & Centro Avançado

## Fase 16 — Contacts & CRM 360
- F919 — Visão 360º de Contatos
- F920 — UI de Merge & Deduplicação

## Fase 17 — Mobile/Desktop Packaging
- F921 — Setup Capacitor
- F922 — Push Notifications Mobile
- F923 — Release Mobile
- F924 — Packaging Electron
