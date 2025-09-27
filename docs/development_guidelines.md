# Diretrizes de Desenvolvimento & Agentes

## Visão Geral
- Todo o projeto é multi-tenant e orientado a eventos. Garanta que qualquer feature respeite `tenant_id`, org units e emita eventos para analytics/notificações quando necessário.
- Ambiente padrão: `docker-compose up` deve ser suficiente para iniciar stack mínima (Postgres, Redis, Django, Channels, Celery, Ionic). Não introduzir dependências extras sem atualizar o compose.
- Trabalhe sempre em português nas comunicações internas (commits, docs) e mantenha neutralidade/clareza técnica.
- Nenhuma configuração inicial é exigida para módulos como Gamificação ou Notificações: eles devem funcionar com seeds padrão.

## Estrutura de Código
- **Back-end (Django):**
  - Use apps já mapeados (`core`, `organizations`, `channels`, `contacts`, `messaging`, `tickets`, `knowledge`, `automation`, `analytics`, `gamification`, `notifications`, `internal_chat`, etc.).
  - Models enxutos: apenas campos, relacionamentos e validações simples.
  - Serializers concentram regras de negócio; viewsets permanecem finos, delegando para services/use cases onde fizer sentido.
  - Sempre aplique filtros por `tenant_id` e `org_unit` (quando aplicável). Utilize mixins utilitários já existentes.
  - Emita sinais/eventos (`analytics_event`, `notification_queue`, `gamification_event`) quando ações de negócio ocorrerem.
- **Front-end (Ionic/Capacitor):**
  - Utilize store global (Zustand/Redux) para estado crítico. Evite duplicidade de fontes de verdade.
  - Interfaces responsivas, com suporte a PT/EN/ES desde o início (i18n configurado).
  - Componentes devem consumir APIs via serviços tipados (OpenAPI ou SDK). Trate loading/erro com feedback claro.
  - WebSockets/Channels: reconectar automaticamente, exibir fallback quando offline.

## Convenções Gerais
- **Nomeação:** use snake_case em Python, camelCase/ PascalCase em TypeScript. Slugs sempre kebab-case.
- **Eventos:** `event_type` segue padrão `dominio.acao` (ex.: `conversation.assigned`). Inclua `schema_version` ao evoluir payload.
- **Logs & Observabilidade:** use logging estruturado (JSON) com `tenant_id`, `org_unit_id` e `correlation_id`. Evite logs verbosos com PII.
- **Tests:**
  - Backend: pytest ou Django test runner – inclua unit (serializers/services) + integrações (viewsets, Celery tasks). Utilize factories multi-tenant.
  - Frontend: testes de componente (Testing Library) e e2e críticos (Playwright). Priorize flows de messaging/tickets.
  - Celery/Channels: use cenários reais (Redis em memória) e tasks idempotentes.
- **CI/CD:** pipelines devem rodar lint + testes + type-check. Falhas bloqueiam merge.
- **Docs:** qualquer feature relevante deve atualizar docs em `docs/` (apresentações, diagramas Mermaid já definidos).

## Segurança & LGPD
- Implemenar sempre que necessario Throttle/Rate-limit nos endpoints Django Rest framework nos endpoints criados, levando em consideração possivel uso.
- Sempre mascarar/criptografar PII sensível (contatos, tokens, gravações). Prefira `pgcrypto` e `vault` para secrets.
- Implementar RLS (Row-Level Security) em tabelas multi-tenant; back-end reforça restrições em serializers/querysets.
- Respeitar retenção configurável (mensagens, gravações, analytics). Use Celery jobs para limpeza.
- Consentimento: mantenha trace (audit_log) quando cliente/colaborador fornecer feedback ou aceitar termos.

## Integrações Essenciais
- **Analytics:** emita `analytics_event` para mudanças significativas (conversation status, ticket, automation, gamificação, knowledge). Não agregue diretamente na camada OLTP.
- **Notificações:** ao alterar estado crítico (atribuição, SLA, alertas), acione `notification_rule` via fila. Respeite preferências do usuário.
- **Gamificação:** utilize seeds padrão. Ao criar novos eventos (ex.: nova automação), avalie se deve gerar `gamification_event`.
- **Internal Chat:** sempre use WebRTC para voz e Channels para sinalização. Transcrições via automations são opcionais, porém respeite consentimento.

## Fluxo de Trabalho (Devs)
1. **Planejamento:** sempre crie tarefa com descrição clara; alinhe com Tech Lead/PM.
2. **Branching:** `feature/<modulo>-<descricao>`. Commits pequenos, mensagens claras.
3. **Tests & Linters:** execute localmente antes de abrir PR. Inclua migrações testadas (`python manage.py migrate --check`).
4. **Pull Request:** descreva contexto, testing evidence, impacto em analytics/notificações/gamificação.
5. **Code Review:** revisar multi-tenant, dreno de eventos, LGPD, seeds default. Não aprove se regras padrão forem quebradas.
6. **Deploy:** merge gatilha pipeline automatizada. Monitoração via dashboards analytics/notificações.

## Diretrizes para Agentes IA (Pair/Assistentes)
- Respeite `AGENT.md` e este documento. Nunca modifique configurações críticas sem aprovação humana.
- Ao implementar algo, sempre:
  - Conferir se há seeds/config padrões (Gamificação, Notificações) antes de propor customização.
  - Garantir eventos (`analytics_event`, `notification_queue`, `gamification_event`) quando processo de negócio justificar.
  - Atualizar docs (Mermaid, listas) em `docs/` quando criar/alterar entidades.
  - Validar testes relevantes. Se não for possível executar (ex.: falta dependência), comunicar claramente.
- Não remover dados/anexos sem encaminhar plano de retenção. Em caso de dúvida sobre LGPD/PII, escalar para dev humano.

## Seeds & Defaults
- **Gamificação:** regras padrão: `peer_kudos`, `customer_csat`, `sla_on_time`, `voice_participation`. Níveis Bronze/Prata/Ouro/Platino preconfigurados.
- **Notificações:** templates padrão (SLA, ticket assignment, analytics alert, gamification kudos). Preferências iniciais: in-app + push habilitados, quiet hours 22h–7h locais.
- **Automation:** fluxos de intake (normalização, anti-spam) e alertas críticos pré-publicados.
- **Knowledge:** portal externo + interno seeds com categorias básicas.

## Boas Práticas de UX/Produto
- Inboxes (conversas, tickets, notificações) devem oferecer quick actions e evitar ruído (aplicar dedupe/agrupamento).
- Sempre cross-link: notificações, gamificação, analytics devem apontar para contexto correto (deep link).
- Perfis de agente exibem pontos/níveis/badges; permitir celebratory UI sem exagero (usar guidelines do design).
- Documente decisões de produto/UX significativas em `docs/` (seção Riscos & Próximos Passos ou README correlato).

## Checklist Antes de Mudar Qualquer Módulo
- Impacta multi-tenant? ✅ filtros e seeds padrão mantidos.
- Emite eventos necessários? ✅ analytics/notificações/gamificação.
- Respeita LGPD & retenção? ✅ dados sensíveis tratados.
- Atualizou docs/ERD? ✅ diagrama Mermaid/MD pertinentes.
- Tests/lint executados? ✅ evidência no PR.

## Melhorias Futuras
- Painel único com métricas build vs. business (ligar analytics + gamificação + notificações).
- Template CLI para gerar módulos seguindo convenções (Django app + docs + tests).
- Guia detalhado para seed customization (gamificação/notificações) quando optarem por avançar.
