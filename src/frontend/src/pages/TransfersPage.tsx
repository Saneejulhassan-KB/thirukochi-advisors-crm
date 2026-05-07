import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockBranches, mockEmployees, mockTransfers } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Transfer, TransferStatus } from "@/types";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  GitMerge,
  Plus,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function getEmployee(id: string) {
  return mockEmployees.find((e) => e.id === id);
}
function getBranch(id: string) {
  return mockBranches.find((b) => b.id === id);
}
function getZoneName(branchId: string) {
  const branch = getBranch(branchId);
  const zones: Record<string, string> = {
    z1: "Kochi",
    z2: "Thrissur",
    z3: "Calicut",
    z4: "Trivandrum",
  };
  return branch ? (zones[branch.zoneId] ?? "—") : "—";
}

const INITIALS_BG = [
  "bg-indigo-500",
  "bg-purple-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-amber-500",
];

function TKAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  const bg = INITIALS_BG[name.charCodeAt(0) % INITIALS_BG.length];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0",
        bg,
        size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm",
      )}
    >
      {initials}
    </span>
  );
}

interface CreateTransferForm {
  employeeId: string;
  toBranchId: string;
  reason: string;
  priority: "normal" | "urgent";
  effectiveDate: string;
  notes: string;
}

const defaultForm: CreateTransferForm = {
  employeeId: "",
  toBranchId: "",
  reason: "",
  priority: "normal",
  effectiveDate: "",
  notes: "",
};

