# B501 — Models de Knowledge Base

## Objetivo
Implementar models/migrations do módulo `knowledge` (quick replies, categories, articles, versions, feedback, portal, sections) com seeds padrão.

## Escopo
1. Models/migrations:
   - `QuickReply`, `KnowledgeCategory`, `KnowledgeArticle`, `KnowledgeArticleVersion`, `KnowledgeArticleFeedback`, `KnowledgeArticleTag`, `KnowledgeAttachment`.
   - `KnowledgePortal`, `KnowledgePortalSection`, `KnowledgePortalArticle`, `KnowledgeSuggestion`.
2. Seeds default:
   - Portal externo `help-center` + interno `wiki`. Criar categorias e artigo demo em cada portal.
   - Quick replies default (atendimento inicial, saudação) por idioma (PT/EN/ES).
3. Constraints/validações:
   - Unicidade de `slug` por tenant (category, article, portal, section).
   - Versionamento: `KnowledgeArticleVersion` deve receber `versao` incremental.
4. Services helpers:
   - `publish_article(article, actor)` — cria nova versão, atualiza status/versão corrente.
   - `increment_article_usage(article, kind)` (para analytics futuros).

## Testes
- `docker compose exec backend pytest knowledge/tests/test_models.py` — criação artigo/versão, quick reply multi-idioma, portal/sections.
- `docker compose exec backend pytest knowledge/tests/test_services.py` — `publish_article`, `increment_article_usage` (com mocks).
- Seeds: rodar comando (`docker compose exec backend python manage.py seed_knowledge_demo`) e validar dados criados.

## Checklist ao concluir
- ✅ Tests knowledge passando.
- ✅ Seeds executáveis e idempotentes.
- ✅ README do plano atualizado com status/comandos.
- ✅ Verificar `docs/modules/knowledge.md`/`docs/03-modelo-dados.md` caso haja ajustes.
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/knowledge.md`
