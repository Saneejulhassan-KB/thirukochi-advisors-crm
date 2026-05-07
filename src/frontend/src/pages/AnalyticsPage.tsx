import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
import { ExportButton } from "@/components/shared/ExportButton";
import { KPICard } from "@/components/shared/KPICard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockBranches, mockZoneRevenue, summaryKPIs } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Brain,
  Building2,
  Download,
  Lightbulb,
  Loader2,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = "daily" | "weekly" | "monthly" | "yearly";

interface StaffPerformance {
  rank: number;
  name: string;
  branch: string;
  collection: number;
  tasks: number;
  attendance: number;
  score: number;
  trend: "up" | "down";
}

interface ReportItem {
  name: string;
  period: string;
  generated: string;
  format: "PDF" | "Excel";
}

// ─── Mock Analytics Data ──────────────────────────────────────────────────────
const staffPerformance: StaffPerformance[] = [
  {
    rank: 1,
    name: "Anjali Pillai",
    branch: "Kochi Main",
    collection: 2840000,
    tasks: 42,
    attendance: 98,
    score: 96,
    trend: "up",
  },
  {
    rank: 2,
    name: "Divya Suresh",
    branch: "Trivandrum East",
    collection: 2650000,
    tasks: 38,
    attendance: 97,
    score: 93,
    trend: "up",
  },
  {
    rank: 3,
    name: "Nimisha George",
    branch: "Ernakulam North",
    collection: 2420000,
    tasks: 35,
    attendance: 96,
    score: 91,
    trend: "up",
  },
  {
    rank: 4,
    name: "Sowmya Babu",
    branch: "Thrissur Central",
    collection: 2280000,
    tasks: 33,
    attendance: 95,
    score: 89,
    trend: "up",
  },
  {
    rank: 5,
    name: "Pooja Chandran",
    branch: "Calicut Main",
    collection: 2180000,
    tasks: 31,
    attendance: 94,
    score: 87,
    trend: "down",
  },
  {
    rank: 6,
    name: "Vivek Krishnan",
    branch: "Kochi Main",
    collection: 2050000,
    tasks: 29,
    attendance: 93,
    score: 85,
    trend: "up",
  },
  {
    rank: 7,
    name: "Aakash Menon",
    branch: "Thrissur Central",
    collection: 1920000,
    tasks: 28,
    attendance: 91,
    score: 82,
    trend: "down",
  },
  {
    rank: 8,
    name: "Archana Nair",
    branch: "Fort Kochi",
    collection: 1840000,
    tasks: 26,
    attendance: 90,
    score: 80,
    trend: "up",
  },
  {
    rank: 9,
    name: "Faizal Khan",
    branch: "Calicut Main",
    collection: 1760000,
    tasks: 24,
    attendance: 88,
    score: 78,
    trend: "down",
  },
  {
    rank: 10,
    name: "Harish Raj",
    branch: "Kodungallur",
    collection: 1640000,
    tasks: 22,
    attendance: 86,
    score: 75,
    trend: "up",
  },
];

const reports: ReportItem[] = [
  {
    name: "Monthly Collection Report",
    period: "Oct 2025",
    generated: "01 Nov 2025",
    format: "PDF",
  },
  {
    name: "Branch Performance Report",
    period: "Q3 2025",
    generated: "02 Oct 2025",
    format: "Excel",
  },
  {
    name: "Zone Revenue Summary",
    period: "Sep 2025",
    generated: "01 Oct 2025",
    format: "PDF",
  },
  {
    name: "Customer KYC Status",
    period: "Oct 2025",
    generated: "05 Nov 2025",
    format: "Excel",
  },
  {
    name: "Defaulter Alert Report",
    period: "Oct 2025",
    generated: "31 Oct 2025",
    format: "PDF",
  },
  {
    name: "HR Attendance Report",
    period: "Oct 2025",
    generated: "03 Nov 2025",
    format: "Excel",
  },
];

const collectionStatusData = [
  { name: "Collected on time", value: 68, color: chartColors.success },
  { name: "Late collection", value: 18, color: chartColors.warning },
  { name: "Overdue", value: 9, color: chartColors.danger },
  { name: "Waived", value: 5, color: chartColors.muted },
];

const branchPerformanceData = mockBranches.slice(0, 10).map((b) => ({
  name: b.name.length > 12 ? `${b.name.slice(0, 11)}…` : b.name,
  revenue: Math.round(b.monthlyCollection / 10000),
  target: Math.round(
    (b.monthlyCollection * (0.85 + Math.random() * 0.3)) / 10000,
  ),
}));

