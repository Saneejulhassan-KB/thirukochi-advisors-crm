import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/authStore";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import ActivityLogsPage from "@/pages/ActivityLogsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AttendancePage from "@/pages/AttendancePage";
import BranchesPage from "@/pages/BranchesPage";
import CustomerDetailPage from "@/pages/CustomerDetailPage";
import CustomersPage from "@/pages/CustomersPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeDetailPage from "@/pages/EmployeeDetailPage";
import EmployeesPage from "@/pages/EmployeesPage";
import LoginPage from "@/pages/LoginPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SettingsPage from "@/pages/SettingsPage";
import TransfersPage from "@/pages/TransfersPage";
import ZonesPage from "@/pages/ZonesPage";
import { StaffAttendancePage } from "@/pages/staff/StaffAttendancePage";
import StaffCustomersPage from "@/pages/staff/StaffCustomersPage";
import StaffFollowUpPage from "@/pages/staff/StaffFollowUpPage";
import StaffLeadsPage from "@/pages/staff/StaffLeadsPage";
import StaffProfilePage from "@/pages/staff/StaffProfilePage";
import StaffTasksPage from "@/pages/staff/StaffTasksPage";

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Index redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customers",
  component: CustomersPage,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customers/$id",
  component: CustomerDetailPage,
});

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees",
  component: EmployeesPage,
});

const employeeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees/$id",
  component: EmployeeDetailPage,
});

const branchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/branches",
  component: BranchesPage,
});

const zonesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/zones",
  component: ZonesPage,
});

const transfersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transfers",
  component: TransfersPage,
});

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/attendance",
  component: AttendancePage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const activityLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activity-logs",
  component: ActivityLogsPage,
});

const staffProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff/profile",
  component: StaffProfilePage,
});

const staffLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff/leads",
  component: StaffLeadsPage,
});

const staffTasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff/tasks",
  component: StaffTasksPage,
});

const staffCustomersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff/customers",
  component: StaffCustomersPage,
});

const staffFollowupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff/followups",
  component: StaffFollowUpPage,
});

const staffAttendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff/attendance",
  component: StaffAttendancePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  customersRoute,
  customerDetailRoute,
  employeesRoute,
  employeeDetailRoute,
  branchesRoute,
  zonesRoute,
  transfersRoute,
  attendanceRoute,
  analyticsRoute,
  notificationsRoute,
  settingsRoute,
  activityLogsRoute,
  staffProfileRoute,
  staffLeadsRoute,
  staffTasksRoute,
  staffCustomersRoute,
  staffFollowupsRoute,
  staffAttendanceRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
