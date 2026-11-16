# EduPro

Monorepo pnpm com duas implementações equivalentes de uma demonstração de gestão escolar. O destino de publicação é GitHub Pages, sem backend. `README.md` documenta os fluxos e as decisões de negócio.

## Escopo

- `apps/vue/src/`: Vue 3, Pinia, Vue Router, vue-i18n e VueUse.
- `apps/react/src/`: React, Zustand, React Router, react-i18next e ReactUse.
- `packages/core/`: infraestrutura genérica em TypeScript, sem frameworks ou regras escolares.
- `packages/data/`: JSONs iniciais fictícios compartilhados.
- `packages/domain/`: tipos, validações, regras, repository e seletores escolares compartilhados.
- `packages/ui/`: estilos, tokens e mensagens comuns; componentes ficam nos respectivos apps.
- `packages/presentation/`: modelos, configurações de formulário e resolvers puros compartilhados, sem frameworks.
- `vue_example/`: referência original de arquitetura e layout; preserve seus arquivos e não importe dessa pasta nos apps.

Os caminhos `src/` mencionados nas skills são relativos ao workspace consumidor. A skill Vue possui referências históricas de Nuxt/PrimeVue e projetos anteriores: para este monorepo prevalecem o contexto atual e as escolhas acima. Não use `app/`, BFF, Pinia no React ou componentes de framework dentro do core.

## Implementação

Valide os ajustes de produto primeiro no Vue; aplique as mudanças equivalentes no React ao concluir os ajustes, conforme solicitado pelo usuário. Alterações em pacotes compartilhados afetam ambas as versões. Use layout e breakpoints do exemplo: sidebar desktop, drawer mobile, cartões em telas pequenas e painel de detalhes ao lado da lista em telas largas. Use Tailwind e componentes locais baseados em Radix/Reka no padrão shadcn.

Use pnpm na versão fixada em `packageManager`, workspaces declarados em `pnpm-workspace.yaml`, `workspace:*` para dependências internas e `catalog:` para versões comuns. Não gere lockfiles de outros gerenciadores.

Dados passam pelo `SchoolRepository`; stores não duplicam persistência de entidades. VueUse/ReactUse atendem preferências e comportamentos de interface. As duas versões compartilham a chave `edupro:school:v1` quando servidas na mesma origem. A mudança de schema requer considerar os dados existentes e a restauração explícita da demonstração.

Em Vue e React, organize funcionalidades em módulos separados: `auth`, `dashboard`, `courses`, `subjects`, `students`, `enrollments` e `notifications`. Resolvers puros preparam relacionamentos, modelos de exibição, configurações de formulário e ações; stores coordenam estado e repositories do módulo. Mantenha componentes de registros reutilizáveis em `src/components/records/`, sem recriar um módulo único `school`. O store de dados da raiz mantém apenas o snapshot, notificações globais e sincronização. Regras de integridade compartilhadas ficam nos resolvers de `packages/domain`; modelos e resolvers de apresentação ficam em `packages/presentation`, acessados pelas entradas de cada módulo, fora do core.

Os logins são demonstrativos e guardam somente o e-mail em `sessionStorage`, em chaves separadas por implementação, sem persistir senha ou alegar autenticação real. Preserve validação, logout e retorno a links internos. As duas versões estão alinhadas; mantenha novos ajustes equivalentes seguindo a preferência do usuário de validar primeiro o Vue.

Vue e React suportam `pt-BR`, `en` e `es`, com preferência em `edupro:locale` e inglês como padrão quando não houver preferência salva. Mantenha as traduções comuns e do login em `packages/ui`, passe o idioma aos formatadores e preserve o seletor no desktop, drawer mobile e login. Resolvers recebem o idioma por parâmetro, sem traduzir suas chaves. Evite conteúdo com largura mínima implícita no rodapé da sidebar: textos longos devem quebrar ou truncar adequadamente.

Não adicione backend, envio real de e-mail, autenticação ficticiamente segura ou dados pessoais reais. Use imports públicos entre pacotes, TypeScript estrito e comentários somente para decisões não óbvias.

## Verificação

- `pnpm test`: regras e persistência compartilhadas.
- `pnpm build`: tipagem de todos os workspaces e build estático combinado em `dist/`.
- `pnpm test:e2e`: fluxos Playwright sobre o build atualizado, com Edge isolado e servidor na porta 4175.
- `pnpm format:check`: formatação de código e configuração.
- `pnpm dev:vue` / `pnpm dev:react`: desenvolvimento em portas diferentes; para testar storage compartilhado, use `pnpm preview` sobre o build combinado.

Não publique, crie remotes ou altere permissões do GitHub apenas para validar localmente. O workflow de Pages está preparado para execução no repositório de destino.
