---
name: coder-front
description: >
  Desenvolva aplicações frontend com Vue 3, TypeScript, Vite, Pinia, Vue Router e arquitetura em camadas.

  DIRETRIZES DE ESCOPO:
  1. Atue em `./src/**` numa SPA Vue 3 + TypeScript executada pelo Vite.
  2. `src/core/` é a base genérica compartilhada; não coloque regras de contatos ali.
  3. Use um único `createApp()` em `src/main.ts`, Vue Router em `src/router/` e Pinia para estado compartilhado.
  4. Use Tailwind CSS e shadcn-vue para a interface deste projeto. Não use PrimeVue. Preserve HTML semântico, acessibilidade e identidade visual própria.

  Este skill descreve o projeto Vite atual. Instruções e exemplos históricos abaixo que mencionem Nuxt, PrimeVue, ComfyUI, BFF ou `app/` não se aplicam a este projeto. A regra de comentários desta seção prevalece sobre qualquer exemplo legado.

  DIRETRIZES TÉCNICAS:
  - PRIORIZE ACESSIBILIDADE (WCAG) e usabilidade em todos os componentes.
  - Siga arquitetura proporcional (Repository/API → Store/Composable → View/Component), conforme `references/arquitetura-aplicacao.md`.
  - Garanta tipagem estrita com TypeScript (sem `any`).
  - Aplique o Clean Code e design patterns de frontend sempre que possível, sem introduzir abstrações especulativas.
  - Mantenha o código modular (por responsabilidade/domínio) e testável.
  - Use pnpm como gerenciador de pacotes, com workspaces e scripts definidos em `package.json`.
  - Use shadcn-vue (não o pacote shadcn para React) e Tailwind CSS. Componentes gerados ficam no projeto e podem ser adaptados às necessidades da interface.
  - A API deste teste é mockada localmente; mantenha o acesso aos dados isolado em repositories.
  - Não adicione comentários triviais. Comente apenas motivos, limitações ou efeitos não óbvios que não possam ser expressos claramente pelo código.

  Orienta desenvolvimento Vue 3 + TypeScript em Vite com Pinia, Vue Router e arquitetura simples em camadas.

triggers:
  - 'criar componente'
  - 'novo componente'
  - 'tela'
  - 'formulário'
  - 'tabela'
  - 'botão'
  - 'input'
  - 'modal'
  - 'listagem'
  - 'UI'
  - 'front'
  - 'vue'
  - 'vite'
  - 'component'
  - 'kubb'
  - 'api'
  - 'bff'
  - 'server route'
  - 'comfyui'
  - 'hook'
  - 'repositório'
  - 'resolver'
  - 'composable'
  - 'store'
  - 'arquitetura'
  - 'camadas'
  - 'frontend'
  - 'vue-template'
  - 'template'
  - 'scss'
  - 'layout'
  - 'tema'
  - 'theme'
  - 'primevue'
  - 'i18n'
  - 'tradução'
  - 'idioma'
  - 'locale'
  - 'lang'
  - 'internacionalização'
  - 'teste'
  - 'testes'
  - 'vitest'
---

# Padrão de Desenvolvimento Frontend (Vue 3 / TypeScript / Vite / Pinia / Vue Router)

Implemente uma SPA Vue 3 com TypeScript, Vite, Pinia e Vue Router. Mantenha tipagem estrita, acessibilidade, componentes focados e lógica de dados fora da UI. Use arquitetura adequada ao tamanho do teste, sem criar abstrações desnecessárias.

## Contexto legado (não aplicável a este projeto)

O texto histórico a seguir descreve outra aplicação. Para este repositório, valem as regras Vite na seção de escopo; não use as instruções abaixo sobre Nuxt, PrimeVue ou ComfyUI.

