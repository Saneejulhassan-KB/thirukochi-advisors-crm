import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface SearchFilterProps {
  searchValue: string;
  onSearch: (value: string) => void;
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilter?: (key: string, value: string) => void;
  onClear?: () => void;
  className?: string;
}

export function SearchFilter({
  searchValue,
  onSearch,
  filters = [],
  filterValues = {},
  onFilter,
  onClear,
  className,
}: SearchFilterProps) {
  const hasActive = searchValue || Object.values(filterValues).some(Boolean);

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      data-ocid="search_filter"
    >
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
          data-ocid="search_filter.search_input"
        />
      </div>
      {filters.map((f) => (
        <select
          key={f.key}
          value={filterValues[f.key] ?? ""}
          onChange={(e) => onFilter?.(f.key, e.target.value)}
          className={cn(
            "h-9 rounded-lg border border-input bg-background px-3 text-sm",
            "text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            "transition-smooth",
          )}
          aria-label={f.label}
          data-ocid={`search_filter.${f.key}_select`}
        >
          <option value="">{f.label}: All</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="gap-1.5 text-muted-foreground"
          data-ocid="search_filter.clear_button"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
