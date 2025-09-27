# R1103 — Plano de Release & Checklist

## Objetivo
Preparar plano de release MVP, checklist de verificação, comunicação e monitoramento pós-deploy.

## Escopo
1. Documento `docs/release/MVP-release-checklist.md` contendo:
   - Pré-release: migrations aplicadas, seeds rodados, variáveis ambiente, backups.
   - Testes: unit, integration, e2e status.
   - Observabilidade: dashboards analytics, alerts notificação, logs audit.
   - Segurança/LGPD: rotinas de retenção, consentimento, anonimizador pronto.
   - Rollback plan.
2. Script/command `python manage.py release_check` (stub) validando seeds, migrations pendentes, status workers.
3. Playbook de comunicação: arquivo `docs/release/communication.md` com stakeholders, mensagens (internas/externas).
4. Atualizar README principal com link para release docs e instruções resumidas.

## Testes
- Executar `release_check` em ambiente dev/stage para validar mensagens.

## Checklist ao concluir
- ✅ Documentos criados (`docs/release/*`).
- ✅ Script release_check funcional.
- ✅ README plano atualizado.

## Referências
- `docs/development_guidelines.md`
