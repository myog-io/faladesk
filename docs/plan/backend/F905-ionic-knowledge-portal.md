# F905 — Knowledge Portal (Ionic Angular)

## Objetivo
Implementar portal de conhecimento (público e interno) com busca, feedback e publicação de artigos consumindo APIs B502.

## Escopo
1. Portal público (sem auth):
   - Rota `knowledge/:portalSlug` exibindo seções/categorias, artigos destacados, busca client-side.
   - Página `knowledge-article` renderizando Markdown (usar `ngx-markdown` ou similar), breadcrumbs, feedback (thumb up/down + comentário).
2. Portal interno (com auth):
   - Tela `knowledge-internal` listando artigos internos, quick replies favoritas, CTA “Publicar novo”.
   - Wizard Reactive Forms para criar/editar artigo, integrando `POST /knowledge/articles` + `/publish`.
3. Estado/API:
   - NgRx `KnowledgeState` (`portals`, `articles`, `loading`); effects `loadPortal`, `searchArticles`, `submitFeedback`, `createArticle`.
   - Services `KnowledgeApiService` e `QuickRepliesService` reaproveitando interceptors.
   - Suporte i18n (filtrar artigos por idioma preferido do usuário).
4. UX/A11y:
   - Skeletons, tags, badge “Atualizado em”.
   - Toasts para feedback enviado, validações de formulário.

## Testes
- `npm run lint`.
- `npm run test` — `knowledge-portal.component.spec.ts`, `knowledge-article.component.spec.ts`, `knowledge.effects.spec.ts`.
- Teste manual: publicar artigo (ambiente dev) e verificar exibição no portal público/interno.

## Checklist ao concluir
- ✅ Tests/lint passando (container `frontend`).
- ✅ Fluxos publish/feedback funcionais.
- ✅ README plano atualizado + docs (se necessário prints ou instruções).
- ✅ Se novos endpoints/backend foram criados/ajustados, atualizar documentação OpenAPI (B003) e módulos correspondentes.

## Referências
- `docs/development_guidelines.md`
- `docs/modules/knowledge.md`
