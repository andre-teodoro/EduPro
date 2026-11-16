# Camadas em detalhe

## 4.1 `types/` — Domínio

- Interfaces que representam o contrato com a API (snake_case, igual ao backend)
- Tipos derivados para a UI também ficam aqui
- Não conter lógica, apenas tipos

```ts
export interface Conversa {
  id: number
  nome: string
  tipo: 'INDIVIDUAL' | 'GRUPO'
  status: 'ATIVA' | 'ARQUIVADA'
}
```

## 4.2 `router/api.ts` — Mapa de endpoints

- Centraliza todas as rotas de uma área da API em um objeto `const`
- Usa `createApiResolver` (core) para gerar URLs com parâmetros de rota e query string

```ts
export const ComunicacaoRoutes = {
  conversas_lista: '/comunicacoes/conversas',
  conversa_detalhe: '/comunicacoes/conversas/:id',
} as const

export const resolveComunicacaoApi = createApiResolver(ComunicacaoRoutes, getApiUrl())
```

## 4.3 `repositories/` — Acesso à API

Responsável por:

- Chamadas HTTP (via `HttpInterface`)
- Resolver a URL via `router/api.ts`
- Devolver `Either<DataError, ApiResponse<T>>` ou `ApiPaginatedResponse<T>`

NÃO deve: transformar dados complexos, conter regra de negócio, conhecer Vue/Pinia.

```ts
export class ConversaRepository extends BaseRepository {
  async listarConversas(status: 'ATIVA' | 'ARQUIVADA', page = 1) {
    const url = resolveComunicacaoApi('conversas_lista', {}, { status, page })
    return this.requestPaginated<ConversaPanel>(this.httpClient.get(url))
  }
}
```

`BaseRepository` encapsula `request<T>` / `requestPaginated<T>` / `requestCustom<T>` e mapeia erros HTTP para `DataError`.

Repositórios são instanciados sob demanda (`new XRepository(HttpClientFactory.create())`), nunca como singleton global.

> **Track Kubb**: esta camada não existe — `generated/clients/` cumpre o papel de acesso HTTP. O padrão `Either` não se aplica; Vue Query gerencia loading/erro via `status`/`error` reativos nos hooks gerados.
>
> **Preservado intencionalmente**: se um repository chama uma rota do BFF (`server/api/**`, que por sua vez fala com o ComfyUI), o contrato não muda — o repository continua devolvendo `Either<DataError, ApiResponse<T>>`. O ComfyUI em si nunca é conhecido por esta camada.

## 4.4 `errors/` — Either + DataError

- `Either<L, R>` representa sucesso (`right`) ou falha (`left`) sem lançar exceções
- Consumido sempre via `.fold(onError, onSuccess)`
- **Regra**: toda chamada de repository retorna `Either`. Nenhuma camada acima usa `try/catch` para tratar erro de API.

```ts
const res = await repository.criarConversa(form)
res.fold(
  (err) => {
    /* tratar DataError */
  },
  (data) => {
    /* sucesso */
  },
)
```

## 4.5 `enums/` — Mapeamento de valores de API para UI

A pasta `enums/` centraliza:

- **Aliases type-safe** dos valores de enum (para comparações sem strings literais)
- **Arrays `SelectOption[]`** prontos para PrimeVue `Select`/`MultiSelect`

O padrão é **universal**: funciona em ambos os tracks (Kubb e tradicional). A diferença é só na origem dos valores.

**⚠️ REGRA FUNDAMENTAL: `label` de cada `SelectOption` é sempre uma chave de tradução (string), nunca o texto final.** Enums são classes/consts puras — **nunca importam `vue-i18n` nem chamam `t()`**. Quem traduz é a `view`/`component` ou `composable` consumidora via `computed` que mapeia as opções antes de passar ao componente PrimeVue.

### Track Kubb (com spec OpenAPI)

O Kubb gera `const` objects com os valores dos enums da API (ex: `{ M: "M", V: "V" }`), mas sem os labels. O arquivo `<Algo>Enums.ts` re-exporta com alias curto e adiciona as arrays de opções:

