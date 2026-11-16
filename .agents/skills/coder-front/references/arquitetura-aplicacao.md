# Arquitetura da Aplicação (Vue 3 / Vite)

> Perfil vigente para este repositório: SPA Vue 3 + TypeScript com Vite, um `createApp()` em `src/main.ts`, Vue Router em `src/router/`, Pinia para estado compartilhado e código-fonte em `src/`. `src/core/` contém apenas infraestrutura genérica. Organize funcionalidades de domínio em `src/modules/<domínio>/`; mantenha views e componentes compartilhados em `src/views/` e `src/components/`. Acesse a API mockada por repositories. As seções legadas abaixo descrevem a antiga aplicação Nuxt e não se aplicam aqui.

> Este arquivo substitui o antigo `arquitetura-modulos.md` do `coder-front` original. Lá, a aplicação era composta por vários módulos independentes, cada um com seu próprio bootstrap e ciclo de vida (ver tabela comparativa no `SKILL.md`). Aqui é **uma única aplicação Nuxt 4** — não existe bootstrap por módulo, e esse mecanismo não deve ser recriado. Agrupar código por domínio em `app/modules/<nome>/` continua sendo o padrão preferido (ver § 2.3) — o que não existe mais é o bootstrap/ciclo de vida próprio por módulo.

## 1. Objetivo

- Código previsível e com responsabilidades bem definidas
- Fácil de testar (camadas puras sem depender de Vue)
- Reuso de regras entre client e server (BFF Nuxt)
- Evitar lógica de negócio, transformação de dados e chamadas HTTP dentro de componentes

---

## 2. Estrutura de pastas

### 2.1 `app/core/` (compartilhado por toda a aplicação)

```
app/core/
  adapters/
    AxiosHttpClient.ts    → implementação de HttpInterface (browser, localStorage/CSRF)
    DateAdapter.ts
    UrlUtils.ts
  config/                  → helpers puros de configuração/ambiente
    theme.ts               → resolve o preset do PrimeVue via VITE_PRIMEVUE_THEME
    env.ts                 → isMockEnabled, getApiUrl
  errors/                 → Either, DataError e helpers de erro
  interfaces/             → contratos (HttpInterface, ApiResponse, ApiPaginatedResponse)
  repositories/           → BaseRepository, HttpClientFactory, transformers
  resolvers/
    FiltrosAtivosBase.ts  → base para resolvers de filtros ativos (ver 4.6.1 em camadas.md)
  routing/
    createApiResolver.ts  → gera URLs a partir de um mapa de endpoints
  types/                  → interfaces genéricas (SelectOption, BreadcrumbItem, etc.)
  utils/                  → helpers genéricos (string, etc.)

  # ── Opcionais — inertes por padrão (sem dependências instaladas) ──
  i18n/                   → vue-i18n, locales, registerModuleLang (só se i18n habilitado)
  kubb/                   → KubbHttpClient, setupKubbClient (só se Kubb habilitado)
  mocks/                  → MirageJS: createHandler, loadHandlers, createMock, testServer (só se mocks/testes habilitados)
```

`app/core/` não conhece nenhuma área de domínio específica. Tudo aqui é genérico e reaproveitável por qualquer parte da aplicação. As pastas `i18n/`, `kubb/` e `mocks/` existem prontas mas **não têm dependências instaladas por padrão** — cada uma tem um `_OPCIONAL.md` com o passo a passo de ativação. Ver a seção "i18n, testes e Kubb são opcionais" do `SKILL.md`.

> **`KubbHttpClient`** (em `core/kubb/`, quando ativado) não implementa `HttpInterface` — implementa o contrato `Client` do Kubb (uma função `(RequestConfig) => Promise<ResponseConfig>`). Mas internamente usa `AxiosHttpClient`, tornando `HttpInterface` o **ponto único de troca de HTTP** para ambos os tracks. Para usar: em `kubb.config.ts` (raiz do projeto), configure `pluginClient({ importPath: './app/core/kubb/KubbHttpClient' })`.

