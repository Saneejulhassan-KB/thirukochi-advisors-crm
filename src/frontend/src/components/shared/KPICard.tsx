import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  icon: React.ReactNode;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend = "neutral",
  trendValue,
  icon,
  iconColor = "text-primary",
  onClick,
  className,
}: KPICardProps) {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "up",
    },
    down: {
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
      label: "down",
    },
    neutral: {
      icon: Minus,
      color: "text-muted-foreground",
      bg: "bg-muted",
      label: "neutral",
    },
  }[trend];

  const TrendIcon = trendConfig.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl p-5 border border-border overflow-hidden",
        "bg-card shadow-glow",
        "dark:before:absolute dark:before:inset-0 dark:before:rounded-2xl",
        "dark:before:bg-gradient-to-br dark:before:from-primary/5 dark:before:to-transparent dark:before:pointer-events-none",
        onClick && "cursor-pointer",
        className,
      )}
      data-ocid="kpi.card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="font-display font-bold text-2xl text-foreground truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {subtitle}
            </p>
          )}
          {trendValue !== undefined && (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 mt-3 px-2 py-1 rounded-full text-xs font-semibold",
                trendConfig.bg,
                trendConfig.color,
              )}
            >
              <TrendIcon className="w-3 h-3" />
              {trendValue > 0 ? "+" : ""}
              {trendValue}% vs last month
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl shrink-0",
            "bg-muted/60 border border-border/50",
            iconColor,
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
