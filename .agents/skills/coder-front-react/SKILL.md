---
name: coder-front-react
description: Desenvolva e revise a versão React do app deste monorepo de portfólio com TypeScript, Vite, React Router, Zustand e react-i18next, preservando as camadas e o core reutilizável entre Vue e React. Use para telas, componentes, rotas, estado e internacionalização da aplicação React.
---

# Frontend React

## Contexto e escopo

Este monorepo tem duas versões do mesmo produto, Vue e React, publicadas no GitHub Pages para portfólio. A pasta vue_example/ contém o src de um teste anterior: consulte sua organização e contratos, sem copiar contatos, autenticação, telas ou regras daquele produto.

O workspace React fica em apps/react/ e os pacotes compartilhados ficam em packages/. Consulte as instruções e os scripts atuais antes de alterar a estrutura. Os caminhos src/ abaixo são relativos ao app React. Use pnpm e os scripts existentes, dependências internas com workspace:* e catalog: para versões comuns declaradas em pnpm-workspace.yaml. Cada consumidor declara suas dependências.

Esta skill define convenções: não exige criar o app, extrair o core ou instalar bibliotecas fora da tarefa solicitada. Preserve a referência Vue.

## Equivalências

| Vue | React |
| --- | --- |
| Vue 3 + TypeScript + Vite | React + TypeScript estrito + Vite |
| createApp em main.ts | Um createRoot em main.tsx, com StrictMode |
| Vue Router | React Router em src/router/ |
| Pinia / defineStore | Zustand / create<State>()(...) |
| Composables | Hooks use<Nome> |
| computed | Valores derivados; useMemo quando útil |
| vue-i18n / useI18n | i18next + react-i18next / useTranslation |
| shadcn-vue | shadcn/ui para React + Tailwind CSS |

Confira versões instaladas e documentação oficial ao configurar APIs. Não introduza Next.js, SSR, Nuxt ou PrimeVue numa SPA destinada ao Pages.

## Arquitetura

Leia [arquitetura](references/arquitetura.md) ao criar módulos, camadas ou integrar o core.

- Preserve Repository → Store/Hook → View/Component. Resolvers e services só entram quando a transformação ou regra justificar.
- HTTP e dados ficam em repositories atrás dos contratos do core; componentes não fazem fetch diretamente.
- Use componentes funcionais, imports explícitos e TypeScript estrito, sem any. Dados externos são unknown até validação ou estreitamento. Não copie os tipos fracos presentes na referência.
- Respeite as Rules of Hooks. Não use efeitos para calcular valores derivados nem execute efeitos colaterais na renderização.
- Efeitos devem ter cleanup e tratar respostas obsoletas. O ciclo extra do StrictMode não pode provocar operações destrutivas duplicadas; mutações de usuário pertencem a handlers.
- Comente somente motivos, restrições e efeitos não óbvios.

## Rotas, stores e traduções

Leia [rotas, estado e i18n](references/rotas-estado-i18n.md) ao configurar navegação, stores ou idiomas.

i18n faz parte do padrão solicitado: configure a integração quando criar o app. Numa tarefa restrita a outro assunto, não amplie o escopo para migrar todo o conteúdo. Os idiomas são pt-BR, en e es, com inglês como padrão sem preferência salva e a chave edupro:locale compartilhada. Reutilize recursos de packages/ui e os resolvers puros de packages/presentation, mantendo componentes e estado específicos de cada framework. O React usa módulos auth, dashboard, courses, subjects, students, enrollments e notifications; não reúna suas responsabilidades em um módulo school.

## UI e revisão

Use Tailwind e componentes shadcn/ui locais em src/components/ui/, com identidade visual própria. Preserve HTML semântico, labels, teclado, foco visível, contraste, responsividade e estados de carregamento, vazio e erro. Textos acessíveis também entram no i18n.

Ao revisar, use o diff ou caminho solicitado e reporte problemas concretos com arquivo, impacto e correção. Confira fronteiras do core, isolamento de dados, seletores, efeitos, rotas no Pages e paridade de traduções. Execute scripts existentes de tipagem, lint, build e testes relevantes; informe checks indisponíveis. Não configure uma suíte ou Kubb apenas por aplicar a skill.

Fontes oficiais: [React Router](https://reactrouter.com/start/declarative/routing), [Zustand](https://zustand.docs.pmnd.rs/reference/apis/create), [react-i18next](https://react.i18next.com/latest/usetranslation-hook).
