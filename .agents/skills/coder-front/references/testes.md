# Testes (Vitest) — OPCIONAL

**Este documento só se aplica se o usuário pediu explicitamente para habilitar/adicionar testes** (ex.: "criar testes para X", "adicionar cobertura para Y"). Por padrão, o projeto não usa Vitest — qualquer `__tests__/` existente em `app/core/` está inerte (sem a dependência instalada). Não crie testes para código novo por conta própria a menos que a área já tenha uma suíte ou o pedido do usuário tenha mencionado testes.

## Ativação (primeira vez no projeto)

1. Instalar as dependências (peça confirmação ao usuário antes de rodar):
   ```bash
   pnpm add -D vitest @vue/test-utils jsdom @vitest/coverage-v8 miragejs
   ```
2. Criar `vitest.config.ts` e `vitest.setup.ts` na raiz do projeto (registra i18n de teste "silencioso" e PrimeVue globalmente via `@vue/test-utils`), com `coverage.thresholds` (`statements/branches/functions/lines: 95`, `perFile: true`).
3. Adicionar ao `package.json`:
   ```json
   "scripts": {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:coverage": "vitest run --coverage"
   }
   ```

Ferramenta: **Vitest** + `@vue/test-utils` (jsdom). Config em `vitest.config.ts` (raiz), setup global em `vitest.setup.ts` (raiz).

## Onde colocar o teste

Pasta `__tests__/` **espelhando** a árvore de produção — não co-localizado com o arquivo-alvo. Este projeto não usa `modules/<modulo>/`; a árvore espelhada é a mesma estrutura de pastas onde o código de domínio já vive sob `app/`:

```
app/
  resolvers/
    ResolveAtividadeLista.ts
  composables/
    useAtividadesLista.ts
  __tests__/
    resolvers/
      ResolveAtividadeLista.test.ts
    composables/
      useAtividadesLista.test.ts
    components/
      AtividadesFiltrosBadges.test.ts
```

Camadas compartilhadas de `app/core/` seguem o mesmo padrão em `core/__tests__/<camada>/<Nome>.test.ts` (ex: `core/__tests__/resolvers/FiltrosAtivosBase.test.ts`).

## Convenção de nome

`<Nome do arquivo-alvo>.test.ts` — mesmo nome da classe/arquivo testado, sufixo `.test.ts`.

## Quando um teste é obrigatório

- **Resolvers e composables com lógica de estado/transformação** (paginação, filtros, mapeamento de status, cálculo de datas) — **sempre** devem ter teste, se a área já usa testes.
- **Componentes com lógica condicional relevante** (`v-if` combinando múltiplas condições, emits com payload derivado, formatação de exibição) — devem ser testados.
- Componentes puramente visuais (sem lógica além de passar props adiante) — teste é opcional.

## `generated/` (Kubb) nunca é testado diretamente — mas testar por cima dele é obrigatório

Código gerado não deve ser alvo de teste. Mas composables que consomem hooks Vue Query gerados (`useGet...`) devem ser testados **de ponta a ponta contra uma chamada HTTP real interceptada pelo MirageJS** — não com `vi.mock` do módulo `generated` (isso mascara bugs reais de integração: já aconteceu de um `vi.mock` esconder uma chamada de hook com a assinatura de argumentos errada, que só um teste com HTTP de verdade pegou).

Infra pronta em `app/core/mocks/testServer.ts`:

```ts
import { startTestMockServer, stopTestMockServer } from '@/core/mocks/testServer'
import type { Server } from 'miragejs'

let server: Server | null
beforeEach(() => {
  server = startTestMockServer()
})
afterEach(() => stopTestMockServer(server))
```

`startTestMockServer()` sobe um MirageJS reaproveitando os handlers descobertos via `loadHandlers()` (glob `@/**/mock/handler.ts`, sem assumir mais uma pasta `modules/<modulo>/`) — a mesma fonte de dados usada pelo `pnpm run dev` com `VITE_API_MOCK=true`. Por isso, **sempre que criar/editar um composable que chama um hook `generated`, garanta que exista um `mock/handler.ts` para aquele endpoint** — se faltar, a query vai falhar no teste (e no dev mock) por rota não registrada. Nota: em Nuxt, chamadas feitas do lado do servidor (`server/`) não passam pelo MirageJS (client-only) — ver `references/ssr-nuxt.md`.

Como os hooks do Kubb usam `@tanstack/vue-query` de verdade, o composable precisa rodar dentro de um `QueryClient`/`VueQueryPlugin` — use o helper `withSetup()` (padrão comum):

```ts
function withSetup<T>(composable: () => T): [T, () => void] {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      return () => null
    },
  })
  app.use(VueQueryPlugin, { queryClient })
  app.mount(document.createElement('div'))
  return [result, () => app.unmount()]
}
```

