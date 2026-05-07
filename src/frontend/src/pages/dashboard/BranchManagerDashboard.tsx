import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  mockActivityLogs,
  mockBranches,
  mockCollectionData,
  mockEmployees,
} from "@/data/mockData";
import type { AuthUser } from "@/types";
import {
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

interface Props {
  user: AuthUser;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
  }),
};

const pendingLeaves = [
  {
    id: "lv1",
    name: "Vivek Krishnan",
    type: "Casual Leave",
    days: 2,
    from: "May 10",
    to: "May 11",
  },
  {
    id: "lv2",
    name: "Archana Nair",
    type: "Sick Leave",
    days: 1,
    from: "May 8",
    to: "May 8",
  },
  {
    id: "lv3",
    name: "Praveen Sharma",
    type: "Emergency Leave",
    days: 3,
    from: "May 12",
    to: "May 14",
  },
];

export function BranchManagerDashboard({ user }: Props) {
  const branchId = user.branchId ?? "b10";
  const branch = mockBranches.find((b) => b.id === branchId);
  const branchStaff = mockEmployees.filter(
    (e) => e.branchId === branchId && e.role === "staff",
  );

  const kpiCards = [
    {
      title: "Total Staff",
      value: branchStaff.length || 7,
      icon: <Users className="w-5 h-5" />,
      iconColor: "text-blue-500",
      subtitle: "Active members",
    },
    {
      title: "Active Customers",
      value: branch?.customerCount ?? 145,
      icon: <UserCheck className="w-5 h-5" />,
      iconColor: "text-purple-500",
      subtitle: "In branch",
    },
    {
      title: "Monthly Collection",
      value: `₹${((branch?.monthlyCollection ?? 480000) / 100000).toFixed(1)}L`,
      icon: <TrendingUp className="w-5 h-5" />,
      iconColor: "text-emerald-500",
      trend: "up" as const,
      trendValue: 4.8,
      subtitle: "April 2026",
    },
    {
      title: "Daily Target",
      value: "₹80k",
      icon: <Target className="w-5 h-5" />,
      iconColor: "text-indigo-500",
      subtitle: "Today's goal",
    },
    {
      title: "Today's Attendance",
      value: "6/7",
      icon: <Calendar className="w-5 h-5" />,
      iconColor: "text-teal-500",
      subtitle: "1 on leave",
    },
    {
      title: "Pending Payments",
      value: "₹85k",
      icon: <Clock className="w-5 h-5" />,
      iconColor: "text-amber-500",
      subtitle: "This week",
    },
    {
      title: "Collection Rate",
      value: "85%",
      icon: <BarChart2 className="w-5 h-5" />,
      iconColor: "text-cyan-500",
      trend: "up" as const,
      trendValue: 2.3,
      subtitle: "This month",
    },
  ];

  const dailyData = mockCollectionData.slice(0, 14).map((d) => ({
    date: d.date,
    collected: Math.round(d.collected / 1000),
    target: Math.round(d.target / 1000),
  }));

  const staffPerf = branchStaff.slice(0, 6).map((e, i) => ({
    name: e.name.split(" ")[0],
    collections: [18, 15, 14, 12, 11, 9][i] * 10000,
    score: e.performanceScore,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-1"
          >
            <KPICard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartWrapper
            title="Daily Collection"
            subtitle="Last 14 days (₹ Thousands)"
          >
            <LineChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.07}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                stroke="transparent"
                interval={3}
              />
              <YAxis tick={{ fontSize: 11 }} stroke="transparent" unit="k" />
              <Tooltip formatter={(v: number) => `₹${v}k`} />
              <Line
                type="monotone"
                dataKey="collected"
                name="Collected"
                stroke={chartColors.success}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke={chartColors.muted}
                strokeWidth={1.5}
                strokeDasharray="4 2"
                dot={false}
              />
            </LineChart>
          </ChartWrapper>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartWrapper
            title="Staff Performance"
            subtitle="Collection amounts (₹)"
          >
            <BarChart data={staffPerf}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.07}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                stroke="transparent"
              />
              <YAxis
                tickFormatter={(v) => `₹${v / 10000}k`}
                tick={{ fontSize: 11 }}
                stroke="transparent"
              />
              <Tooltip
                formatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Bar
                dataKey="collections"
                name="Collections"
                fill={chartColors.secondary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartWrapper>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="xl:col-span-2"
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
            <h3 className="font-display font-semibold text-base text-foreground mb-4">
              Staff Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Name",
                      "Role",
                      "Customers",
                      "Collections",
                      "Attendance",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {branchStaff.slice(0, 6).map((e, i) => (
                    <tr
                      key={e.id}
                      className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      data-ocid={`dashboard.staff_table.item.${i + 1}`}
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {e.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {e.name.split(" ")[0]}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground text-xs">
                        {e.designation}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {[23, 19, 21, 18, 25, 17][i]}
                      </td>
                      <td className="px-3 py-3 font-mono text-foreground">
                        ₹{[18, 15, 14, 12, 11, 9][i] * 1000}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {[95, 90, 88, 85, 92, 78][i]}%
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge
                          status={e.status === "active" ? "active" : "inactive"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base text-foreground">
                Leave Approvals
              </h3>
              <span className="text-xs bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full font-semibold">
                {pendingLeaves.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingLeaves.map((lv, i) => (
                <div
                  key={lv.id}
                  className="p-3 rounded-xl border border-border bg-muted/30"
                  data-ocid={`dashboard.leave.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {lv.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lv.type} &middot; {lv.days} day{lv.days > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lv.from} — {lv.to}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        toast.success(`${lv.name}'s leave approved`)
                      }
                      className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 transition-colors"
                      data-ocid={`dashboard.leave.confirm_button.${i + 1}`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.error(`${lv.name}'s leave rejected`)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-colors"
                      data-ocid={`dashboard.leave.cancel_button.${i + 1}`}
                    >
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
          <h3 className="font-display font-semibold text-base text-foreground mb-4">
            Today's Tasks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                task: "EMI collection follow-up for 8 customers",
                priority: "high",
                done: false,
              },
              {
                task: "Review Anjali's transfer request",
                priority: "medium",
                done: false,
              },
              {
                task: "Submit April collection report",
                priority: "high",
                done: true,
              },
              {
                task: "KYC verification for 3 new customers",
                priority: "medium",
                done: false,
              },
              { task: "Approve leave requests", priority: "low", done: false },
              { task: "Branch meeting at 3 PM", priority: "low", done: true },
            ].map((t, i) => (
              <div
                key={t.task}
                className={`flex items-start gap-3 p-3 rounded-xl border ${t.done ? "border-border/40 opacity-60" : "border-border"} bg-muted/20`}
                data-ocid={`dashboard.task.item.${i + 1}`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 ${t.done ? "bg-emerald-500 border-emerald-500" : "border-border"}`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {t.task}
                  </p>
                  <span
                    className={`text-[10px] font-semibold uppercase mt-1 ${t.priority === "high" ? "text-red-500" : t.priority === "medium" ? "text-amber-500" : "text-muted-foreground"}`}
                  >
                    {t.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
