import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import type { AuthUser } from "@/types";
import { useRouter } from "@tanstack/react-router";
import {
  CheckCircle2,
  CheckSquare,
  CircleDot,
  ClipboardList,
  Plus,
  Target,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

// Task performance: last 7 days
const taskPerformanceData = [
  { day: "Mon", assigned: 6, completed: 5, pending: 1 },
  { day: "Tue", assigned: 8, completed: 6, pending: 2 },
  { day: "Wed", assigned: 5, completed: 5, pending: 0 },
  { day: "Thu", assigned: 9, completed: 7, pending: 2 },
  { day: "Fri", assigned: 7, completed: 4, pending: 3 },
  { day: "Sat", assigned: 4, completed: 4, pending: 0 },
  { day: "Sun", assigned: 3, completed: 2, pending: 1 },
];

// Target performance: last 4 weeks
const targetPerformanceData = [
  { week: "Week 1", assigned: 4, achieved: 3, pending: 1 },
  { week: "Week 2", assigned: 5, achieved: 4, pending: 1 },
  { week: "Week 3", assigned: 6, achieved: 5, pending: 1 },
  { week: "Week 4", assigned: 5, achieved: 3, pending: 2 },
];

export function StaffDashboard({ user }: Props) {
  const router = useRouter();

  const kpiCards = [
    {
      title: "Assigned Tasks",
      value: 42,
      icon: <ClipboardList className="w-5 h-5" />,
      iconColor: "text-blue-500",
      subtitle: "This month",
      trend: "up" as const,
      trendValue: 12,
    },
    {
      title: "Completed Tasks",
      value: 33,
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconColor: "text-emerald-500",
      subtitle: "Tasks finished",
      trend: "up" as const,
      trendValue: 8,
    },
    {
      title: "Pending Tasks",
      value: 9,
      icon: <CircleDot className="w-5 h-5" />,
      iconColor: "text-amber-500",
      subtitle: "Awaiting action",
      trend: "down" as const,
      trendValue: -3,
    },
    {
      title: "Assigned Targets",
      value: 20,
      icon: <Target className="w-5 h-5" />,
      iconColor: "text-purple-500",
      subtitle: "This month",
    },
    {
      title: "Pending Targets",
      value: 5,
      icon: <CheckSquare className="w-5 h-5" />,
      iconColor: "text-orange-500",
      subtitle: "In progress",
      trend: "neutral" as const,
    },
    {
      title: "Closed Targets",
      value: 15,
      icon: <XCircle className="w-5 h-5" />,
      iconColor: "text-teal-500",
      subtitle: "Achieved & closed",
      trend: "up" as const,
      trendValue: 20,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        subtitle={`${user.branchId ?? "ThiruKochi Advisors"} · ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
        badge={user.role === "staff" ? "Staff" : "Employee"}
      />

      {/* Task & Target Overview Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Task &amp; Target Overview
        </h2>
        <button
          type="button"
          onClick={() => router.navigate({ to: "/staff/tasks" })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          data-ocid="staff_dashboard.add_task_button"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            data-ocid={`staff_dashboard.kpi.${i + 1}`}
          >
            <KPICard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Task Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          data-ocid="staff_dashboard.task_performance_chart"
        >
          <ChartWrapper
            title="Task Performance"
            subtitle="Assigned vs Completed vs Pending — last 7 days"
            height={260}
          >
            <BarChart data={taskPerformanceData} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.07} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                stroke="transparent"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="transparent" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar
                dataKey="assigned"
                name="Assigned"
                fill={chartColors.primary}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill={chartColors.success}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill={chartColors.warning}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartWrapper>
        </motion.div>

        {/* Target Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          data-ocid="staff_dashboard.target_performance_chart"
        >
          <ChartWrapper
            title="Target Performance"
            subtitle="Assigned vs Achieved vs Pending — weekly view"
            height={260}
          >
            <BarChart data={targetPerformanceData} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.07} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11 }}
                stroke="transparent"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="transparent" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar
                dataKey="assigned"
                name="Assigned"
                fill={chartColors.secondary}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="achieved"
                name="Achieved"
                fill={chartColors.success}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill={chartColors.danger}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartWrapper>
        </motion.div>
      </div>
    </div>
  );
}
