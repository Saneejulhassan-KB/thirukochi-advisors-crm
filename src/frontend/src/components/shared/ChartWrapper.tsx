import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "recharts";

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
  toolbar?: React.ReactNode;
  isEmpty?: boolean;
}

export function ChartWrapper({
  title,
  subtitle,
  children,
  height = 280,
  className,
  toolbar,
  isEmpty = false,
}: ChartWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-glow",
        className,
      )}
      data-ocid="chart_wrapper"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-base text-foreground truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {toolbar && <div className="shrink-0">{toolbar}</div>}
      </div>
      {isEmpty ? (
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{ height }}
          data-ocid="chart_wrapper.empty_state"
        >
          <span className="text-3xl mb-2">📊</span>
          <p className="text-sm text-muted-foreground">
            No chart data available
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Chart color palette for consistent usage across charts
export const chartColors = {
  primary: "oklch(0.65 0.21 262)",
  secondary: "oklch(0.72 0.15 280)",
  success: "oklch(0.68 0.19 142)",
  warning: "oklch(0.75 0.15 80)",
  danger: "oklch(0.65 0.19 22)",
  muted: "oklch(0.50 0.01 255)",
};
