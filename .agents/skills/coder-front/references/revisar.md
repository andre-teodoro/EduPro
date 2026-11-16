# Processo do comando `/revisar`

Processo completo executado quando o usuário digita `/revisar [caminho-opcional]`. A checklist resumida vive no `SKILL.md`; este arquivo é o processo real — ordem das checagens, como verificar cada uma, e o formato do relatório.

## 1. Resolver o escopo

- **Sem argumento** (`/revisar`): escopo = arquivos com mudança em `app/**` (e `server/**` quando aplicável). Rode `git status --porcelain -- app server` na raiz do repo (staged + unstaged). Se vazio, avise o usuário e pergunte o que revisar em vez de seguir sem escopo.
- **Com caminho** (`/revisar app/modules/character`): escopo = todos os arquivos `.ts`/`.vue` relevantes dentro do caminho, recursivamente, **independente** do git status.

Agrupe os arquivos do escopo por área de domínio (o nome do módulo em `app/modules/<nome>/` onde o arquivo vive, ou `core/` para o que é genérico) antes de checar — os achados do relatório final também são agrupados assim.

## 2. Blocos de checagem (nesta ordem)

### A. Arquitetura em camadas

- HTTP só acontece em `repositories/`, `adapters/` ou `generated/` (Kubb, se habilitado) — grep por `axios(` / `fetch(` fora dessas pastas no escopo.
- Sem `any` no contrato com API (tipos de request/response).
- Repository não é singleton global compartilhando estado entre requisições.
- Cada arquivo está na camada certa (`resolvers/`, `composables/`, `components/`, `views/`, etc. — ver `references/camadas.md`).

### B. PrimeVue / Props sobre Classes

- Sem HTML puro (`<button>`, `<input>`, `<table>`, `<select>`) onde existe componente PrimeVue equivalente.
- Sem `class="p-button-outlined p-button-danger"` etc. em vez de props (`outlined`, `severity`) — classes PrimeFlex (`flex`, `gap-2`) são OK.
- Sem `panel-style="..."` como string — precisa ser `:panel-style="{ maxHeight: '...' }"` (objeto).
- Sem uso de componente/prop descontinuado na v5 sem necessidade — ver tabela de migração em `references/primevue-mcp.md` (ex: `Calendar`, `Dropdown`, `OverlayPanel`, `TabView`, `AccordionTab`, `InputSwitch`, `Chips`/`InputChips`).

### C. i18n — condicional

**Só aplique este bloco se a área revisada já usa i18n** (tem pasta `lang/`) **ou** o pedido que originou o `/revisar` mencionou i18n explicitamente. Caso contrário, marque como N/A e não gere achado.

- Toda chave nova existe em **todos** os locales obrigatórios — confira quais em `app/core/i18n/locales/` (hoje `pt-BR`, `es`) e nos `lang/<locale>.ts` da área.
- Sem string visível ao usuário hardcoded em template — sempre `t('chave')`.
- Sem `t()`/`useI18n()` dentro de `enums/` ou `resolvers/` — essas camadas retornam chave, não texto traduzido.
- Chave genérica/reaproveitável (`selecione`, `filtrar`, `status`, etc.) está em `common.*`, não em `lang/<área>` — checklist "Common vs Área de domínio" em `references/i18n.md`.

### D. Convenções de nome

Contra a tabela de `references/convencoes.md` (`<Entidade>Repository`, `Resolve<Algo>`, `use<Algo>Store`, `use<Algo>` composable, etc.).

### E. Testes e cobertura — condicional

**Só aplique este bloco se a área revisada já usa testes** (tem pasta `__tests__/`) **ou** o pedido que originou o `/revisar` pediu explicitamente para adicionar testes. Caso contrário, marque como N/A e não gere achado obrigatório.

1. **Existência**: confirme teste em `__tests__/<camada>/<Nome>.test.ts`, espelhando a árvore de produção (nunca co-localizado) — convenção completa em `references/testes.md`.
2. **Suíte passa**: rode `pnpm run test` (escopo total; usar `-- <pattern>` só se quiser feedback rápido de um arquivo específico antes do passo 3) — precisa passar limpo, sem unhandled rejections.
3. **Cobertura ≥95% por arquivo**: rode `pnpm run test:coverage` **sempre completo** (rodar escopado com `--` dá números incorretos para arquivos fora do subset executado nessa run). O `vitest.config.ts` já tem `coverage.thresholds` com `perFile: true` a 95% — se o comando sair com erro, é sinal de achado, mas o relatório deve listar especificamente os arquivos **do escopo revisado** que estão abaixo; débito de cobertura pré-existente fora do escopo revisado é mencionado à parte (não bloqueia o achado deste bloco).
4. Composable que chama hook `generated/` (Kubb) deve ser testado via MirageJS real (`app/core/mocks/testServer.ts`) — **nunca** `vi.mock('.../generated', ...)` (mascara bugs reais de integração).
5. Branch genuinamente inalcançável pela API pública: em `.ts`, checar que usa `/* v8 ignore next N -- motivo */` pontual (não exclusão do arquivo inteiro); em `.vue` com muitos campos `v-model`, `coverage.exclude` no `vitest.config.ts` com comentário explicando é aceitável (exceção reconhecida, ver `references/testes.md`). Qualquer outro padrão de "excluir pra facilitar" é achado.

**Resolver/composable sem teste correspondente, ou qualquer arquivo do escopo revisado abaixo de 95% em alguma métrica, é achado obrigatório de correção — mas só quando este bloco se aplica (ver condição acima).**

### F. Anti-patterns

Percorra a checklist de anti-patterns já presente no `SKILL.md` (seção "Anti-patterns evitados"), respeitando as condições "se o código usa i18n/testes/Kubb" onde aplicável.

## 3. Formato do relatório

Markdown, uma seção por bloco (A–F). Em cada bloco, um item por linha: `✅`/`❌`/`⚠️`/`N/A` + descrição curta + `arquivo:linha` quando aplicável. `❌` = achado obrigatório de correção; `⚠️` = melhoria sugerida, não bloqueante; `N/A` = bloco condicional (C ou E) que não se aplica a este escopo.

Termine com:

- Resumo: contagem de ✅/❌/⚠️/N/A.
- Se houver algum ❌: pergunte ao usuário se quer que sejam corrigidos agora. **Não corrija automaticamente** sem essa confirmação — `/revisar` é primariamente diagnóstico. Exceção: se o próprio pedido que invocou `/revisar` já pediu explicitamente "revisar e corrigir", pode corrigir direto e relatar o que foi feito (mesmo formato, com uma coluna extra indicando o que foi corrigido).