```ts
// enums/AtividadeEnums.ts — Track Kubb
import type { SelectOption } from '@/core/types/SelectOption'
import { getPedagogicoV1AtividadesQueryParamsPeriodoEnum } from '../generated'

// Alias curto — use em comparações: PeriodoEnum.M (não 'M')
export const PeriodoEnum = getPedagogicoV1AtividadesQueryParamsPeriodoEnum

// Array para PrimeVue Select — labels são CHAVES DE TRADUÇÃO (não o texto final)
export const periodoOpcoes: SelectOption[] = [
  { label: 'atividades.periodo_matutino', value: PeriodoEnum.M },
  { label: 'atividades.periodo_vespertino', value: PeriodoEnum.V },
  { label: 'atividades.periodo_noturno', value: PeriodoEnum.N },
]
```

### Track Tradicional (sem spec — define à mão)

Sem Kubb não há `generated/types/`. O desenvolvedor define o mesmo padrão `as const` manualmente:

```ts
// enums/TurnoEnums.ts — Track Tradicional (manual)
import type { SelectOption } from '@/core/types/SelectOption'

// Enum manual — mesmo padrão as const que o Kubb usa
export const TurnoEnum = {
  MANHA: 'MANHA',
  TARDE: 'TARDE',
  NOITE: 'NOITE',
} as const

export type TurnoEnumKey = (typeof TurnoEnum)[keyof typeof TurnoEnum]

// Array para PrimeVue Select — labels são CHAVES DE TRADUÇÃO
export const turnoOpcoes: SelectOption[] = [
  { label: 'modulo.turno_manha', value: TurnoEnum.MANHA },
  { label: 'modulo.turno_tarde', value: TurnoEnum.TARDE },
  { label: 'modulo.turno_noite', value: TurnoEnum.NOITE },
]
```

O consumo é **idêntico** em ambos os tracks: `TurnoEnum.MANHA` em comparações, `turnoOpcoes` nos selects.

#### Por que não definir arrays inline?

- Labels como chaves centralizadas evitam duplicar a mesma string em vários idiomas em lugares diferentes (resolver, componente, etc).
- `value === 'M'` não tem autocomplete nem verificação de type; `value === TurnoEnum.M` sim
- Com Kubb: se o enum mudar na API, o build quebra nos alias — aviso imediato

**`SelectOption<T>` vive em `app/core/types/SelectOption.ts`:**

```ts
export interface SelectOption<T = string> {
  label: string
  value: T
}
```

**Regra**: nunca crie `{ label, value }` arrays hardcoded inline em componentes ou composables. Centralize em `enums/<Algo>Enums.ts` com **`label` como chave de tradução** — a tradução acontece no `computed` da `view`/`composable`.

---

## 4.6 `resolvers/` — Transformação de dados

- Sempre uma classe com método(s) `resolve(...)` ou similares (sem `static` é opcional; `static` é ok)
- Não conhece Vue (sem `ref`, `computed` como dependência) — **nunca importa `vue-i18n` nem chama `t()`**
- Usado quando precisa agrupar dados ou adaptar resposta da API para o formato da UI
- Evitar quando a transformação é trivial — usar `computed` direto no composable/store

**⚠️ Se o resolver precisa expressar texto para o usuário (ex: "Realizada", "Agendada"), retorna a chave de tradução (string ou array de strings), nunca o texto final.** A `view`/`composable` consumidora chama `t(chave)` no template. Exemplo:

```ts
// resolvers/ResolveAtividadeLista.ts — resolver puro, sem t()
export class ResolveAtividadeLista {
    static statusBadge(item: Atividade): { label: string; severity: string } {
        if (item.inativo) return { label: 'atividades.status_inativa', severity: 'danger' }
        if (item.status === 'FECHADO') return { label: 'atividades.status_fechada', severity: 'info' }
        return { label: 'atividades.status_ativa', severity: 'success' }
    }

    static situacao(item: Atividade): string {
        if (item.data_inicio > now()) return 'atividades.situacao_agendada'
        if (item.data_fim < now()) return 'atividades.situacao_ocorrida'
        return 'atividades.situacao_em_execucao'
    }
}

// view/AtividadesView.vue — quem traduz é a view
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <Tag :value="t(ResolveAtividadeLista.statusBadge(item).label)" :severity="ResolveAtividadeLista.statusBadge(item).severity" />
  <span>{{ t(ResolveAtividadeLista.situacao(item)) }}</span>
</template>
```

### 4.6.1 Padrão reutilizável: listagem com filtros em drawer + badges

