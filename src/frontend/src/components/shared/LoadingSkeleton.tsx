import { cn } from "@/lib/utils";

type SkeletonVariant = "card" | "table" | "page" | "kpi";

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

const KPI_KEYS = ["kpi-a", "kpi-b", "kpi-c", "kpi-d"];
const COL_KEYS = ["col-a", "col-b", "col-c", "col-d", "col-e"];
const ROW_KEYS = [
  "row-1",
  "row-2",
  "row-3",
  "row-4",
  "row-5",
  "row-6",
  "row-7",
  "row-8",
];
const CELL_KEYS = ["c1", "c2", "c3", "c4", "c5"];

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_KEYS.map((k) => (
        <div key={k} className="rounded-2xl border border-border bg-card p-5">
          <Pulse className="h-3 w-24 mb-4" />
          <Pulse className="h-7 w-32 mb-2" />
          <Pulse className="h-2.5 w-16" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-muted/40 px-4 py-3 border-b border-border">
        <div className="flex gap-6">
          {COL_KEYS.map((k, i) => (
            <Pulse key={k} className={cn("h-3", i === 0 ? "w-20" : "w-16")} />
          ))}
        </div>
      </div>
      {ROW_KEYS.map((rowKey) => (
        <div
          key={rowKey}
          className="px-4 py-3.5 border-b border-border/50 last:border-0 flex gap-6"
        >
          {CELL_KEYS.map((ck, j) => (
            <Pulse key={ck} className={cn("h-3", j === 0 ? "w-32" : "w-20")} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Pulse className="h-4 w-40 mb-3" />
      <Pulse className="h-3 w-full mb-2" />
      <Pulse className="h-3 w-3/4 mb-4" />
      <Pulse className="h-8 w-24" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Pulse className="h-7 w-48 mb-2" />
          <Pulse className="h-4 w-64" />
        </div>
        <Pulse className="h-9 w-32" />
      </div>
      <KPISkeleton />
      <TableSkeleton />
    </div>
  );
}

export function LoadingSkeleton({
  variant = "card",
  className,
}: LoadingSkeletonProps) {
  const map = {
    card: CardSkeleton,
    table: TableSkeleton,
    page: PageSkeleton,
    kpi: KPISkeleton,
  };
  const Skeleton = map[variant];
  return (
    <div className={className} data-ocid="loading_state">
      <Skeleton />
    </div>
  );
}
