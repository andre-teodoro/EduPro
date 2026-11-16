# PrimeVue 5 — Uso Obrigatório

## Regra fundamental

**SEMPRE** use componentes PrimeVue. Nunca crie elementos HTML puros (`<button>`, `<input>`, `<select>`, `<table>`, `<dialog>` etc.) quando existir um componente PrimeVue equivalente.

Este projeto usa **PrimeVue 5** (`primevue` + `@primeuix/themes`). A v5 é retrocompatível com a v4 (nenhuma quebra na API pública dos componentes), mas várias props/componentes foram **descontinuados** ou **removidos** — ver seção "PrimeVue 5 — API depreciada/removida" abaixo. Antes de usar qualquer prop/componente fora do uso corriqueiro, **confirme via MCP** em vez de confiar em conhecimento antigo da v4.

---

## Tema (styled mode)

O preset ativo é escolhido via `VITE_PRIMEVUE_THEME` (`aura` [default] | `lara` | `material` | `nora`), resolvido em `app/core/config/theme.ts` a partir de `@primeuix/themes/<preset>`. Para trocar o tema do projeto, edite o `.env` — não o código. Para customizar tokens de um preset (cor primária, superfícies, etc.), use `definePreset` (ver `get_guide` `styled` no MCP) dentro de `theme.ts`, nunca overrides via CSS solto.

---

## Estilo — CSS PrimeVue (obrigatório)

Use **exclusivamente** as classes utilitárias do PrimeVue (PrimeFlex/tokens). Não escreva CSS custom sem antes verificar se já existe uma classe ou token PrimeVue equivalente.

- Espaçamento: `p-*`, `m-*`, `gap-*`
- Flex/Grid: `flex`, `grid`, `col-*`, `justify-content-*`, `align-items-*`
- Tipografia: classes de texto PrimeFlex
- Cores/superfícies: tokens CSS do tema (`--p-primary-color`, `--p-surface-*`, etc.)

---

## Props e Atributos — Preferir a props, não classes

**Regra**: use as props nativas do PrimeVue em vez de adicionar classes CSS quando o componente já oferece atributos para aquela funcionalidade.

### ✅ Correto — usar props/atributos:

```vue
<!-- Button com variantes -->
<Button outlined />
<!-- em vez de class="p-button-outlined" -->
<Button severity="danger" />
<!-- em vez de class="p-button-danger" -->
<Button size="small" />
<!-- em vez de class="p-button-sm" -->

<!-- Dialog -->
<Dialog modal />
<!-- em vez de class="p-dialog-modal" -->
<Dialog :draggable="false" />

<!-- Select -->
<Select :show-clear="true" />
<Select :filter="true" />

<!-- DataTable -->
<DataTable scrollable />
<DataTable :paginator="true" />
```

### ❌ Evitar — usar classes diretamente:

```vue
<!-- Ruim -->
<Button class="p-button-outlined p-button-danger p-button-sm" />

<!-- Ruim -->
<Dialog class="p-dialog-modal" />
```

**Exceção**: use classes apenas para:

- Layout/espaçamento PrimeFlex (`flex`, `gap-2`, `p-4`, etc.)
- Posicionamento customizado
- Tokens de tema quando não houver prop equivalente

---

## Workflow obrigatório para qualquer componente Vue

```
1. Identificar o que precisa construir
2. → CallMcpTool: search (busca por nome/palavra-chave/caso de uso)
3. → CallMcpTool: get_component (props, events, slots) + get_example (uso real)
4. Implementar usando o componente PrimeVue
5. Estilizar com classes/tokens PrimeVue
6. → CallMcpTool: validate_usage (se houver dúvida sobre a marcação final)
```

---

## Mapeamento rápido (HTML → PrimeVue, já na nomenclatura v5)

| HTML puro                     | Componente PrimeVue                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `<button>`                    | `<Button>`                                                                         |
| `<input type="text">`         | `<InputText>`                                                                      |
| `<input type="number">`       | `<InputNumber>`                                                                    |
| `<input type="password">`     | `<InputPassword>` (substitui `Password`, descontinuado na v5)                      |
| `<select>`                    | `<Select>` (substitui `Dropdown`, removido na v5)                                  |
| `<textarea>`                  | `<Textarea>`                                                                       |
| `<table>`                     | `<DataTable>`                                                                      |
| `<dialog>` / modal            | `<Dialog>`                                                                         |
| Notificação                   | `<Toast>` / `<Message>`                                                            |
| Loading                       | `<ProgressSpinner>` / `<Skeleton>`                                                 |
| Tabs                          | `<Tabs>` (substitui `TabView`/`TabMenu`, removidos na v5)                          |
| Accordion                     | `<Accordion>` com `AccordionPanel`/`AccordionHeader`/`AccordionContent`            |
| Badge/chip                    | `<Badge>` / `<Chip>` / `<OverlayBadge>` (substitui a diretiva `v-badge`, removida) |
| Tooltip                       | `<Tooltip>` (diretiva `v-tooltip`)                                                 |
| Data picker                   | `<DatePicker>` (substitui `Calendar`, removido na v5)                              |
| Upload                        | `<FileUpload>`                                                                     |
| Menu dropdown                 | `<Menu>` / `<TieredMenu>`                                                          |
| Breadcrumb                    | `<Breadcrumb>`                                                                     |
| Paginação                     | `<Paginator>`                                                                      |
| Stepper                       | `<Stepper>`                                                                        |
| Kanban/lista drag             | `<OrderList>` / `<PickList>`                                                       |
| Galeria/lightbox              | `<Gallery>` (substitui `Galleria`/`Image`, descontinuados na v5)                   |
| Comparar duas imagens         | `<Compare>` (substitui `ImageCompare`, descontinuado na v5)                        |
| Seletor de cor                | `<InputColor>` (substitui `ColorPicker`, descontinuado na v5)                      |
| Painel com scroll customizado | `<ScrollArea>` (substitui `ScrollPanel`, descontinuado na v5)                      |
| Popover/overlay ancorado      | `<Popover>` (substitui `OverlayPanel`, removido na v5)                             |
| Tags de input                 | `<InputTags>` (substitui `Chips`/`InputChips`, removidos na v5)                    |
| Toggle on/off                 | `<ToggleSwitch>` (substitui `InputSwitch`, removido na v5)                         |