| Contexto antigo (`coder-front` original)                    | Este projeto                                               |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| Aplicação grande, múltiplos módulos                         | Uma única aplicação Nuxt 4                                 |
| Cada módulo tinha bootstrap próprio (`createApp().mount()`) | Nuxt cria e monta a app — não existe `createApp.ts` custom |
| Ciclo de vida por módulo (`main.ts`, registro independente) | Nuxt possui o ciclo de vida da aplicação inteira           |
| Roteador agregando `modules/*/router/routes.ts` via glob    | `app/pages/` (file-based routing do Nuxt)                  |
| SPA pura, sem servidor próprio                              | Nuxt server/BFF (`server/`) fala com o ComfyUI             |
| `src/` como raiz de código-fonte                            | `app/` como raiz de código-fonte (convenção Nuxt 4)        |

**Não recrie o bootstrap/ciclo de vida independente por módulo.** Se você se pegar prestes a criar um `createApp().mount()` próprio, um agregador de rotas via glob, um registro de i18n próprio por módulo ou qualquer coisa que reproduza o ciclo de vida de aplicação independente do `coder-front` original — pare. Isso é o que foi removido nesta adaptação.

**Isso não proíbe `app/modules/<nome>/`.** Agrupar código por domínio numa pasta própria (`app/modules/<nome>/{components,composables,repositories,resolvers,types,...}`) é o padrão preferido deste projeto — é só organização de arquivos, sem bootstrap, sem registro de rotas via glob e sem ciclo de vida próprio. Ver `references/arquitetura-aplicacao.md` § 2.3.

## Regras de escopo (não negociáveis)

1. Trabalhe em `./src/**` e mantenha `src/core/` agnóstico de domínio.
2. Use uma única aplicação Vue; registre Pinia e Vue Router em `src/main.ts`.
3. Declare navegação em `src/router/`; não gere rotas dinamicamente sem necessidade.
4. Construa a interface com Tailwind CSS e componentes shadcn-vue; não adicione PrimeVue.
5. Mantenha acesso HTTP em repositories; stores coordenam estado e componentes apresentam a interface.
6. Não escreva comentários que apenas repetem o nome/operação do código ou narrem passos óbvios. Prefira nomes claros. Comente somente decisões, restrições ou efeitos colaterais não evidentes.

---

## i18n, testes e Kubb são opcionais

Por padrão, este projeto **não usa** vue-i18n, Vitest nem Kubb — as pastas correspondentes (`app/core/i18n/`, `app/core/kubb/`, `app/core/mocks/`, qualquer `__tests__/`) existem prontas em `app/core` mas ficam inertes (sem dependências instaladas) até serem ativadas.

**Regra**: só crie/instale/configure um desses três recursos quando o pedido do usuário mencionar isso explicitamente ("adicionar i18n", "criar testes para X", "configurar kubb em Y"). Ao implementar uma tela/componente/área de domínio comum, **não** adicione `lang/`, `__tests__/` ou `docs/api.yaml`/`generated/` por conta própria, e não trate a ausência deles como pendência.

Cada pasta opcional em `app/core/` tem um `_OPCIONAL.md` com o passo a passo de ativação (dependências a instalar, o que ligar em `app/plugins/*.ts`). Ao ativar, siga também a referência correspondente: `references/i18n.md`, `references/testes.md`, `references/kubb-dependencias.md`.

> Nota (DEFERRED): no `coder-front` original, essas pastas ficavam fora do build via `exclude` num `tsconfig.app.json` mantido à mão. Neste projeto Nuxt 4, `tsconfig.app.json` é gerado automaticamente (`.nuxt/tsconfig.app.json`) a cada `nuxt prepare`/`dev` — não há hoje um mecanismo equivalente de gating (o candidato natural seria `typescript.tsConfig.exclude` em `nuxt.config.ts`, mas isso não foi implementado, pois não há sequer um script de typecheck configurado ainda). Trate isso como uma decisão em aberto, não como algo quebrado — só vira relevante quando alguém configurar typecheck/CI.

---

## Interface visual

