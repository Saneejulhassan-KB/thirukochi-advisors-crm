import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  mockActivityLogs,
  mockBranches,
  mockEmployees,
  mockTransfers,
  mockZoneRevenue,
  mockZones,
  summaryKPIs,
} from "@/data/mockData";
import { useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Building2,
  CheckCircle2,
  Clock,
  Map as MapIcon,
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
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

const kpiCards = [
  {
    title: "Total Customers",
    value: "1,247",
    icon: <Users className="w-5 h-5" />,
    iconColor: "text-blue-500",
    trend: "up" as const,
    trendValue: 8.4,
    subtitle: "Across all branches",
  },
  {
    title: "Total Employees",
    value: "89",
    icon: <UserCheck className="w-5 h-5" />,
    iconColor: "text-purple-500",
    trend: "up" as const,
    trendValue: 2.1,
    subtitle: "Active staff",
  },
  {
    title: "Monthly Collection",
    value: "₹45.2L",
    icon: <TrendingUp className="w-5 h-5" />,
    iconColor: "text-emerald-500",
    trend: "up" as const,
    trendValue: 6.3,
    subtitle: "April 2026",
  },
  {
    title: "Pending Payments",
    value: "₹12.8L",
    icon: <Clock className="w-5 h-5" />,
    iconColor: "text-amber-500",
    trend: "down" as const,
    trendValue: -3.2,
    subtitle: "Overdue & upcoming",
  },
  {
    title: "Active Branches",
    value: "12",
    icon: <Building2 className="w-5 h-5" />,
    iconColor: "text-indigo-500",
    trend: "neutral" as const,
    subtitle: "All operational",
  },
  {
    title: "Total Zones",
    value: "4",
    icon: <MapIcon className="w-5 h-5" />,
    iconColor: "text-teal-500",
    trend: "neutral" as const,
    subtitle: "Kochi, Thrissur, Calicut, TVM",
  },
  {
    title: "Collection Rate",
    value: "78.5%",
    icon: <BarChart2 className="w-5 h-5" />,
    iconColor: "text-cyan-500",
    trend: "up" as const,
    trendValue: 4.1,
    subtitle: "This month",
  },
  {
    title: "Defaulters",
    value: "47",
    icon: <AlertTriangle className="w-5 h-5" />,
    iconColor: "text-red-500",
    trend: "down" as const,
    trendValue: -12,
    subtitle: "Needs follow-up",
  },
];

const zonePerformance = mockZones.map((z, i) => ({
  ...z,
  rank: i + 1,
  branchCount: mockBranches.filter((b) => b.zoneId === z.id).length,
  staffCount: mockEmployees.filter((e) => e.zoneId === z.id).length,
  collectionRate: [82, 78, 74, 71][i],
}));

const topPerformers = mockEmployees
  .filter((e) => e.role === "staff" || e.role === "branch_manager")
  .sort((a, b) => b.performanceScore - a.performanceScore)
  .slice(0, 5)
  .map((e, i) => ({
    ...e,
    rank: i + 1,
    collection: [182000, 165000, 148000, 139000, 125000][i],
    branch: mockBranches.find((b) => b.id === e.branchId)?.name ?? "—",
  }));

const branchCollectionData = mockBranches.slice(0, 8).map((b) => ({
  name: b.name.split(" ")[0],
  collection: Math.round(b.monthlyCollection / 100000),
}));

const pendingTransfers = mockTransfers.filter((t) => t.status === "pending");

export function SuperAdminDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <KPICard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <ChartWrapper
            title="Revenue Trend"
            subtitle="Zone-wise 6-month performance (₹ Lakhs)"
          >
            <LineChart data={mockZoneRevenue.slice(-6)}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.07}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="transparent"
              />
              <YAxis
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                tick={{ fontSize: 11 }}
                stroke="transparent"
              />
              <Tooltip
                formatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="kochi"
                name="Kochi"
                stroke={chartColors.primary}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="thrissur"
                name="Thrissur"
                stroke={chartColors.secondary}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="calicut"
                name="Calicut"
                stroke={chartColors.success}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="trivandrum"
                name="Trivandrum"
                stroke={chartColors.warning}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartWrapper>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <ChartWrapper
            title="Collection by Branch"
            subtitle="Current month (₹ Lakhs)"
          >
            <BarChart data={branchCollectionData}>
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
              <YAxis tick={{ fontSize: 11 }} stroke="transparent" unit="L" />
              <Tooltip formatter={(v: number) => `₹${v}L`} />
              <Bar
                dataKey="collection"
                name="Collection"
                fill={chartColors.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartWrapper>
        </motion.div>
      </div>

      {/* Tables + Activity + Approvals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Zone Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="xl:col-span-2"
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-base text-foreground">
                  Zone Performance
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Current month rankings
                </p>
              </div>
              <button
                type="button"
                onClick={() => void router.navigate({ to: "/zones" })}
                className="text-xs text-primary flex items-center gap-1 hover:gap-2 transition-all"
                data-ocid="dashboard.zone_table.view_all_link"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Rank",
                      "Zone",
                      "Branches",
                      "Staff",
                      "Revenue",
                      "Collection %",
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
                  {zonePerformance.map((z, i) => (
                    <tr
                      key={z.id}
                      className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      data-ocid={`dashboard.zone_table.item.${i + 1}`}
                    >
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            z.rank === 1
                              ? "bg-amber-500/20 text-amber-500"
                              : z.rank === 2
                                ? "bg-muted-foreground/20 text-muted-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {z.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-foreground">
                        {z.name}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {z.branchCount}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {z.staffCount}
                      </td>
                      <td className="px-3 py-3 font-mono text-foreground">
                        ₹{(z.totalRevenue / 100000).toFixed(1)}L
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted min-w-[60px]">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${z.collectionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {z.collectionRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base text-foreground">
                Pending Approvals
              </h3>
              <span className="text-xs bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full font-semibold">
                {pendingTransfers.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingTransfers.map((t, i) => {
                const emp = mockEmployees.find((e) => e.id === t.employeeId);
                const from = mockBranches.find((b) => b.id === t.fromBranchId);
                const to = mockBranches.find((b) => b.id === t.toBranchId);
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl border border-border bg-muted/30"
                    data-ocid={`dashboard.pending_approval.item.${i + 1}`}
                  >
                    <p className="text-sm font-medium text-foreground">
                      {emp?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {from?.name ?? "—"} → {to?.name ?? "—"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          toast.success(`Transfer for ${emp?.name} approved`)
                        }
                        className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 transition-colors"
                        data-ocid={`dashboard.pending_approval.confirm_button.${i + 1}`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast.error(`Transfer for ${emp?.name} rejected`)
                        }
                        className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-colors"
                        data-ocid={`dashboard.pending_approval.cancel_button.${i + 1}`}
                      >
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
            <h3 className="font-display font-semibold text-base text-foreground mb-4">
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.map((emp, i) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3"
                  data-ocid={`dashboard.leaderboard.item.${i + 1}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0
                        ? "bg-amber-500/20 text-amber-500"
                        : i === 1
                          ? "bg-muted-foreground/20 text-muted-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {emp.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {emp.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {emp.branch}
                    </p>
                  </div>
                  <span className="text-sm font-mono font-semibold text-emerald-500">
                    ₹{(emp.collection / 100000).toFixed(1)}L
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
            <h3 className="font-display font-semibold text-base text-foreground mb-4">
              Live Activity Feed
            </h3>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {mockActivityLogs.slice(0, 10).map((log, i) => (
                <div
                  key={log.id}
                  className="flex gap-3 items-start"
                  data-ocid={`dashboard.activity.item.${i + 1}`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">
                      {log.action.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {log.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