Depois de disparar qualquer ação que refaça o fetch (montagem inicial, `onPageChange`, `applyFilters`, etc.), espere a query assentar antes de derrubar o servidor/desmontar, para não vazar requisição pendente entre testes:

```ts
await vi.waitFor(() => expect(result.isFetching.value).toBe(false))
```

`getApiUrl()` (`app/core/config/env.ts`) já resolve para o valor real de dev (via `.env`) dentro do Vitest, desde que `vitest.config.ts` defina `envDir` apontando pro `.env` da raiz do repo (mesmo mecanismo do build do Nuxt/Vite) — não precisa de nenhum `.env` de teste separado nem de mock de `config/env.ts`. Isso também garante que `mock/handler.ts`, o `AxiosHttpClient` do composable e o `urlPrefix` do MirageJS de teste apontem todos para a mesma base.

**Escape-hatch para rodar contra a API real** (uso manual local, nunca no CI): `VITE_TEST_REAL_API=true pnpm run test` — `startTestMockServer()` retorna `null` e não sobe o MirageJS, deixando as chamadas irem para a API real configurada no `.env`.

## Testando lógica pura fora de uma área (`core/adapters`, `core/errors`, `core/repositories`, `core/utils`)

Mesma pasta `core/__tests__/<camada>/<Nome>.test.ts`. Pontos que já surgiram na prática:

- **`vi.setSystemTime()`** para qualquer coisa que dependa de "agora" (`DateAdapter.isToday`/`isYesterday`/`getRelativeLabel`) — sempre `vi.useFakeTimers()` no `beforeEach` e `vi.useRealTimers()` no `afterEach`.
- **`vi.stubEnv(nome, valor)` + `vi.unstubAllEnvs()` no `afterEach`** para testar `config/env.ts`/qualquer coisa que leia `import.meta.env` — inclusive `DEV`/`PROD` (aceitam boolean). Sem o cleanup, o stub vaza pros próximos testes do mesmo arquivo.
- **`BaseRepository`/classes com métodos `protected`**: crie uma subclasse de teste local que expõe os métodos via wrappers públicos, e injete um **fake `HttpInterface`** (objeto simples com os métodos como `vi.fn()`) — não precisa MirageJS aqui, é um ponto de injeção de dependência puro, sem I/O real.
- **`AxiosHttpClient`/branches de `KubbHttpClient` (POST/PUT/PATCH/DELETE)**: mesmo padrão MirageJS de sempre, mas **sem** passar por `mock/handler.ts` (que é específico de uma área) — suba um `createServer({ urlPrefix: '<qualquer-url-fake>' })` registrando as rotas direto no teste.
  - **Use `Response` do pacote `miragejs`** (`import { Response } from 'miragejs'`) pra simular status de erro (`new Response(500, {}, {...})`) — a `Response` global do Fetch/jsdom tem assinatura `(body, init)`, completamente diferente, e o mock silenciosamente "funciona" mas devolve `200` com o body errado. Já causou um teste de toast de erro passar com `toastAdd` nunca chamado até essa troca.
  - `request.requestHeaders` do handler do Mirage preserva a **capitalização original** dos headers (`Authorization`, `X-CSRF-TOKEN`), não normaliza pra lowercase.
  - `request.requestBody` de um POST com `FormData` (ex: `AxiosHttpClient.post`, que sempre converte pra multipart) chega como uma instância real de `FormData` no handler — use `.get()`/`.getAll()` nela, não tente `JSON.parse`.
- **Barrel `core/index.ts`**: não reexporte `./mocks` dali — `core/mocks/loadHandlers.ts` faz `import.meta.glob(..., { eager: true })`, que importa todo `mock/handler.ts` de forma **antecipada e recursiva**. Se algo em `core/index.ts` (a raiz) for a primeira coisa a puxar `core/mocks` no grafo de módulos, cria um import circular (`mock/handler.ts` → `@/core/mocks` → `core/mocks/index.ts` → `loadHandlers.ts` → glob → `mock/handler.ts` de novo) que quebra dependendo da ordem dos `export *` dentro de `core/mocks/index.ts`. Import de mocks/test-infra fica só em `@/core/mocks` (sub-barrel) ou relativo direto — nunca na raiz `@/core`.

## Testando componentes Vue que dependem de contexto (router, toast, MirageJS)

Componentes que usam `useRouter()`/`useRoute()` do Nuxt normalmente funcionam com o mock que `@nuxt/test-utils` ou o setup do Vitest provê — se o projeto ainda usa `vue-router` puro em algum trecho não migrado para `app/pages/`, uma instância real (`createRouter({ history: createMemoryHistory(), routes: [...] })`) em `global.plugins` resolve, mesmo que o teste não navegue de verdade.

