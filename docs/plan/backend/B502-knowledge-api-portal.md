# B502 — APIs de Knowledge & Portais

## Objetivo
Construir endpoints REST para gestão de quick replies, artigos e portais, além de entregar páginas públicas usando Django + DRF + templates estáticos (quando necessário).

## Escopo
1. API REST (DRF ViewSets):
   - `QuickReplyViewSet`, `KnowledgeCategoryViewSet`, `KnowledgeArticleViewSet`, `KnowledgePortalViewSet`, `KnowledgePortalSectionViewSet`.
   - Endpoints específicos: `POST /knowledge/articles/{id}/publish`, `GET /knowledge/articles/{id}/versions`.
   - Portal externo: `GET /knowledge/portal/{slug}` (dados para frontend) e rota opcional HTML (render template simples).
2. Permissões: `HasTenantPermission` com códigos `knowledge.manage` / `knowledge.view`. Portal público acessa sem auth (apenas artigos `tipo = public`).
3. Feedback: endpoint `POST /knowledge/articles/{id}/feedback` (cliente ou agente) gravando `KnowledgeArticleFeedback`.
4. Notificações/Gamificação: ao publicar artigo, notificar subscritores (notificações) e conceder badge “Knowledge Contributor” (gamificação).
5. Atualizar seeds/drafts para usar API (ex.: script que cria artigo via endpoint).

## Testes
- `docker compose exec backend pytest knowledge/tests/test_api_articles.py` — CRUD, publish, feedback, permissões.
- `docker compose exec backend pytest knowledge/tests/test_api_portal.py` — consulta portal público e interno.

## Checklist ao concluir
- ✅ Tests API passando.
- ✅ Notificações/gamificação emitter via mocks/asserts.
- ✅ README do plano atualizado + docs (se endpoints novos, listar).
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/knowledge.md`
- `docs/modules/notifications.md`
- `docs/modules/gamification.md`
