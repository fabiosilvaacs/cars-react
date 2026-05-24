'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export type SortConfig = {
  key: string;
  direction: SortDirection;
};

/** Defines how a single column is rendered and sorted. */
export type ColumnDef<T> = {
  /** Key of the item property to display. */
  key: keyof T & string;
  /** Header label shown in the table. */
  label: string;
  /**
   * Optional formatter applied to the cell value before rendering.
   * Receives the raw value; must return a string.
   *
   * @example
   * format: (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
   */
  format?: (value: unknown) => string;
  /**
   * Sort type for this column.
   * - `'numeric'`  → sorts as Number (default for columns named 'id', 'ano', 'valor', etc.)
   * - `'date'`     → sorts as Date (ISO strings, Date objects)
   * - `'string'`   → locale-aware string sort (default)
   *
   * @default 'string'
   */
  sortType?: 'numeric' | 'date' | 'string';
};

/** Configuration for a custom action rendered in the actions column. */
export type RowAction<T> = {
  /** Button label. */
  label: string;
  /** Tailwind class string for the button. */
  className?: string;
  /** Callback invoked when the action button is clicked. */
  onClick: (item: T) => void;
};

export type DataGridProps<T extends { id: number }> = {
  // ── Data ──────────────────────────────────
  /** Array of items to display. Each item must have a numeric `id` field. */
  items: T[];
  /** Column definitions controlling which fields are shown and how. */
  columns: ReadonlyArray<ColumnDef<T>>;

  // ── Sorting ───────────────────────────────
  /**
   * Initial sort applied when the component mounts (or when this prop changes).
   * If omitted, no initial sort is applied.
   */
  defaultSort?: SortConfig;

  // ── Grouping ──────────────────────────────
  /**
   * Key of the field used to group rows. When provided, rows are grouped
   * into collapsible sections and expand/collapse controls appear in the toolbar.
   */
  groupBy?: keyof T & string;
  /**
   * Singular label for the group item counter  (e.g. `'produto'`).
   * @default 'item'
   */
  groupItemLabel?: string;
  /**
   * Plural label for the group item counter (e.g. `'produtos'`).
   * @default 'itens'
   */
  groupItemLabelPlural?: string;
  /**
   * Fallback group name when a row's `groupBy` field is null or undefined.
   * @default 'Sem grupo'
   */
  groupFallbackLabel?: string;

  // ── Toolbar ───────────────────────────────
  /**
   * Callback for the "Add" button in the toolbar.
   * When omitted, the button is not rendered.
   */
  onAdd?: () => void;
  /**
   * Label for the "Add" button.
   * @default 'Adicionar'
   */
  addLabel?: string;
  /**
   * Placeholder text for the search input.
   * @default 'Filtrar...'
   */
  filterPlaceholder?: string;

  // ── Row actions ───────────────────────────
  /**
   * List of actions rendered in the last column of each row.
   * When empty or omitted, the actions column is hidden entirely.
   *
   * @example
   * actions={[
   *   { label: 'Editar',  className: 'bg-amber-300 ...',  onClick: handleEdit  },
   *   { label: 'Excluir', className: 'bg-red-500 text-white ...', onClick: handleDelete },
   * ]}
   */
  actions?: RowAction<T>[];

  // ── Row interaction ───────────────────────
  /**
   * Callback invoked on single-click (selection toggle).
   * When omitted, row selection is still tracked internally but not reported.
   */
  onRowClick?: (item: T) => void;
  /**
   * Callback invoked on double-click.
   * When omitted, double-click has no effect.
   */
  onRowDoubleClick?: (item: T) => void;

  // ── Empty state ───────────────────────────
  /**
   * Content rendered when `items` is empty or no results match the filter.
   * @default <p>Nenhum item encontrado.</p>
   */
  emptyState?: React.ReactNode;
};

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

function resolveSort(value: unknown, sortType: ColumnDef<unknown>['sortType']): string | number {
  if (sortType === 'numeric') return Number(value);
  if (sortType === 'date') return new Date(String(value)).getTime();
  return String(value ?? '');
}