---

## PrimeVue 5 — API depreciada/removida

Consultar sempre `get_guide` (`v5`, migração) no MCP para a versão mais atual desta tabela — o resumo abaixo é um atalho para os casos mais comuns.

### Removidos na v5 (não existem mais — build quebra se usados)

| v4                                                       | Substituto v5                                                         |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| `Calendar`                                               | `DatePicker`                                                          |
| `Dropdown`                                               | `Select`                                                              |
| `Chips` / `InputChips`                                   | `InputTags`                                                           |
| `InputSwitch`                                            | `ToggleSwitch`                                                        |
| `OverlayPanel`                                           | `Popover`                                                             |
| `TabView` / `TabMenu`                                    | `Tabs`                                                                |
| `AccordionTab`                                           | `Accordion` com `AccordionPanel`/`AccordionHeader`/`AccordionContent` |
| Diretiva `v-badge` (`BadgeDirective`)                    | `OverlayBadge`                                                        |
| `InlineMessage`                                          | `Message`                                                             |
| `Select`/`CascadeSelect` props `panelStyle`/`panelClass` | props `overlayStyle`/`overlayClass`                                   |
| PrimeVue config `inputStyle`                             | `inputVariant`                                                        |
| `Button` prop `plain`                                    | severity `contrast`                                                   |

### Descontinuados na v5 (ainda funcionam, mas evite em código novo — remoção prevista na v6)

| v4/v5                                               | Substituto recomendado                                             |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `MultiSelect`                                       | `Select` com `multiple`                                            |
| `Galleria` / `Image`                                | `Gallery`                                                          |
| `ColorPicker`                                       | `InputColor`                                                       |
| `ImageCompare`                                      | `Compare`                                                          |
| `ScrollPanel`                                       | `ScrollArea`                                                       |
| `Password`                                          | `InputPassword`                                                    |
| `InputMask` (componente)                            | diretiva `Mask`                                                    |
| `PanelMenu`                                         | `Menu` com a opção `toggleable`                                    |
| `Button` props `label`/`icon`/`iconPos`/`iconClass` | colocar ícone/texto no slot default do `Button`                    |
| `Button` props `badge`/`badgeClass`/`badgeSeverity` | compor um `Badge` dentro do slot default                           |
| `Button` props `loading`/`loadingIcon`              | renderizar o próprio spinner no slot default + alternar `disabled` |
| `Tabs` prop `scrollable`                            | scroll agora é automático quando necessário                        |

**Regra**: ao encontrar código existente usando qualquer item da coluna da esquerda, ou ao ficar em dúvida se uma prop ainda existe, chame `get_component`/`validate_usage` no MCP antes de escrever/manter o uso — não assuma pela memória da v4.

---

## Antes de implementar qualquer UI

1. **Consulte o MCP `primevue`** para descobrir o componente correto:
   ```
   search           → busca por nome/palavra-chave/caso de uso (scope: components | guides | api | examples | all)
   list             → lista componentes, guides, hooks, examples disponíveis
   get_component    → detalhes completos de um componente (props, events, slots)
   ```
2. **Se não souber qual componente usar**, chame `search` com a descrição do caso de uso antes de escrever qualquer código.
3. **Consulte exemplos e setup pelo MCP antes de usar o componente**:
   ```
   get_example      → exemplo de uso real de um componente
   get_guide        → guias (theming, migração v5, configuração, acessibilidade, etc.)
   get_setup        → guia de instalação/setup por ambiente (vite, nuxt, etc.)
   validate_usage   → valida uma marcação/uso específico
   version          → versão do PrimeVue/docs que o MCP está servindo
   ```

## Identificador do servidor MCP

```
server: primevue
```

Ferramentas disponíveis:

| Ferramenta       | Quando usar                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| `search`         | Não sabe qual componente usar, ou busca por nome/keyword                           |
| `list`           | Listar componentes/guides/hooks/examples disponíveis                               |
| `get_component`  | Visão geral do componente — props, events, slots                                   |
| `get_example`    | Exemplo prático de uso de um componente                                            |
| `get_guide`      | Guias completos (theming, migração v4/v5, configuração, acessibilidade, RTL, etc.) |
| `get_setup`      | Guia de instalação por ambiente (vite, nuxt, cdn, laravel, etc.)                   |
| `validate_usage` | Validar uma marcação/uso antes de finalizar                                        |
| `version`        | Ver a versão do PrimeVue/docs servida pelo MCP                                     |
