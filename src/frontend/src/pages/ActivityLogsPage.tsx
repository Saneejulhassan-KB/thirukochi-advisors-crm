import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockActivityLogs, mockEmployees } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@/types";
import {
  ActivitySquare,
  AlertTriangle,
  Download,
  Filter,
  Search,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Extended mock data ───────────────────────────────────────────────────────
const extraLogs: ActivityLog[] = [
  {
    id: "al11",
    userId: "e3",
    action: "CREATE",
    description: "New customer Rajeev Kumar added to Fort Kochi branch",
    entityType: "customer",
    entityId: "c21",
    ipAddress: "192.168.1.102",
    createdAt: "2026-04-30T11:25:00",
  },
  {
    id: "al12",
    userId: "e6",
    action: "EDIT",
    description: "Updated EMI schedule for Aravindakshan K (c11)",
    entityType: "customer",
    entityId: "c11",
    ipAddress: "192.168.1.112",
    createdAt: "2026-04-30T12:40:00",
  },
  {
    id: "al13",
    userId: "e1",
    action: "EXPORT",
    description: "Exported employee performance report Q1 2026",
    entityType: "report",
    entityId: "rep_q1_2026",
    ipAddress: "192.168.1.100",
    createdAt: "2026-04-30T14:05:00",
  },
  {
    id: "al14",
    userId: "e9",
    action: "LOGIN",
    description: "Zonal Manager logged in from Calicut office",
    entityType: "auth",
    entityId: "e9",
    ipAddress: "103.45.67.100",
    createdAt: "2026-04-30T08:30:00",
  },
  {
    id: "al15",
    userId: "e13",
    action: "LOGIN",
    description: "Zonal Manager logged in from Trivandrum office",
    entityType: "auth",
    entityId: "e13",
    ipAddress: "103.45.67.101",
    createdAt: "2026-04-30T09:00:00",
  },
  {
    id: "al16",
    userId: "e22",
    action: "VIEW",
    description: "Viewed customer profile Aravindakshan K (c11)",
    entityType: "customer",
    entityId: "c11",
    ipAddress: "192.168.1.115",
    createdAt: "2026-04-29T10:15:00",
  },
  {
    id: "al17",
    userId: "e25",
    action: "CREATE",
    description: "Follow-up note added for Abdulkalam T (c15)",
    entityType: "customer",
    entityId: "c15",
    ipAddress: "192.168.1.130",
    createdAt: "2026-04-29T11:00:00",
  },
  {
    id: "al18",
    userId: "e1",
    action: "DELETE",
    description: "Duplicate customer record deleted (temp_c99)",
    entityType: "customer",
    entityId: "temp_c99",
    ipAddress: "192.168.1.100",
    createdAt: "2026-04-29T13:45:00",
  },
  {
    id: "al19",
    userId: "e2",
    action: "APPROVE",
    description: "Approved leave request for Anjali Pillai",
    entityType: "leave",
    entityId: "lv_e17",
    ipAddress: "192.168.1.102",
    createdAt: "2026-04-29T14:20:00",
  },
  {
    id: "al20",
    userId: "e5",
    action: "EXPORT",
    description: "Exported Thrissur Zone monthly report — April 2026",
    entityType: "report",
    entityId: "rep_z2_apr26",
    ipAddress: "192.168.1.110",
    createdAt: "2026-04-29T15:30:00",
  },
  {
    id: "al21",
    userId: "e17",
    action: "LOGIN",
    description: "Staff logged in from mobile device",
    entityType: "auth",
    entityId: "e17",
    ipAddress: "103.45.67.89",
    createdAt: "2026-04-28T08:05:00",
  },
  {
    id: "al22",
    userId: "e18",
    action: "EDIT",
    description: "Updated contact phone for Muraleedharan K (c3)",
    entityType: "customer",
    entityId: "c3",
    ipAddress: "192.168.1.115",
    createdAt: "2026-04-28T10:45:00",
  },
  {
    id: "al23",
    userId: "e14",
    action: "CREATE",
    description: "New EMI schedule created for Sugunan P (c19)",
    entityType: "payment",
    entityId: "emi_c19",
    ipAddress: "192.168.1.120",
    createdAt: "2026-04-28T11:30:00",
  },
  {
    id: "al24",
    userId: "e1",
    action: "LOGIN",
    description: "Super Admin login — suspicious location detected",
    entityType: "auth",
    entityId: "e1",
    ipAddress: "45.33.22.11",
    createdAt: "2026-04-27T02:15:00",
  },
  {
    id: "al25",
    userId: "e3",
    action: "EXPORT",
    description: "Bulk customer data export (219 records)",
    entityType: "customer",
    entityId: "bulk_export_01",
    ipAddress: "192.168.1.102",
    createdAt: "2026-04-26T16:45:00",
  },
  {
    id: "al26",
    userId: "e6",
    action: "APPROVE",
    description: "Transfer request approved for Harish Raj (e24)",
    entityType: "transfer",
    entityId: "t2",
    ipAddress: "192.168.1.112",
    createdAt: "2026-04-26T09:30:00",
  },
  {
    id: "al27",
    userId: "e27",
    action: "VIEW",
    description: "Viewed EMI schedule for Geetha Lekshmi (c18)",
    entityType: "payment",
    entityId: "emi_c18",
    ipAddress: "192.168.1.135",
    createdAt: "2026-04-25T14:00:00",
  },
  {
    id: "al28",
    userId: "e20",
    action: "EDIT",
    description: "KYC status updated for Babu Jose (c7)",
    entityType: "customer",
    entityId: "c7",
    ipAddress: "192.168.1.120",
    createdAt: "2026-04-25T10:30:00",
  },
  {
    id: "al29",
    userId: "e10",
    action: "CREATE",
    description: "Branch announcement posted for Calicut Main",
    entityType: "branch",
    entityId: "b7",
    ipAddress: "192.168.1.125",
    createdAt: "2026-04-24T09:15:00",
  },
  {
    id: "al30",
    userId: "e1",
    action: "DELETE",
    description: "Inactive employee record archived (e28)",
    entityType: "employee",
    entityId: "e28",
    ipAddress: "192.168.1.100",
    createdAt: "2026-04-24T11:00:00",
  },
  {
    id: "al31",
    userId: "e11",
    action: "LOGIN",
    description: "Branch Manager logged in from Kozhikode South",
    entityType: "auth",
    entityId: "e11",
    ipAddress: "192.168.1.126",
    createdAt: "2026-04-23T08:10:00",
  },
  {
    id: "al32",
    userId: "e23",
    action: "VIEW",
    description: "Viewed payment history for Sarada Devi Menon (c12)",
    entityType: "payment",
    entityId: "pay_c12",
    ipAddress: "192.168.1.115",
    createdAt: "2026-04-23T13:00:00",
  },
  {
    id: "al33",
    userId: "e12",
    action: "EDIT",
    description: "Updated branch operating hours for Vatakara",
    entityType: "branch",
    entityId: "b9",
    ipAddress: "192.168.1.127",
    createdAt: "2026-04-22T14:30:00",
  },
  {
    id: "al34",
    userId: "e15",
    action: "CREATE",
    description: "Leave request submitted for Sreekanth P",
    entityType: "leave",
    entityId: "lv_e28",
    ipAddress: "192.168.1.124",
    createdAt: "2026-04-22T11:45:00",
  },
  {
    id: "al35",
    userId: "e8",
    action: "EXPORT",
    description: "Branch performance report exported for Irinjalakuda",
    entityType: "report",
    entityId: "rep_b6",
    ipAddress: "192.168.1.117",
    createdAt: "2026-04-21T15:00:00",
  },
  {
    id: "al36",
    userId: "e16",
    action: "APPROVE",
    description: "New loan application approved for Technopark client",
    entityType: "customer",
    entityId: "c22",
    ipAddress: "192.168.1.128",
    createdAt: "2026-04-21T10:00:00",
  },
  {
    id: "al37",
    userId: "e1",
    action: "LOGIN",
    description: "Admin login failed — wrong password (attempt 1)",
    entityType: "auth",
    entityId: "e1",
    ipAddress: "103.45.99.11",
    createdAt: "2026-04-20T03:22:00",
  },
  {
    id: "al38",
    userId: "e1",
    action: "LOGIN",
    description: "Admin login failed — wrong password (attempt 2)",
    entityType: "auth",
    entityId: "e1",
    ipAddress: "103.45.99.11",
    createdAt: "2026-04-20T03:23:00",
  },
  {
    id: "al39",
    userId: "e1",
    action: "LOGIN",
    description: "Admin login failed — wrong password (attempt 3)",
    entityType: "auth",
    entityId: "e1",
    ipAddress: "103.45.99.11",
    createdAt: "2026-04-20T03:24:00",
  },
  {
    id: "al40",
    userId: "e7",
    action: "CREATE",
    description: "Transfer request initiated for Pooja Chandran (e25)",
    entityType: "transfer",
    entityId: "t6",
    ipAddress: "192.168.1.116",
    createdAt: "2026-04-19T14:00:00",
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `al${41 + i}`,
    userId: ["e17", "e18", "e19", "e20", "e21"][i % 5],
    action: ["VIEW", "EDIT", "CREATE"][i % 3],
    description: `Customer record ${["viewed", "updated", "created"][i % 3]} by field agent`,
    entityType: "customer",
    entityId: `c${(i % 20) + 1}`,
    ipAddress: `192.168.1.${110 + i}`,
    createdAt: `2026-04-${String(18 - (i % 15)).padStart(2, "0")}T${String(8 + i).padStart(2, "0")}:00:00`,
  })),
];