function compareValues<T>(
  a: T,
  b: T,
  col: ColumnDef<T>,
  direction: SortDirection,
): number {
  const factor = direction === 'asc' ? 1 : -1;
  const va = resolveSort(a[col.key as keyof T], col.sortType);
  const vb = resolveSort(b[col.key as keyof T], col.sortType);

  if (typeof va === 'number' && typeof vb === 'number') {
    return (va - vb) * factor;
  }

  return String(va).localeCompare(String(vb), 'pt-BR', { numeric: true }) * factor;
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SortIndicator({
  columnKey,
  sortKey,
  sortDirection,
}: {
  columnKey: string;
  sortKey: string;
  sortDirection: SortDirection;
}) {
  const active = sortKey === columnKey;
  return (
    <span className="ml-1 inline-flex flex-col leading-none" aria-hidden>
      <span className={`text-[10px] ${active && sortDirection === 'asc' ? 'text-sky-600' : 'text-gray-300'}`}>▲</span>
      <span className={`-mt-0.5 text-[10px] ${active && sortDirection === 'desc' ? 'text-sky-600' : 'text-gray-300'}`}>▼</span>
    </span>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function DataGrid<T extends { id: number }>({
  items,
  columns,
  defaultSort,
  groupBy,
  groupItemLabel = 'item',
  groupItemLabelPlural = 'itens',
  groupFallbackLabel = 'Sem grupo',
  onAdd,
  addLabel = 'Adicionar',
  filterPlaceholder = 'Filtrar...',
  actions = [],
  onRowClick,
  onRowDoubleClick,
  emptyState = <p className="py-8 text-center text-sm text-gray-400">Nenhum item encontrado.</p>,
}: DataGridProps<T>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortConfig>(defaultSort ?? { key: '', direction: 'asc' });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => new Set());

  // Sync sort when defaultSort prop changes (e.g. parent switches view)
  useEffect(() => {
    if (defaultSort) setSort(defaultSort);
  }, [defaultSort]);

  // Reset collapsed groups when groupBy changes
  useEffect(() => {
    setCollapsedGroups(new Set());
  }, [groupBy]);

  // ── Sorting ─────────────────────────────────

  const handleSort = useCallback((key: string) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
  }, []);

  const sortedColumn = useMemo(
    () => columns.find((c) => c.key === sort.key),
    [columns, sort.key],
  );

  // ── Filtering + sorting ──────────────────────

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searchKeys = groupBy
      ? [...new Set([...columns.map((c) => c.key), groupBy])]
      : columns.map((c) => c.key);

    let arr: T[] = q
      ? items.filter((item) =>
          searchKeys.some((key) =>
            String((item as Record<string, unknown>)[key] ?? '').toLowerCase().includes(q),
          ),
        )
      : items;

    if (sort.key && sortedColumn) {
      arr = [...arr].sort((a, b) => compareValues(a, b, sortedColumn as ColumnDef<T>, sort.direction));
    }

    return arr;
  }, [items, query, sort, columns, groupBy, sortedColumn]);

  // ── Grouping ─────────────────────────────────

  const groups = useMemo(() => {
    if (!groupBy) return null;
    const map = new Map<string, T[]>();
    for (const item of filtered) {
      const name = String((item as Record<string, unknown>)[groupBy] ?? groupFallbackLabel);
      const list = map.get(name);
      if (list) list.push(item);
      else map.set(name, [item]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }));
  }, [filtered, groupBy, groupFallbackLabel]);

  const toggleGroup = useCallback((name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }, []);

  const expandAllGroups = useCallback(() => setCollapsedGroups(new Set()), []);
  const collapseAllGroups = useCallback(() => {
    if (groups) setCollapsedGroups(new Set(groups.map(([name]) => name)));
  }, [groups]);

  const allExpanded = groups ? groups.every(([name]) => !collapsedGroups.has(name)) : true;
  const allCollapsed = groups ? groups.every(([name]) => collapsedGroups.has(name)) : false;

  // ── Row selection ────────────────────────────

  const handleSelect = useCallback(
    (item: T) => {
      setSelectedId((prev) => (prev === item.id ? null : item.id));
      onRowClick?.(item);
    },
    [onRowClick],
  );

  // ── Render helpers ───────────────────────────

  const colSpan = columns.length + (actions.length > 0 ? 1 : 0);

  const renderRow = (item: T) => {
    const isSelected = selectedId === item.id;
    return (
      <tr
        key={item.id}
        tabIndex={0}
        onClick={() => handleSelect(item)}
        onDoubleClick={() => onRowDoubleClick?.(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(item);
          }
        }}
        aria-selected={isSelected}
        className={`cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-inset ${
          isSelected ? 'bg-yellow-50' : 'hover:bg-slate-50'
        }`}
      >
        {columns.map((col) => (
          <td key={col.key} className="p-2 align-top">
            {col.format
              ? col.format((item as Record<string, unknown>)[col.key])
              : String((item as Record<string, unknown>)[col.key] ?? '')}
          </td>
        ))}
        {actions.length > 0 && (
          <td className="p-2">
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => action.onClick(item)}
                  className={action.className ?? 'cursor-pointer rounded bg-sky-600 px-2 py-1 text-white'}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </td>
        )}
      </tr>
    );
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="datagrid-filter" className="sr-only">Filtrar</label>
          <input
            id="datagrid-filter"
            aria-label="Filtrar"
            placeholder={filterPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded border px-2 py-1"
          />
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="cursor-pointer rounded bg-sky-600 px-3 py-2 text-white"
            >
              {addLabel}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>{filtered.length} {filtered.length === 1 ? groupItemLabel : groupItemLabelPlural}</span>
          {groups && groups.length > 0 && (
            <>
              <span className="text-gray-300" aria-hidden>|</span>
              <button
                type="button"
                onClick={expandAllGroups}
                disabled={allExpanded}
                className="cursor-pointer text-sky-600 hover:underline disabled:cursor-default disabled:text-gray-400 disabled:no-underline"
              >
                Expandir todos
              </button>
              <button
                type="button"
                onClick={collapseAllGroups}
                disabled={allCollapsed}
                className="cursor-pointer text-sky-600 hover:underline disabled:cursor-default disabled:text-gray-400 disabled:no-underline"
              >
                Colapsar todos
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-collapse" role="table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    className="border-b p-2 text-left"
                    aria-sort={isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex cursor-pointer items-center font-medium hover:text-sky-700"
                    >
                      {col.label}
                      <SortIndicator columnKey={col.key} sortKey={sort.key} sortDirection={sort.direction} />
                    </button>
                  </th>
                );
              })}
              {actions.length > 0 && <th className="border-b p-2 text-left">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>{emptyState}</td>
              </tr>
            ) : groups ? (
              groups.map(([name, groupItems]) => {
                const isCollapsed = collapsedGroups.has(name);
                const count = groupItems.length;
                return (
                  <React.Fragment key={name}>
                    <tr className="bg-slate-100">
                      <td colSpan={colSpan} className="border-b p-2">
                        <button
                          type="button"
                          onClick={() => toggleGroup(name)}
                          aria-expanded={!isCollapsed}
                          className="inline-flex cursor-pointer items-center gap-2 font-semibold text-slate-800 hover:text-sky-700"
                        >
                          <span aria-hidden className="text-xs">{isCollapsed ? '▶' : '▼'}</span>
                          {name}
                          <span className="text-sm font-normal text-gray-500">
                            ({count} {count === 1 ? groupItemLabel : groupItemLabelPlural})
                          </span>
                        </button>
                      </td>
                    </tr>
                    {!isCollapsed && groupItems.map((item) => renderRow(item))}
                  </React.Fragment>
                );
              })
            ) : (
              filtered.map((item) => renderRow(item))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