### 2.2 Bootstrap da aplicação (Nuxt 4)

Nuxt já possui o ciclo de vida da aplicação inteira — não existe (nem deve ser recriado) um `createApp.ts`/`main.ts` manual, nem um agregador de rotas via `import.meta.glob`:

```
app/
  app.vue                → shell raiz (layout, <NuxtPage/>)
  pages/                  → file-based routing do Nuxt (substitui o antigo router/index.ts agregador)
  plugins/                → defineNuxtPlugin — ponto de registro de Pinia, PrimeVue, Toast, etc.
                             (quando essas dependências forem instaladas; ver `references/ssr-nuxt.md`)
  core/                   → ver 2.1
server/                   → Nitro (BFF) — rotas que falam com o ComfyUI (ver 2.4)
```

Se surgir a necessidade de registrar plugins de app (Pinia, PrimeVue, i18n), cada um vira **um arquivo em `app/plugins/`**, não uma função central de bootstrap. Isso não é uma abstração nova: é o próprio mecanismo do Nuxt.

### 2.3 Organização do código de domínio

Este projeto organiza código de domínio em `app/modules/<nome>/`, um por área/entidade (ex.: `character`, `clothing`, `generation-studio`). Cada módulo agrupa as camadas que ele efetivamente precisa — não crie de antemão todas as pastas abaixo; elas são exemplos do que pode existir, não um esqueleto obrigatório:

```
app/
  modules/
    <nome>/
      components/          → UI do módulo (auto-importado — ver nuxt.config.ts `components`)
      composables/         → lógica reativa sem estado global
      stores/               → Pinia, quando necessário (estado compartilhado entre telas)
      repositories/         → chamadas HTTP via AxiosHttpClient, quando não for algo genérico de core/
      resolvers/            → transformação/agrupamento de dados
      types/                → tipos/interfaces de domínio manuais

      # ── Opcionais (só se o usuário pediu) ─────────────────────
      lang/                 → traduções (só se i18n habilitado — ver references/i18n.md)
      __tests__/            → espelha a árvore do módulo (só se testes habilitados)

  components/              → UI Vue reutilizável entre módulos, sem dono de domínio (ex.: ConfirmModal.vue)
  composables/             → lógica reativa reutilizável entre módulos, sem dono de domínio (ex.: useConfirm.ts)
  stores/                  → Pinia reutilizável entre módulos, quando necessário (raro — a maioria dos stores é de um módulo só)
  pages/                    → rotas (file-based routing do Nuxt) — fica em app/pages/, não em app/modules/
```

`app/modules/<nome>/` é **só organização de arquivos por domínio** — não tem bootstrap, não agrega rotas via glob e não registra i18n próprio; isso é Nuxt (`app/pages/`, `app/plugins/`) e `registerModuleLang`/`vue-i18n` fazendo o que sempre fizeram (ver § "Não recrie o bootstrap..." no `SKILL.md`). `app/pages/*.vue` continua enxuto, só compondo o(s) componente(s) do módulo correspondente.

Nem toda pasta de módulo nasce completa: um módulo pode começar só com `components/` (placeholder de UI) e ganhar `repositories/`, `composables/` etc. conforme a funcionalidade for implementada — isso é uma decisão orgânica por necessidade, não um esqueleto obrigatório de dia um.

Um módulo pode também possuir **sub-módulos**, quando uma área só existe dentro dele e não é reaproveitável em nenhum outro lugar (ex.: `character`, `scene`, `camera` e `options` só existem como seções de `generation-studio`): `app/modules/<pai>/<filho>/<camada>/`, um nível a mais da mesma estrutura:

```
app/modules/generation-studio/
  components/GenerationStudio.vue
  character/components/Character.vue
  scene/components/Scene.vue
  camera/components/Camera.vue
  options/components/Options.vue
```

