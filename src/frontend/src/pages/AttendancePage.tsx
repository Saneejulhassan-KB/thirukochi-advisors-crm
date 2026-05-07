import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { mockAttendance, mockBranches, mockEmployees } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { AttendanceRecord, LeaveRequest } from "@/types";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  TrendingUp,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Mock Leave Requests ──────────────────────────────────────────────────────
const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: "lv1",
    employeeId: "e17",
    leaveType: "casual",
    fromDate: "2026-05-05",
    toDate: "2026-05-07",
    reason: "Personal work",
    status: "pending",
    approvedBy: null,
    createdAt: "2026-04-28",
  },
  {
    id: "lv2",
    employeeId: "e22",
    leaveType: "sick",
    fromDate: "2026-05-02",
    toDate: "2026-05-03",
    reason: "Medical appointment",
    status: "pending",
    approvedBy: null,
    createdAt: "2026-04-29",
  },
  {
    id: "lv3",
    employeeId: "e25",
    leaveType: "annual",
    fromDate: "2026-05-12",
    toDate: "2026-05-16",
    reason: "Family vacation",
    status: "approved",
    approvedBy: "e9",
    createdAt: "2026-04-20",
  },
  {
    id: "lv4",
    employeeId: "e28",
    leaveType: "casual",
    fromDate: "2026-05-01",
    toDate: "2026-05-01",
    reason: "Local festival",
    status: "rejected",
    approvedBy: "e15",
    createdAt: "2026-04-25",
  },
  {
    id: "lv5",
    employeeId: "e19",
    leaveType: "sick",
    fromDate: "2026-05-08",
    toDate: "2026-05-09",
    reason: "Fever and cold",
    status: "pending",
    approvedBy: null,
    createdAt: "2026-04-30",
  },
];

// Calendar heatmap data for April 2026
const CALENDAR_DATA = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const date = new Date(2026, 3, day);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const attendance = isWeekend ? 0 : 78 + Math.floor(Math.random() * 11) - 5;
  const total = 89;
  return {
    day,
    isWeekend,
    attendance,
    total,
    pct: isWeekend ? 0 : attendance / total,
  };
});

const LEAVE_TYPE_LABELS: Record<string, string> = {
  casual: "Casual",
  sick: "Sick",
  annual: "Annual",
  maternity: "Maternity",
  paternity: "Paternity",
};

function dateDiff(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.ceil((b.getTime() - a.getTime()) / 86400000) + 1;
}

function getAttStatusCls(status: AttendanceRecord["status"]) {
  switch (status) {
    case "present":
      return "bg-emerald-500/10";
    case "absent":
      return "bg-red-500/10";
    case "late":
      return "bg-amber-500/10";
    default:
      return "";
  }
}

