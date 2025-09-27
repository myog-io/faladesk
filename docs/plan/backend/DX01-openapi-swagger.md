# DX01 — Documentação OpenAPI/Swagger & Postman

## Objetivo
Configurar documentação automática da API (OpenAPI/Swagger) e exportá-la para Postman/Redoc, garantindo atualização contínua.

## Escopo
1. Escolher biblioteca (recomendado `drf-spectacular`) e configurar:
   - Adicionar dependência (`pip install drf-spectacular`), atualizar `INSTALLED_APPS`, `REST_FRAMEWORK` settings.
   - Gerar schema automatizado (`/api/schema/`), views `schema`, `swagger-ui`, `redoc`.
2. Documentar endpoints existentes:
   - Usar decorators `@extend_schema` ou serializer meta para detalhar parâmetros/respostas (core, organizations, messaging, tickets, knowledge, automations, analytics, notifications, gamification, internal_chat).
   - Garantir tags por módulo e exemplos relevantes.
3. Export Postman:
   - Configurar script/management command `generate_openapi_postman` que converte schema para coleção Postman (usar `openapi-to-postmanv2` ou libs Python).
   - Salvar coleção em `docs/api/postman_collection.json` (gerado automaticamente, mas versionado).
4. CI: adicionar job que valida schema (`spectacular --fail-on-warn`) e regenera docs quando necessário.
5. Atualizar `docs/README.md` com link para endpoints (Swagger UI, Redoc, Postman collection).

## Testes
- Rodar `python manage.py spectacular --file schema.yaml` e verificar warnings.
- Testar acesso às rotas `/api/schema/swagger-ui/` e `/api/schema/redoc/` manualmente.
- Executar script de export Postman e validar arquivo gerado.

## Checklist ao concluir
- ✅ Schema gerado sem warnings.
- ✅ Swagger UI/Redoc acessíveis.
- ✅ Postman collection gerada e commitada.
- ✅ README atualizado (links).
- ✅ Registrar comandos executados no README do plano.

## Referências
- `docs/development_guidelines.md`
- Documentação drf-spectacular ou alternativa escolhida.