Para asserir que um componente disparou um toast de erro (`useToast()` do `primevue/usetoast`), **não** tente montar um `<Toast/>` de verdade e procurar no DOM — normalmente não há nenhum `<Toast/>` renderizado dentro da árvore do componente sob teste (fica uma vez só no layout raiz). Em vez disso, faça `vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: toastAddSpy } ) }))` no topo do arquivo e assert no spy.

Localize botões do PrimeVue por componente + prop, não por texto renderizado (que muitas vezes é só a chave de tradução, se i18n estiver habilitado): `wrapper.findAllComponents(Button).find(b => b.props('label') === 'common.aplicar_filtros')`. Se o botão depende de dados assíncronos (`:disabled="isLoading"`), espere com `vi.waitFor` tanto a existência do componente quanto o atributo `disabled` sumir — só checar `?.attributes('disabled')` com optional chaining é um falso positivo (`undefined` também quando o componente simplesmente não existe ainda).

## Padrão de import — sem globals

`globals: false` no `vitest.config.ts`. Sempre importar explicitamente:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
```

## Componentes: `@vue/test-utils`

`vitest.setup.ts` já registra globalmente um `vue-i18n` de teste "silencioso" (sem `messages` — `t('chave')` retorna a própria chave, útil mesmo quando o código sob teste usa i18n) e o `PrimeVue`, então **não é preciso reconfigurar i18n/PrimeVue em cada teste de componente**. Prefira importar o componente PrimeVue usado (`import Chip from 'primevue/chip'`) e localizar via `findComponent(Chip)`/`findAllComponents(Chip)` em vez de seletores CSS ou `{ name: 'Chip' }`.

## Cobertura mínima: 95% por arquivo

`vitest.config.ts` (raiz) define `coverage.thresholds` com `statements/branches/functions/lines: 95` e `perFile: true` — **cada arquivo** incluído no relatório precisa bater 95% em cada métrica, não só a média geral. `pnpm run test:coverage` sai com código de erro se algum arquivo ficar abaixo disso. Ao criar/editar qualquer arquivo em `core/` ou numa área com testes habilitados, rode `pnpm run test:coverage` e cheque a tabela antes de considerar terminado.

### Branches genuinamente inalcançáveis: `/* v8 ignore */`, não exclusão do arquivo

É comum sobrar 1-2 branches defensivos que a API pública do arquivo nunca consegue exercitar de verdade (ex: um `default:` de `switch` só alcançável se um valor não previsto entrar por um caminho que já é filtrado antes por outro array/enum; um `if (!x)` de guarda cujo `x` já é garantido não-vazio por quem chama). **Não remova esse código defensivo só para bater 100%** — ele continua protegendo contra erros de manutenção futuros. Em vez disso, marque a linha específica com `/* v8 ignore next [N] -- motivo */` explicando por que é inalcançável hoje:

```ts
/* v8 ignore next 2 -- só chamado com fieldName já filtrado por idFields em activeFilters */
default:
    return String(value)
```

### Exceção: componentes `.vue` com muitos campos `v-model`

Diferente de arquivos `.ts`, **não dá pra colocar `/* v8 ignore */` em cima de um setter gerado pelo compilador do Vue** para cada `v-model` de campo de formulário (`InputText`/`DatePicker`/`Select`/`MultiSelect`) — esse código não existe no seu source, é gerado no template compilado. Um componente de formulário com muitos campos nunca bate 95% de function coverage por essa razão, a menos que o teste simule interação real com cada widget de overlay do PrimeVue (abrir dropdown, clicar opção) — caro e frágil no jsdom pra cobrir o que é só glue do compilador, não lógica de negócio escrita por você.

Nesse caso, adicione o arquivo `.vue` inteiro em `coverage.exclude` no `vitest.config.ts`, com um comentário explicando o motivo (não é código morto — é lifecycle/setter de componente, uma categoria de exceção reconhecida para `.vue`). Continue testando a lógica de verdade do componente (handlers, computeds, emits) normalmente — a exclusão é só para a métrica de function coverage não travar o CI por causa de glue de framework.

## Como rodar

```bash
pnpm run test           # roda toda a suíte uma vez
pnpm run test:watch     # modo watch
pnpm run test:coverage  # com relatório de cobertura (coverage/, gitignored)
```

Assim como qualquer comando `pnpm`, a primeira execução depende de `pnpm install` já ter sido rodado — **nunca rode `pnpm install`/`pnpm install --frozen-lockfile` diretamente**, peça confirmação ao usuário antes (mesma regra dos demais anti-patterns desta skill).
