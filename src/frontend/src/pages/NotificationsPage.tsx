import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notificationStore";
import type { Notification, NotificationType } from "@/types";
import {
  AlertTriangle,
  Bell,
  BellOff,
  BookOpen,
  Cake,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Megaphone,
  ShieldAlert,
  Sparkles,
  Trash2,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FilterTab = "all" | "unread" | "events_programs" | "memos" | "comments";

interface PrefRow {
  type: string;
  label: string;
  inApp: boolean;
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
}

const INITIAL_PREFS: PrefRow[] = [
  {
    type: "payment",
    label: "Payment Reminders",
    inApp: true,
    email: true,
    whatsapp: true,
    sms: true,
  },
  {
    type: "attendance",
    label: "Attendance Alerts",
    inApp: true,
    email: true,
    whatsapp: false,
    sms: false,
  },
  {
    type: "transfer",
    label: "Transfer Updates",
    inApp: true,
    email: true,
    whatsapp: false,
    sms: false,
  },
  {
    type: "system",
    label: "System Alerts",
    inApp: true,
    email: true,
    whatsapp: false,
    sms: false,
  },
  {
    type: "birthday",
    label: "Birthday Reminders",
    inApp: true,
    email: false,
    whatsapp: true,
    sms: false,
  },
];

const TYPE_ICON_MAP: Record<NotificationType, React.ReactNode> = {
  payment_due: <CheckCircle className="w-5 h-5" />,
  overdue_alert: <AlertTriangle className="w-5 h-5" />,
  transfer_request: <Users className="w-5 h-5" />,
  transfer_approval: <Users className="w-5 h-5" />,
  attendance_missing: <Clock className="w-5 h-5" />,
  target_achieved: <Trophy className="w-5 h-5" />,
  new_customer: <Bell className="w-5 h-5" />,
  leave_request: <Calendar className="w-5 h-5" />,
  kyc_pending: <ShieldAlert className="w-5 h-5" />,
  birthday_reminder: <Cake className="w-5 h-5" />,
  system_alert: <Info className="w-5 h-5" />,
  memo: <FileText className="w-5 h-5" />,
  program: <BookOpen className="w-5 h-5" />,
  event: <Sparkles className="w-5 h-5" />,
  marketing_notice: <Megaphone className="w-5 h-5" />,
};

const TYPE_COLOR_MAP: Record<NotificationType, string> = {
  payment_due: "bg-emerald-500/15 text-emerald-500",
  overdue_alert: "bg-red-500/15 text-red-500",
  transfer_request: "bg-purple-500/15 text-purple-500",
  transfer_approval: "bg-purple-500/15 text-purple-500",
  attendance_missing: "bg-amber-500/15 text-amber-500",
  target_achieved: "bg-emerald-500/15 text-emerald-500",
  new_customer: "bg-blue-500/15 text-blue-500",
  leave_request: "bg-amber-500/15 text-amber-500",
  kyc_pending: "bg-orange-500/15 text-orange-500",
  birthday_reminder: "bg-pink-500/15 text-pink-500",
  system_alert: "bg-blue-500/15 text-blue-500",
  memo: "bg-yellow-500/15 text-yellow-600",
  program: "bg-sky-500/15 text-sky-500",
  event: "bg-violet-500/15 text-violet-500",
  marketing_notice: "bg-orange-500/15 text-orange-500",
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function filterByTab(
  notifications: Notification[],
  tab: FilterTab,
): Notification[] {
  switch (tab) {
    case "unread":
      return notifications.filter((n) => !n.isRead);
    case "events_programs":
      return notifications.filter(
        (n) => n.type === "event" || n.type === "program",
      );
    case "memos":
      return notifications.filter((n) => n.type === "memo");
    case "comments":
      return notifications.filter((n) => n.type === "marketing_notice");
    default:
      return notifications;
  }
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "events_programs", label: "Events & Programs" },
  { id: "memos", label: "Memos" },
  { id: "comments", label: "Comments" },
];

function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const iconColor = TYPE_COLOR_MAP[notification.type];
  const icon = TYPE_ICON_MAP[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-smooth group",
        !notification.isRead
          ? "bg-primary/5 border-primary/20 dark:bg-primary/8"
          : "bg-card border-border hover:bg-muted/30",
      )}
      data-ocid={`notifications.item.${notification.id}`}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          iconColor,
        )}
      >
        {icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-semibold truncate",
              !notification.isRead
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {notification.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {/* Priority dot */}
            <span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                PRIORITY_COLOR[notification.priority],
                notification.isRead && "opacity-40",
              )}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {relativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-smooth">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => onMarkRead(notification.id)}
            data-ocid={`notifications.mark_read_button.${notification.id}`}
            title="Mark as read"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDismiss(notification.id)}
          data-ocid={`notifications.dismiss_button.${notification.id}`}
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <span className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}
    </motion.div>
  );
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
  } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [prefs, setPrefs] = useState<PrefRow[]>(INITIAL_PREFS);

  const filtered = useMemo(
    () => filterByTab(notifications, activeTab),
    [notifications, activeTab],
  );

  const highPriority = useMemo(
    () =>
      notifications.filter(
        (n) => n.priority === "critical" || n.priority === "high",
      ).length,
    [notifications],
  );

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return notifications.filter(
      (n) => new Date(n.createdAt).toDateString() === today,
    ).length;
  }, [notifications]);

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    clearAll();
    toast.success("All notifications cleared");
  };

  const togglePref = (
    idx: number,
    channel: keyof Omit<PrefRow, "type" | "label">,
  ) => {
    setPrefs((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [channel]: !row[channel] } : row,
      ),
    );
  };

  const handleSavePrefs = () => {
    toast.success("Notification preferences saved");
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div
          className="p-6 max-w-5xl mx-auto space-y-6"
          data-ocid="notifications.page"
        >
          <PageHeader
            title="Notifications"
            subtitle="Stay updated with alerts, reminders, and system messages"
            actions={[
              {
                label: "Mark All Read",
                onClick: handleMarkAllRead,
                icon: <CheckCircle className="w-4 h-4" />,
                variant: "outline",
              },
              {
                label: "Clear All",
                onClick: handleClearAll,
                icon: <Trash2 className="w-4 h-4" />,
                variant: "outline",
              },
            ]}
          />

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total"
              value={notifications.length}
              icon={<Bell className="w-5 h-5" />}
              iconColor="text-primary"
              subtitle="All notifications"
            />
            <KPICard
              title="Unread"
              value={unreadCount}
              icon={<BellOff className="w-5 h-5" />}
              iconColor="text-amber-500"
              subtitle="Need attention"
            />
            <KPICard
              title="High Priority"
              value={highPriority}
              icon={<AlertTriangle className="w-5 h-5" />}
              iconColor="text-red-500"
              subtitle="Critical & high"
            />
            <KPICard
              title="Today"
              value={todayCount}
              icon={<Clock className="w-5 h-5" />}
              iconColor="text-blue-500"
              subtitle="Received today"
            />
          </div>

          {/* Filter Tabs */}
          <div
            className="flex items-center gap-1 overflow-x-auto pb-1 bg-muted/40 p-1.5 rounded-xl border border-border"
            data-ocid="notifications.filter_tabs"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap relative",
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid={`notifications.${tab.id}.tab`}
              >
                {tab.label}
                {tab.id === "unread" && unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-1.5 h-4 px-1.5 text-xs min-w-[16px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="space-y-2 relative" data-ocid="notifications.list">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                  data-ocid="notifications.empty_state"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">
                    No notifications
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </motion.div>
              ) : (
                filtered.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={markAsRead}
                    onDismiss={removeNotification}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6"
            data-ocid="notifications.preferences_section"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">
                  Notification Preferences
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Choose how you want to receive each type of notification
                </p>
              </div>
              <Button
                onClick={handleSavePrefs}
                data-ocid="notifications.save_prefs_button"
              >
                Save Preferences
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 text-muted-foreground font-semibold pr-6">
                      Notification Type
                    </th>
                    {["In-App", "Email", "WhatsApp", "SMS"].map((ch) => (
                      <th
                        key={ch}
                        className="text-center pb-3 px-4 text-muted-foreground font-semibold"
                      >
                        {ch}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {prefs.map((row, idx) => (
                    <tr
                      key={row.type}
                      className="hover:bg-muted/20 transition-smooth"
                    >
                      <td className="py-3 pr-6 font-medium text-foreground">
                        {row.label}
                      </td>
                      {(["inApp", "email", "whatsapp", "sms"] as const).map(
                        (channel) => (
                          <td key={channel} className="py-3 px-4 text-center">
                            <Switch
                              checked={row[channel]}
                              onCheckedChange={() => togglePref(idx, channel)}
                              data-ocid={`notifications.pref.${row.type}.${channel}.switch`}
                            />
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