const staffingData = [
  { branch: "Kochi Main", current: 8, optimal: 8, recommendation: "Balanced" },
  { branch: "Fort Kochi", current: 6, optimal: 8, recommendation: "Hire 2" },
  {
    branch: "Ernakulam North",
    current: 5,
    optimal: 7,
    recommendation: "Transfer in",
  },
  {
    branch: "Thrissur Central",
    current: 7,
    optimal: 6,
    recommendation: "Transfer out",
  },
  {
    branch: "Kodungallur",
    current: 4,
    optimal: 5,
    recommendation: "Transfer in",
  },
  {
    branch: "Irinjalakuda",
    current: 4,
    optimal: 5,
    recommendation: "Transfer in",
  },
  {
    branch: "Calicut Main",
    current: 6,
    optimal: 6,
    recommendation: "Balanced",
  },
  {
    branch: "Kozhikode South",
    current: 5,
    optimal: 5,
    recommendation: "Balanced",
  },
  { branch: "Vatakara", current: 4, optimal: 4, recommendation: "Balanced" },
  {
    branch: "Trivandrum East",
    current: 6,
    optimal: 7,
    recommendation: "Transfer in",
  },
  { branch: "Palayam", current: 5, optimal: 4, recommendation: "Transfer out" },
  { branch: "Technopark", current: 4, optimal: 6, recommendation: "Hire 2" },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateTransferForm>(defaultForm);

  const pending = transfers.filter((t) => t.status === "pending");

  const stats = [
    {
      title: "Total Transfers",
      value: transfers.length,
      icon: <GitMerge className="w-5 h-5" />,
      color: "text-primary",
      trend: "neutral" as const,
    },
    {
      title: "Pending Approval",
      value: pending.length,
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-500",
      trend: "neutral" as const,
    },
    {
      title: "Completed",
      value: transfers.filter((t) => t.status === "approved").length,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-emerald-500",
      trend: "up" as const,
    },
    {
      title: "Rejected",
      value: transfers.filter((t) => t.status === "rejected").length,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-500",
      trend: "neutral" as const,
    },
  ];

  const handleApprove = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "approved" as TransferStatus,
              approvedBy: "e1",
              processedAt: new Date().toISOString().split("T")[0],
            }
          : t,
      ),
    );
    toast.success("Transfer approved successfully");
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === rejectTarget
          ? {
              ...t,
              status: "rejected" as TransferStatus,
              reason: rejectReason || t.reason,
              processedAt: new Date().toISOString().split("T")[0],
            }
          : t,
      ),
    );
    setRejectTarget(null);
    setRejectReason("");
    toast.error("Transfer rejected");
  };

  const selectedEmployee = mockEmployees.find((e) => e.id === form.employeeId);
  const toBranches = selectedEmployee
    ? mockBranches.filter((b) => b.id !== selectedEmployee.branchId)
    : mockBranches;

  const handleCreate = () => {
    if (!form.employeeId || !form.toBranchId || !form.reason) {
      toast.error("Please fill all required fields");
      return;
    }
    const newTransfer: Transfer = {
      id: `t${Date.now()}`,
      employeeId: form.employeeId,
      fromBranchId: selectedEmployee?.branchId ?? "",
      toBranchId: form.toBranchId,
      requestedBy: "e1",
      approvedBy: null,
      status: "pending",
      reason: form.reason,
      requestedAt: new Date().toISOString().split("T")[0],
      processedAt: null,
    };
    setTransfers((prev) => [newTransfer, ...prev]);
    setForm(defaultForm);
    setShowCreate(false);
    toast.success("Transfer request created");
  };

  const tableColumns = useMemo(
    () => [
      {
        key: "employeeId",
        header: "Employee",
        render: (_: unknown, row: Transfer) => {
          const emp = getEmployee(row.employeeId);
          return emp ? (
            <div className="flex items-center gap-2">
              <TKAvatar name={emp.name} size="sm" />
              <span className="font-medium text-foreground">{emp.name}</span>
            </div>
          ) : (
            "—"
          );
        },
      },
      {
        key: "fromBranchId",
        header: "From Branch",
        render: (_: unknown, row: Transfer) =>
          getBranch(row.fromBranchId)?.name ?? "—",
      },
      {
        key: "toBranchId",
        header: "To Branch",
        render: (_: unknown, row: Transfer) =>
          getBranch(row.toBranchId)?.name ?? "—",
      },
      {
        key: "zone",
        header: "Zone",
        render: (_: unknown, row: Transfer) => getZoneName(row.fromBranchId),
      },
      {
        key: "requestedBy",
        header: "Requested By",
        render: (_: unknown, row: Transfer) =>
          getEmployee(row.requestedBy)?.name ?? "—",
      },
      {
        key: "requestedAt",
        header: "Date",
        render: (_: unknown, row: Transfer) => row.requestedAt,
      },
      {
        key: "status",
        header: "Status",
        render: (_: unknown, row: Transfer) => (
          <StatusBadge status={row.status} />
        ),
      },
    ],
    [],
  );

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="transfers.page">
          <PageHeader
            title="Transfer Management"
            subtitle="Manage employee transfers across branches"
            actions={[
              {
                label: "Create Transfer Request",
                icon: <Plus className="w-4 h-4" />,
                onClick: () => setShowCreate(true),
              },
            ]}
          />

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <KPICard
                key={s.title}
                title={s.title}
                value={s.value}
                icon={s.icon}
                iconColor={s.color}
                trend={s.trend}
              />
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pending" data-ocid="transfers.tabs">
            <TabsList className="bg-muted/60 dark:bg-muted/30">
              <TabsTrigger value="pending" data-ocid="transfers.tab.pending">
                Pending
                {pending.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {pending.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" data-ocid="transfers.tab.all">
                All Transfers
              </TabsTrigger>
              <TabsTrigger value="history" data-ocid="transfers.tab.history">
                History
              </TabsTrigger>
            </TabsList>

            {/* Pending Tab */}
            <TabsContent value="pending" className="mt-4">
              {pending.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <EmptyState
                    icon={<CheckCircle className="w-10 h-10" />}
                    title="No Pending Transfers"
                    description="All transfer requests have been processed."
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((t, idx) => {
                    const emp = getEmployee(t.employeeId);
                    const fromB = getBranch(t.fromBranchId);
                    const toB = getBranch(t.toBranchId);
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        data-ocid={`transfers.pending.item.${idx + 1}`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {emp && <TKAvatar name={emp.name} />}
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">
                              {emp?.name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {emp?.designation}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="text-sm text-muted-foreground">
                                {fromB?.name ?? "—"}
                              </span>
                              <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                              <span className="text-sm font-medium text-foreground">
                                {toB?.name ?? "—"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                              {t.reason}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
                            {t.requestedAt}
                          </span>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            onClick={() => handleApprove(t.id)}
                            data-ocid={`transfers.approve_button.${idx + 1}`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/40 text-red-500 hover:bg-red-500/10 gap-1"
                            onClick={() => {
                              setRejectTarget(t.id);
                              setRejectReason("");
                            }}
                            data-ocid={`transfers.reject_button.${idx + 1}`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* All Transfers Tab */}
            <TabsContent value="all" className="mt-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <DataTable
                  columns={tableColumns}
                  data={transfers}
                  pageSize={10}
                  searchable
                  searchPlaceholder="Search by employee or branch..."
                  keyExtractor={(t) => t.id}
                  actions={(_row) => (
                    <Button variant="ghost" size="sm" className="text-primary">
                      View
                    </Button>
                  )}
                />
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="relative space-y-0">
                  {transfers
                    .filter((t) => t.status !== "pending")
                    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
                    .map((t, idx) => {
                      const emp = getEmployee(t.employeeId);
                      const fromB = getBranch(t.fromBranchId);
                      const toB = getBranch(t.toBranchId);
                      const approver = t.approvedBy
                        ? getEmployee(t.approvedBy)
                        : null;
                      return (
                        <div
                          key={t.id}
                          className="flex gap-4 pb-6 last:pb-0 relative"
                          data-ocid={`transfers.history.item.${idx + 1}`}
                        >
                          <div className="flex flex-col items-center shrink-0">
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full mt-1 shrink-0 border-2",
                                t.status === "approved"
                                  ? "bg-emerald-500 border-emerald-500"
                                  : "bg-red-500 border-red-500",
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0 pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-foreground text-sm">
                                    {emp?.name ?? "Unknown"}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {fromB?.name} → {toB?.name}
                                  </span>
                                </div>
                                {approver && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Processed by {approver.name}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground hidden sm:inline">
                                  {t.processedAt ?? t.requestedAt}
                                </span>
                                <StatusBadge status={t.status} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Branch Staffing Analytics */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-lg text-foreground">
                Branch Staffing Analytics
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Branch Name",
                      "Current Staff",
                      "Optimal Staff",
                      "Variance",
                      "Transfer Recommendation",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staffingData.map((row, i) => {
                    const variance = row.current - row.optimal;
                    return (
                      <tr
                        key={row.branch}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                        data-ocid={`transfers.staffing.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {row.branch}
                        </td>
                        <td className="px-4 py-3 text-center">{row.current}</td>
                        <td className="px-4 py-3 text-center">{row.optimal}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              "font-semibold",
                              variance > 0
                                ? "text-emerald-500"
                                : variance < 0
                                  ? "text-red-500"
                                  : "text-muted-foreground",
                            )}
                          >
                            {variance > 0 ? `+${variance}` : variance}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                              variance > 0
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                                : variance < 0
                                  ? "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400"
                                  : "bg-muted text-muted-foreground border-border",
                            )}
                          >
                            {row.recommendation}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reject Dialog */}
        <Dialog
          open={!!rejectTarget}
          onOpenChange={(o) => !o && setRejectTarget(null)}
        >
          <DialogContent data-ocid="transfers.reject.dialog">
            <DialogHeader>
              <DialogTitle>Reject Transfer Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reject-reason">Reason for Rejection</Label>
                <Textarea
                  id="reject-reason"
                  placeholder="Enter rejection reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="mt-1"
                  data-ocid="transfers.reject.textarea"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setRejectTarget(null)}
                  data-ocid="transfers.reject.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  data-ocid="transfers.reject.confirm_button"
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Transfer Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent
            className="max-w-lg"
            data-ocid="transfers.create.dialog"
          >
            <DialogHeader>
              <DialogTitle>Create Transfer Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee *</Label>
                <Select
                  value={form.employeeId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, employeeId: v, toBranchId: "" }))
                  }
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="transfers.create.employee_select"
                  >
                    <SelectValue placeholder="Select employee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name} — {getBranch(e.branchId)?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedEmployee && (
                <div>
                  <Label>From Branch (auto-filled)</Label>
                  <Input
                    value={getBranch(selectedEmployee.branchId)?.name ?? ""}
                    readOnly
                    className="mt-1 bg-muted/40"
                  />
                </div>
              )}
              <div>
                <Label>To Branch *</Label>
                <Select
                  value={form.toBranchId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, toBranchId: v }))
                  }
                  disabled={!form.employeeId}
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="transfers.create.to_branch_select"
                  >
                    <SelectValue placeholder="Select target branch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {toBranches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reason *</Label>
                <Textarea
                  placeholder="Transfer reason..."
                  value={form.reason}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reason: e.target.value }))
                  }
                  className="mt-1"
                  data-ocid="transfers.create.reason_textarea"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        priority: v as "normal" | "urgent",
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Effective Date</Label>
                  <Input
                    type="date"
                    value={form.effectiveDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, effectiveDate: e.target.value }))
                    }
                    className="mt-1"
                    data-ocid="transfers.create.date_input"
                  />
                </div>
              </div>
              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Optional notes..."
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreate(false);
                    setForm(defaultForm);
                  }}
                  data-ocid="transfers.create.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  data-ocid="transfers.create.submit_button"
                >
                  Create Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </ProtectedRoute>
  );
}