const zoneComparisonData = [
  { zone: "Kochi", revenue: 482, collections: 448, staff: 19 },
  { zone: "Thrissur", revenue: 365, collections: 324, staff: 15 },
  { zone: "Calicut", revenue: 321, collections: 288, staff: 15 },
  { zone: "Trivandrum", revenue: 298, collections: 267, staff: 15 },
];

const customerGrowthData = [
  { month: "May", customers: 712 },
  { month: "Jun", customers: 748 },
  { month: "Jul", customers: 779 },
  { month: "Aug", customers: 805 },
  { month: "Sep", customers: 831 },
  { month: "Oct", customers: 856 },
  { month: "Nov", customers: 870 },
  { month: "Dec", customers: 888 },
  { month: "Jan", customers: 899 },
  { month: "Feb", customers: 912 },
  { month: "Mar", customers: 924 },
  { month: "Apr", customers: 933 },
];

const emiRecoveryData = [
  { month: "Nov", paid: 1840000, pending: 420000, overdue: 180000 },
  { month: "Dec", paid: 1920000, pending: 380000, overdue: 160000 },
  { month: "Jan", paid: 1780000, pending: 460000, overdue: 210000 },
  { month: "Feb", paid: 2010000, pending: 340000, overdue: 140000 },
  { month: "Mar", paid: 2180000, pending: 310000, overdue: 120000 },
  { month: "Apr", paid: 2340000, pending: 290000, overdue: 98000 },
];

const aiInsights = [
  {
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    headline: "Kochi zone outperforming by 24%",
    detail:
      "Kochi zone is performing 24% above quarterly target — highest achievement rate in the company this fiscal year.",
  },
  {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    headline: "Defaulter spike in Calicut zone",
    detail:
      "Defaulter rate increased by 2.1% in Calicut zone over the last 30 days — recommend immediate follow-up campaign.",
  },
  {
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    headline: "Technopark branch: 94.2% collection rate",
    detail:
      "Technopark branch maintains the highest collection rate in the entire network at 94.2%, driven by digital payment adoption.",
  },
  {
    icon: Lightbulb,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    headline: "Monday efficiency dip detected",
    detail:
      "Staff efficiency drops approximately 15% on Mondays compared to weekly average — consider scheduling review and team meetings earlier in the day.",
  },
];