const allLogs = [...mockActivityLogs, ...extraLogs].sort((a, b) =>
  b.createdAt.localeCompare(a.createdAt),
);

const suspiciousLogs = [
  {
    id: "sus1",
    title: "Multiple Failed Logins",
    detail:
      "3 consecutive failed login attempts from IP 103.45.99.11 at 03:22–03:24 AM on Apr 20, 2026",
    severity: "critical",
  },
  {
    id: "sus2",
    title: "Unusual Bulk Export",
    detail:
      "219 customer records exported by Branch Manager (e3) at 16:45 on Apr 26, 2026 — outside business hours",
    severity: "high",
  },
  {
    id: "sus3",
    title: "Off-Hours Admin Login",
    detail:
      "Super Admin login from unknown IP 45.33.22.11 at 02:15 AM on Apr 27, 2026 — possible unauthorized access",
    severity: "critical",
  },
];

const ACTION_TYPES = [
  "All",
  "Login",
  "Create",
  "Edit",
  "Delete",
  "Approve",
  "Export",
  "View",
];
const MODULES = [
  "All",
  "Customers",
  "Employees",
  "Branches",
  "Transfers",
  "Settings",
  "Reports",
  "Auth",
];
const PAGE_SIZE = 15;

const actionConfig: Record<string, { label: string; cls: string }> = {
  LOGIN: {
    label: "Login",
    cls: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  },
  CREATE: {
    label: "Create",
    cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  EDIT: {
    label: "Edit",
    cls: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  DELETE: {
    label: "Delete",
    cls: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  APPROVE: {
    label: "Approve",
    cls: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
  },
  EXPORT: {
    label: "Export",
    cls: "bg-teal-500/15 text-teal-600 border-teal-500/30 dark:text-teal-400",
  },
  VIEW: { label: "View", cls: "bg-muted text-muted-foreground border-border" },
  PAYMENT_COLLECTED: {
    label: "Payment",
    cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  TRANSFER_INITIATED: {
    label: "Transfer",
    cls: "bg-primary/15 text-primary border-primary/30",
  },
  CUSTOMER_UPDATED: {
    label: "Edit",
    cls: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  REPORT_DOWNLOADED: {
    label: "Export",
    cls: "bg-teal-500/15 text-teal-600 border-teal-500/30 dark:text-teal-400",
  },
  EMPLOYEE_CREATED: {
    label: "Create",
    cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  TARGET_SET: {
    label: "Create",
    cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  LEAVE_APPROVED: {
    label: "Approve",
    cls: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
  },
  KYC_UPLOADED: {
    label: "Upload",
    cls: "bg-primary/15 text-primary border-primary/30",
  },
};

function getStatus(log: ActivityLog): { label: string; cls: string } {
  const suspicious = ["103.45.99.11", "45.33.22.11"];
  if (suspicious.includes(log.ipAddress))
    return {
      label: "Suspicious",
      cls: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    };
  if (log.description.toLowerCase().includes("failed"))
    return {
      label: "Failed",
      cls: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    };
  return {
    label: "Success",
    cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  };
}

function getModuleFromEntityType(entityType: string): string {
  const map: Record<string, string> = {
    customer: "Customers",
    employee: "Employees",
    branch: "Branches",
    transfer: "Transfers",
    auth: "Auth",
    report: "Reports",
    payment: "Customers",
    leave: "Employees",
    target: "Settings",
  };
  return map[entityType] ?? entityType;
}

function getEmployee(id: string) {
  return mockEmployees.find((e) => e.id === id);
}

function LogAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  const BGTYPES = [
    "bg-indigo-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-rose-500",
    "bg-amber-500",
  ];
  const bg = BGTYPES[name.charCodeAt(0) % BGTYPES.length];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 w-7 h-7 text-xs",
        bg,
      )}
    >
      {initials}
    </span>
  );
}

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [investigateLog, setInvestigateLog] = useState<
    (typeof suspiciousLogs)[0] | null
  >(null);

  const filtered = useMemo(() => {
    return allLogs.filter((log) => {
      const emp = getEmployee(log.userId);
      const matchSearch =
        !search ||
        [emp?.name ?? "", log.action, log.description, log.ipAddress].some(
          (v) => v.toLowerCase().includes(search.toLowerCase()),
        );
      const matchAction =
        actionFilter === "All" ||
        log.action.includes(actionFilter.toUpperCase());
      const matchModule =
        moduleFilter === "All" ||
        getModuleFromEntityType(log.entityType) === moduleFilter;
      return matchSearch && matchAction && matchModule;
    });
  }, [search, actionFilter, moduleFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = search || actionFilter !== "All" || moduleFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setActionFilter("All");
    setModuleFilter("All");
    setPage(1);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="activity_logs.page">
          <PageHeader
            title="Activity Logs"
            subtitle="Complete audit trail of all system actions"
            actions={[
              {
                label: "Export Audit Log",
                icon: <Download className="w-4 h-4" />,
                onClick: () => {},
                variant: "outline",
              },
            ]}
          />

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Actions Today", value: "247", icon: "⚡" },
              { title: "This Month", value: "5,821", icon: "📊" },
              { title: "Active Users", value: "32", icon: "👥" },
              { title: "Most Active Module", value: "Customers", icon: "👤" },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-4"
                data-ocid={`activity_logs.stat.${i + 1}`}
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  {s.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="font-display font-bold text-2xl text-foreground">
                    {s.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, action, IP..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                  data-ocid="activity_logs.search_input"
                />
              </div>
              <Select
                value={actionFilter}
                onValueChange={(v) => {
                  setActionFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  className="w-36"
                  data-ocid="activity_logs.action_filter"
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={moduleFilter}
                onValueChange={(v) => {
                  setModuleFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  className="w-36"
                  data-ocid="activity_logs.module_filter"
                >
                  <ActivitySquare className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  {MODULES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1.5 text-muted-foreground"
                  data-ocid="activity_logs.clear_filters"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </Button>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {filtered.length} records
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    {[
                      "Timestamp",
                      "User",
                      "Role",
                      "Action",
                      "Module",
                      "Description",
                      "IP Address",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState
                          title="No activity logs found"
                          description="Try adjusting your search or filters."
                        />
                      </td>
                    </tr>
                  ) : (
                    paged.map((log, idx) => {
                      const emp = getEmployee(log.userId);
                      const actionCfg = actionConfig[log.action] ?? {
                        label: log.action,
                        cls: "bg-muted text-muted-foreground border-border",
                      };
                      const statusCfg = getStatus(log);
                      const module = getModuleFromEntityType(log.entityType);
                      return (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                          data-ocid={`activity_logs.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {emp && <LogAvatar name={emp.name} />}
                              <span className="font-medium text-foreground whitespace-nowrap">
                                {emp?.name ?? log.userId}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary whitespace-nowrap">
                              {emp?.role.replace("_", " ") ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                                actionCfg.cls,
                              )}
                            >
                              {actionCfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {module}
                          </td>
                          <td className="px-4 py-3 text-foreground max-w-xs">
                            <p className="truncate" title={log.description}>
                              {log.description}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {log.ipAddress}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                                statusCfg.cls,
                              )}
                            >
                              {statusCfg.label}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages} — {filtered.length} records
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-ocid="activity_logs.pagination_prev"
                  >
                    ← Prev
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg =
                      Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    return (
                      <Button
                        key={pg}
                        variant={pg === page ? "default" : "ghost"}
                        size="sm"
                        className="w-8 h-8 p-0 text-xs"
                        onClick={() => setPage(pg)}
                        data-ocid={`activity_logs.page.${pg}`}
                      >
                        {pg}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    data-ocid="activity_logs.pagination_next"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Suspicious Activity */}
          <div
            className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5"
            data-ocid="activity_logs.suspicious.section"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="font-display font-semibold text-lg text-foreground">
                Suspicious Activity
              </h2>
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-600 border border-red-500/30 dark:text-red-400">
                {suspiciousLogs.length} flagged
              </span>
            </div>
            <div className="space-y-3">
              {suspiciousLogs.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-card"
                  data-ocid={`activity_logs.suspicious.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold border",
                          s.severity === "critical"
                            ? "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400"
                            : "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
                        )}
                      >
                        {s.severity.toUpperCase()}
                      </span>
                      <span className="font-semibold text-foreground text-sm">
                        {s.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-red-500/40 text-red-500 hover:bg-red-500/10"
                    onClick={() => setInvestigateLog(s)}
                    data-ocid={`activity_logs.investigate_button.${i + 1}`}
                  >
                    Investigate
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investigate Dialog */}
        <Dialog
          open={!!investigateLog}
          onOpenChange={(o) => !o && setInvestigateLog(null)}
        >
          <DialogContent data-ocid="activity_logs.investigate.dialog">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Investigate: {investigateLog?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {investigateLog?.detail}
              </p>
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Recommended Actions
                </p>
                <ul className="space-y-1 text-sm text-foreground">
                  <li>• Review all sessions from flagged IP addresses</li>
                  <li>• Force password reset for affected users</li>
                  <li>• Enable IP whitelist restriction</li>
                  <li>• Notify compliance officer for review</li>
                </ul>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setInvestigateLog(null)}
                  data-ocid="activity_logs.investigate.cancel_button"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setInvestigateLog(null);
                  }}
                  data-ocid="activity_logs.investigate.confirm_button"
                >
                  Block IP &amp; Alert Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </ProtectedRoute>
  );
}
