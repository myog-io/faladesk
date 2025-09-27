# 6. Riscos & Próximos Passos

## Riscos Principais
- **Integrações WhatsApp**: aprovações Meta e provedores podem atrasar cronograma; manter mocks e SLAs claros.
- **Complexidade de Automação**: ferramenta estilo n8n pode crescer rápido; começar com ações limitadas e evoluir.
- **LGPD/PII**: armazenamento inadequado de dados sensíveis; aplicar criptografia por coluna e revisar logs.
- **Escalabilidade**: arquitetura deve suportar aumento além de 400 conversas/mês/tenant; planejar autoescalonamento Channels/Celery.
- **Developer Experience**: ambiente `docker-compose` pode ficar pesado; separar profiles `dev`/`prod` e usar caching.

## Próximos Passos
- Validar o modelo de dados com stakeholders e ajustar entidades críticas.
- Priorizar adapters prioritários (WhatsApp oficial, Telegram) e definir cronograma com provedores.
- Preparar backlog detalhado das milestones e alinhar com squads responsáveis.
- Prototipar UI da inbox no Ionic para validar UX com agentes.
- Implantar monitoramento básico (metrics/logs) desde o início do desenvolvimento.