Isso é só profundidade extra da mesma convenção — o padrão de auto-import via `nuxt.config.ts` (`pattern: '**/components/**/*.vue'`) já cobre qualquer nível de aninhamento. Se um sub-módulo mais tarde precisar ser usado fora do pai, promova-o para `app/modules/<nome>/` (nível raiz).

#### 2.3.1 Três níveis: `core/` vs `app/<camada>/` vs `app/modules/<nome>/<camada>/`

Existem três lugares onde código "compartilhado" pode morar, e eles não são intercambiáveis:

| Nível                                      | O que é                                                                                 | Conhece Vue?                                               | Conhece domínio?                                            | Exemplos                                                                               |
| ------------------------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `app/core/`                                | Infraestrutura técnica genérica: HTTP, erros, contratos, config, tipos genéricos, utils | **Não** — TypeScript puro, sem componentes/composables Vue | Não — não sabe o que é "character" nem "clothing"           | `AxiosHttpClient`, `BaseRepository`, `Either`/`DataError`, `SelectOption`, `getApiUrl` |
| `app/<camada>/` (raiz, fora de `modules/`) | Blocos de UI/comportamento **Vue** reaproveitáveis por qualquer módulo                  | **Sim** — são componentes/composables Vue                  | Não — não tem regra de negócio de nenhum domínio específico | `ConfirmModal.vue`, `useConfirm.ts`, uma `DataTable.vue` genérica de paginação         |
| `app/modules/<nome>/<camada>/`             | Código de UI/negócio **de um domínio específico**                                       | Sim                                                        | Sim — pertence a exatamente um módulo                       | `Character.vue`, `CharacterRepository.ts`, `useCharacterForm.ts`                       |

**Pergunta-teste** ao decidir onde colocar um arquivo novo:

1. É TypeScript puro, sem depender de Vue (HTTP, erro, tipo genérico, util)? → `app/core/`.
2. É um componente/composable Vue, mas **não** pertence a nenhuma entidade/fluxo específico — serviria igual em qualquer módulo (ex.: um modal de confirmação, um `useDebounce`, um wrapper de tabela)? → `app/<camada>/` na raiz.
3. É específico de uma entidade/fluxo (Character, Clothing, etc.), mesmo que hoje só tenha um arquivo? → `app/modules/<nome>/<camada>/`.

Na dúvida entre os níveis 2 e 3: comece em `app/modules/<nome>/<camada>/` (mais fácil de promover para a raiz depois, quando um segundo módulo precisar do mesmo componente/composable, do que quebrar um acoplamento indevido depois).

**Auto-import de componentes por módulo**: o `components/` de cada módulo só é escaneado pelo Nuxt porque `nuxt.config.ts` inclui uma entrada custom:

```ts
components: [
  { path: '~/components' },
  { path: '~/modules', pattern: '*/components/**/*.vue', pathPrefix: false },
]
```

Com `pathPrefix: false`, o nome do componente vem só do nome do arquivo (ex.: `app/modules/character/components/Character.vue` → `<Character>`), não do caminho completo. Isso exige nomes de arquivo únicos entre módulos — ao criar um componente de módulo, confira que o nome não colide com outro já existente em `app/modules/*/components/`.

### 2.4 BFF / ComfyUI (`server/`)

O Nuxt server/BFF (Nitro, pasta `server/`) é o único lugar que conhece a API do ComfyUI:

```
Browser → app Nuxt → server/ (BFF, Nitro) → API do ComfyUI → execução no ComfyUI
```

- O frontend/domínio (`app/`) nunca importa client/tipos do ComfyUI diretamente — só conhece o contrato exposto pelas rotas do BFF (`server/api/**`).
- Isso preserva o mesmo princípio de "isolar tecnologia externa atrás de uma interface" que `HttpInterface`/`AxiosHttpClient` já aplicam para HTTP genérico — só que na borda server-side.
- Este documento não define a implementação da integração com ComfyUI — isso é escopo de uma tarefa futura, não desta adaptação de arquitetura.

