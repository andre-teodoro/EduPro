# Rotas, estado e i18n

## React Router e GitHub Pages

Centralize rotas em src/router/. Use HashRouter com Routes/Route como padrão simples para hospedagem sem rewrites. Se loaders/actions forem necessários, use createHashRouter com RouterProvider, criado fora da renderização. Não aninhe um router no outro.

Layouts usam Outlet; navegação interna usa Link/NavLink. Inclua rota * de página não encontrada, parâmetros inválidos e fallback para lazy loading. Guard visual não oferece segurança de backend; não copie o login do exemplo sem requisito.

Configure o base do Vite para o caminho físico publicado. Se React estiver em /repositorio/react/, esse é o base dos assets; uma rota pode ser /repositorio/react/#/painel. O basename do hash router opera depois de #: não repita automaticamente ali o prefixo físico. Links entre as versões usam seus caminhos físicos sob o prefixo real.

Use imports de assets ou import.meta.env.BASE_URL no app, evitando /assets/... absoluto. Verifique build, abertura direta e reload de rota sob o prefixo de publicação. BrowserRouter exige solução explícita e verificada para deep links: Pages não fornece o fallback de SPA do servidor Vite.

## Zustand no papel do Pinia

Estado local de formulário/modal fica em useState/useReducer. Use Zustand para estado compartilhado. Não duplique parâmetros representados na URL nem armazene dados derivados calculáveis.

~~~ts
import { create } from 'zustand'

interface SelectionState {
  selectedId: string | null
  select: (id: string | null) => void
}

export const useSelectionStore = create<SelectionState>()((set) => ({
  selectedId: null,
  select: (selectedId) => set({ selectedId }),
}))
~~~

Consuma seletores focados: useSelectionStore((state) => state.selectedId). Para seletores que criam objetos/arrays a cada chamada, use seletores separados ou useShallow quando adequado. Atualize dados imutavelmente. Fora do React, use getState() quando necessário, nunca o hook.

Ações assíncronas chamam repositories e expõem loading/erro. Restaure loading em finally quando houver caminhos de exceção e impeça respostas antigas de sobrescrever as recentes. Zustand não fornece cache de servidor, deduplicação ou cancelamento automaticamente. Adicione biblioteca de queries somente com necessidade concreta e defina um dono para cada dado.

Persistência é opt-in: limite campos, versione quando necessário e permita reset de dados de demonstração. Não persista loading, erros ou credenciais indiscriminadamente. Mesmo uma store vanilla Zustand fica fora do core compartilhado.

## i18next + react-i18next

Inicialize uma única instância em src/i18n/ com initReactI18next. Aguarde sua inicialização antes de renderizar ou forneça fallback Suspense adequado. I18nextProvider serve para fornecer instância explicitamente; não é obrigatório se a integração global já resolve o contexto.

Use namespace common para ações genéricas e um namespace por domínio, com arquivos src/modules/<dominio>/lang/<locale>.ts. Registre recursos centralmente, sem inicialização por módulo. Configure supportedLngs, idioma inicial e fallbackLng conforme o produto. Para recursos locais, prefira imports estáticos antes de acrescentar backend de tradução.

Na apresentação use useTranslation('namespace') e i18n.changeLanguage(locale). Mantenha todas as chaves em cada idioma suportado, incluindo erros, validação, placeholders, alt e labels acessíveis. Use interpolação/pluralização, evitando concatenar fragmentos; use Trans para marcação React quando necessário.

Resolvers/enums retornam códigos/chaves ou dados, nunca textos traduzidos. Não chame hooks ou t() em repositories, no core ou em resolvers puros. Traduza na apresentação para a troca de idioma atualizar a UI sem refazer requisições. Dicionários podem ser dados compartilhados; integrações das bibliotecas ficam nos respectivos apps.

Tipifique recursos com CustomTypeOptions via module augmentation de i18next em declaração incluída pelo tsconfig. Não esconda chaves ausentes com casts. Use Intl com o idioma ativo para datas/números e sincronize document.documentElement.lang e dir quando aplicável. Persistir idioma não exige duplicá-lo numa store.

Fontes: [HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter), [Zustand](https://zustand.docs.pmnd.rs/reference/apis/create), [useTranslation](https://react.i18next.com/latest/usetranslation-hook), [I18nextProvider](https://react.i18next.com/latest/i18nextprovider).
