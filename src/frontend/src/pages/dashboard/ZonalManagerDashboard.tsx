import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  mockActivityLogs,
  mockBranches,
  mockEmployees,
  mockTransfers,
  mockZoneRevenue,
} from "@/data/mockData";
import type { AuthUser } from "@/types";
import {
  ArrowLeftRight,
  BarChart2,
  Building2,
  CheckCircle2,
  Clock,
  TrendingUp,
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

export function ZonalManagerDashboard({ user }: Props) {
  const zoneId = user.zoneId ?? "z2";
  const zoneBranches = mockBranches.filter((b) => b.zoneId === zoneId);
  const zoneStaff = mockEmployees.filter((e) => e.zoneId === zoneId);
  const pendingTransfers = mockTransfers.filter(
    (t) =>
      t.status === "pending" &&
      zoneBranches.some(
        (b) => b.id === t.fromBranchId || b.id === t.toBranchId,
      ),
  );

  const kpiCards = [
    {
      title: "Branches in Zone",
      value: zoneBranches.length,
      icon: <Building2 className="w-5 h-5" />,
      iconColor: "text-blue-500",
      subtitle: "All active",
    },
    {
      title: "Staff in Zone",
      value: zoneStaff.length,
      icon: <Users className="w-5 h-5" />,
      iconColor: "text-purple-500",
      subtitle: "Active staff",
    },
    {
      title: "Monthly Revenue",
      value: "₹14.2L",
      icon: <TrendingUp className="w-5 h-5" />,
      iconColor: "text-emerald-500",
      trend: "up" as const,
      trendValue: 5.2,
      subtitle: "April 2026",
    },
    {
      title: "Pending Payments",
      value: "₹3.1L",
      icon: <Clock className="w-5 h-5" />,
      iconColor: "text-amber-500",
      subtitle: "Overdue & upcoming",
    },
    {
      title: "Collection Rate",
      value: "82%",
      icon: <BarChart2 className="w-5 h-5" />,
      iconColor: "text-cyan-500",
      trend: "up" as const,
      trendValue: 3.5,
      subtitle: "This month",
    },
    {
      title: "Pending Transfers",
      value: pendingTransfers.length,
      icon: <ArrowLeftRight className="w-5 h-5" />,
      iconColor: "text-indigo-500",
      subtitle: "Awaiting approval",
    },
  ];

  const branchPerf = zoneBranches.map((b) => ({
    name: b.name.split(" ")[0],
    collection: Math.round(b.monthlyCollection / 100000),
    staff: b.employeeCount,
  }));

  const trendData = mockZoneRevenue.slice(-6).map((d) => ({
    month: d.month.split(" ")[0],
    revenue:
      zoneId === "z1"
        ? d.kochi
        : zoneId === "z2"
          ? d.thrissur
          : zoneId === "z3"
            ? d.calicut
            : d.trivandrum,
  }));

  const branchManagers = zoneBranches.map((b) => {
    const mgr = mockEmployees.find((e) => e.id === b.managerId);
    const targetPct = Math.round((b.monthlyCollection / 1600000) * 100);
    return {
      ...b,
      mgrName: mgr?.name ?? "—",
      targetPct: Math.min(targetPct, 120),
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartWrapper
            title="Branch Performance"
            subtitle="Current month (₹ Lakhs)"
          >
            <BarChart data={branchPerf}>
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartWrapper
            title="Monthly Trend"
            subtitle="Zone revenue over 6 months (₹)"
          >
            <LineChart data={trendData}>
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
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={chartColors.secondary}
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
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
              Branch Manager Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Branch",
                      "Manager",
                      "Staff",
                      "Collection",
                      "Target %",
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
                  {branchManagers.map((b, i) => (
                    <tr
                      key={b.id}
                      className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      data-ocid={`dashboard.branch_mgr.item.${i + 1}`}
                    >
                      <td className="px-3 py-3 font-medium text-foreground">
                        {b.name}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {b.mgrName}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {b.employeeCount}
                      </td>
                      <td className="px-3 py-3 font-mono text-foreground">
                        ₹{(b.monthlyCollection / 100000).toFixed(1)}L
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted min-w-[50px]">
                            <div
                              className={`h-full rounded-full ${b.targetPct >= 90 ? "bg-emerald-500" : b.targetPct >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{
                                width: `${Math.min(b.targetPct, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {b.targetPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge
                          status={b.targetPct >= 80 ? "active" : "pending"}
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
                Transfer Requests
              </h3>
              {pendingTransfers.length > 0 && (
                <span className="text-xs bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full font-semibold">
                  {pendingTransfers.length}
                </span>
              )}
            </div>
            {pendingTransfers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending transfers in your zone.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingTransfers.map((t, i) => {
                  const emp = mockEmployees.find((e) => e.id === t.employeeId);
                  const from = mockBranches.find(
                    (b) => b.id === t.fromBranchId,
                  );
                  const to = mockBranches.find((b) => b.id === t.toBranchId);
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl border border-border bg-muted/30"
                      data-ocid={`dashboard.transfer.item.${i + 1}`}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {emp?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {from?.name ?? "—"} → {to?.name ?? "—"}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => toast.success("Transfer approved")}
                          className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                          data-ocid={`dashboard.transfer.confirm_button.${i + 1}`}
                        >
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.error("Transfer rejected")}
                          className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-red-500/15 text-red-500 hover:bg-red-500/25"
                          data-ocid={`dashboard.transfer.cancel_button.${i + 1}`}
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Recent Activity
              </p>
              <div className="space-y-2">
                {mockActivityLogs.slice(0, 3).map((log, i) => (
                  <div
                    key={log.id}
                    className="flex gap-2 items-start"
                    data-ocid={`dashboard.zonal_activity.item.${i + 1}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-primary">
                        {log.action.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {log.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
