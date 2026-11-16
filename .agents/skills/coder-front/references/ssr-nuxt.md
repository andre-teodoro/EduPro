# 8. Infraestrutura Nuxt (bootstrap, HTTP client, mocks, BFF/ComfyUI)

Este projeto **é** Nuxt 4 — o que segue não é uma "adaptação opcional para SSR", é como a infraestrutura deste projeto funciona por padrão. A separação de camadas (`Repository → Resolver/Service → Query/Store/Composable → Component`) é o mesmo contrato usado no `coder-front` original; o que muda é só a infraestrutura de I/O (bootstrap, HTTP, env, mocks).

## 8.1 Bootstrap / plugins de app

Não existe `app/core/bootstrap/createApp.ts` — Nuxt já cria e monta a aplicação. Cada plugin de app vira um arquivo em `app/plugins/`, registrado automaticamente pelo Nuxt:

```ts
// app/plugins/primevue.ts (exemplo — só crie quando as deps estiverem instaladas)
import PrimeVue from 'primevue/config'
import { getPrimeVueTheme } from '@/core/config/theme'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: { preset: getPrimeVueTheme(), options: { darkModeSelector: false } },
    ripple: true,
  })
})
```

Pinia em Nuxt normalmente entra via módulo `@pinia/nuxt` (registrado em `nuxt.config.ts` → `modules: ['@pinia/nuxt']`), não via `app.use(createPinia())` manual — mas isso só é relevante quando Pinia for de fato instalado; não instale/configure por conta própria (ver regra de `pnpm add` no `SKILL.md`).

## 8.2 HTTP Client

`AxiosHttpClient` (em `app/core/adapters/`) continua válido para chamadas feitas do browser. Para chamadas feitas do lado do servidor (dentro de `server/`, ou em composables que rodam durante SSR), prefira um client baseado em `$fetch`/`ofetch` implementando o mesmo `HttpInterface`:

```ts
export class OFetchHttpClient implements HttpInterface {
  constructor(
    public baseURL: string,
    private headers: Record<string, string> = {},
  ) {}

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return $fetch(url, { baseURL: this.baseURL, headers: this.headers })
  }
}
```

Token/CSRF: não usar `localStorage` direto em código que roda no servidor (não existe lá). Usar `useCookie()` ou `useRequestHeaders(['cookie'])`.

`HttpInterface` continua sendo o ponto único de troca de implementação — trocar `AxiosHttpClient` por `OFetchHttpClient` não exige mudar nenhum `Repository`.

## 8.3 Query / estado assíncrono

- `@pinia/colada` funciona em Nuxt (`@pinia/colada-nuxt`)
- Alternativa nativa: `useAsyncData`/`useLazyAsyncData` chamando o repository dentro do handler

## 8.4 Variáveis de ambiente

`app/core/config/env.ts` hoje usa `import.meta.env.VITE_*` (mesmo mecanismo do `coder-front` original, que continua funcionando em Nuxt via Vite no client bundle). Migrar para `useRuntimeConfig()` + `nuxt.config.ts` é o caminho idiomático do Nuxt, mas **não foi feito nesta adaptação** — é uma decisão em aberto (ver DEFERRED no relatório de migração), não implemente essa troca por conta própria sem o usuário pedir.

## 8.5 Mocks

`miragejs` é client-only — não intercepta chamadas feitas dentro de `server/`. Em Nuxt, para mockar o lado do servidor, use `server/api/**` (Nitro) ou `msw`. `app/core/mocks/` (MirageJS) continua servindo para mocks client-side e para os testes (ver `references/testes.md`), quando habilitado.

## 8.6 BFF e ComfyUI

```
Browser → app Nuxt → server/ (BFF, Nitro) → API do ComfyUI → execução no ComfyUI
```

- `server/` é o único código que conhece a API/protocolo do ComfyUI.
- O frontend (`app/`) consome `server/api/**` como consumiria qualquer outra API — via `Repository`/`HttpInterface`, do mesmo jeito que qualquer outro endpoint.
- Não importe SDKs/tipos do ComfyUI dentro de `app/` — se precisar de tipos compartilhados entre `server/` e `app/`, isso é uma decisão de arquitetura a ser tomada quando a integração for implementada (fora do escopo desta adaptação).

## 9. Resumo

| Camada                              | `coder-front` original (Vite SPA)                                               | Este projeto (Nuxt 4)                                                |
| ----------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Bootstrap                           | `bootstrap/createApp.ts` + `main.ts`                                            | `app/plugins/*.ts` (Nuxt cria/monta a app)                           |
| HTTP client                         | `AxiosHttpClient`                                                               | `AxiosHttpClient` (client) / `OFetchHttpClient` (server)             |
| Token/CSRF                          | `localStorage` / meta tag                                                       | `localStorage` (client) / `useCookie` / `useRequestHeaders` (server) |
| Env                                 | `import.meta.env`                                                               | `import.meta.env` (hoje) → `useRuntimeConfig()` (futuro, DEFERRED)   |
| Cache/async                         | `@pinia/colada` (opcional)                                                      | `@pinia/colada` ou `useAsyncData` (opcional)                         |
| Estado                              | Pinia (opcional) ou composables                                                 | Pinia (opcional, via `@pinia/nuxt`) ou composables + `useState`      |
| Mock                                | `miragejs`                                                                      | `miragejs` (client) / `server/api` (Nitro) ou `msw` (server)         |
| Rotas página                        | Vue Router (`router/index.ts`, agregando `modules/*/router/routes.ts` via glob) | `app/pages/` (file-based routing)                                    |
| Backend                             | API própria                                                                     | `server/` (BFF Nitro) → ComfyUI                                      |
| Repositories/Resolvers/Errors/Types | **iguais** em ambos                                                             | **iguais** em ambos                                                  |

A separação **Repository → Resolver/Service → Query/Store/Composable → Component** é o contrato que não muda entre os dois ambientes — o que muda é apenas a infraestrutura de I/O (HTTP, env, mocks, bootstrap, rotas).
