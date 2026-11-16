# EduPro

[![GitHub Pages](https://github.com/andre-teodoro/EduPro/actions/workflows/pages.yml/badge.svg)](https://github.com/andre-teodoro/EduPro/actions/workflows/pages.yml)
[![Demo online](https://img.shields.io/badge/Demo-online-2563eb?logo=githubpages&logoColor=white)](https://andre-teodoro.github.io/EduPro/)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)](https://andre-teodoro.github.io/EduPro/vue/)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://andre-teodoro.github.io/EduPro/react/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Aplicação de gestão escolar para portfólio, com duas implementações equivalentes em **Vue 3** e **React**, usando TypeScript e Vite.

Este projeto não é um produto.

## Demonstração

**[Acessar o EduPro](https://andre-teodoro.github.io/EduPro/)**

- [Explorar a versão Vue](https://andre-teodoro.github.io/EduPro/vue/)
- [Explorar a versão React](https://andre-teodoro.github.io/EduPro/react/)

Use **Try the demo** na tela de login para experimentar com dados fictícios. As alterações ficam apenas no navegador; as duas versões compartilham os dados e as preferências de idioma e tema.

## Executar

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

Os servidores de desenvolvimento usam portas diferentes e, portanto, **não compartilham localStorage entre si**. Para testar a continuidade dos dados entre Vue e React, use o preview do build: ambas as versões ficam na mesma origem, assim como no GitHub Pages. Chaves têm prefixo `edupro:` para não interferir nos dados de outros projetos hospedados no mesmo domínio.

## Organização

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

## Funcionalidades

- Painel com indicadores, distribuição de matrículas ativas e vínculos recentes.
- Cursos e disciplinas: cadastro, edição, exclusão e detalhes; disciplinas podem pertencer a vários cursos.
- Alunos: cadastro com pelo menos um curso, edição, exclusão, busca por nome/CPF/e-mail e filtro por curso.
- Matrículas: criação, listagem, filtro por curso/situação, trancamento e reativação.
- Confirmações: prévias de e-mail geradas junto com novas matrículas, com histórico local.
- Busca, paginação, cartões/lista, tema claro/escuro/sistema e restauração dos dados.
- Mobile: cabeçalho compacto, menu lateral com controle de foco e listagens em cartões.
- Vue e React com seletor de português, inglês e espanhol na sidebar, no menu mobile e no login. Sem preferência salva, o idioma inicial é inglês. A preferência fica em `edupro:locale`; interface, validações, datas e números acompanham a troca sem recarregar. Dados cadastrados mantêm seu conteúdo original.

## Decisões sobre regras em aberto

- O aluno tem e-mail obrigatório para preencher a confirmação prevista no desafio.
- CPF é normalizado, validado pelos dígitos verificadores e único.
- Um aluno só pode ter um vínculo por curso. Matrícula trancada é reativada, em vez de duplicada.
- Curso com qualquer matrícula vinculada, ativa ou trancada, não pode ser excluído.
- Uma disciplina precisa de pelo menos um curso; a referência a múltiplos cursos no desafio é interpretada como capacidade de associação, não mínimo obrigatório de dois.
- Ao excluir um curso sem matrículas, seus vínculos com disciplinas são removidos. Se uma disciplina ficaria sem curso, a exclusão é bloqueada até reorganizar a matriz.
- Excluir um aluno remove suas matrículas e confirmações, após confirmação do usuário.
- Reativar mantém a data original do vínculo; confirmação é gerada na criação, sem envio real.
- A restauração afeta as duas versões na mesma origem e preserva preferências de tema e dados de outros aplicativos.

## Limites da demonstração

Não há backend, autenticação real ou envio de e-mail. Todos os dados são fictícios e ficam no navegador. Não use informações pessoais reais. Armazenamento local não oferece confidencialidade ou sincronização entre dispositivos. Alterações em abas distintas são atualizadas pelo evento de storage e ao retomar o foco; edições simultâneas usam a última gravação, sem resolução de conflitos.

Nas duas versões, `/login` demonstra validação, exibição de senha, entrada, saída e retorno à rota solicitada. O botão **Entrar na demonstração** preenche um acesso fictício. Também é possível usar qualquer e-mail fictício válido e senha não vazia, como no exemplo de referência. Somente o e-mail fica em `sessionStorage`, com uma chave por implementação (`edupro:vue:session` e `edupro:react:session`); a senha não é persistida. Essa sessão da aba e o guard do router servem apenas para demonstrar navegação, sem proteção de dados. Sair não apaga os dados escolares salvos.

## Verificação

```sh
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format:check
```

Os testes de domínio cobrem persistência, seed, corrupção/falha do storage, validação de aluno, integridade de vínculos, exclusões e matrícula duplicada. Os testes Playwright verificam fluxos reais, persistência após reload, compartilhamento de dados entre versões e mobile sem overflow horizontal.

Playwright usa Microsoft Edge instalado, em contexto isolado. Em ambientes sem Edge, instale Chromium com `pnpm exec playwright install chromium` e remova `channel: 'msedge'` de `playwright.config.ts`, ou execute `pnpm exec playwright install msedge` para manter a configuração. O CI de Pages executa testes de domínio, tipagem e build; os testes de navegador são locais e precisam do build atualizado.

## GitHub Pages

O build gera `dist/index.html`, `dist/vue/` e `dist/react/`. Assets usam base relativa e os roteadores usam hash, permitindo abertura direta e reload de links internos sem rewrites.

O workflow `.github/workflows/pages.yml` instala dependências, executa testes e build, e publica o diretório `dist` ao receber push em `main` ou execução manual. No repositório GitHub, selecione **Settings → Pages → Source → GitHub Actions**. Ajuste o nome da branch no workflow se necessário. Nenhum repositório remoto ou publicação foi criado automaticamente.