Quando uma tela precisa exibir uma lista com um painel de filtros (drawer/offcanvas), badges dos filtros ativos, e regra de "filtro ativo" (ex: um campo vazio ou com valor default não conta como preenchido), use este padrão de 3 peças:

**Estrutura de 3 peças:**

1. **`<Algo>FiltrosSidebar.vue`** — `Drawer` do PrimeVue com header (título), form de filtros no body, e footer com dois botões:
   - **"Limpar filtros"** (outlined secundário, ícone `pi pi-times`): condicionado a `v-if` — **só renderizado quando há filtro preenchido**. Chama handler que reseta `localFilters` ao estado default.
   - **"Aplicar filtros"** (primário, azul): sempre renderizado, alinhado à direita via `ml-auto`. Chama handler que aplica os filtros e fecha o drawer.
     Esta é a regra confirmada pelo Figma: o botão "Limpar filtros" não aparece quando nenhum filtro foi tocado.

2. **`<Algo>FiltrosBadges.vue`** — exibe chips (tags com `closable="true"`) dos filtros ativos acima da tabela. Cada chip mostra `${t(filter.label)}: ${filter.displayValue}` e emite evento de remoção.

3. **`Resolve<Algo>Filtros.ts`** — resolver que **estende** `app/core/resolvers/FiltrosAtivosBase`. Deve declarar um `protected static labels` mapeando cada chave de filtro para sua chave de tradução (`<área>.campo_*` / `common.*`), e sobrescrever `isPreenchido` apenas se tiver regra extra (ex: `status === 'A'` é o valor default, não conta como ativo).

```ts
// Exemplo: app/resolvers/ResolveAtividadeFiltros.ts
import { FiltrosAtivosBase } from '@/core/resolvers/FiltrosAtivosBase'

export class ResolveAtividadeFiltros extends FiltrosAtivosBase {
  protected static labels: Record<string, string> = {
    nome: 'atividades.campo_nome',
    projeto_id: 'atividades.campo_projeto',
    status: 'common.status',
    // ... demais filtros
  }

  protected static isPreenchido(key: string, value: unknown): boolean {
    // Regra: status === 'A' (valor default) não conta como filtro ativo
    if (key === 'status' && value === 'A') return false
    return super.isPreenchido(key, value)
  }
}
```

**Por que estender a base?** A base (`FiltrosAtivosBase`) centraliza a regra de "preenchido" (não undefined/null/""/array vazio) e os métodos públicos `possuiFiltrosAtivos()` e `listarAtivos()`, que são chamados tanto pelo composable/store (para o computed `activeFilters`) quanto pelo sidebar (para o `computed hasActiveFilters` que controla a renderização do botão "Limpar filtros"). Se o mesmo resolver é reescrito manualmente em cada tela, bugs na lógica de "preenchido" se replicam — por isso a base centraliza isso uma vez em `app/core/`, e cada resolver específico só declara `labels` e overrides de regra.

**Regra de i18n:** o campo `labels` do mapa aponta para **chaves de tradução**, nunca texto final. A tradução (`t(filter.label)`) acontece na view/componente (`AtividadesFiltrosBadges.vue` traduz no template, o sidebar traduz no header).

## 4.7 `services/` — Regra de negócio (opcional)

Contém lógica de negócio que não é nem transformação nem acesso a dados — cálculo de permissões, regras de fluxo, orquestração de múltiplas chamadas.

**Services são independentes do track**: não conhecem de onde os dados vieram. Tanto no track Kubb (dados chegam via `generated/clients/`) quanto no track tradicional (dados chegam via `Repository + Either`), o service recebe os dados já resolvidos e aplica suas regras. Nem toda área precisa de `services/`.

## 4.8 `query/` — Definição de queries (opcional, somente track tradicional)

Só existe se o projeto adotar `@pinia/colada` ou similar. Em projetos simples, o composable/store chama o repository diretamente.

> **Track Kubb**: esta pasta não existe — `generated/hooks/` cumpre esse papel com cache Vue Query embutido e tipagem automática gerada da spec.

