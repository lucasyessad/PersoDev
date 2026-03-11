'use client';

import { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal } from 'lucide-react';

/* ─── Types ──────────────────────────────────────── */

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selected: string[]) => void;
  emptyState?: ReactNode;
  loading?: boolean;
}

/* ─── Sort Icon ──────────────────────────────────── */

function SortIcon({ direction }: { direction?: 'asc' | 'desc' | null }) {
  if (direction === 'asc')  return <ChevronUp className="h-3 w-3" />;
  if (direction === 'desc') return <ChevronDown className="h-3 w-3" />;
  return <ChevronsUpDown className="h-3.5 w-3.5 text-neutral-400" />;
}

/* ─── Table ──────────────────────────────────────── */

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable,
  onSelectionChange,
  emptyState,
  loading,
}: TableProps<T>) {
  const [sortKey, setSortKey]       = useState<string | null>(null);
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected]     = useState<string[]>([]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleAll = () => {
    const next = selected.length === data.length ? [] : data.map(keyExtractor);
    setSelected(next);
    onSelectionChange?.(next);
  };

  const toggleOne = (id: string) => {
    const next = selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id];
    setSelected(next);
    onSelectionChange?.(next);
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full min-w-full">
        {/* Header */}
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === data.length && data.length > 0}
                  onChange={toggleAll}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-100"
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={[
                  'px-4 py-3 text-left text-caption uppercase tracking-wider text-neutral-500 font-semibold whitespace-nowrap',
                  col.sortable ? 'cursor-pointer select-none hover:text-neutral-900' : '',
                  col.width ?? '',
                ].join(' ')}
                onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <SortIcon direction={sortKey === String(col.key) ? sortDir : null} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-neutral-200 bg-white">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)}>
                {emptyState ?? (
                  <div className="py-12 text-center text-body-md text-neutral-500">
                    Aucun résultat
                  </div>
                )}
              </td>
            </tr>
          ) : (
            data.map(row => {
              const id = keyExtractor(row);
              const isSelected = selected.includes(id);
              return (
                <tr
                  key={id}
                  className={[
                    'transition-colors duration-100 min-h-[56px]',
                    onRowClick ? 'cursor-pointer' : '',
                    isSelected
                      ? 'bg-primary-50 border-l-2 border-l-primary-600'
                      : 'hover:bg-neutral-50',
                  ].join(' ')}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-4" onClick={e => { e.stopPropagation(); toggleOne(id); }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(id)}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-100"
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-4 py-4 text-body-md text-neutral-900">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Row Action Menu ────────────────────────────── */

export function RowActions({ children }: { children: ReactNode }) {
  return (
    <div className="relative group" onClick={e => e.stopPropagation()}>
      <button className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg border border-neutral-200 z-10 hidden group-focus-within:block">
        {children}
      </div>
    </div>
  );
}
