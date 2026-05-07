import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@tanstack/react-router";
import { BarChart2, Bell, FileText, Users } from "lucide-react";
import { motion } from "motion/react";
import { BranchManagerDashboard } from "./dashboard/BranchManagerDashboard";
import { StaffDashboard } from "./dashboard/StaffDashboard";
import { SuperAdminDashboard } from "./dashboard/SuperAdminDashboard";
import { ZonalManagerDashboard } from "./dashboard/ZonalManagerDashboard";

const roleActions = {
  super_admin: [
    {
      label: "Analytics",
      icon: <BarChart2 className="w-4 h-4" />,
      path: "/analytics" as const,
    },
    {
      label: "Employees",
      icon: <Users className="w-4 h-4" />,
      path: "/employees" as const,
    },
    {
      label: "Reports",
      icon: <FileText className="w-4 h-4" />,
      path: "/analytics" as const,
    },
  ],
  zonal_manager: [
    {
      label: "Branches",
      icon: <BarChart2 className="w-4 h-4" />,
      path: "/branches" as const,
    },
    {
      label: "Staff",
      icon: <Users className="w-4 h-4" />,
      path: "/employees" as const,
    },
  ],
  branch_manager: [
    {
      label: "Staff",
      icon: <Users className="w-4 h-4" />,
      path: "/employees" as const,
    },
    {
      label: "Reports",
      icon: <FileText className="w-4 h-4" />,
      path: "/analytics" as const,
    },
  ],
  staff: [
    {
      label: "Customers",
      icon: <Users className="w-4 h-4" />,
      path: "/customers" as const,
    },
    {
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      path: "/notifications" as const,
    },
  ],
} as const;

function DashboardContent() {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const actions = (roleActions[user.role] ?? []).map((a) => ({
    label: a.label,
    icon: a.icon,
    onClick: () => void router.navigate({ to: a.path }),
    variant: "outline" as const,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
      data-ocid="dashboard.page"
    >
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}!`}
        subtitle={`${user.designation} · ${dateStr}`}
        badge={user.role
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())}
        actions={actions}
      />

      {user.role === "super_admin" && <SuperAdminDashboard />}
      {user.role === "zonal_manager" && <ZonalManagerDashboard user={user} />}
      {user.role === "branch_manager" && <BranchManagerDashboard user={user} />}
      {user.role === "staff" && <StaffDashboard user={user} />}
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
