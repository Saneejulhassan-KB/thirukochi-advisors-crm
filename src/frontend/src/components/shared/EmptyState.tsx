import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-8 py-12",
        className,
      )}
      data-ocid="empty_state"
    >
      {icon ? (
        <div className="mb-4 text-muted-foreground">{icon}</div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📥</span>
        </div>
      )}
      <h3 className="font-display font-semibold text-base text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="default"
          size="sm"
          data-ocid="empty_state.action_button"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
