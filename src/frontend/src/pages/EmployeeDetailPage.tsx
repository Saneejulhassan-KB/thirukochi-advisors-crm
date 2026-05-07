import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockAttendance,
  mockBranches,
  mockCustomers,
  mockEmployees,
  mockTransfers,
  mockZones,
} from "@/data/mockData";
import type { Employee, EmployeeStatus, Role } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRightLeft,
  Award,
  BarChart2,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Star,
  TrendingUp,
  User,
  UserMinus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ─── Role badge ───────────────────────────────────────────────────────────────
const ROLE_BADGE: Record<Role, { label: string; className: string }> = {
  super_admin: {
    label: "Super Admin",
    className: "bg-red-500/15 text-red-500 border-red-500/30",
  },
  zonal_manager: {
    label: "Zonal Manager",
    className: "bg-secondary/15 text-secondary border-secondary/30",
  },
  branch_manager: {
    label: "Branch Manager",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  staff: {
    label: "Staff",
    className: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  },
};

function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_BADGE[role];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        cfg.className
      }`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Role permissions ─────────────────────────────────────────────────────────
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: [
    "View All Zones & Branches",
    "Manage All Employees",
    "Approve/Reject Transfers",
    "View Financial Reports",
    "Manage System Settings",
    "Override All Permissions",
  ],
  zonal_manager: [
    "View Zone Branches",
    "Manage Branch Managers",
    "Approve Branch Transfers",
    "View Zone Analytics",
    "Set Monthly Targets",
  ],
  branch_manager: [
    "Manage Branch Staff",
    "Assign Customer Leads",
    "Approve Leave Requests",
    "View Branch Reports",
    "Initiate Transfers",
  ],
  staff: [
    "View Assigned Customers",
    "Submit Daily Activity",
    "Mark Attendance",
    "Apply for Leave",
    "Send Reminders",
  ],
};

// ─── Static mock data for charts/incentives ───────────────────────────────────
const PERFORMANCE_DATA = [
  { month: "Feb 2026", collection: 820000, tasks: 28, attendance: 95 },
  { month: "Mar 2026", collection: 930000, tasks: 32, attendance: 100 },
  { month: "Apr 2026", collection: 875000, tasks: 29, attendance: 91 },
];

const INCENTIVES = [
  { type: "Monthly Bonus", amount: 5000, date: "2026-03-31" },
  { type: "Collection Incentive", amount: 3000, date: "2026-03-15" },
  { type: "Performance Award", amount: 2500, date: "2026-02-28" },
];

const ACHIEVEMENTS = [
  { label: "Top Collector Q1 2026", icon: "🏆", colorClass: "text-amber-500" },
  {
    label: "Perfect Attendance Feb",
    icon: "✅",
    colorClass: "text-emerald-500",
  },
  {
    label: "Customer Satisfaction Star",
    icon: "⭐",
    colorClass: "text-blue-500",
  },
];

// ─── Attendance Calendar ──────────────────────────────────────────────────────
function AttendanceCalendar({ employeeId }: { employeeId: string }) {
  const records = mockAttendance.filter((a) => a.employeeId === employeeId);
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2026, 3, i + 1);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const rec = records.find(
      (r) => r.date === date.toISOString().split("T")[0],
    );
    return {
      day: i + 1,
      isWeekend,
      status: isWeekend ? "weekend" : (rec?.status ?? "present"),
    };
  });

  const dotColor: Record<string, string> = {
    present: "bg-emerald-500",
    absent: "bg-red-500",
    late: "bg-amber-500",
    weekend: "bg-muted-foreground/20",
    holiday: "bg-blue-400",
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-xs font-semibold text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>
      {/* April 2026 starts on Wednesday */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={`offset-${i + 1}`} />
        ))}
        {days.map((d) => (
          <div
            key={d.day}
            className={`flex flex-col items-center justify-center h-9 rounded-lg transition-colors ${
              d.isWeekend ? "opacity-40" : "hover:bg-muted/40"
            }`}
          >
            <span className="text-xs text-foreground font-medium">{d.day}</span>
            <div
              className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor[d.status] ?? "bg-muted"}`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        {[
          { label: "Present", color: "bg-emerald-500" },
          { label: "Absent", color: "bg-red-500" },
          { label: "Late", color: "bg-amber-500" },
          { label: "Weekend", color: "bg-muted-foreground/20" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EmployeeDetailPage ───────────────────────────────────────────────────────

export default function EmployeeDetailPage() {
  const { id } = useParams({ from: "/employees/$id" });
  const employee: Employee =
    mockEmployees.find((e) => e.id === id) ?? mockEmployees[0];

  const branch = mockBranches.find((b) => b.id === employee.branchId);
  const zone = mockZones.find((z) => z.id === employee.zoneId);
  const assignedCustomers = mockCustomers.filter(
    (c) => c.assignedStaffId === employee.id,
  );
  const transfers = mockTransfers.filter((t) => t.employeeId === employee.id);
  const permissions = ROLE_PERMISSIONS[employee.role];

  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [leaveFormOpen, setLeaveFormOpen] = useState(false);

  const handleSendMessage = () =>
    toast.success("Message sent", {
      description: `WhatsApp message sent to ${employee.name}.`,
    });

  const handleDeactivate = () =>
    toast.info("Deactivate", {
      description: "Employee deactivation requires confirmation in production.",
    });

  const handleTransfer = () =>
    toast.info("Initiate Transfer", {
      description: "Transfer request flow would open here.",
    });

  return (
    <ProtectedRoute>
      <AppLayout>
        <div
          className="p-6 space-y-6 max-w-6xl mx-auto"
          data-ocid="employee_detail.page"
        >
          {/* Back link */}
          <Link
            to="/employees"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="employee_detail.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Employees
          </Link>

          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-card rounded-2xl border border-border overflow-hidden p-6"
            data-ocid="employee_detail.profile_card"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {initials}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {employee.performanceScore}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="font-display font-bold text-2xl text-foreground">
                    {employee.name}
                  </h1>
                  <RoleBadge role={employee.role} />
                  <StatusBadge status={employee.status as EmployeeStatus} />
                </div>
                <p className="text-muted-foreground text-sm mb-3">
                  {employee.designation} &bull; ID:{" "}
                  <span className="font-mono text-foreground">
                    {employee.id.toUpperCase()}
                  </span>
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {[
                    {
                      icon: <Building2 className="w-3.5 h-3.5" />,
                      text: branch?.name ?? "—",
                    },
                    {
                      icon: <Shield className="w-3.5 h-3.5" />,
                      text: `${zone?.name ?? "—"} Zone`,
                    },
                    {
                      icon: <Phone className="w-3.5 h-3.5" />,
                      text: employee.phone,
                    },
                    {
                      icon: <Mail className="w-3.5 h-3.5" />,
                      text: employee.email,
                    },
                    {
                      icon: <CalendarDays className="w-3.5 h-3.5" />,
                      text: `Hired ${new Date(employee.hireDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
                    },
                  ].map((item) => (
                    <span
                      key={item.text}
                      className="flex items-center gap-1.5 text-muted-foreground"
                    >
                      {item.icon}
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score + Actions */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">
                    Performance Score
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={employee.performanceScore}
                      className="w-28 h-2"
                    />
                    <span className="text-lg font-bold text-foreground">
                      {employee.performanceScore}/100
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.info("Edit Employee", {
                        description: "Edit form would open here.",
                      })
                    }
                    data-ocid="employee_detail.edit_button"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTransfer}
                    data-ocid="employee_detail.transfer_button"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
                    Transfer
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    data-ocid="employee_detail.message_button"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    Message
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeactivate}
                    data-ocid="employee_detail.deactivate_button"
                  >
                    <UserMinus className="w-3.5 h-3.5 mr-1" />
                    Deactivate
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabbed Content */}
          <Tabs defaultValue="profile" data-ocid="employee_detail.tabs">
            <TabsList className="w-full sm:w-auto flex flex-wrap gap-1 h-auto bg-card border border-border p-1 rounded-xl mb-6">
              {[
                {
                  value: "profile",
                  label: "Profile",
                  icon: <User className="w-3.5 h-3.5" />,
                },
                {
                  value: "performance",
                  label: "Performance",
                  icon: <TrendingUp className="w-3.5 h-3.5" />,
                },
                {
                  value: "attendance",
                  label: "Attendance",
                  icon: <CalendarDays className="w-3.5 h-3.5" />,
                },
                {
                  value: "leave",
                  label: "Leave",
                  icon: <Clock className="w-3.5 h-3.5" />,
                },
                {
                  value: "transfers",
                  label: "Transfers",
                  icon: <ArrowRightLeft className="w-3.5 h-3.5" />,
                },
                {
                  value: "documents",
                  label: "Documents",
                  icon: <FileText className="w-3.5 h-3.5" />,
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-1.5"
                  data-ocid={`employee_detail.${tab.value}_tab`}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── TAB 1: Profile ── */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Personal Details
                  </h3>
                  <dl className="space-y-3">
                    {[
                      { label: "Full Name", value: employee.name },
                      { label: "Phone", value: employee.phone },
                      { label: "Email", value: employee.email },
                      { label: "Date of Birth", value: "15 Mar 1990" },
                      { label: "Gender", value: "Male" },
                      {
                        label: "Address",
                        value: "MG Road, Kochi, Kerala 682011",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between gap-2"
                      >
                        <dt className="text-xs text-muted-foreground shrink-0 w-28">
                          {item.label}
                        </dt>
                        <dd className="text-sm font-medium text-foreground text-right">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Employment Details
                  </h3>
                  <dl className="space-y-3">
                    {[
                      {
                        label: "Employee ID",
                        value: employee.id.toUpperCase(),
                      },
                      { label: "Designation", value: employee.designation },
                      {
                        label: "Hire Date",
                        value: new Date(employee.hireDate).toLocaleDateString(
                          "en-IN",
                        ),
                      },
                      { label: "Branch", value: branch?.name ?? "—" },
                      { label: "Zone", value: `${zone?.name ?? "—"} Zone` },
                      { label: "Salary Grade", value: employee.salaryGrade },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between gap-2"
                      >
                        <dt className="text-xs text-muted-foreground shrink-0 w-28">
                          {item.label}
                        </dt>
                        <dd className="text-sm font-medium text-foreground text-right font-mono">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Assigned Customers
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {assignedCustomers.length}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium">
                        {assignedCustomers.length} customers assigned
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Active portfolio under management
                      </p>
                      <Link to="/customers">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          data-ocid="employee_detail.view_customers_link"
                        >
                          View Customers
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Role Permissions
                  </h3>
                  <ul className="space-y-2">
                    {permissions.map((perm) => (
                      <li key={perm} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-sm text-foreground">{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 2: Performance ── */}
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Collection (Apr)",
                    value: "₹8.75L",
                    icon: <TrendingUp className="w-5 h-5" />,
                    colorClass: "text-primary",
                  },
                  {
                    label: "Tasks Completed",
                    value: "29",
                    icon: <CheckCircle2 className="w-5 h-5" />,
                    colorClass: "text-emerald-500",
                  },
                  {
                    label: "Attendance %",
                    value: "91%",
                    icon: <CalendarDays className="w-5 h-5" />,
                    colorClass: "text-amber-500",
                  },
                  {
                    label: "Rank in Team",
                    value: "#3",
                    icon: <Star className="w-5 h-5" />,
                    colorClass: "text-secondary",
                  },
                ].map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-card rounded-2xl border border-border p-4"
                  >
                    <div className={`${kpi.colorClass} mb-2`}>{kpi.icon}</div>
                    <p className="text-2xl font-bold text-foreground">
                      {kpi.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" />
                  3-Month Collection Performance
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={PERFORMANCE_DATA}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v: number) =>
                        `₹${(v / 100000).toFixed(1)}L`
                      }
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v: number) => [
                        `₹${(v / 100000).toFixed(2)}L`,
                        "Collection",
                      ]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="collection"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4">
                  Collection vs Target (Apr 2026)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Current Month Progress
                    </span>
                    <span className="font-semibold text-foreground">
                      ₹8.75L / ₹10L
                    </span>
                  </div>
                  <Progress value={87.5} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    87.5% of monthly target achieved
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Achievements & Milestones
                </h3>
                <div className="flex flex-wrap gap-3 mb-5">
                  {ACHIEVEMENTS.map((a) => (
                    <div
                      key={a.label}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-border ${a.colorClass}`}
                    >
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-sm font-medium">{a.label}</span>
                    </div>
                  ))}
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  Incentive Breakdown
                </h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                          Type
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">
                          Amount
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {INCENTIVES.map((inc) => (
                        <tr
                          key={inc.type}
                          className="border-b border-border/50 last:border-0"
                        >
                          <td className="px-4 py-2.5 text-foreground">
                            {inc.type}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-emerald-500 dark:text-emerald-400">
                            ₹{inc.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground text-xs">
                            {new Date(inc.date).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 3: Attendance ── */}
            <TabsContent value="attendance" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    April 2026 Attendance
                  </h3>
                  <AttendanceCalendar employeeId={employee.id} />
                </div>

                <div className="space-y-4">
                  <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="font-semibold text-foreground mb-4">
                      Attendance Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          label: "Present %",
                          value: "91%",
                          colorClass: "text-emerald-500",
                        },
                        {
                          label: "Absent Days",
                          value: "2",
                          colorClass: "text-red-500",
                        },
                        {
                          label: "Leave Days",
                          value: "0",
                          colorClass: "text-amber-500",
                        },
                        {
                          label: "Total Hours",
                          value: "176h",
                          colorClass: "text-primary",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-muted/20 rounded-xl p-3 text-center"
                        >
                          <p className={`text-xl font-bold ${stat.colorClass}`}>
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="font-semibold text-foreground mb-3">
                      View History
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">From</Label>
                        <Input
                          type="date"
                          defaultValue="2026-04-01"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">To</Label>
                        <Input
                          type="date"
                          defaultValue="2026-04-30"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() =>
                        toast.info("Loading historical attendance...")
                      }
                      data-ocid="employee_detail.attendance_filter_button"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Monthly Attendance Records
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        {[
                          "Date",
                          "Check-In",
                          "Check-Out",
                          "Total Hours",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockAttendance
                        .filter((a) => a.employeeId === employee.id)
                        .slice(0, 10)
                        .map((rec, i) => (
                          <tr
                            key={rec.id}
                            className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                            data-ocid={`employee_detail.attendance_row.${i + 1}`}
                          >
                            <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                              {rec.date}
                            </td>
                            <td className="px-4 py-2.5 text-sm text-foreground">
                              {rec.checkIn ?? "—"}
                            </td>
                            <td className="px-4 py-2.5 text-sm text-foreground">
                              {rec.checkOut ?? "—"}
                            </td>
                            <td className="px-4 py-2.5 text-sm text-foreground">
                              {rec.checkIn && rec.checkOut ? "8h 55m" : "—"}
                            </td>
                            <td className="px-4 py-2.5">
                              <StatusBadge
                                status={rec.status as EmployeeStatus}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 4: Leave ── */}
            <TabsContent value="leave" className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    Leave Balance
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => setLeaveFormOpen(!leaveFormOpen)}
                    data-ocid="employee_detail.apply_leave_button"
                  >
                    Apply Leave
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      type: "Annual",
                      used: 5,
                      total: 20,
                      colorClass: "text-primary",
                    },
                    {
                      type: "Sick",
                      used: 2,
                      total: 10,
                      colorClass: "text-amber-500",
                    },
                    {
                      type: "Casual",
                      used: 2,
                      total: 5,
                      colorClass: "text-secondary",
                    },
                  ].map((leave) => (
                    <div key={leave.type} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg
                          viewBox="0 0 36 36"
                          className="w-full h-full -rotate-90"
                          aria-label={`${leave.type} leave usage`}
                          role="img"
                        >
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            className="stroke-muted"
                            strokeWidth="2.5"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9155"
                            fill="none"
                            className={`stroke-current ${leave.colorClass}`}
                            strokeWidth="2.5"
                            strokeDasharray={`${((leave.total - leave.used) / leave.total) * 100} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-foreground">
                            {leave.total - leave.used}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-foreground">
                        {leave.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leave.total - leave.used}/{leave.total} remaining
                      </p>
                    </div>
                  ))}
                </div>

                {leaveFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-muted/20 rounded-xl border border-border"
                    data-ocid="employee_detail.leave_form"
                  >
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Apply for Leave
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Label className="text-xs">Leave Type</Label>
                        <select
                          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring mt-1"
                          data-ocid="employee_detail.leave_type_select"
                        >
                          <option value="casual">Casual Leave</option>
                          <option value="sick">Sick Leave</option>
                          <option value="annual">Annual Leave</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">From Date</Label>
                        <Input
                          type="date"
                          className="h-8 text-xs mt-1"
                          data-ocid="employee_detail.leave_from_input"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">To Date</Label>
                        <Input
                          type="date"
                          className="h-8 text-xs mt-1"
                          data-ocid="employee_detail.leave_to_input"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Reason</Label>
                        <textarea
                          rows={2}
                          placeholder="Reason for leave..."
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none mt-1"
                          data-ocid="employee_detail.leave_reason_textarea"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => setLeaveFormOpen(false)}
                        data-ocid="employee_detail.leave_cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => {
                          toast.success("Leave request submitted");
                          setLeaveFormOpen(false);
                        }}
                        data-ocid="employee_detail.leave_submit_button"
                      >
                        Submit
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Leave History
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        {[
                          "From",
                          "To",
                          "Type",
                          "Days",
                          "Status",
                          "Approved By",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          from: "2026-02-10",
                          to: "2026-02-12",
                          type: "Casual",
                          days: 3,
                          status: "approved",
                          approvedBy: "Rajan Pillai",
                        },
                        {
                          from: "2026-01-15",
                          to: "2026-01-16",
                          type: "Sick",
                          days: 2,
                          status: "approved",
                          approvedBy: "Rajan Pillai",
                        },
                        {
                          from: "2025-12-26",
                          to: "2025-12-31",
                          type: "Annual",
                          days: 5,
                          status: "approved",
                          approvedBy: "Suresh Menon",
                        },
                      ].map((row, i) => (
                        <tr
                          key={row.from}
                          className="border-b border-border/50 last:border-0 hover:bg-muted/20"
                          data-ocid={`employee_detail.leave_row.${i + 1}`}
                        >
                          <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                            {row.from}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                            {row.to}
                          </td>
                          <td className="px-4 py-2.5 text-foreground">
                            {row.type}
                          </td>
                          <td className="px-4 py-2.5 text-center font-semibold text-foreground">
                            {row.days}
                          </td>
                          <td className="px-4 py-2.5">
                            <StatusBadge
                              status={
                                row.status as
                                  | "approved"
                                  | "pending"
                                  | "rejected"
                              }
                            />
                          </td>
                          <td className="px-4 py-2.5 text-sm text-muted-foreground">
                            {row.approvedBy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 5: Transfers ── */}
            <TabsContent value="transfers" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Transfer History
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTransfer}
                  data-ocid="employee_detail.initiate_transfer_button"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
                  Initiate Transfer
                </Button>
              </div>

              {transfers.length === 0 ? (
                <div
                  className="bg-card rounded-2xl border border-border p-12 text-center"
                  data-ocid="employee_detail.transfers_empty_state"
                >
                  <ArrowRightLeft className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No transfer history for this employee.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transfers.map((transfer, i) => {
                    const fromBranch = mockBranches.find(
                      (b) => b.id === transfer.fromBranchId,
                    );
                    const toBranch = mockBranches.find(
                      (b) => b.id === transfer.toBranchId,
                    );
                    const approver = mockEmployees.find(
                      (e) => e.id === transfer.approvedBy,
                    );
                    return (
                      <motion.div
                        key={transfer.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-card rounded-2xl border border-border p-4 flex gap-4"
                        data-ocid={`employee_detail.transfer_item.${i + 1}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center shrink-0 mt-1">
                          <ArrowRightLeft className="w-4 h-4 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">
                              {fromBranch?.name ?? "—"}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              →
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                              {toBranch?.name ?? "—"}
                            </span>
                            <StatusBadge
                              status={
                                transfer.status as
                                  | "pending"
                                  | "approved"
                                  | "rejected"
                              }
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {transfer.reason}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>Requested: {transfer.requestedAt}</span>
                            {transfer.processedAt && (
                              <span>Processed: {transfer.processedAt}</span>
                            )}
                            {approver && (
                              <span>Approved by: {approver.name}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* ── TAB 6: Documents ── */}
            <TabsContent value="documents" className="space-y-4">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Uploaded Documents
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {[
                    {
                      name: "Aadhaar Card",
                      type: "ID Proof",
                      status: "verified",
                      date: "2021-01-15",
                      size: "1.2 MB",
                    },
                    {
                      name: "PAN Card",
                      type: "Tax Document",
                      status: "verified",
                      date: "2021-01-15",
                      size: "0.8 MB",
                    },
                    {
                      name: "Employment Contract",
                      type: "Legal",
                      status: "verified",
                      date: "2021-01-20",
                      size: "2.4 MB",
                    },
                    {
                      name: "B.Com Certificate",
                      type: "Education",
                      status: "pending",
                      date: "2021-02-01",
                      size: "3.1 MB",
                    },
                    {
                      name: "Experience Letter",
                      type: "Work History",
                      status: "verified",
                      date: "2021-02-10",
                      size: "0.6 MB",
                    },
                  ].map((doc, i) => (
                    <div
                      key={doc.name}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
                      data-ocid={`employee_detail.document_item.${i + 1}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} &bull; {doc.size} &bull; {doc.date}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          doc.status === "verified"
                            ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                            : doc.status === "pending"
                              ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                              : "border-red-500/40 text-red-500 bg-red-500/10"
                        }
                      >
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="w-full border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-muted/10 transition-colors cursor-pointer"
                aria-label="Upload document"
                data-ocid="employee_detail.document_upload_button"
                onClick={() =>
                  toast.info("Upload Document", {
                    description:
                      "File upload dialog would open here in production.",
                  })
                }
              >
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drag &amp; drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: PDF, JPG, PNG — Max 10 MB
                </p>
              </button>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
