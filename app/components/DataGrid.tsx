'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';

export type SortDirection = 'asc' | 'desc';

export type DefaultSort = {
  key: string;
  direction: SortDirection;
};

const NUMERIC_SORT_KEYS = new Set(['ano', 'valor', 'numPortas', 'id', 'modeloId', 'marcaId']);

function compareValues(
  a: unknown,
  b: unknown,
  key: string,
  direction: SortDirection,
): number {
  const factor = direction === 'asc' ? 1 : -1;
  const va = a ?? '';
  const vb = b ?? '';

  if (NUMERIC_SORT_KEYS.has(key)) {
    return (Number(va) - Number(vb)) * factor;
  }

  if (key === 'createdAt') {
    return (new Date(String(va)).getTime() - new Date(String(vb)).getTime()) * factor;
  }

  return String(va).localeCompare(String(vb), 'pt-BR', { numeric: true }) * factor;
}

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
      <span className={`text-[10px] ${active && sortDirection === 'asc' ? 'text-sky-600' : 'text-gray-300'}`}>
        ▲
      </span>
      <span className={`-mt-0.5 text-[10px] ${active && sortDirection === 'desc' ? 'text-sky-600' : 'text-gray-300'}`}>
        ▼
      </span>
    </span>
  );
}

function RowActions<T extends { id: number }>({
  item,
  onEdit,
  onDelete,
}: {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => onEdit(item)} className="cursor-pointer rounded bg-amber-300 px-2 py-1">
        Editar
      </button>
      <button type="button" onClick={() => onDelete(item)} className="cursor-pointer rounded bg-red-500 px-2 py-1 text-white">
        Excluir
      </button>
    </div>
  );
}

export default function DataGrid<T extends Record<string, any> & { id: number }>({
  items,
  columns,
  defaultSort,
  groupBy,
  onEdit,
  onDelete,
  onAdd,
  titleAdd,
}: {
  items: T[];
  columns: ReadonlyArray<{ key: string; label: string; format?: (value: unknown) => string }>;
  defaultSort?: DefaultSort;
  groupBy?: string;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onAdd: () => void;
  titleAdd?: string;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<DefaultSort>(
    defaultSort ?? { key: '', direction: 'asc' },
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (defaultSort) {
      setSort(defaultSort);
    }
  }, [defaultSort]);

  useEffect(() => {
    setCollapsedGroups(new Set());
  }, [groupBy]);

  const handleSort = useCallback((key: string) => {
    setSort((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items;
    if (q) {
      const searchKeys = groupBy
        ? [...new Set([...columns.map((c) => c.key), groupBy])]
        : columns.map((c) => c.key);
      arr = arr.filter((it) =>
        searchKeys.some((key) => String(it[key as keyof T] ?? '').toLowerCase().includes(q)),
      );
    }
    if (sort.key) {
      arr = [...arr].sort((a, b) =>
        compareValues(a[sort.key as keyof T], b[sort.key as keyof T], sort.key, sort.direction),
      );
    }
    return arr;
  }, [items, query, sort, columns, groupBy]);

  const groups = useMemo(() => {
    if (!groupBy) return null;
    const map = new Map<string, T[]>();
    for (const item of filtered) {
      const name = String(item[groupBy] ?? 'Sem marca');
      const list = map.get(name);
      if (list) list.push(item);
      else map.set(name, [item]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true }));
  }, [filtered, groupBy]);

  const toggleGroup = useCallback((name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const expandAllGroups = useCallback(() => {
    setCollapsedGroups(new Set());
  }, []);

  const collapseAllGroups = useCallback(() => {
    if (!groups) return;
    setCollapsedGroups(new Set(groups.map(([name]) => name)));
  }, [groups]);

  const allGroupsExpanded = groups ? groups.every(([name]) => !collapsedGroups.has(name)) : true;

  const handleSelect = useCallback((id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const colSpan = columns.length + 1;

  const renderRow = (item: T) => {
    const isSelected = selectedId === item.id;
    return (
      <tr
        key={item.id}
        tabIndex={0}
        onClick={() => handleSelect(item.id)}
        onDoubleClick={() => onEdit(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(item.id);
          }
        }}
        aria-selected={isSelected}
        className={`cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-inset ${isSelected ? 'bg-yellow-50' : 'hover:bg-slate-50'}`}
      >
        {columns.map((col) => (
          <td key={String(col.key)} className="p-2 align-top">
            {col.format
              ? col.format(item[col.key as keyof T])
              : String(item[col.key as keyof T] ?? '')}
          </td>
        ))}
        <td className="p-2">
          <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
        </td>
      </tr>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="grid-filter" className="sr-only">
            Filtrar
          </label>
          <input
            id="grid-filter"
            aria-label="Filtrar"
            placeholder="Filtrar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded border px-2 py-1"
          />
          <button type="button" onClick={onAdd} className="cursor-pointer rounded bg-sky-600 px-3 py-2 text-white">
            {titleAdd || 'Adicionar'}
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>{filtered.length} itens</span>
          {groups && groups.length > 0 && (
            <>
              <span className="text-gray-300" aria-hidden>
                |
              </span>
              <button
                type="button"
                onClick={expandAllGroups}
                disabled={allGroupsExpanded}
                className="cursor-pointer text-sky-600 hover:underline disabled:cursor-default disabled:text-gray-400 disabled:no-underline"
              >
                Expandir todos
              </button>
              <button
                type="button"
                onClick={collapseAllGroups}
                disabled={groups.every(([name]) => collapsedGroups.has(name))}
                className="cursor-pointer text-sky-600 hover:underline disabled:cursor-default disabled:text-gray-400 disabled:no-underline"
              >
                Colapsar todos
              </button>
            </>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-collapse" role="table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sort.key === col.key;
                return (
                  <th
                    key={String(col.key)}
                    className="border-b p-2 text-left"
                    aria-sort={
                      isSorted
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(String(col.key))}
                      className="inline-flex cursor-pointer items-center font-medium hover:text-sky-700"
                    >
                      {col.label}
                      <SortIndicator
                        columnKey={String(col.key)}
                        sortKey={sort.key}
                        sortDirection={sort.direction}
                      />
                    </button>
                  </th>
                );
              })}
              <th className="border-b p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {groups
              ? groups.map(([name, groupItems]) => {
                  const collapsed = collapsedGroups.has(name);
                  return (
                    <React.Fragment key={name}>
                      <tr className="bg-slate-100">
                        <td colSpan={colSpan} className="border-b p-2">
                          <button
                            type="button"
                            onClick={() => toggleGroup(name)}
                            aria-expanded={!collapsed}
                            className="inline-flex cursor-pointer items-center gap-2 font-semibold text-slate-800 hover:text-sky-700"
                          >
                            <span aria-hidden className="text-xs">
                              {collapsed ? '▶' : '▼'}
                            </span>
                            {name}
                            <span className="text-sm font-normal text-gray-500">
                              ({groupItems.length}{' '}
                              {groupItems.length === 1 ? 'carro' : 'carros'})
                            </span>
                          </button>
                        </td>
                      </tr>
                      {!collapsed && groupItems.map((item) => renderRow(item))}
                    </React.Fragment>
                  );
                })
              : filtered.map((item) => renderRow(item))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