function CalendarHeatmap({
  data,
  selectedDay,
  onSelect,
}: {
  data: typeof CALENDAR_DATA;
  selectedDay: number | null;
  onSelect: (day: number | null) => void;
}) {
  const weekdayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // April 2026 starts on Wednesday (day 3)
  const startOffset = 3;
  type CellEntry = { key: string; day: number | null };
  const allCells: CellEntry[] = [
    ...Array.from({ length: startOffset }, (_, i) => ({
      key: `pre-${i + 1}`,
      day: null as null,
    })),
    ...data.map((d) => ({ key: `day-${d.day}`, day: d.day })),
  ];
  while (allCells.length % 7 !== 0)
    allCells.push({ key: `post-${allCells.length}`, day: null });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayHeaders.map((h) => (
          <div
            key={h}
            className="text-xs font-semibold text-muted-foreground py-1"
          >
            {h}
          </div>
        ))}
        {allCells.map(({ key, day }) => {
          if (day === null) return <div key={key} className="aspect-square" />;
          const entry = data[day - 1];
          const isSelected = selectedDay === day;
          let bgClass = "bg-muted/30";
          if (!entry.isWeekend) {
            if (entry.pct >= 0.9)
              bgClass = "bg-emerald-500/25 border-emerald-500/40";
            else if (entry.pct >= 0.7)
              bgClass = "bg-amber-500/25 border-amber-500/40";
            else bgClass = "bg-red-500/25 border-red-500/40";
          }
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(isSelected ? null : day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg border text-xs transition-smooth cursor-pointer hover:scale-105",
                entry.isWeekend
                  ? "bg-muted/20 border-border/40 text-muted-foreground/50"
                  : bgClass,
                isSelected &&
                  "ring-2 ring-primary ring-offset-1 ring-offset-background",
              )}
              title={
                entry.isWeekend
                  ? `${day} (Weekend)`
                  : `${day} — ${entry.attendance}/${entry.total}`
              }
              data-ocid={`attendance.calendar.day.${day}`}
            >
              <span className="font-semibold">{day}</span>
              {!entry.isWeekend && (
                <span className="text-[9px] opacity-70">
                  {entry.attendance}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/30" />
          ≥90%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/30" />
          70–90%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500/30" />
          &lt;70%
        </span>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState("all");
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(MOCK_LEAVES);
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    id: string;
  }>({
    open: false,
    id: "",
  });
  const [rejectReason, setRejectReason] = useState("");

  const empMap = useMemo(
    () => Object.fromEntries(mockEmployees.map((e) => [e.id, e])),
    [],
  );
  const branchMap = useMemo(
    () => Object.fromEntries(mockBranches.map((b) => [b.id, b])),
    [],
  );

  // Filter attendance records
  const displayedRecords = useMemo(() => {
    let rows = mockAttendance.filter((r) => r.status !== "weekend");
    if (selectedDay !== null) {
      const dayStr = String(selectedDay).padStart(2, "0");
      rows = rows.filter((r) => r.date.endsWith(`-${dayStr}`));
    }
    if (branchFilter !== "all") {
      rows = rows.filter((r) => {
        const emp = empMap[r.employeeId];
        return emp?.branchId === branchFilter;
      });
    }
    return rows;
  }, [selectedDay, branchFilter, empMap]);

  const stats = useMemo(() => {
    const present = displayedRecords.filter(
      (r) => r.status === "present",
    ).length;
    const absent = displayedRecords.filter((r) => r.status === "absent").length;
    return { present, absent };
  }, [displayedRecords]);

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: "approved" as const, approvedBy: "e1" }
          : l,
      ),
    );
    toast.success("Leave request approved");
  };

  const handleReject = () => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === rejectDialog.id
          ? { ...l, status: "rejected" as const, approvedBy: "e1" }
          : l,
      ),
    );
    setRejectDialog({ open: false, id: "" });
    setRejectReason("");
    toast.success("Leave request rejected");
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="attendance.page">
          <PageHeader
            title="Attendance Management"
            subtitle="Track employee attendance, leaves, and HR records"
            actions={[
              {
                label: "Download Report",
                onClick: () => toast.success("Report downloaded"),
                icon: <Download className="w-4 h-4" />,
                variant: "outline",
              },
              {
                label: "Mark Bulk Attendance",
                onClick: () => toast.info("Bulk attendance dialog coming soon"),
                icon: <UserCheck className="w-4 h-4" />,
              },
            ]}
          />

          {/* KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Present Today"
              value="78/89"
              subtitle="employees"
              icon={<UserCheck className="w-5 h-5" />}
              iconColor="text-emerald-500"
              trend="up"
              trendValue={2.1}
            />
            <KPICard
              title="On Leave Today"
              value={4}
              subtitle="approved leaves"
              icon={<CalendarDays className="w-5 h-5" />}
              iconColor="text-amber-500"
            />
            <KPICard
              title="Absent"
              value={7}
              subtitle="no check-in"
              icon={<UserX className="w-5 h-5" />}
              iconColor="text-red-500"
            />
            <KPICard
              title="Avg. Attendance"
              value="91.3%"
              subtitle="this month"
              icon={<TrendingUp className="w-5 h-5" />}
              iconColor="text-primary"
              trend="up"
              trendValue={1.4}
            />
          </div>

          {/* Filter Bar */}
          <div
            className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-end gap-3"
            data-ocid="attendance.filter_bar"
          >
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Branch</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger
                  className="w-44 h-9"
                  data-ocid="attendance.branch.select"
                >
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {mockBranches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Date Filter</Label>
              <Input
                type="text"
                placeholder="e.g. Apr 2026"
                className="w-36 h-9 text-sm"
                readOnly
                value="April 2026"
              />
            </div>
            <Button
              variant="default"
              className="h-9"
              onClick={() => {
                setSelectedDay(null);
                setBranchFilter("all");
              }}
              data-ocid="attendance.reset_filters_button"
            >
              Apply Filters
            </Button>
            {selectedDay !== null && (
              <Badge variant="secondary" className="h-9 px-3 text-sm">
                Showing April {selectedDay}
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="ml-2 hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>

          {/* Main Two-Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Left: Attendance Records Table (60%) */}
            <div className="xl:col-span-3 bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-foreground">
                  Attendance Records
                </h2>
                <span className="text-xs text-muted-foreground">
                  {stats.present} present / {stats.absent} absent
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {[
                        "Date",
                        "Employee",
                        "Branch",
                        "Check-in",
                        "Check-out",
                        "Hours",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-muted-foreground text-sm"
                        >
                          No records for the selected filter
                        </td>
                      </tr>
                    ) : (
                      displayedRecords.slice(0, 20).map((record, idx) => {
                        const emp = empMap[record.employeeId];
                        const branch = emp ? branchMap[emp.branchId] : null;
                        const hours =
                          record.checkIn && record.checkOut
                            ? (() => {
                                const [h1, m1] = record.checkIn
                                  .split(":")
                                  .map(Number);
                                const [h2, m2] = record.checkOut
                                  .split(":")
                                  .map(Number);
                                const total = h2 * 60 + m2 - (h1 * 60 + m1);
                                return `${Math.floor(total / 60)}h ${total % 60}m`;
                              })()
                            : "—";

                        return (
                          <motion.tr
                            key={record.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            className={cn(
                              "border-b border-border/40 last:border-0 hover:bg-muted/30 transition-smooth",
                              getAttStatusCls(record.status),
                            )}
                            data-ocid={`attendance.record.item.${idx + 1}`}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                              {record.date}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-medium text-foreground">
                                {emp?.name ?? record.employeeId}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {branch?.name ?? "—"}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">
                              {record.checkIn ?? "—"}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">
                              {record.checkOut ?? "—"}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">
                              {hours}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge
                                status={
                                  record.status as
                                    | "present"
                                    | "absent"
                                    | "late"
                                    | "weekend"
                                }
                              />
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {displayedRecords.length > 20 && (
                <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground text-center">
                  Showing 20 of {displayedRecords.length} records
                </div>
              )}
            </div>

            {/* Right: Attendance Calendar (40%) */}
            <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-base text-foreground">
                  April 2026
                </h2>
                <Badge variant="outline" className="text-xs">
                  <CalendarDays className="w-3 h-3 mr-1" /> Calendar
                </Badge>
              </div>
              <CalendarHeatmap
                data={CALENDAR_DATA}
                selectedDay={selectedDay}
                onSelect={setSelectedDay}
              />
              {selectedDay !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-muted/40 rounded-lg border border-border text-sm"
                >
                  <p className="font-semibold text-foreground">
                    April {selectedDay} Summary
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {CALENDAR_DATA[selectedDay - 1].isWeekend
                      ? "Weekend — no attendance recorded"
                      : `${CALENDAR_DATA[selectedDay - 1].attendance} / ${CALENDAR_DATA[selectedDay - 1].total} employees present (${Math.round(
                          CALENDAR_DATA[selectedDay - 1].pct * 100,
                        )}%)`}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Leave Management */}
          <div
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="attendance.leave_section"
          >
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display font-bold text-base text-foreground">
                Pending Leave Requests
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {leaveRequests.filter((l) => l.status === "pending").length}{" "}
                pending approvals
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {[
                      "Employee",
                      "Branch",
                      "Leave Type",
                      "From",
                      "To",
                      "Days",
                      "Reason",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((leave, idx) => {
                    const emp = empMap[leave.employeeId];
                    const branch = emp ? branchMap[emp.branchId] : null;
                    const days = dateDiff(leave.fromDate, leave.toDate);
                    return (
                      <motion.tr
                        key={leave.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-smooth"
                        data-ocid={`attendance.leave.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {emp?.name ?? leave.employeeId}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {branch?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {LEAVE_TYPE_LABELS[leave.leaveType]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {leave.fromDate}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {leave.toDate}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-foreground">
                          {days}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                          {leave.reason}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            status={
                              leave.status === "approved"
                                ? "approved"
                                : leave.status === "rejected"
                                  ? "rejected"
                                  : "pending"
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          {leave.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10"
                                onClick={() => handleApprove(leave.id)}
                                data-ocid={`attendance.leave.approve_button.${idx + 1}`}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />{" "}
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-red-600 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() =>
                                  setRejectDialog({ open: true, id: leave.id })
                                }
                                data-ocid={`attendance.leave.reject_button.${idx + 1}`}
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Balance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6"
            data-ocid="attendance.leave_balance_section"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-base text-foreground">
                  Leave Balance Overview
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Annual leave utilization across all employees
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">234 / 890</p>
                <p className="text-xs text-muted-foreground">
                  Total Annual Leaves Utilized
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">
                  Overall Utilization
                </span>
                <span className="text-xs font-bold text-foreground">26%</span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "26%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            {/* Leave type breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(
                [
                  {
                    type: "Casual",
                    used: 89,
                    total: 280,
                    color: "bg-blue-500",
                  },
                  { type: "Sick", used: 54, total: 280, color: "bg-red-500" },
                  {
                    type: "Annual",
                    used: 78,
                    total: 240,
                    color: "bg-emerald-500",
                  },
                  {
                    type: "Maternity",
                    used: 10,
                    total: 60,
                    color: "bg-pink-500",
                  },
                  {
                    type: "Paternity",
                    used: 3,
                    total: 30,
                    color: "bg-purple-500",
                  },
                ] as const
              ).map((lt) => (
                <div
                  key={lt.type}
                  className="bg-muted/30 rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn("w-2.5 h-2.5 rounded-full", lt.color)}
                    />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {lt.type}
                    </span>
                  </div>
                  <p className="font-display font-bold text-xl text-foreground">
                    {lt.used}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {lt.total} days
                  </p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${Math.round((lt.used / lt.total) * 100)}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn("h-full rounded-full", lt.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reject Dialog */}
        <Dialog
          open={rejectDialog.open}
          onOpenChange={(open) => setRejectDialog((d) => ({ ...d, open }))}
        >
          <DialogContent data-ocid="attendance.reject_leave.dialog">
            <DialogHeader>
              <DialogTitle>Reject Leave Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label htmlFor="reject-reason">Reason for rejection</Label>
              <Input
                id="reject-reason"
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                data-ocid="attendance.reject_leave.reason_input"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRejectDialog({ open: false, id: "" })}
                data-ocid="attendance.reject_leave.cancel_button"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                data-ocid="attendance.reject_leave.confirm_button"
              >
                Confirm Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </ProtectedRoute>
  );
}
