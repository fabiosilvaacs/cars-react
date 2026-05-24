# DataGrid

Componente de tabela genérico e reutilizável com suporte a **filtragem**, **ordenação**, **agrupamento**, **seleção de linha** e **ações customizáveis por linha**.

Construído com React + TypeScript + Tailwind CSS.

---

## Instalação

Copie `DataGrid.tsx` para `app/components/` (ou qualquer pasta de componentes do seu projeto).

```
components/
└── DataGrid.tsx
```

---

## Uso básico

```tsx
import DataGrid from '@/components/DataGrid';

type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
};

const produtos: Produto[] = [
  { id: 1, nome: 'Notebook', preco: 4500, categoria: 'Eletrônicos' },
  { id: 2, nome: 'Mesa',     preco: 800,  categoria: 'Móveis' },
];

export default function ProdutosPage() {
  return (
    <DataGrid
      items={produtos}
      columns={[
        { key: 'id',        label: 'ID',       sortType: 'numeric' },
        { key: 'nome',      label: 'Nome' },
        { key: 'preco',     label: 'Preço',    sortType: 'numeric',
          format: (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
        { key: 'categoria', label: 'Categoria' },
      ]}
    />
  );
}
```

---

## Props

### Dados

| Prop      | Tipo                          | Obrigatório | Descrição                                                      |
|-----------|-------------------------------|:-----------:|----------------------------------------------------------------|
| `items`   | `T[]`                         | ✅          | Array de itens a exibir. Cada item **deve** ter um campo `id: number`. |
| `columns` | `ReadonlyArray<ColumnDef<T>>` | ✅          | Definição das colunas. Ver [ColumnDef](#columndef) abaixo.     |

### Ordenação

| Prop          | Tipo         | Padrão | Descrição                                                                 |
|---------------|--------------|--------|---------------------------------------------------------------------------|
| `defaultSort` | `SortConfig` | —      | Ordenação inicial aplicada na montagem e sempre que o prop mudar. Ver [SortConfig](#sortconfig). |

### Agrupamento

| Prop                   | Tipo     | Padrão       | Descrição                                                                 |
|------------------------|----------|--------------|---------------------------------------------------------------------------|
| `groupBy`              | `keyof T` | —           | Campo usado para agrupar as linhas em seções colapsáveis.                 |
| `groupItemLabel`       | `string` | `'item'`     | Rótulo singular no contador de itens por grupo.                           |
| `groupItemLabelPlural` | `string` | `'itens'`    | Rótulo plural no contador de itens por grupo.                             |
| `groupFallbackLabel`   | `string` | `'Sem grupo'`| Nome do grupo exibido quando o campo `groupBy` é `null` ou `undefined`.   |

### Toolbar

| Prop                | Tipo         | Padrão        | Descrição                                                             |
|---------------------|--------------|---------------|-----------------------------------------------------------------------|
| `onAdd`             | `() => void` | —             | Callback do botão "Adicionar". Quando omitido, o botão não é renderizado. |
| `addLabel`          | `string`     | `'Adicionar'` | Rótulo do botão "Adicionar".                                          |
| `filterPlaceholder` | `string`     | `'Filtrar...'`| Placeholder do campo de busca.                                        |

### Ações por linha

| Prop      | Tipo              | Padrão | Descrição                                                                           |
|-----------|-------------------|--------|-------------------------------------------------------------------------------------|
| `actions` | `RowAction<T>[]`  | `[]`   | Lista de ações renderizadas na última coluna de cada linha. Quando vazio, a coluna de ações **não é renderizada**. Ver [RowAction](#rowaction). |

### Interação com linha

| Prop               | Tipo                  | Padrão | Descrição                                                                   |
|--------------------|-----------------------|--------|-----------------------------------------------------------------------------|
| `onRowClick`       | `(item: T) => void`   | —      | Callback de clique simples. O estado de seleção é gerenciado internamente.  |
| `onRowDoubleClick` | `(item: T) => void`   | —      | Callback de duplo clique.                                                   |

### Estado vazio

| Prop         | Tipo              | Padrão                          | Descrição                                                     |
|--------------|-------------------|---------------------------------|---------------------------------------------------------------|
| `emptyState` | `React.ReactNode` | `<p>Nenhum item encontrado.</p>`| Conteúdo renderizado quando não há itens ou nenhum resultado. |

---

## Tipos auxiliares

### `ColumnDef<T>`

```ts
type ColumnDef<T> = {
  key: keyof T & string;
  label: string;
  format?: (value: unknown) => string;
  sortType?: 'numeric' | 'date' | 'string';
};
```

| Campo      | Descrição                                                                                           |
|------------|-----------------------------------------------------------------------------------------------------|
| `key`      | Chave do objeto `T` cujo valor será exibido nessa coluna.                                           |
| `label`    | Texto do cabeçalho da coluna.                                                                       |
| `format`   | Função opcional que transforma o valor bruto em string antes de renderizar.                         |
| `sortType` | Estratégia de ordenação: `'numeric'` (como Number), `'date'` (como Date), `'string'` (locale-aware). Padrão: `'string'`. |

### `SortConfig`

```ts
type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};
```

### `RowAction<T>`

```ts
type RowAction<T> = {
  label: string;
  className?: string;
  onClick: (item: T) => void;
};
```

| Campo       | Descrição                                                      |
|-------------|----------------------------------------------------------------|
| `label`     | Texto do botão.                                                |
| `className` | Classes Tailwind do botão. Padrão: `bg-sky-600 text-white ...`.|
| `onClick`   | Callback chamado com o item da linha ao clicar no botão.       |

---

## Comportamento esperado

### Filtragem
A busca ocorre em tempo real conforme o usuário digita. Todos os campos definidos em `columns` são pesquisados. Quando `groupBy` está ativo, o campo de agrupamento também é incluído na busca. A busca é **case-insensitive**.

### Ordenação
Cada coluna no cabeçalho é clicável. O primeiro clique ordena de forma ascendente; o segundo, descendente; cliques alternados invertem a direção. O indicador visual (▲▼) destaca a coluna ativa e sua direção. A estratégia de comparação é determinada por `sortType`:

- `'string'` → `localeCompare` com `pt-BR` e `numeric: true`
- `'numeric'` → comparação numérica via `Number()`
- `'date'` → comparação por timestamp via `new Date()`

### Agrupamento
Quando `groupBy` é fornecido, as linhas são agrupadas em seções com cabeçalho colapsável. Cada grupo exibe o nome e a contagem de itens. Botões "Expandir todos" e "Colapsar todos" aparecem na toolbar. Os grupos são reiniciados (todos expandidos) sempre que `groupBy` muda.

### Seleção de linha
Um clique simples seleciona a linha (destaque amarelo) e dispara `onRowClick`. Um segundo clique na mesma linha a desseleciona. Um duplo clique dispara `onRowDoubleClick` (útil para abrir modo de edição). Navegação por teclado: `Enter` e `Espaço` selecionam a linha focada.

### Coluna de ações
A coluna de ações só é renderizada quando `actions` contém pelo menos um item. O clique nos botões de ação **não propaga** para o handler de seleção da linha.

### Estado vazio
Quando `items` é vazio ou nenhum item passa pelo filtro, o conteúdo de `emptyState` é exibido ocupando toda a largura da tabela.

---

## Exemplos de uso

### Sem ações (somente leitura)

```tsx
<DataGrid
  items={logs}
  columns={[
    { key: 'id',        label: 'ID',   sortType: 'numeric' },
    { key: 'evento',    label: 'Evento' },
    { key: 'criadoEm', label: 'Data',  sortType: 'date',
      format: (v) => new Date(String(v)).toLocaleString('pt-BR') },
  ]}
  defaultSort={{ key: 'criadoEm', direction: 'desc' }}
/>
```

---

### Com ações de editar e excluir

```tsx
<DataGrid
  items={clientes}
  columns={[
    { key: 'id',    label: 'ID',    sortType: 'numeric' },
    { key: 'nome',  label: 'Nome' },
    { key: 'email', label: 'E-mail' },
  ]}
  actions={[
    {
      label: 'Editar',
      className: 'cursor-pointer rounded bg-amber-300 px-2 py-1',
      onClick: (cliente) => openEditModal(cliente),
    },
    {
      label: 'Excluir',
      className: 'cursor-pointer rounded bg-red-500 px-2 py-1 text-white',
      onClick: (cliente) => confirmDelete(cliente),
    },
  ]}
  onAdd={() => openCreateModal()}
  addLabel="Novo cliente"
/>
```

---

### Com agrupamento

```tsx
<DataGrid
  items={produtos}
  columns={[
    { key: 'nome',  label: 'Produto' },
    { key: 'preco', label: 'Preço', sortType: 'numeric',
      format: (v) => `R$ ${Number(v).toFixed(2)}` },
  ]}
  groupBy="categoria"
  groupItemLabel="produto"
  groupItemLabelPlural="produtos"
  groupFallbackLabel="Sem categoria"
  defaultSort={{ key: 'nome', direction: 'asc' }}
/>
```

---

### Com duplo clique para editar e estado vazio customizado

```tsx
<DataGrid
  items={tarefas}
  columns={[
    { key: 'titulo',   label: 'Título' },
    { key: 'status',   label: 'Status' },
    { key: 'prazo',    label: 'Prazo', sortType: 'date',
      format: (v) => new Date(String(v)).toLocaleDateString('pt-BR') },
  ]}
  onRowDoubleClick={(tarefa) => router.push(`/tarefas/${tarefa.id}`)}
  emptyState={
    <div className="py-12 text-center">
      <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
      <button onClick={criarTarefa} className="mt-2 text-sky-600 underline">
        Criar a primeira tarefa
      </button>
    </div>
  }
  filterPlaceholder="Buscar tarefas..."
/>
```

---

## Restrições e boas práticas

- Cada item **deve** ter um campo `id: number` único — ele é usado como `key` do React internamente.
- `groupBy` deve referenciar um campo que exista nos itens. Valores `null`/`undefined` são agrupados sob `groupFallbackLabel`.
- Evite passar funções `format` ou `actions` instanciadas inline sem `useMemo`/`useCallback` em listas grandes, para não forçar re-renders desnecessários.
- O componente **não gerencia estado externo** (fetch, paginação, loading). Esses estados devem ser controlados pelo componente pai.
