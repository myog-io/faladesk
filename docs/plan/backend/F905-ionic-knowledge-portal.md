# F905 — Knowledge & Portal no Ionic

## Objetivo
Implementar interface de base de conhecimento/portal (público e interno) consumindo APIs B502, incluindo busca, categorias e feedback.

## Escopo
1. Portal público (rotas sem auth):
   - Página `KnowledgePortal` exibindo seções/categorias, artigos destacados, busca (client-side).
   - Página `KnowledgeArticle` com conteúdo Markdown, breadcrumbs, feedback (thumbs up/down com comentário opcional).
2. Portal interno (reutilizar layout principal):
   - Tela `KnowledgeInternal` para agentes (listar artigos internos, quick replies favoritas, CTA “Publicar novo”).
   - Formulário de criação/edição artigo (wizard simples) integrando endpoints `POST /knowledge/articles` e `/publish`.
3. Estado/API:
   - Store `knowledgeSlice` com actions `fetchPortal(slug)`, `fetchArticle`, `submitFeedback`, `createArticle`.
   - Suporte a i18n (mostrar artigos por idioma preferido).
4. UX: componentes com skeleton loading, tags, badges “Atualizado em”. Feedback confirma via toast.

## Testes
- `npm run test` — suites `KnowledgePortal.test.tsx`, `KnowledgeArticle.test.tsx` (mock API + i18n).
- Teste manual do fluxo publish → article aparece no portal.

## Checklist ao concluir
- ✅ Tests passando.
- ✅ Integração com backend (mock/real) funcional.
- ✅ README plano atualizado + docs (se snippet/guia).

## Referências
- `docs/development_guidelines.md`
- `docs/modules/knowledge.md`