---

## 3. Fluxo padrão

**Track Kubb** (opcional — quando existir `docs/api.yaml` para uma parte da API):

```
API → KubbHttpClient → generated/clients/ → generated/hooks/ → Store/Composable → Component
                                                     ↕ (Resolver/Service quando necessário)
```

**Track Tradicional** (padrão — sem spec):

```
API/BFF → AxiosHttpClient (HttpInterface) → Repository → Either<DataError,T> → Store/Composable → Component
                                                              ↕ (Resolver/Service quando necessário)
```

> Trocar o HTTP consumer (ex: Axios → `$fetch`/`ofetch`): crie uma nova classe que implemente `HttpInterface`. Tanto `KubbHttpClient` quanto todos os `Repository` passam a usar a nova implementação — sem refatorar chamadas de método.

**Passos comuns (ambos os tracks):**

1. Component dispara uma ação (via composable/store)
2. Store/composable obtém dados (via hooks gerados ou repository)
3. Resolver (se necessário) transforma/agrupa os dados para o formato da UI
4. Store/composable expõe estado reativo já tratado
5. Component apenas renderiza e emite eventos

---

## 6. Pragmatismo (MVP)

Nem todo fluxo precisa de todas as camadas:

- Transformação simples → `computed`, sem Resolver
- Sem regra de negócio → sem `services/`
- Tela simples sem cache/paginação → chamar repository direto do composable, sem `query/`

**Regra inegociável**: HTTP fica em repository (ou em `server/` para o que fala com o ComfyUI). UI nunca chama API direto e não tem regra de negócio.

### 6.1 Pinia e `@pinia/colada` são opcionais

- **Sem `@pinia/colada`**: a camada `query/` não existe; composable/store chama repository diretamente.
- **Sem Pinia**: a camada `stores/` não existe; tudo vira `composables/`.
- O contrato **Repository → Resolver/Service → (Query/Store/Composable) → Component** continua o mesmo.

Use Pinia/`@pinia/colada` quando o projeto precisar de cache entre rotas, paginação infinita, polling, ou estado global complexo.

### 6.2 Kubb vs. track tradicional

| Critério               | Track Kubb (opcional)                    | Track Tradicional (padrão)       |
| ---------------------- | ---------------------------------------- | -------------------------------- |
| Área tem spec OpenAPI  | ✅ `docs/api.yaml` → use Kubb            | — sem spec                       |
| HTTP client            | `KubbHttpClient` → `AxiosHttpClient`     | `Repository` → `AxiosHttpClient` |
| Contrato HTTP          | `Client` fn (Kubb) + `HttpInterface`     | `HttpInterface`                  |
| Types                  | `generated/types/` automáticos           | `types/index.ts` manuais         |
| Enums                  | `generated/` (re-exportados em `enums/`) | Definidos à mão com `as const`   |
| Cache / loading / erro | `generated/hooks/` (Vue Query)           | `Either` + `ref` manuais         |
| Validação de schema    | `generated/zod/` automático              | manual ou sem Zod                |
| `query/`               | não existe                               | opcional (`@pinia/colada`)       |
| `repositories/`        | não existe                               | obrigatório                      |
| Resolvers / Services   | ✅ iguais em ambos                       | ✅ iguais em ambos               |
| Stores / Composables   | ✅ iguais em ambos                       | ✅ iguais em ambos               |

**Trocar o HTTP consumer** (ex: Axios → `$fetch`): crie uma nova classe que implemente `HttpInterface`. O `KubbHttpClient` e todos os `Repository` passarão a usar a nova implementação automaticamente — não há refatoração nas chamadas.

Uma spec pode cobrir alguns endpoints via Kubb e outros via Repository (quando o endpoint ainda não tem spec), mas cada endpoint segue um track só. Ativar Kubb é opt-in — ver `references/kubb-dependencias.md`.
