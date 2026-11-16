# EduPro

[![GitHub Pages](https://github.com/andre-teodoro/EduPro/actions/workflows/pages.yml/badge.svg)](https://github.com/andre-teodoro/EduPro/actions/workflows/pages.yml)
[![Demo online](https://img.shields.io/badge/Demo-online-2563eb?logo=githubpages&logoColor=white)](https://andre-teodoro.github.io/EduPro/)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)](https://andre-teodoro.github.io/EduPro/vue/)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://andre-teodoro.github.io/EduPro/react/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[English](#english) | [Português](#português)

## English

A school management portfolio application with two equivalent implementations in **Vue 3** and **React**, built with TypeScript and Vite.

This is a demonstration project.

### Live demo

**[Open EduPro](https://andre-teodoro.github.io/EduPro/)**

- [Explore the Vue version](https://andre-teodoro.github.io/EduPro/vue/)
- [Explore the React version](https://andre-teodoro.github.io/EduPro/react/)

Click **Try the demo** on the login page to explore the application with fictional data. Changes stay in your browser; both versions share data and language and theme preferences.

### Getting started

Requires Node.js 24 and pnpm 12.11.2.

The pnpm version is pinned in `packageManager`. To activate it through Corepack, run `corepack enable` and `corepack prepare pnpm@12.11.2 --activate` in your environment.

```sh
pnpm install --frozen-lockfile
pnpm dev:vue
pnpm dev:react
```

Vue: `http://127.0.0.1:5173`. React: `http://127.0.0.1:5174`.

```sh
pnpm test
pnpm build
pnpm preview
```

The combined preview runs at `http://localhost:4173`, with a version selector at the root and the applications under `/vue/` and `/react/`.

The landing page also supports Portuguese, English and Spanish, sharing the language preference with both apps. English is the default when no preference has been saved.

The development servers use different ports, so they **do not share localStorage with each other**. To test data continuity between Vue and React, use the combined build preview: both versions run on the same origin, just as they do on GitHub Pages. Storage keys use the `edupro:` prefix to avoid interfering with other projects hosted on the same domain.

### Project structure

```text
apps/vue/              Vue Router, Pinia, vue-i18n, VueUse and Vue components
apps/react/            React Router, Zustand, react-i18next, ReactUse and React components
packages/core/         Storage contract and JSON adapter, independent of frameworks and domains
packages/data/         Shared, immutable JSON fixtures
packages/domain/       School types, validation, repositories and pure selectors
packages/presentation/ Shared presentation resolvers and pure view models
packages/ui/           Shared tokens, responsive styles and translations
e2e/                   End-to-end tests for both versions
```

Data access goes through `SchoolRepository`. Framework-specific stores receive persisted snapshots; components do not access the stored collection directly. Visual preferences use VueUse/ReactUse, while school data uses the shared adapter. The core does not import frameworks, stores, styles or school business rules. The UI package shares CSS, translation resources and login styles; Vue and React components remain in their respective apps.

Both apps are organized into `auth`, `dashboard`, `courses`, `subjects`, `students`, `enrollments` and `notifications` modules. Each domain has its own resolver entry points and store; modules that write data also have their own repositories. Reusable lists, forms and details live in `src/components/records/`. The root data store synchronizes the persisted snapshot without taking over module actions. Shared resolvers in `packages/presentation/` prepare view models and return translation keys; components do not assemble school entity relationships.

Integrity rules in `packages/domain/src/resolvers/` are pure and shared. `SchoolRepository` applies them before persisting each transaction. Both implementations maintain the same module organization, workflows and layout, with adapters specific to Pinia/Vue and Zustand/React.

`pnpm-workspace.yaml` defines the workspaces and the catalog of versions used by both apps. Internal dependencies use `workspace:*`; common dependencies use `catalog:` and are declared by each consumer. Shared development tools live in the root `package.json`, with a single workspace lockfile.

The initial read uses the JSON fixtures. The first change saves a validated, versioned snapshot under `edupro:school:v1`. The repository applies the rules before writing the entire snapshot, avoiding partial student, enrollment or confirmation records. Read/write failures are shown to the user. Invalid local data is not silently overwritten; explicitly resetting the demo restores the sample data.

### Features

- Dashboard with metrics, active enrollments by course and recent enrollments.
- Courses and subjects: create, edit, delete and view details; subjects can belong to multiple courses.
- Students: register with at least one course, edit, delete, search by name/CPF/email and filter by course.
- Enrollments: create, list, filter by course/status, suspend and reactivate.
- Confirmations: email previews created alongside new enrollments, with local history.
- Search, pagination, card/list views, light/dark/system themes and data reset.
- Mobile: compact header, navigation drawer with focus management and card layouts.
- Portuguese, English and Spanish selectors in both apps, available in the sidebar, mobile menu and login page. English is the default without a saved preference. The preference is stored under `edupro:locale`; the interface, validation messages, dates and numbers update without reloading. User-entered data keeps its original content.

### Business rule decisions

- Students must have an email address to populate the enrollment confirmation required by the challenge.
- CPF, the Brazilian individual taxpayer identifier, is normalized, validated using its check digits and unique.
- A student can have only one enrollment per course. Suspended enrollments are reactivated rather than duplicated.
- A course with any linked enrollment, active or suspended, cannot be deleted.
- A subject must belong to at least one course. The challenge's reference to multiple courses is interpreted as support for multiple associations, not a minimum of two.
- Deleting a course without enrollments removes its subject associations. If a subject would be left without a course, deletion is blocked until the curriculum is reorganized.
- Deleting a student removes their enrollments and confirmations after user confirmation.
- Reactivation keeps the original enrollment date; confirmations are generated on creation, with no real email delivery.
- Resetting affects both versions on the same origin and preserves theme preferences and data belonging to other applications.

### Demo limitations

There is no backend, real authentication or email delivery. All data is fictional and stays in the browser. Do not enter real personal information. Local storage does not provide confidentiality or cross-device synchronization. Changes in other tabs are refreshed through storage events and when the window regains focus; concurrent edits use the last write, with no conflict resolution.

In both versions, `/login` demonstrates validation, password visibility, sign-in, sign-out and returning to the requested route. **Try the demo** uses fictional credentials. Any valid fictional email and non-empty password can also be used, following the reference example. Only the email is stored in `sessionStorage`, under a separate key for each implementation (`edupro:vue:session` and `edupro:react:session`); passwords are never persisted. The tab session and router guard demonstrate navigation only and do not secure data. Signing out does not delete saved school data.

### Verification

```sh
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format:check
```

Domain tests cover persistence, fixtures, corrupted/unavailable storage, student validation, relationship integrity, deletions and duplicate enrollments. Playwright tests exercise real workflows, persistence after reload, shared data between versions and mobile layouts without horizontal overflow.

Playwright uses an installed Microsoft Edge browser in an isolated context. Without Edge, install Chromium with `pnpm exec playwright install chromium` and remove `channel: 'msedge'` from `playwright.config.ts`, or run `pnpm exec playwright install msedge` to keep the current configuration. The Pages CI runs domain tests, type checks and builds; browser tests run locally and require an up-to-date build.

### GitHub Pages

The build generates `dist/index.html`, `dist/vue/` and `dist/react/`. Assets use relative base paths and the routers use hash routing, allowing direct links and page reloads without server rewrites.

The `.github/workflows/pages.yml` workflow installs dependencies, runs tests and builds, and publishes `dist` on pushes to `main` or manual runs. In the GitHub repository, select **Settings → Pages → Source → GitHub Actions**. Adjust the branch name in the workflow if necessary. The published demo is available through the links at the top of this README.

---

## Português

Aplicação de gestão escolar para portfólio, com duas implementações equivalentes em **Vue 3** e **React**, usando TypeScript e Vite.

Este projeto não é um produto.

### Demonstração

**[Acessar o EduPro](https://andre-teodoro.github.io/EduPro/)**

- [Explorar a versão Vue](https://andre-teodoro.github.io/EduPro/vue/)
- [Explorar a versão React](https://andre-teodoro.github.io/EduPro/react/)

Use **Try the demo** na tela de login para experimentar com dados fictícios. As alterações ficam apenas no navegador; as duas versões compartilham os dados e as preferências de idioma e tema.

### Executar

Requer Node.js 24 e pnpm 12.11.2.

A versão do pnpm está fixada em `packageManager`. Se precisar ativá-la via Corepack, execute `corepack enable` e `corepack prepare pnpm@12.11.2 --activate` no seu ambiente.

```sh
pnpm install --frozen-lockfile
pnpm dev:vue
pnpm dev:react
```

Vue: `http://127.0.0.1:5173`. React: `http://127.0.0.1:5174`.

```sh
pnpm test
pnpm build
pnpm preview
```

O preview completo fica em `http://localhost:4173`, com seletor de versão na raiz e aplicações em `/vue/` e `/react/`.

A página de entrada também permite escolher português, inglês ou espanhol e compartilha a preferência de idioma com os dois apps. Sem preferência salva, ela abre em inglês.

Os servidores de desenvolvimento usam portas diferentes e, portanto, **não compartilham localStorage entre si**. Para testar a continuidade dos dados entre Vue e React, use o preview do build: ambas as versões ficam na mesma origem, assim como no GitHub Pages. Chaves têm prefixo `edupro:` para não interferir nos dados de outros projetos hospedados no mesmo domínio.

### Organização

```text
apps/vue/          Vue Router, Pinia, vue-i18n, VueUse e componentes Vue
apps/react/        React Router, Zustand, react-i18next, ReactUse e componentes React
packages/core/     Contrato de storage e adapter JSON, sem framework ou domínio
packages/data/     JSONs iniciais fictícios e imutáveis
packages/domain/   Tipos escolares, validações, repositories e seletores puros
packages/presentation/ Resolvers de apresentação e modelos puros reutilizados
packages/ui/       Tokens, estilos responsivos e mensagens compartilhadas
e2e/               Testes de fluxo das duas versões
```

O acesso aos dados passa por `SchoolRepository`. Stores específicas de cada framework recebem os snapshots persistidos; componentes não acessam a coleção no storage diretamente. A preferência visual usa VueUse/ReactUse, enquanto os dados escolares usam o adapter compartilhado. O core não importa frameworks, stores, estilos ou regras escolares. O pacote UI compartilha CSS, recursos de idioma e estilos de login, sem compartilhar componentes Vue/React.

Vue e React estão organizados em módulos `auth`, `dashboard`, `courses`, `subjects`, `students`, `enrollments` e `notifications`. Cada domínio mantém seus resolvers e store; módulos que gravam dados também possuem repositories próprios. Listagens, formulários e detalhes reutilizáveis ficam em `src/components/records/`. O store de dados na raiz sincroniza o snapshot persistido, sem concentrar as ações dos módulos. Os resolvers compartilhados em `packages/presentation/` preparam os modelos de apresentação e retornam chaves de tradução; componentes não montam relacionamentos escolares.

As regras de integridade em `packages/domain/src/resolvers/` são puras e compartilhadas. `SchoolRepository` as utiliza antes de persistir cada transação. As duas implementações mantêm a mesma organização modular, os mesmos fluxos e o mesmo layout, com adaptadores específicos para Pinia/Vue e Zustand/React.

`pnpm-workspace.yaml` define os workspaces e o catálogo das versões usadas por ambos os apps. Dependências internas usam `workspace:*`; dependências comuns usam `catalog:` e continuam declaradas por cada consumidor. As ferramentas de desenvolvimento comuns ficam no `package.json` da raiz, com um lockfile compartilhado.

A primeira leitura usa os JSONs. A primeira alteração grava um snapshot validado e versionado na chave `edupro:school:v1`. O repository aplica as regras antes de gravar o snapshot inteiro, evitando cadastro parcial de aluno, matrícula ou confirmação. Falhas de leitura/gravação são apresentadas ao usuário. Dados locais inválidos não são silenciosamente substituídos; a restauração explícita recupera a demonstração.

### Funcionalidades

- Painel com indicadores, distribuição de matrículas ativas e vínculos recentes.
- Cursos e disciplinas: cadastro, edição, exclusão e detalhes; disciplinas podem pertencer a vários cursos.
- Alunos: cadastro com pelo menos um curso, edição, exclusão, busca por nome/CPF/e-mail e filtro por curso.
- Matrículas: criação, listagem, filtro por curso/situação, trancamento e reativação.
- Confirmações: prévias de e-mail geradas junto com novas matrículas, com histórico local.
- Busca, paginação, cartões/lista, tema claro/escuro/sistema e restauração dos dados.
- Mobile: cabeçalho compacto, menu lateral com controle de foco e listagens em cartões.
- Vue e React com seletor de português, inglês e espanhol na sidebar, no menu mobile e no login. Sem preferência salva, o idioma inicial é inglês. A preferência fica em `edupro:locale`; interface, validações, datas e números acompanham a troca sem recarregar. Dados cadastrados mantêm seu conteúdo original.

### Decisões sobre regras em aberto

- O aluno tem e-mail obrigatório para preencher a confirmação prevista no desafio.
- CPF é normalizado, validado pelos dígitos verificadores e único.
- Um aluno só pode ter um vínculo por curso. Matrícula trancada é reativada, em vez de duplicada.
- Curso com qualquer matrícula vinculada, ativa ou trancada, não pode ser excluído.
- Uma disciplina precisa de pelo menos um curso; a referência a múltiplos cursos no desafio é interpretada como capacidade de associação, não mínimo obrigatório de dois.
- Ao excluir um curso sem matrículas, seus vínculos com disciplinas são removidos. Se uma disciplina ficaria sem curso, a exclusão é bloqueada até reorganizar a matriz.
- Excluir um aluno remove suas matrículas e confirmações, após confirmação do usuário.
- Reativar mantém a data original do vínculo; confirmação é gerada na criação, sem envio real.
- A restauração afeta as duas versões na mesma origem e preserva preferências de tema e dados de outros aplicativos.

### Limites da demonstração

Não há backend, autenticação real ou envio de e-mail. Todos os dados são fictícios e ficam no navegador. Não use informações pessoais reais. Armazenamento local não oferece confidencialidade ou sincronização entre dispositivos. Alterações em abas distintas são atualizadas pelo evento de storage e ao retomar o foco; edições simultâneas usam a última gravação, sem resolução de conflitos.

Nas duas versões, `/login` demonstra validação, exibição de senha, entrada, saída e retorno à rota solicitada. O botão **Entrar na demonstração** preenche um acesso fictício. Também é possível usar qualquer e-mail fictício válido e senha não vazia, como no exemplo de referência. Somente o e-mail fica em `sessionStorage`, com uma chave por implementação (`edupro:vue:session` e `edupro:react:session`); a senha não é persistida. Essa sessão da aba e o guard do router servem apenas para demonstrar navegação, sem proteção de dados. Sair não apaga os dados escolares salvos.

### Verificação

```sh
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format:check
```

Os testes de domínio cobrem persistência, seed, corrupção/falha do storage, validação de aluno, integridade de vínculos, exclusões e matrícula duplicada. Os testes Playwright verificam fluxos reais, persistência após reload, compartilhamento de dados entre versões e mobile sem overflow horizontal.

Playwright usa Microsoft Edge instalado, em contexto isolado. Em ambientes sem Edge, instale Chromium com `pnpm exec playwright install chromium` e remova `channel: 'msedge'` de `playwright.config.ts`, ou execute `pnpm exec playwright install msedge` para manter a configuração. O CI de Pages executa testes de domínio, tipagem e build; os testes de navegador são locais e precisam do build atualizado.

### GitHub Pages

O build gera `dist/index.html`, `dist/vue/` e `dist/react/`. Assets usam base relativa e os roteadores usam hash, permitindo abertura direta e reload de links internos sem rewrites.

O workflow `.github/workflows/pages.yml` instala dependências, executa testes e build, e publica o diretório `dist` ao receber push em `main` ou execução manual. No repositório GitHub, selecione **Settings → Pages → Source → GitHub Actions**. Ajuste o nome da branch no workflow se necessário. A demonstração publicada está disponível nos links no início deste README.
