import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  LogIn,
  LogOut,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "weekend"
  | "leave"
  | "future";

interface DayRecord {
  day: number;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  hours?: number;
}

interface LeaveRecord {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const MONTH_DAYS: DayRecord[] = [
  {
    day: 1,
    status: "present",
    checkIn: "09:02",
    checkOut: "18:05",
    hours: 9.0,
  },
  {
    day: 2,
    status: "present",
    checkIn: "09:10",
    checkOut: "18:00",
    hours: 8.8,
  },
  { day: 3, status: "weekend" },
  { day: 4, status: "weekend" },
  {
    day: 5,
    status: "present",
    checkIn: "09:05",
    checkOut: "18:10",
    hours: 9.1,
  },
  { day: 6, status: "late", checkIn: "09:45", checkOut: "18:30", hours: 8.7 },
  {
    day: 7,
    status: "present",
    checkIn: "09:00",
    checkOut: "18:00",
    hours: 9.0,
  },
  {
    day: 8,
    status: "present",
    checkIn: "08:58",
    checkOut: "18:02",
    hours: 9.1,
  },
  {
    day: 9,
    status: "present",
    checkIn: "09:03",
    checkOut: "18:00",
    hours: 9.0,
  },
  { day: 10, status: "weekend" },
  { day: 11, status: "weekend" },
  { day: 12, status: "leave", checkIn: undefined, checkOut: undefined },
  {
    day: 13,
    status: "present",
    checkIn: "09:00",
    checkOut: "18:05",
    hours: 9.1,
  },
  {
    day: 14,
    status: "present",
    checkIn: "09:08",
    checkOut: "18:00",
    hours: 8.9,
  },
  {
    day: 15,
    status: "present",
    checkIn: "09:01",
    checkOut: "18:00",
    hours: 9.0,
  },
  {
    day: 16,
    status: "present",
    checkIn: "09:04",
    checkOut: "18:10",
    hours: 9.1,
  },
  { day: 17, status: "weekend" },
  { day: 18, status: "weekend" },
  {
    day: 19,
    status: "present",
    checkIn: "09:02",
    checkOut: "18:00",
    hours: 9.0,
  },
  {
    day: 20,
    status: "present",
    checkIn: "09:10",
    checkOut: "18:15",
    hours: 9.1,
  },
  {
    day: 21,
    status: "present",
    checkIn: "09:05",
    checkOut: "18:00",
    hours: 8.9,
  },
  { day: 22, status: "absent" },
  {
    day: 23,
    status: "present",
    checkIn: "09:00",
    checkOut: "18:00",
    hours: 9.0,
  },
  { day: 24, status: "weekend" },
  { day: 25, status: "weekend" },
  { day: 26, status: "late", checkIn: "09:50", checkOut: "18:30", hours: 8.7 },
  {
    day: 27,
    status: "present",
    checkIn: "09:02",
    checkOut: "18:05",
    hours: 9.0,
  },
  {
    day: 28,
    status: "present",
    checkIn: "09:00",
    checkOut: "18:00",
    hours: 9.0,
  },
  {
    day: 29,
    status: "present",
    checkIn: "09:03",
    checkOut: "18:02",
    hours: 9.0,
  },
  {
    day: 30,
    status: "present",
    checkIn: "09:01",
    checkOut: "18:00",
    hours: 9.0,
  },
  { day: 31, status: "future" },
];

const LOG_ROWS = MONTH_DAYS.filter(
  (d) => d.status !== "weekend" && d.status !== "future",
);

const LEAVE_HISTORY: LeaveRecord[] = [
  {
    id: "l1",
    type: "Casual Leave",
    from: "2026-05-12",
    to: "2026-05-12",
    days: 1,
    reason: "Personal work",
    status: "approved",
  },
  {
    id: "l2",
    type: "Sick Leave",
    from: "2026-04-03",
    to: "2026-04-04",
    days: 2,
    reason: "Fever and cold",
    status: "approved",
  },
  {
    id: "l3",
    type: "Earned Leave",
    from: "2026-03-25",
    to: "2026-03-26",
    days: 2,
    reason: "Family function in Thrissur",
    status: "approved",
  },
  {
    id: "l4",
    type: "Medical Leave",
    from: "2026-06-02",
    to: "2026-06-03",
    days: 2,
    reason: "Planned surgery follow-up",
    status: "pending",
  },
];

const statusStyles: Record<AttendanceStatus, string> = {
  present: "bg-emerald-500/80 text-white",
  absent: "bg-red-500/80 text-white",
  late: "bg-amber-400/80 text-black",
  weekend: "bg-muted text-muted-foreground",
  leave: "bg-blue-500/80 text-white",
  future: "bg-muted/40 text-muted-foreground/40",
};

const leaveStatusBadge: Record<string, string> = {
  approved:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  pending:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// May 2026 starts on Friday (index 5)
const startOffset = 5;

export function StaffAttendancePage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  function handleCheckIn() {
    setCheckedIn(true);
    setCheckInTime(timeStr);
  }

  function handleCheckOut() {
    setCheckedIn(false);
  }

  function handleLeaveSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowLeaveModal(false);
      setSubmitted(false);
      setLeaveType("");
      setLeaveFrom("");
      setLeaveTo("");
      setLeaveReason("");
    }, 1200);
  }

  const kpiCards = [
    {
      title: "Present Days",
      value: 22,
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconColor: "text-emerald-500",
      subtitle: "May 2026",
      trend: "up" as const,
      trendValue: 5,
    },
    {
      title: "Absent Days",
      value: 1,
      icon: <XCircle className="w-5 h-5" />,
      iconColor: "text-red-500",
      subtitle: "This month",
      trend: "down" as const,
      trendValue: -2,
    },
    {
      title: "Late Count",
      value: 2,
      icon: <Clock className="w-5 h-5" />,
      iconColor: "text-amber-500",
      subtitle: "Late check-ins",
      trend: "neutral" as const,
    },
    {
      title: "Leave Balance",
      value: 8,
      icon: <Calendar className="w-5 h-5" />,
      iconColor: "text-blue-500",
      subtitle: "Days remaining",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <AppLayout>
        <div className="space-y-8">
          <PageHeader
            title="Attendance"
            subtitle="May 2026 · Manage check-in, leave requests, and attendance records"
            badge="Staff"
            actions={[
              {
                label: "Apply Leave",
                onClick: () => setShowLeaveModal(true),
                variant: "outline" as const,
                icon: <FileText className="w-4 h-4" />,
              },
            ]}
          />

          {/* Check-in / Check-out Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm"
            data-ocid="attendance.checkin_panel"
          >
            <div className="flex-1 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Today's Status
              </p>
              <p className="font-display text-2xl font-bold text-foreground">
                {checkedIn ? "Checked In" : "Not Checked In"}
              </p>
              {checkInTime && (
                <p className="text-sm text-muted-foreground">
                  Check-in recorded at{" "}
                  <span className="font-semibold text-emerald-500">
                    {checkInTime}
                  </span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Current time:{" "}
                <span className="font-medium text-foreground">{timeStr}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={checkedIn ? "outline" : "default"}
                disabled={checkedIn}
                onClick={handleCheckIn}
                className="gap-2"
                data-ocid="attendance.checkin_button"
              >
                <LogIn className="w-4 h-4" />
                Check In
              </Button>
              <Button
                type="button"
                variant={!checkedIn ? "outline" : "default"}
                disabled={!checkedIn}
                onClick={handleCheckOut}
                className="gap-2"
                data-ocid="attendance.checkout_button"
              >
                <LogOut className="w-4 h-4" />
                Check Out
              </Button>
            </div>
          </motion.div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {kpiCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                data-ocid={`attendance.kpi.${i + 1}`}
              >
                <KPICard {...card} />
              </motion.div>
            ))}
          </div>

          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="rounded-2xl border border-border bg-card p-6"
            data-ocid="attendance.calendar"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-foreground text-lg">
                May 2026 — Attendance Calendar
              </h3>
              <div className="flex flex-wrap gap-3 text-xs">
                {[
                  { label: "Present", cls: "bg-emerald-500/80" },
                  { label: "Absent", cls: "bg-red-500/80" },
                  { label: "Late", cls: "bg-amber-400/80" },
                  { label: "Leave", cls: "bg-blue-500/80" },
                  { label: "Weekend", cls: "bg-muted" },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5">
                    <span
                      className={cn("w-3 h-3 rounded-full inline-block", l.cls)}
                    />
                    <span className="text-muted-foreground">{l.label}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {dayLabels.map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-muted-foreground pb-1"
                >
                  {d}
                </div>
              ))}
              {/* Empty offset cells */}
              {Array.from(
                { length: startOffset },
                (_, idx) => `offset-${idx + 1}-${startOffset}`,
              ).map((key) => (
                <div key={key} />
              ))}
              {MONTH_DAYS.map((rec) => (
                <div
                  key={rec.day}
                  className={cn(
                    "rounded-xl aspect-square flex items-center justify-center text-sm font-bold transition-all cursor-default",
                    statusStyles[rec.status],
                    rec.status === "future" ? "opacity-30" : "",
                  )}
                  title={
                    rec.status.charAt(0).toUpperCase() + rec.status.slice(1)
                  }
                >
                  {rec.day}
                </div>
              ))}
            </div>
          </motion.div>

          {/* This Month's Log Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            data-ocid="attendance.log_table"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">
                This Month's Attendance Log
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily check-in/out record for May 2026
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-right font-semibold">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LOG_ROWS.map((rec, i) => (
                    <tr
                      key={rec.day}
                      className="border-t border-border/50 hover:bg-muted/30 transition-colors"
                      data-ocid={`attendance.log_row.${i + 1}`}
                    >
                      <td className="px-6 py-3 font-medium text-foreground">
                        {`2026-05-${String(rec.day).padStart(2, "0")}`}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {rec.checkIn ?? (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {rec.checkOut ?? (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-foreground">
                        {rec.hours ? `${rec.hours}h` : "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold border",
                            rec.status === "present" &&
                              "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                            rec.status === "absent" &&
                              "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
                            rec.status === "late" &&
                              "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
                            rec.status === "leave" &&
                              "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
                          )}
                        >
                          {rec.status.charAt(0).toUpperCase() +
                            rec.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Leave History Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            data-ocid="attendance.leave_history"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  Leave Request History
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All leave applications submitted
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowLeaveModal(true)}
                className="gap-1.5 text-xs"
                data-ocid="attendance.apply_leave_button"
              >
                <FileText className="w-3.5 h-3.5" />
                Apply Leave
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-semibold">Type</th>
                    <th className="px-6 py-3 text-left font-semibold">From</th>
                    <th className="px-6 py-3 text-left font-semibold">To</th>
                    <th className="px-6 py-3 text-right font-semibold">Days</th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LEAVE_HISTORY.map((lv, i) => (
                    <tr
                      key={lv.id}
                      className="border-t border-border/50 hover:bg-muted/30 transition-colors"
                      data-ocid={`attendance.leave_row.${i + 1}`}
                    >
                      <td className="px-6 py-3 font-medium text-foreground">
                        {lv.type}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {lv.from}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {lv.to}
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-foreground">
                        {lv.days}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground max-w-[180px] truncate">
                        {lv.reason}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold border",
                            leaveStatusBadge[lv.status],
                          )}
                        >
                          {lv.status.charAt(0).toUpperCase() +
                            lv.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Leave Request Modal */}
          <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
            <DialogContent
              className="sm:max-w-md"
              data-ocid="attendance.leave_dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display text-lg">
                  Apply for Leave
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLeaveSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select
                    value={leaveType}
                    onValueChange={setLeaveType}
                    required
                  >
                    <SelectTrigger
                      id="leaveType"
                      data-ocid="attendance.leave_type_select"
                    >
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="earned">Earned Leave</SelectItem>
                      <SelectItem value="medical">Medical Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="leaveFrom">From Date</Label>
                    <Input
                      id="leaveFrom"
                      type="date"
                      value={leaveFrom}
                      onChange={(e) => setLeaveFrom(e.target.value)}
                      required
                      data-ocid="attendance.leave_from_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="leaveTo">To Date</Label>
                    <Input
                      id="leaveTo"
                      type="date"
                      value={leaveTo}
                      onChange={(e) => setLeaveTo(e.target.value)}
                      required
                      data-ocid="attendance.leave_to_input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="leaveReason">Reason</Label>
                  <Textarea
                    id="leaveReason"
                    placeholder="Briefly describe the reason for leave..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    rows={3}
                    required
                    data-ocid="attendance.leave_reason_textarea"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={submitted}
                    data-ocid="attendance.leave_submit_button"
                  >
                    {submitted ? "Submitting…" : "Submit Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLeaveModal(false)}
                    data-ocid="attendance.leave_cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
