import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import type { Role } from "@/types";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Map as MapIcon,
  Phone,
  Settings,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "zonal_manager", "branch_manager", "staff"],
  },
  // Staff-only pages
  {
    label: "My Profile",
    path: "/staff/profile",
    icon: User,
    roles: ["staff"],
  },
  {
    label: "Lead Management",
    path: "/staff/leads",
    icon: UserPlus,
    roles: ["staff"],
  },
  {
    label: "My Tasks",
    path: "/staff/tasks",
    icon: CheckSquare,
    roles: ["staff"],
  },
  {
    label: "My Customers",
    path: "/customers",
    icon: Users,
    roles: ["staff"],
  },
  {
    label: "Follow-ups",
    path: "/staff/followups",
    icon: Phone,
    roles: ["staff"],
  },
  {
    label: "Attendance",
    path: "/staff/attendance",
    icon: Calendar,
    roles: ["staff"],
  },
  // Admin/manager shared pages
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
    roles: ["super_admin", "zonal_manager", "branch_manager"],
  },
  {
    label: "Employees",
    path: "/employees",
    icon: UserCheck,
    roles: ["super_admin", "zonal_manager", "branch_manager"],
  },
  {
    label: "Branches",
    path: "/branches",
    icon: Building2,
    roles: ["super_admin", "zonal_manager", "branch_manager"],
  },
  { label: "Zones", path: "/zones", icon: MapIcon, roles: ["super_admin"] },
  {
    label: "Transfers",
    path: "/transfers",
    icon: ArrowLeftRight,
    roles: ["super_admin", "zonal_manager", "branch_manager"],
  },
  {
    label: "Attendance",
    path: "/attendance",
    icon: Calendar,
    roles: ["super_admin", "zonal_manager", "branch_manager"],
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    roles: ["super_admin", "zonal_manager", "branch_manager"],
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    roles: ["super_admin", "zonal_manager", "branch_manager", "staff"],
  },
  {
    label: "Activity Logs",
    path: "/activity-logs",
    icon: FileText,
    roles: ["super_admin"],
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["super_admin"],
  },
];

const roleBadgeMap: Record<Role, { label: string; color: string }> = {
  super_admin: {
    label: "Super Admin",
    color: "bg-primary/20 text-primary border-primary/30",
  },
  zonal_manager: {
    label: "Zonal Mgr",
    color: "bg-secondary/20 text-secondary border-secondary/30",
  },
  branch_manager: {
    label: "Branch Mgr",
    color: "bg-accent/20 text-accent border-accent/30",
  },
  staff: {
    label: "Staff",
    color: "bg-muted text-muted-foreground border-border",
  },
};

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const filteredNav = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed top-0 left-0 z-30 h-screen flex flex-col",
          "bg-card border-r border-border shadow-elevated overflow-hidden",
          "lg:relative lg:z-auto",
        )}
        data-ocid="sidebar"
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div
            className={cn(
              "flex items-center justify-center rounded-xl shrink-0",
              "w-9 h-9 bg-gradient-to-br from-primary to-secondary shadow-glow",
            )}
          >
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <p className="font-display font-bold text-sm text-foreground truncate">
                  ThiruKochi
                </p>
                <p className="font-body text-xs text-muted-foreground truncate">
                  Advisors CRM
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "ml-auto shrink-0 p-1.5 rounded-lg",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            data-ocid="sidebar.toggle"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-2"
          aria-label="Main navigation"
        >
          <ul className="space-y-0.5">
            {filteredNav.map((item) => {
              const isActive =
                currentPath === item.path ||
                currentPath.startsWith(`${item.path}/`);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path as never}
                    onClick={() => {
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary/15 text-primary shadow-glow/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                    data-ocid={`sidebar.nav.${item.label.toLowerCase().replace(" ", "-")}`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        "shrink-0 w-5 h-5",
                        isActive && "text-primary",
                      )}
                    />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-medium truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info at bottom */}
        {user && (
          <div
            className={cn(
              "px-3 py-4 border-t border-border",
              sidebarOpen ? "flex items-center gap-3" : "flex justify-center",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full shrink-0",
                "w-8 h-8 bg-gradient-to-br from-primary/60 to-secondary/60 text-primary-foreground",
                "text-xs font-bold",
              )}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <span
                    className={cn(
                      "inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border mt-0.5",
                      roleBadgeMap[user.role].color,
                    )}
                  >
                    {roleBadgeMap[user.role].label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.aside>
    </>
  );
}
