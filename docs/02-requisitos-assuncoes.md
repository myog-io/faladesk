# 2. Requisitos Derivados & Assunções

## Multi-Tenant & Autenticação
- Subdomínios por tenant com `tenant_domain` definindo URLs.
- Login mágico por e-mail sem senha; tokens temporários.
- Usuários podem pertencer a múltiplos tenants.
- Escopo e filtros obrigatórios por `tenant_id` em todas as consultas.

## Canais e Atendimento
- Adapters iniciais: WhatsApp oficial/não-oficial, Telegram, E-mail (SMTP/IMAP), Web Chat.
- Expandir arquitetura para novos canais (Instagram, voz) sem impacto no core.
- Atendimento humano no MVP, com base pronta para bots.
- Roteamento configurado por fluxos; múltiplos agentes por conversa.

## SLA & Operação
- Políticas de SLA por departamento e canal com horários configuráveis.
- Transbordo automático quando o SLA é violado.
- Registros detalhados de responsabilidade e histórico de atendimentos.

## RBAC, LGPD & Auditoria
- Papéis: agente, supervisor, admin; granularidade por departamento.
- Visibilidade limitada por departamento/time conforme papel.
- Auditoria completa de eventos críticos com `audit_log` imutável.
- Armazenamento e mascaramento de PII conforme LGPD.

## Developer Experience
- `docker-compose up` deve provisionar Postgres, Redis, Django, Channels, Celery e Ionic web.
- Documentação clara para devs humanos e agentes IA.
- Seeds de dados para explorar inbox e tickets rapidamente.

## Assunções
- Autenticação sem MFA é aceitável no MVP; pode ser adicionado depois.
- Bots/LLM entram após estabilização do atendimento humano.
- Licenciamento: cobrança fixa por usuário; gratuito até 3 usuários por tenant.