// ─── Formatters ───────────────────────────────────────────────────────────────
function formatINR(val: number, compact = false): string {
  if (compact) {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${(val / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur-sm p-3 shadow-xl">
      {label && (
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          {label}
        </p>
      )}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground">
            {unit === "INR"
              ? formatINR(entry.value)
              : entry.value.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Report Download Button ───────────────────────────────────────────────────
function ReportDownloadButton({ name }: { name: string }) {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Report downloaded successfully", {
      description: `${name} has been saved to your downloads.`,
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="gap-1.5"
      data-ocid="analytics.report.download_button"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {loading ? "Downloading…" : "Download"}
    </Button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const periods: { key: Period; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  const kpis = [
    {
      title: "Total Revenue",
      value: "₹2.84Cr",
      subtitle: "Year to date",
      trend: "up" as const,
      trendValue: 8.4,
      icon: <Wallet className="w-5 h-5" />,
      iconColor: "text-primary",
    },
    {
      title: "Collection Rate",
      value: "78.5%",
      subtitle: "Of total outstanding",
      trend: "up" as const,
      trendValue: 3.2,
      icon: <TrendingUp className="w-5 h-5" />,
      iconColor: "text-emerald-500",
    },
    {
      title: "Customer Growth",
      value: "+12.3%",
      subtitle: "vs last period",
      trend: "up" as const,
      trendValue: 12.3,
      icon: <Users className="w-5 h-5" />,
      iconColor: "text-blue-500",
    },
    {
      title: "Defaulter Rate",
      value: "3.8%",
      subtitle: `${summaryKPIs.defaulterCount} active defaulters`,
      trend: "down" as const,
      trendValue: -0.4,
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: "text-amber-500",
    },
    {
      title: "Staff Efficiency",
      value: "87.2%",
      subtitle: `${summaryKPIs.totalEmployees} active staff`,
      trend: "up" as const,
      trendValue: 2.1,
      icon: <Zap className="w-5 h-5" />,
      iconColor: "text-purple-500",
    },
  ];

  const revenueData =
    period === "yearly"
      ? mockZoneRevenue.filter((_, i) => i % 3 === 0)
      : period === "weekly"
        ? mockZoneRevenue.slice(-8)
        : period === "daily"
          ? mockZoneRevenue.slice(-4)
          : mockZoneRevenue;

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-4 md:p-6 space-y-6" data-ocid="analytics.page">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PageHeader
              title="Analytics & Reports"
              subtitle="Company-wide performance intelligence and downloadable reports"
              className="mb-0"
            />
            <div className="flex items-center gap-2 shrink-0">
              <ExportButton label="Export Excel" format="excel" />
              <ExportButton label="Export PDF" format="pdf" />
            </div>
          </div>

          {/* Period Selector */}
          <div
            className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-fit border border-border"
            data-ocid="analytics.period.tab"
          >
            {periods.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-smooth",
                  period === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid={`analytics.period.${key}`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSkeleton variant="page" />
          ) : (
            <>
              {/* Section 1 — KPI Cards */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
                data-ocid="analytics.kpi.section"
              >
                {kpis.map((kpi, i) => (
                  <motion.div
                    key={kpi.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <KPICard
                      title={kpi.title}
                      value={kpi.value}
                      subtitle={kpi.subtitle}
                      trend={kpi.trend}
                      trendValue={kpi.trendValue}
                      icon={kpi.icon}
                      iconColor={kpi.iconColor}
                      data-ocid={`analytics.kpi.item.${i + 1}`}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Section 2 — Revenue & Collections */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-4"
              >
                <ChartWrapper
                  title="Revenue Trend by Zone"
                  subtitle="Monthly revenue (₹ Lakhs) across all 4 zones"
                  height={280}
                >
                  <LineChart data={revenueData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.25 0.01 255 / 0.4)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) =>
                        `₹${(v / 100000).toFixed(0)}L`
                      }
                      tick={{ fontSize: 11, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                    />
                    <Tooltip content={<CustomTooltip unit="INR" />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="kochi"
                      name="Kochi"
                      stroke={chartColors.primary}
                      strokeWidth={2}
                      dot={{ r: 4, fill: chartColors.primary }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="thrissur"
                      name="Thrissur"
                      stroke={chartColors.success}
                      strokeWidth={2}
                      dot={{ r: 4, fill: chartColors.success }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="calicut"
                      name="Calicut"
                      stroke={chartColors.warning}
                      strokeWidth={2}
                      dot={{ r: 4, fill: chartColors.warning }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="trivandrum"
                      name="Trivandrum"
                      stroke={chartColors.secondary}
                      strokeWidth={2}
                      dot={{ r: 4, fill: chartColors.secondary }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartWrapper>

                <ChartWrapper
                  title="Collection Status Distribution"
                  subtitle="Breakdown of payment collection outcomes this period"
                  height={280}
                >
                  <PieChart>
                    <Pie
                      data={collectionStatusData}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {collectionStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, ""]}
                      contentStyle={{
                        background: "var(--card)",
                        color: "var(--card-foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => (
                        <span style={{ fontSize: 12 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ChartWrapper>
              </motion.div>

              {/* Section 3 — Branch & Zone Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-4"
              >
                <ChartWrapper
                  title="Branch Performance"
                  subtitle="Revenue vs target (₹ in tens of thousands) — top 10 branches"
                  height={280}
                >
                  <BarChart data={branchPerformanceData} barGap={2}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.25 0.01 255 / 0.4)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const rev = payload.find(
                          (p) => p.dataKey === "revenue",
                        );
                        const tgt = payload.find((p) => p.dataKey === "target");
                        const pct =
                          rev && tgt && tgt.value
                            ? Math.round(
                                (Number(rev.value) / Number(tgt.value)) * 100,
                              )
                            : 0;
                        return (
                          <div className="rounded-xl border border-border bg-card/95 p-3 text-xs shadow-xl">
                            <p className="font-semibold mb-1">{label}</p>
                            <p style={{ color: chartColors.primary }}>
                              Revenue: ₹{rev?.value}0K
                            </p>
                            <p style={{ color: chartColors.success }}>
                              Target: ₹{tgt?.value}0K
                            </p>
                            <p className="text-muted-foreground mt-1">
                              Achievement: {pct}%
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Legend
                      iconType="square"
                      iconSize={10}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      fill={chartColors.primary}
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="target"
                      name="Target"
                      fill={chartColors.success}
                      radius={[3, 3, 0, 0]}
                      opacity={0.7}
                    />
                  </BarChart>
                </ChartWrapper>

                <ChartWrapper
                  title="Zone Comparison"
                  subtitle="Revenue (₹L), Collections (₹L) and Staff headcount per zone"
                  height={280}
                >
                  <BarChart data={zoneComparisonData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.25 0.01 255 / 0.4)"
                    />
                    <XAxis
                      dataKey="zone"
                      tick={{ fontSize: 12, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="square"
                      iconSize={10}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="revenue"
                      name="Revenue (₹L)"
                      fill={chartColors.primary}
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="collections"
                      name="Collections (₹L)"
                      fill={chartColors.secondary}
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="staff"
                      name="Staff Count"
                      fill={chartColors.success}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ChartWrapper>
              </motion.div>

              {/* Section 4 — Customer Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-4"
              >
                <ChartWrapper
                  title="Customer Growth"
                  subtitle="Cumulative customer count over 12 months"
                  height={260}
                >
                  <AreaChart data={customerGrowthData}>
                    <defs>
                      <linearGradient
                        id="customerGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors.primary}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.25 0.01 255 / 0.4)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[680, 960]}
                      tick={{ fontSize: 11, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="customers"
                      name="Customers"
                      stroke={chartColors.primary}
                      strokeWidth={2.5}
                      fill="url(#customerGradient)"
                    />
                  </AreaChart>
                </ChartWrapper>

                <ChartWrapper
                  title="EMI Recovery Analytics"
                  subtitle="Stacked monthly EMI collection breakdown (₹)"
                  height={260}
                >
                  <BarChart data={emiRecoveryData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.25 0.01 255 / 0.4)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) =>
                        `₹${(v / 100000).toFixed(0)}L`
                      }
                      tick={{ fontSize: 11, fill: "oklch(0.6 0.01 255)" }}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                    />
                    <Tooltip content={<CustomTooltip unit="INR" />} />
                    <Legend
                      iconType="square"
                      iconSize={10}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="paid"
                      name="Paid"
                      stackId="emi"
                      fill={chartColors.success}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      name="Pending"
                      stackId="emi"
                      fill={chartColors.warning}
                    />
                    <Bar
                      dataKey="overdue"
                      name="Overdue"
                      stackId="emi"
                      fill={chartColors.danger}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ChartWrapper>
              </motion.div>

              {/* Section 5 — Staff Performance Table */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-border bg-card shadow-glow overflow-hidden"
                data-ocid="analytics.staff_performance.section"
              >
                <div className="flex items-center justify-between gap-4 p-5 border-b border-border">
                  <div>
                    <h3 className="font-display font-semibold text-base text-foreground">
                      Top 10 Staff Performance
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ranked by collection amount and overall performance score
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Building2 className="w-3 h-3" /> Current Period
                  </Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/40 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Rank
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Staff Name
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Branch
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                          Collection
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                          Tasks
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                          Attendance
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                          Score
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffPerformance.map((s, i) => (
                        <motion.tr
                          key={s.name}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.04 }}
                          className="border-t border-border/50 hover:bg-muted/30 transition-colors"
                          data-ocid={`analytics.staff.item.${i + 1}`}
                        >
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                s.rank <= 3
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {s.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground">
                              {s.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {s.branch}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-foreground">
                            {formatINR(s.collection, true)}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {s.tasks}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                s.attendance >= 95
                                  ? "text-emerald-500"
                                  : "text-amber-500",
                              )}
                            >
                              {s.attendance}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${s.score}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-foreground w-8 text-right">
                                {s.score}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {s.trend === "up" ? (
                              <ArrowUp className="w-4 h-4 text-emerald-500 ml-auto" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-500 ml-auto" />
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Section 6 — AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                data-ocid="analytics.ai_insights.section"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-base text-foreground">
                    AI Insights
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    Powered by Analytics Engine
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {aiInsights.map((insight, i) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={insight.headline}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -3 }}
                        className={cn(
                          "rounded-2xl border p-4 transition-smooth",
                          insight.bg,
                        )}
                        data-ocid={`analytics.insight.item.${i + 1}`}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center mb-3",
                            insight.bg,
                          )}
                        >
                          <Icon className={cn("w-4 h-4", insight.color)} />
                        </div>
                        <p className="font-semibold text-sm text-foreground mb-1.5">
                          {insight.headline}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {insight.detail}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Section 7 — Reports Table */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-border bg-card shadow-glow overflow-hidden"
                data-ocid="analytics.reports.section"
              >
                <div className="flex items-center justify-between gap-4 p-5 border-b border-border">
                  <div>
                    <h3 className="font-display font-semibold text-base text-foreground">
                      Downloadable Reports
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Generated reports available for download in PDF and Excel
                      formats
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/40">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Report Name
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Period
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Generated
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Format
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r, i) => (
                        <tr
                          key={r.name}
                          className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                          data-ocid={`analytics.report.item.${i + 1}`}
                        >
                          <td className="px-5 py-3.5 font-medium text-foreground">
                            {r.name}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">
                            {r.period}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">
                            {r.generated}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge
                              variant={
                                r.format === "PDF" ? "destructive" : "secondary"
                              }
                              className="text-xs"
                            >
                              {r.format}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <ReportDownloadButton name={r.name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
