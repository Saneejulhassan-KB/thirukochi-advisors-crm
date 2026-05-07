import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ActionItem[];
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
        className,
      )}
      data-ocid="page_header"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-2xl text-foreground truncate">
            {title}
          </h1>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {actions.map((action, i) => (
            <Button
              key={action.label}
              variant={action.variant ?? "default"}
              onClick={action.onClick}
              className="gap-2"
              data-ocid={`page_header.action_button.${i + 1}`}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
