# Índice de Referências — coder-front skill (Vite)

O perfil atual é Vite + Vue 3 + TypeScript + Pinia + Vue Router. Algumas referências abaixo foram herdadas da aplicação Nuxt e contêm orientação específica de Nuxt/PrimeVue que não deve ser aplicada a este projeto; consulte a descrição da arquitetura vigente no início de `arquitetura-aplicacao.md`.

Todos os arquivos aqui contêm o conteúdo técnico completo dividido por tópico. Use esta lista para navegar rapidamente.

## Arquivos disponíveis

- **[primevue-mcp.md](./primevue-mcp.md)** — Regra PrimeVue, workflow MCP, mapeamento HTML → PrimeVue, CSS utilities, cuidado com API depreciada/removida na v5
  - Quando: Criar/editar componentes, escolher componentes PrimeVue, usar MCP

- **[kubb-dependencias.md](./kubb-dependencias.md)** — (Opcional) Arquivos gerados (proibido editar), `docs/api.yaml`, instalar dependências (pnpm)
  - Quando: O usuário pediu para configurar Kubb em alguma área, mexer em `generated/`, regenerar

- **[arquitetura-aplicacao.md](./arquitetura-aplicacao.md)** — Objetivo, estrutura de pastas (Nuxt 4, domínio organizado em `app/modules/<nome>/`), fluxo Repository → Store → Component, papel do BFF/ComfyUI, pragmatismo (MVP), Pinia/Kubb
  - Quando: Entender a estrutura geral da aplicação, o fluxo Repository → Store → Component, ou onde algo novo deve morar

- **[camadas.md](./camadas.md)** — Detalhes de cada camada (types, router/api, repository, errors, enums, resolver, filtros, service, query, store, composable, component, view, mock)
  - Quando: Implementar tipos, repository, resolver, padrão filtros, service, query, store, composable, component, view ou mock

- **[i18n.md](./i18n.md)** — (Opcional) Internacionalização completa, estrutura `lang/`, `common.*` vs `<área>.*`, primelocale
  - Quando: O usuário pediu para habilitar i18n no projeto

- **[convencoes.md](./convencoes.md)** — Convenções de nomenclatura (Repository, Resolver, Service, Query, Store, Composable, tipos, rotas)
  - Quando: Dúvida sobre nome de arquivo/classe/função

- **[ssr-nuxt.md](./ssr-nuxt.md)** — Como cada camada do `coder-front` original mapeia para infraestrutura Nuxt (plugins, `useRuntimeConfig`, `server/`), HTTP client em SSR, ComfyUI via BFF
  - Quando: Trabalho em plugins de app, HTTP client server-safe, ou integração com o BFF/ComfyUI

- **[testes.md](./testes.md)** — (Opcional) Vitest, convenção `__tests__/`, mock de `generated/`, `@vue/test-utils`
  - Quando: O usuário pediu para habilitar/adicionar testes

- **[revisar.md](./revisar.md)** — Processo completo do comando `/revisar`: resolução de escopo, blocos de checagem (arquitetura, PrimeVue, i18n, testes/cobertura, anti-patterns), formato do relatório
  - Quando: Rodar `/revisar` ou entender o que ele verifica

---

## Checklist rápido

**Antes de codar qualquer componente:**

1. ✅ Consulte o MCP `primevue` (`search`/`get_component`) para escolher o componente certo
2. ✅ Verifique `references/primevue-mcp.md` para workflow completo e cuidados com a v5
3. ✅ Use `references/camadas.md` se precisar implementar Repository, Resolver, Store, etc.
4. ✅ Só use `references/i18n.md` se o projeto já usa i18n ou o usuário pediu para habilitar
5. ✅ Revise anti-patterns em `SKILL.md` (sempre visível — não é referência)

**Nunca:**

- ✗ Crie HTML puro quando PrimeVue tem equivalente
- ✗ Edite arquivos em `generated/` (Kubb)
- ✗ Rode `pnpm install`/`pnpm add` sem confirmação do usuário
- ✗ Chame `t()` dentro de `enums/` ou `resolvers/` — retorne a chave, a view traduz
- ✗ Ative i18n/testes/Kubb sem o usuário ter pedido explicitamente
- ✗ Recrie bootstrap/ciclo de vida independente por módulo (`createApp().mount()`, rotas via glob, i18n próprio) — este projeto é uma única app Nuxt 4 (ver tabela comparativa no `SKILL.md`). Agrupar código em `app/modules/<nome>/` é permitido e é o padrão preferido.
