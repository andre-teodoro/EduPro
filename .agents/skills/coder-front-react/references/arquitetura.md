# Arquitetura e core

## Organização proporcional

Dentro do workspace React:

~~~text
src/
  main.tsx
  App.tsx
  router/
  i18n/
  layouts/
  components/ui/
  hooks/
  modules/<dominio>/
    components/
    views/
    hooks/
    stores/
    repositories/
    resolvers/
    types/
    lang/
~~~

Crie só as pastas necessárias. Um módulo organiza arquivos, sem root React, router ou instância i18n próprios. Views compõem telas; componentes apresentam dados e emitem ações; hooks coordenam comportamento React; stores mantêm estado compartilhado. Não crie hooks que apenas renomeiam uma store inteira.

## Fronteiras

| Local | Responsabilidade |
| --- | --- |
| Core genérico | HTTP, adapters, Either, DataError, utilitários e contratos genéricos |
| Raiz do app React | Bootstrap, router, integração i18n, UI e hooks sem domínio |
| Módulo | Tipos, repositories, regras, stores, hooks e UI de uma funcionalidade |

O pacote core compartilhado usa TypeScript puro, sem React, Vue, Zustand, Pinia, roteadores ou integrações i18n de framework. Não contém regras do produto. Dependências seguem app → core, nunca core → app.

vue_example/core/ é referência, não um pacote já extraído. Não importe diretamente de vue_example/ no novo app. Enquanto a extração não for solicitada, preserve a fronteira agnóstica no local definido pela tarefa; quando houver pacote compartilhado, use exports públicos em ambos os apps.

Não mova a pasta inteira cegamente: a referência também inclui CSS e configuração de Vite. Estilos pertencem aos apps ou a um pacote visual separado quando necessário. Injete configuração, storage e clientes nas bordas; o core não deve depender de import.meta.env de um app ou acessar o browser implicitamente durante importação.

Repositories podem preservar Promise<Either<DataError, ApiResponse<T>>> quando esse contrato for adotado. Resolvers transformam DTOs com funções puras. Erros técnicos ficam estruturados; a apresentação escolhe sua tradução.

Regras e modelos de produto comuns às versões podem ganhar pacote de domínio próprio quando necessário; não os coloque no core genérico. Preserve equivalência funcional usando padrões idiomáticos de cada framework, sem compartilhar componentes .vue/.tsx ou stores Pinia/Zustand por condicionais no core.

Os pacotes atuais são packages/core (infraestrutura), packages/data (JSONs), packages/domain (integridade e persistência), packages/presentation (modelos e resolvers puros) e packages/ui (estilos e traduções). Cada módulo do app expõe seus resolvers por reexports do pacote comum, seus repositories e suas ações. Use seletores Zustand focados e derive modelos em hooks, sem duplicar snapshots por entidade. Login é demonstrativo, com e-mail em sessionStorage e sem senha persistida.
