# 5. Convenções de nomenclatura

| Camada     | Padrão de nome                                                |
| ---------- | ------------------------------------------------------------- |
| Repository | `<Entidade>Repository`                                        |
| Resolver   | `Resolve<Algo>`                                               |
| Service    | `<Algo>Service`                                               |
| Query      | `create<Algo>Query` / `create<Algo>InfiniteQuery`             |
| Store      | `use<Algo>Store`                                              |
| Composable | `use<Algo>`                                                   |
| Tipos      | PascalCase, em `types/index.ts`                               |
| Rotas API  | `snake_case`, chave do mapa `Routes`                          |
| Template   | `<Nome>Template.vue`, em `<app>/components/templates/<nome>/` |