Use Tailwind CSS para layout, espaçamento e estilos, e shadcn-vue para componentes acessíveis cuja implementação fica no repositório. Importe somente os componentes necessários e ajuste-os ao design da aplicação; não use tema PrimeVue nem misture bibliotecas de componentes sem necessidade.

---

## Comandos Disponíveis

### `/revisar [caminho-opcional]`

Revisa código frontend contra **todas as regras da skill**.

**Uso:**

```bash
/revisar                       # Revisa arquivos modificados
/revisar app/modules/character # Revisa uma área de domínio específica
/revisar app/components        # Revisa uma pasta
```

**O que verifica:**

- ✅ Componentes shadcn-vue quando adequados e HTML semântico nos demais casos
- ✅ Tailwind para layout, responsividade e estilos locais
- ✅ Arquitetura em camadas (Repository → Resolver → Store → Component)
- ✅ Tipagem estrita com TypeScript (sem `any`)
- ✅ Organização de arquivos e convenções de nome
- ✅ Se o código usa i18n: chaves de tradução atualizadas em todos os idiomas, nunca hardcoded em templates
- ✅ Resolvers e enums retornam chaves, não textos traduzidos (quando i18n está em uso)
- ✅ Sem `useI18n()` / `t()` dentro de `enums/` ou `resolvers/`
- ✅ Se testes estiverem configurados: verifique apenas os testes solicitados
- ✅ Todos os anti-patterns evitados

Processo completo (resolução de escopo, ordem das checagens, como verificar cada bloco e formato do relatório): `references/revisar.md`.

---

## Componentes shadcn-vue e Tailwind

Use props e variantes fornecidas pelos componentes shadcn-vue. Use classes Tailwind para layout, responsividade e ajustes visuais. Adicione somente os componentes necessários com `pnpm dlx shadcn-vue@latest add <componente>`.

---

## Roteamento por situação

| Quando você está                                                                                                                                     | Leia antes de codar                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Consultar componentes de interface                                                                                                                   | Documentação do shadcn-vue e `components.json` |
| Configurar Kubb numa área de domínio (opcional), mexer em `generated/`, `docs/api.yaml`                                                              | `references/kubb-dependencias.md`              |
| Entender a estrutura de pastas da aplicação, fluxo Repository→Store→Component, papel de `app/core` vs. domínio                                       | `references/arquitetura-aplicacao.md`          |
| Implementar tipos, repository, resolver, filtros, service, store, composable, view, etc.                                                             | `references/camadas.md`                        |
| Habilitar i18n no projeto, `lang/`, `common.*` vs `<área>.*`, PrimeVue i18n                                                                          | `references/i18n.md`                           |
| Dúvida de nome (`<Algo>Repository`, `use<Algo>Store`, etc.)                                                                                          | `references/convencoes.md`                     |
| Mapear como cada camada do `coder-front` original vira infraestrutura Nuxt (plugins, `useRuntimeConfig`, `server/`), e como o BFF fala com o ComfyUI | `references/ssr-nuxt.md`                       |
| Habilitar testes (Vitest), mock de `generated/`, convenção `__tests__/`                                                                              | `references/testes.md`                         |
| Rodar/entender o comando `/revisar`                                                                                                                  | `references/revisar.md`                        |

---

## Anti-patterns

- Componentes grandes que misturam chamadas de API, regras de negócio e renderização
- Lógica de domínio espalhada em componentes
- `fetch` direto em componentes ou stores sem passar por repository
- Tipagem fraca (`any`) nos contratos
- Comentários que apenas descrevem a linha seguinte ou narram passos óbvios
- Duplicar componentes já disponíveis em `src/components/ui/` sem motivo
- Colocar componentes Vue ou regras do domínio em `src/core/`
- Instalar PrimeVue ou outro kit visual junto com shadcn-vue sem necessidade concreta
- Adicionar i18n, testes ou Kubb sem solicitação explícita
- Usar um package manager diferente de pnpm neste projeto
