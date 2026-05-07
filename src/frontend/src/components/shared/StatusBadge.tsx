import { cn } from "@/lib/utils";

type Status =
  | "active"
  | "inactive"
  | "pending"
  | "overdue"
  | "approved"
  | "rejected"
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "present"
  | "absent"
  | "late"
  | "completed"
  | "failed"
  | "bounced"
  | "transferred"
  | "on_leave"
  | "weekend"
  | "closed";

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  low: {
    label: "Low Risk",
    className:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  high: {
    label: "High",
    className:
      "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400",
  },
  critical: {
    label: "Critical",
    className: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  present: {
    label: "Present",
    className:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  absent: {
    label: "Absent",
    className: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  late: {
    label: "Late",
    className:
      "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  bounced: {
    label: "Bounced",
    className: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  transferred: {
    label: "Transferred",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  on_leave: {
    label: "On Leave",
    className: "bg-secondary/15 text-secondary border-secondary/30",
  },
  weekend: {
    label: "Weekend",
    className: "bg-muted text-muted-foreground border-border",
  },
  closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground border-border",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