```ts
export const createConversationsInfiniteQuery = (tipo: 'ATIVA' | 'ARQUIVADA') => ({
    key: computed(() => ['conversas', tipo]),
    initialPageParam: 1,
    query: async ({ pageParam }) => {
        const repository = new ConversaRepository(HttpClientFactory.create())
        const res = await repository.listarConversas(tipo, pageParam)
        if (res.isRight()) return res.get()
        throw new Error('Erro ao buscar conversas')
    },
    getNextPageParam: (lastPage) => /* ... */,
    staleTime: 0,
})
```

## 4.9 `stores/` — Estado e orquestração (Pinia) — opcional

Pinia só é necessário quando há **estado compartilhado entre múltiplos componentes/telas**. Se o estado é local de uma tela/feature, um composable resolve.

Pense como "controller do frontend":

- Mantém estado reativo (`ref`/`computed`)
- Instancia repositories e resolvers
- Orquestra chamadas entre repositories/services
- Trata feedback ao usuário (toast) no `fold`

NÃO deve: conter markup/JSX, fazer transformação complexa inline.

## 4.10 `composables/` — Lógica reativa sem estado global

- Comportamento de UI reutilizável que não precisa viver numa store
- Recebe `Ref`s como entrada e devolve `Ref`s/funções
- Se não precisar de reatividade, considerar mover para `resolvers/` ou `services/`

## 4.11 `components/` — UI

Responsável por: renderizar, emitir eventos, consumir stores/composables.

NÃO deve: chamar `repository`/`http` diretamente, conter regra de negócio, transformar dados complexos.

## 4.12 `views/` (Vue Router) ou `pages/` (Nuxt)

- Compõem os componentes da tela
- Fazem a ponte com a rota (`watch(route.params.id, ...)`)
- Chamam métodos de inicialização das stores em `onMounted`

## 4.13 `mock/` — Mocks de API (opcional)

Só existe se mocks/testes foram habilitados no projeto (ver `app/core/mocks/_OPCIONAL.md`).

- `mock/mock.ts` → fixtures (dados estáticos)
- `mock/handler.ts` → registra handlers via `createHandler(resolveApi, method, routeKey, response)`. Descoberto automaticamente via `import.meta.glob('@/**/mock/handler.ts')` — não precisa registrar manualmente.
- Habilitado via `VITE_API_MOCK=true` e `import.meta.env.DEV`
- Em Nuxt, para mocks do lado do servidor (BFF), considere `server/api/**` (Nitro) ou `msw` em vez de MirageJS (client-only) — ver `references/ssr-nuxt.md`.

## 4.14 Setup da aplicação — plugins Nuxt (não existe `bootstrap/`)

**Este projeto não tem `app/core/bootstrap/`.** Nuxt já cria e monta a aplicação; o que no `coder-front` original vivia em `bootstrap/createApp.ts` (registro de Pinia, PrimeVue, Toast, Confirmation) vira, aqui, um ou mais arquivos em `app/plugins/*.ts` usando `defineNuxtPlugin` — só quando essas dependências forem de fato instaladas (nenhuma delas está instalada neste projeto ainda). Ver `references/ssr-nuxt.md` para o mapeamento completo.

O que sobrou de `bootstrap/` como funções puras, sem nenhuma relação com ciclo de vida de módulo, foi realocado para `app/core/config/`:

- `config/theme.ts` → resolve o preset do PrimeVue (`aura`/`lara`/`material`/`nora`) a partir de `VITE_PRIMEVUE_THEME`.
- `config/env.ts` → helpers de variáveis de ambiente: `isMockEnabled`, `getApiUrl`.

Quando i18n está habilitado (pasta opcional `app/core/i18n/`):

- `createI18n.ts` → singleton `vue-i18n` (`legacy: false`). Lê o locale inicial de `<meta name="locale">`, senão `VITE_DEFAULT_LOCALE`, senão `'pt-BR'`.
- `registerModuleLang.ts` → mescla arquivos `lang/*.ts` descobertos via `import.meta.glob` na instância global via `mergeLocaleMessage`. O nome do arquivo é histórico (do tempo de módulos independentes) — a função em si só mescla o que o chamador descobrir via glob, não assume mais uma estrutura `modules/<modulo>/`.

Quando Kubb está habilitado (pasta opcional `app/core/kubb/`): `kubb.config.ts` (raiz do projeto) configura `pluginClient({ importPath: './app/core/kubb/KubbHttpClient' })` para que o código gerado use o client da app (e consequentemente `HttpInterface`) em vez do Axios padrão do Kubb.
