# R1101 — Pipeline CI/CD

## Objetivo
Configurar pipeline CI/CD (GitHub Actions ou similar) para rodar testes, lint, build frontend/backend e gerar artefatos (OpenAPI, Postman) automaticamente.

## Escopo
1. Criar workflows:
   - `ci-backend.yml`: instala deps Python, roda `black --check`, `isort --check`, `docker compose exec backend pytest` (com coverage). Capturar artefato coverage.
   - `ci-frontend.yml`: instala deps npm, `npm run lint`, `npm run test`, `npm run build`.
   - `ci-docs.yml`: roda `docker compose exec backend python manage.py spectacular --file schema.yaml`, `openapi-to-postman` para gerar `docs/api/postman_collection.json`, commitar se autopush (ou salvo como artefato).
2. Pipeline de deploy (stub): workflow `deploy.yml` com jobs placeholder (por enquanto logar “TODO”).
3. Configurar caches (pip, npm) para reduzir tempo.
4. Atualizar badges no README principal (build status). Opcional.

## Testes
- Rodar workflows local (act) ou via PR de teste; garantir sucesso.

## Checklist ao concluir
- ✅ Workflows rodando com sucesso.
- ✅ Artefatos schema/postman gerados.
- ✅ README (principal) atualizado com instruções de CI.
- ✅ README do plano atualizado (status + comandos).
- ✅ Documentar/atualizar endpoints via tarefa B003 (OpenAPI/Postman).

## Referências
- `docs/development_guidelines.md`
- `B003-openapi-swagger.md`
