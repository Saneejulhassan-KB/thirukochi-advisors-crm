import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
import { KPICard } from "@/components/shared/KPICard";
import { mockCustomers } from "@/data/mockData";
import type { AuthUser } from "@/types";
import {
  BarChart2,
  Calendar,
  CheckSquare,
  Clock,
  DollarSign,
  Target,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

const todaysTasks = [
  {
    id: "t1",
    title: "Collect EMI from Gopalan Nair",
    customer: "Gopalan Nair",
    time: "10:00 AM",
    amount: "₹15,000",
    priority: "high",
    done: false,
  },
  {
    id: "t2",
    title: "Follow-up: Thankam Varghese EMI",
    customer: "Thankam Varghese",
    time: "11:30 AM",
    amount: "₹6,000",
    priority: "medium",
    done: false,
  },
  {
    id: "t3",
    title: "KYC verification: Babu Jose",
    customer: "Babu Jose",
    time: "2:00 PM",
    amount: "—",
    priority: "medium",
    done: false,
  },
  {
    id: "t4",
    title: "Morning attendance marked",
    customer: "—",
    time: "09:05 AM",
    amount: "—",
    priority: "low",
    done: true,
  },
  {
    id: "t5",
    title: "Submit daily activity report",
    customer: "—",
    time: "6:00 PM",
    amount: "—",
    priority: "high",
    done: false,
  },
];

const weeklyCollection = [
  { day: "Mon", amount: 18 },
  { day: "Tue", amount: 12 },
  { day: "Wed", amount: 24 },
  { day: "Thu", amount: 9 },
  { day: "Fri", amount: 15 },
  { day: "Sat", amount: 6 },
  { day: "Sun", amount: 0 },
];

const priorityColors: Record<string, string> = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-muted-foreground",
};

export function StaffDashboard({ user }: Props) {
  const myCustomers = mockCustomers
    .filter((c) => c.assignedStaffId === user.id)
    .slice(0, 10);
  const totalTarget = 80000;
  const collected = 52000;
  const progressPct = Math.round((collected / totalTarget) * 100);

  const kpiCards = [
    {
      title: "Assigned Customers",
      value: 23,
      icon: <Users className="w-5 h-5" />,
      iconColor: "text-blue-500",
      subtitle: "Active accounts",
    },
    {
      title: "Collections Today",
      value: "₹12k",
      icon: <DollarSign className="w-5 h-5" />,
      iconColor: "text-emerald-500",
      trend: "up" as const,
      trendValue: 8,
      subtitle: "vs yesterday",
    },
    {
      title: "Pending Follow-ups",
      value: 8,
      icon: <Clock className="w-5 h-5" />,
      iconColor: "text-amber-500",
      subtitle: "Action needed",
    },
    {
      title: "Tasks Completed",
      value: "5/8",
      icon: <CheckSquare className="w-5 h-5" />,
      iconColor: "text-indigo-500",
      subtitle: "Today's tasks",
    },
    {
      title: "Attendance %",
      value: "95%",
      icon: <Calendar className="w-5 h-5" />,
      iconColor: "text-teal-500",
      subtitle: "This month",
    },
    {
      title: "Target Progress",
      value: `${progressPct}%`,
      icon: <Target className="w-5 h-5" />,
      iconColor: "text-purple-500",
      subtitle: "Monthly target",
    },
  ];

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Target Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
            <h3 className="font-display font-semibold text-base text-foreground mb-4">
              Target Progress
            </h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-display font-bold text-foreground">
                {progressPct}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly Collection Target
              </p>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{
                  duration: 1.2,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.6,
                }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Collected:{" "}
                <span className="text-foreground font-semibold">
                  ₹{(collected / 1000).toFixed(0)}k
                </span>
              </span>
              <span>
                Target:{" "}
                <span className="text-foreground font-semibold">
                  ₹{(totalTarget / 1000).toFixed(0)}k
                </span>
              </span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs font-medium text-primary">
                ₹{((totalTarget - collected) / 1000).toFixed(0)}k more to reach
                target
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Keep it up! You're doing great.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <ChartWrapper
            title="This Week's Collection"
            subtitle="Daily amounts (₹ Thousands)"
            height={200}
          >
            <BarChart data={weeklyCollection}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.07}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                stroke="transparent"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="transparent" unit="k" />
              <Tooltip formatter={(v: number) => `₹${v}k`} />
              <Bar dataKey="amount" name="Collection" radius={[4, 4, 0, 0]}>
                {weeklyCollection.map((entry) => (
                  <Cell
                    key={`cell-${entry.day}`}
                    fill={
                      entry.amount > 15
                        ? chartColors.success
                        : entry.amount > 8
                          ? chartColors.primary
                          : chartColors.muted
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartWrapper>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-glow h-full">
            <h3 className="font-display font-semibold text-base text-foreground mb-4">
              Today's Tasks
            </h3>
            <div className="space-y-2.5">
              {todaysTasks.map((task, i) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${task.done ? "border-border/40 opacity-60" : "border-border"} bg-muted/20`}
                  data-ocid={`dashboard.task.item.${i + 1}`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 mt-0.5 shrink-0 ${task.done ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs leading-tight ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {task.time}
                      </span>
                      {task.amount !== "—" && (
                        <span className="text-[10px] font-semibold text-emerald-500">
                          {task.amount}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold uppercase ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Customer Follow-up List */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-base text-foreground">
                Customer Follow-ups
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Prioritized by due date
              </p>
            </div>
            <span className="text-xs bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full font-semibold">
              8 pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Customer",
                    "Last Contact",
                    "Next Action",
                    "Amount Due",
                    "Risk",
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
                {myCustomers.slice(0, 8).map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                    data-ocid={`dashboard.followup.item.${i + 1}`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {c.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground text-xs">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {c.lastPaymentDate}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {c.nextDueDate}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-foreground">
                      ₹{c.emiAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          c.riskLevel === "low"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : c.riskLevel === "medium"
                              ? "bg-amber-500/15 text-amber-500"
                              : c.riskLevel === "critical"
                                ? "bg-red-500/15 text-red-500"
                                : "bg-orange-500/15 text-orange-500"
                        }`}
                      >
                        {c.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
