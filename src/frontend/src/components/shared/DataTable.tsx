import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortKey?: keyof T;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  numeric?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
  rowSelection?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (keys: string[]) => void;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T extends object>({
  columns,
  data,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = "Search...",
  onRowClick,
  actions,
  isLoading = false,
  emptyMessage = "No data found",
  keyExtractor,
  rowSelection = false,
  selectedRows = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row as Record<string, unknown>).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey as string];
        const bv = (b as Record<string, unknown>)[sortKey as string];
        const cmp = String(av ?? "").localeCompare(
          String(bv ?? ""),
          undefined,
          { numeric: true },
        );
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const toggleRow = (key: string) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedRows.includes(key)
        ? selectedRows.filter((k) => k !== key)
        : [...selectedRows, key],
    );
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    const allKeys = paged.map(keyExtractor);
    onSelectionChange(selectedRows.length === paged.length ? [] : allKeys);
  };

  if (isLoading) return <LoadingSkeleton variant="table" />;

  return (
    <div className="flex flex-col gap-3" data-ocid="data_table">
      {searchable && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
            data-ocid="data_table.search_input"
          />
          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} results
          </span>
        </div>
      )}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {rowSelection && (
                  <th className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={
                        paged.length > 0 && selectedRows.length === paged.length
                      }
                      onChange={toggleAll}
                      className="rounded border-border accent-primary"
                      aria-label="Select all"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      "px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap",
                      col.headerClassName,
                      col.sortKey &&
                        "cursor-pointer select-none hover:text-foreground transition-colors",
                      col.numeric && "text-right",
                    )}
                    onClick={() => col.sortKey && handleSort(col.sortKey)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      col.sortKey &&
                      handleSort(col.sortKey)
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortKey &&
                        (sortKey === col.sortKey ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3 h-3 opacity-40" />
                        ))}
                    </span>
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (actions ? 1 : 0) +
                      (rowSelection ? 1 : 0)
                    }
                  >
                    <EmptyState
                      title={emptyMessage}
                      description="Try adjusting your search or filters."
                      className="py-12"
                    />
                  </td>
                </tr>
              ) : (
                paged.map((row, idx) => (
                  <motion.tr
                    key={keyExtractor(row)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border/50 transition-colors last:border-0",
                      onRowClick && "cursor-pointer hover:bg-muted/40",
                      selectedRows.includes(keyExtractor(row)) &&
                        "bg-primary/5",
                    )}
                    data-ocid={`data_table.item.${idx + 1}`}
                  >
                    {rowSelection && (
                      <td
                        className="px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(keyExtractor(row))}
                          onChange={() => toggleRow(keyExtractor(row))}
                          className="rounded border-border accent-primary"
                          aria-label={`Select row ${idx + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const rawVal = (row as Record<string, unknown>)[
                        col.key as string
                      ];
                      return (
                        <td
                          key={String(col.key)}
                          className={cn(
                            "px-4 py-3 text-foreground",
                            col.className,
                            col.numeric && "text-right font-mono",
                          )}
                        >
                          {col.render
                            ? col.render(rawVal, row)
                            : String(rawVal ?? "")}
                        </td>
                      );
                    })}
                    {actions && (
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        {actions(row)}
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages} &mdash; {filtered.length} total
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              data-ocid="data_table.pagination_prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <Button
                  key={pg}
                  variant={pg === page ? "default" : "ghost"}
                  size="icon"
                  className="w-8 h-8 text-xs"
                  onClick={() => setPage(pg)}
                  data-ocid={`data_table.page.${pg}`}
                >
                  {pg}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              data-ocid="data_table.pagination_next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
