import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  Palette,
  ScrollText,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Section =
  | "profile"
  | "crm"
  | "roles"
  | "security"
  | "notifications"
  | "appearance"
  | "logs";

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "profile",
    label: "Profile Settings",
    icon: <User className="w-4 h-4" />,
  },
  {
    id: "crm",
    label: "CRM Configuration",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: "roles",
    label: "Role & Permissions",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: "security",
    label: "Security Settings",
    icon: <Lock className="w-4 h-4" />,
  },
  {
    id: "notifications",
    label: "Notification Settings",
    icon: <Bell className="w-4 h-4" />,
  },
  {
    id: "appearance",
    label: "Appearance Settings",
    icon: <Palette className="w-4 h-4" />,
  },
  {
    id: "logs",
    label: "System Logs",
    icon: <ScrollText className="w-4 h-4" />,
  },
];

const loginHistory = [
  {
    id: 1,
    device: "Chrome / Windows 11",
    ip: "103.45.67.89",
    location: "Kochi, Kerala",
    time: "May 07, 2026 09:15 AM",
  },
  {
    id: 2,
    device: "Safari / iPhone 14",
    ip: "103.45.67.90",
    location: "Kochi, Kerala",
    time: "May 06, 2026 06:42 PM",
  },
  {
    id: 3,
    device: "Chrome / macOS",
    ip: "192.168.1.100",
    location: "Thrissur, Kerala",
    time: "May 05, 2026 11:30 AM",
  },
  {
    id: 4,
    device: "Firefox / Ubuntu",
    ip: "103.45.67.91",
    location: "Kochi, Kerala",
    time: "May 03, 2026 02:15 PM",
  },
  {
    id: 5,
    device: "Chrome / Android",
    ip: "103.45.67.92",
    location: "Calicut, Kerala",
    time: "May 01, 2026 08:00 AM",
  },
];

const activeSessions = [
  {
    id: 1,
    device: "Chrome / Windows 11",
    lastActive: "Just now",
    location: "Kochi, Kerala",
  },
  {
    id: 2,
    device: "Safari / iPhone 14",
    lastActive: "2 hours ago",
    location: "Kochi, Kerala",
  },
  {
    id: 3,
    device: "Chrome / macOS Sonoma",
    lastActive: "Yesterday",
    location: "Trivandrum, Kerala",
  },
];

const roles = [
  {
    name: "Super Admin",
    description: "Full system access and control",
    count: 1,
  },
  {
    name: "Zonal Manager",
    description: "Zone-level oversight and approvals",
    count: 4,
  },
  {
    name: "Branch Manager",
    description: "Branch operations management",
    count: 12,
  },
  { name: "Staff", description: "Day-to-day customer operations", count: 12 },
];

const permissions = [
  "View Dashboard",
  "Manage Customers",
  "Manage Employees",
  "Approve Transfers",
  "View Reports",
  "Export Data",
  "Manage Branches",
  "Configure Settings",
];

const permissionMatrix: Record<string, Record<string, boolean>> = {
  "View Dashboard": {
    super_admin: true,
    zonal_manager: true,
    branch_manager: true,
    staff: true,
  },
  "Manage Customers": {
    super_admin: true,
    zonal_manager: true,
    branch_manager: true,
    staff: true,
  },
  "Manage Employees": {
    super_admin: true,
    zonal_manager: true,
    branch_manager: true,
    staff: false,
  },
  "Approve Transfers": {
    super_admin: true,
    zonal_manager: true,
    branch_manager: false,
    staff: false,
  },
  "View Reports": {
    super_admin: true,
    zonal_manager: true,
    branch_manager: true,
    staff: false,
  },
  "Export Data": {
    super_admin: true,
    zonal_manager: true,
    branch_manager: false,
    staff: false,
  },
  "Manage Branches": {
    super_admin: true,
    zonal_manager: false,
    branch_manager: false,
    staff: false,
  },
  "Configure Settings": {
    super_admin: true,
    zonal_manager: false,
    branch_manager: false,
    staff: false,
  },
};

const notifToggles = [
  {
    key: "payment_due",
    label: "Payment Due Alerts",
    email: true,
    whatsapp: true,
    push: true,
  },
  {
    key: "overdue",
    label: "Overdue Payment Alerts",
    email: true,
    whatsapp: true,
    push: true,
  },
  {
    key: "transfer",
    label: "Transfer Notifications",
    email: true,
    whatsapp: false,
    push: true,
  },
  {
    key: "attendance",
    label: "Attendance Alerts",
    email: false,
    whatsapp: false,
    push: true,
  },
  {
    key: "target",
    label: "Target Achievement",
    email: true,
    whatsapp: true,
    push: true,
  },
  {
    key: "birthday",
    label: "Birthday Reminders",
    email: false,
    whatsapp: true,
    push: false,
  },
  {
    key: "system",
    label: "System Alerts",
    email: true,
    whatsapp: false,
    push: true,
  },
];

const accentColors = [
  { name: "Indigo", value: "indigo", cls: "bg-indigo-500" },
  { name: "Blue", value: "blue", cls: "bg-blue-500" },
  { name: "Purple", value: "purple", cls: "bg-purple-500" },
  { name: "Teal", value: "teal", cls: "bg-teal-500" },
  { name: "Green", value: "green", cls: "bg-emerald-500" },
];

const systemLogs = [
  {
    time: "May 07, 2026 09:15:02",
    level: "INFO",
    message: "User suresh.menon logged in successfully",
    module: "Auth",
  },
  {
    time: "May 07, 2026 09:12:45",
    level: "INFO",
    message: "Database backup completed — 128 MB",
    module: "System",
  },
  {
    time: "May 06, 2026 23:00:00",
    level: "INFO",
    message: "Scheduled task: EMI reminder emails sent (47 customers)",
    module: "Scheduler",
  },
  {
    time: "May 06, 2026 18:42:11",
    level: "WARN",
    message: "Failed login attempt from IP 103.45.99.11",
    module: "Auth",
  },
  {
    time: "May 06, 2026 14:30:22",
    level: "INFO",
    message: "Report exported: Monthly Collection April 2026",
    module: "Reports",
  },
  {
    time: "May 06, 2026 11:15:08",
    level: "ERROR",
    message: "WhatsApp API timeout for bulk send batch #42",
    module: "WhatsApp",
  },
  {
    time: "May 05, 2026 09:00:00",
    level: "INFO",
    message: "System health check passed — all services running",
    module: "System",
  },
  {
    time: "May 04, 2026 16:45:33",
    level: "WARN",
    message: "High memory usage detected: 78% threshold reached",
    module: "System",
  },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [denseMode, setDenseMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [accentColor, setAccentColor] = useState("indigo");
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("medium");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [crmForm, setCrmForm] = useState({
    company: "ThiruKochi Advisors",
    address: "MG Road, Kochi, Kerala 682011",
    phone: "+91 484-2301234",
    email: "info@thirukochi.com",
    website: "www.thirukochi.com",
  });
  const [pwForm, setPwForm] = useState({ old: "", new: "", confirm: "" });
  const [perms, setPerms] = useState(permissionMatrix);

  const isSuperAdmin = user?.role === "super_admin";

  const handleSavePassword = () => {
    if (!pwForm.old || !pwForm.new || !pwForm.confirm) {
      toast.error("Please fill all password fields");
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    setPwForm({ old: "", new: "", confirm: "" });
    toast.success("Password changed successfully");
  };

  const handleSaveCRM = () => toast.success("CRM settings saved");
  const handleSavePermissions = () => toast.success("Permissions updated");
  const handleSaveProfile = () => toast.success("Profile saved");
  const handleSaveNotifications = () =>
    toast.success("Notification preferences saved");
  const handleSaveAppearance = () => toast.success("Appearance settings saved");
  const handleTerminateSession = (id: number) =>
    toast.info(`Session ${id} terminated`);
  const handleLogoutAll = () => toast.info("All other sessions terminated");

  const togglePerm = (perm: string, role: string) => {
    if (!isSuperAdmin) return;
    setPerms((prev) => ({
      ...prev,
      [perm]: { ...prev[perm], [role]: !prev[perm][role] },
    }));
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6" data-ocid="settings.page">
          <div className="mb-6">
            <h1 className="font-display font-bold text-2xl text-foreground">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage application preferences and configuration
            </p>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Left Sidebar Nav */}
            <aside className="lg:w-56 shrink-0">
              <nav
                className="rounded-2xl border border-border bg-card p-2 space-y-0.5"
                data-ocid="settings.nav"
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                    data-ocid={`settings.nav.${item.id}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Panel */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Profile Settings */}
                  {activeSection === "profile" && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 space-y-6"
                      data-ocid="settings.profile.panel"
                    >
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Profile Settings
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                          {user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") ?? "U"}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          data-ocid="settings.profile.upload_button"
                        >
                          <Upload className="w-4 h-4" /> Upload Photo
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            defaultValue={user?.name ?? ""}
                            className="mt-1"
                            data-ocid="settings.profile.name_input"
                          />
                        </div>
                        <div>
                          <Label>Email (read-only)</Label>
                          <Input
                            defaultValue={user?.email ?? ""}
                            readOnly
                            className="mt-1 bg-muted/40"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            defaultValue="+91 9876543210"
                            className="mt-1"
                            data-ocid="settings.profile.phone_input"
                          />
                        </div>
                        <div>
                          <Label>Job Title</Label>
                          <Input
                            defaultValue={user?.designation ?? ""}
                            className="mt-1"
                            data-ocid="settings.profile.title_input"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleSaveProfile}
                        data-ocid="settings.profile.save_button"
                      >
                        Save Profile
                      </Button>

                      {/* Change Password */}
                      <div className="border-t border-border pt-5">
                        <h3 className="font-semibold text-sm text-foreground mb-4">
                          Change Password
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(["old", "new", "confirm"] as const).map((field) => (
                            <div key={field}>
                              <Label>
                                {field === "old"
                                  ? "Old Password"
                                  : field === "new"
                                    ? "New Password"
                                    : "Confirm"}
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  type={
                                    field === "old"
                                      ? showOld
                                        ? "text"
                                        : "password"
                                      : showNew
                                        ? "text"
                                        : "password"
                                  }
                                  value={pwForm[field]}
                                  onChange={(e) =>
                                    setPwForm((p) => ({
                                      ...p,
                                      [field]: e.target.value,
                                    }))
                                  }
                                  data-ocid={`settings.password.${field}_input`}
                                />
                                {field === "old" ? (
                                  <button
                                    type="button"
                                    onClick={() => setShowOld((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                  >
                                    {showOld ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                ) : field === "new" ? (
                                  <button
                                    type="button"
                                    onClick={() => setShowNew((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                  >
                                    {showNew ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          className="mt-4"
                          onClick={handleSavePassword}
                          data-ocid="settings.password.submit_button"
                        >
                          Update Password
                        </Button>
                      </div>

                      {/* Login History */}
                      <div className="border-t border-border pt-5">
                        <h3 className="font-semibold text-sm text-foreground mb-3">
                          Login History
                        </h3>
                        <div className="rounded-xl border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/40 border-b border-border">
                                {[
                                  "Device",
                                  "IP Address",
                                  "Location",
                                  "Time",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {loginHistory.map((h, i) => (
                                <tr
                                  key={h.id}
                                  className="border-b border-border/40 last:border-0"
                                  data-ocid={`settings.login_history.item.${i + 1}`}
                                >
                                  <td className="px-3 py-2.5 text-foreground">
                                    {h.device}
                                  </td>
                                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                                    {h.ip}
                                  </td>
                                  <td className="px-3 py-2.5 text-muted-foreground">
                                    {h.location}
                                  </td>
                                  <td className="px-3 py-2.5 text-muted-foreground">
                                    {h.time}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CRM Configuration */}
                  {activeSection === "crm" && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 space-y-5"
                      data-ocid="settings.crm.panel"
                    >
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        CRM Configuration
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl border border-border bg-muted flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          data-ocid="settings.crm.logo_upload_button"
                        >
                          <Upload className="w-4 h-4" /> Upload Logo
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Company Name</Label>
                          <Input
                            value={crmForm.company}
                            onChange={(e) =>
                              setCrmForm((f) => ({
                                ...f,
                                company: e.target.value,
                              }))
                            }
                            className="mt-1"
                            data-ocid="settings.crm.company_input"
                          />
                        </div>
                        <div>
                          <Label>Website</Label>
                          <Input
                            value={crmForm.website}
                            onChange={(e) =>
                              setCrmForm((f) => ({
                                ...f,
                                website: e.target.value,
                              }))
                            }
                            className="mt-1"
                            data-ocid="settings.crm.website_input"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Address</Label>
                          <Textarea
                            value={crmForm.address}
                            onChange={(e) =>
                              setCrmForm((f) => ({
                                ...f,
                                address: e.target.value,
                              }))
                            }
                            rows={2}
                            className="mt-1"
                            data-ocid="settings.crm.address_textarea"
                          />
                        </div>
                        <div>
                          <Label>Contact Phone</Label>
                          <Input
                            value={crmForm.phone}
                            onChange={(e) =>
                              setCrmForm((f) => ({
                                ...f,
                                phone: e.target.value,
                              }))
                            }
                            className="mt-1"
                            data-ocid="settings.crm.phone_input"
                          />
                        </div>
                        <div>
                          <Label>Contact Email</Label>
                          <Input
                            value={crmForm.email}
                            onChange={(e) =>
                              setCrmForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                            className="mt-1"
                            data-ocid="settings.crm.email_input"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label>Currency</Label>
                          <Select defaultValue="inr">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inr">INR (₹)</SelectItem>
                              <SelectItem value="usd">USD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Timezone</Label>
                          <Select defaultValue="ist">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ist">
                                Asia/Kolkata (IST)
                              </SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Financial Year Start</Label>
                          <Select defaultValue="april">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="april">April</SelectItem>
                              <SelectItem value="january">January</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        onClick={handleSaveCRM}
                        data-ocid="settings.crm.save_button"
                      >
                        Save CRM Settings
                      </Button>
                    </div>
                  )}

                  {/* Role & Permissions */}
                  {activeSection === "roles" && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 space-y-6"
                      data-ocid="settings.roles.panel"
                    >
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Role &amp; Permissions
                      </h2>
                      {!isSuperAdmin ? (
                        <div className="rounded-xl border border-border bg-muted/20 p-8 text-center">
                          <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="font-semibold text-foreground">
                            Access Restricted
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Only Super Admins can manage roles and permissions.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-xl border border-border overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/40 border-b border-border">
                                  {[
                                    "Role Name",
                                    "Description",
                                    "Users",
                                    "Actions",
                                  ].map((h) => (
                                    <th
                                      key={h}
                                      className="px-4 py-3 text-left font-semibold text-muted-foreground"
                                    >
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {roles.map((role, i) => (
                                  <tr
                                    key={role.name}
                                    className="border-b border-border/40 last:border-0"
                                    data-ocid={`settings.roles.item.${i + 1}`}
                                  >
                                    <td className="px-4 py-3 font-medium text-foreground">
                                      {role.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                      {role.description}
                                    </td>
                                    <td className="px-4 py-3">
                                      <Badge variant="secondary">
                                        {role.count}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex gap-2">
                                        <Button variant="ghost" size="sm">
                                          Edit
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-destructive hover:text-destructive"
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm text-foreground mb-3">
                              Permission Matrix
                            </h3>
                            <div className="rounded-xl border border-border overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-muted/40 border-b border-border">
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                      Permission
                                    </th>
                                    {[
                                      "super_admin",
                                      "zonal_manager",
                                      "branch_manager",
                                      "staff",
                                    ].map((r) => (
                                      <th
                                        key={r}
                                        className="px-4 py-3 text-center font-semibold text-muted-foreground capitalize"
                                      >
                                        {r.replace("_", " ")}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {permissions.map((perm, i) => (
                                    <tr
                                      key={perm}
                                      className="border-b border-border/40 last:border-0"
                                      data-ocid={`settings.permissions.item.${i + 1}`}
                                    >
                                      <td className="px-4 py-3 text-foreground">
                                        {perm}
                                      </td>
                                      {[
                                        "super_admin",
                                        "zonal_manager",
                                        "branch_manager",
                                        "staff",
                                      ].map((role) => (
                                        <td
                                          key={role}
                                          className="px-4 py-3 text-center"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={
                                              perms[perm]?.[role] ?? false
                                            }
                                            onChange={() =>
                                              togglePerm(perm, role)
                                            }
                                            disabled={role === "super_admin"}
                                            className="accent-primary rounded"
                                            aria-label={`${role} - ${perm}`}
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <Button
                              className="mt-4"
                              onClick={handleSavePermissions}
                              data-ocid="settings.permissions.save_button"
                            >
                              Save Permissions
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeSection === "security" && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 space-y-6"
                      data-ocid="settings.security.panel"
                    >
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Security Settings
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                          <div>
                            <p className="font-medium text-foreground">
                              Two-Factor Authentication
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Adds extra security to your account
                            </p>
                          </div>
                          <Switch
                            checked={twoFA}
                            onCheckedChange={setTwoFA}
                            data-ocid="settings.security.2fa_switch"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                          <div>
                            <p className="font-medium text-foreground">
                              Session Timeout
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Auto-logout after inactivity
                            </p>
                          </div>
                          <Select
                            value={sessionTimeout}
                            onValueChange={setSessionTimeout}
                          >
                            <SelectTrigger
                              className="w-36"
                              data-ocid="settings.security.timeout_select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="0">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                          <div>
                            <p className="font-medium text-foreground">
                              IP Whitelist
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Restrict login to trusted IPs
                            </p>
                          </div>
                          <Switch
                            checked={ipWhitelist}
                            onCheckedChange={setIpWhitelist}
                            data-ocid="settings.security.ip_whitelist_switch"
                          />
                        </div>
                      </div>

                      <div className="border-t border-border pt-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-sm text-foreground">
                            Active Sessions
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogoutAll}
                            data-ocid="settings.security.logout_all_button"
                          >
                            Logout All Other Sessions
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {activeSessions.map((s, i) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between p-3 rounded-xl border border-border"
                              data-ocid={`settings.security.session.${i + 1}`}
                            >
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {s.device}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {s.lastActive} · {s.location}
                                </p>
                              </div>
                              {i === 0 ? (
                                <Badge variant="secondary">Current</Badge>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  onClick={() => handleTerminateSession(s.id)}
                                  data-ocid={`settings.security.terminate_button.${i + 1}`}
                                >
                                  Terminate
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeSection === "notifications" && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 space-y-5"
                      data-ocid="settings.notifications.panel"
                    >
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Notification Settings
                      </h2>
                      <div className="rounded-xl border border-border overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/40 border-b border-border">
                              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                                Notification Type
                              </th>
                              {["Email", "WhatsApp", "Push"].map((h) => (
                                <th
                                  key={h}
                                  className="px-4 py-3 text-center font-semibold text-muted-foreground"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {notifToggles.map((n, i) => (
                              <tr
                                key={n.key}
                                className="border-b border-border/40 last:border-0"
                                data-ocid={`settings.notifications.item.${i + 1}`}
                              >
                                <td className="px-4 py-3 text-foreground">
                                  {n.label}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Switch
                                    defaultChecked={n.email}
                                    data-ocid={`settings.notifications.email_toggle.${i + 1}`}
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Switch
                                    defaultChecked={n.whatsapp}
                                    data-ocid={`settings.notifications.whatsapp_toggle.${i + 1}`}
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Switch
                                    defaultChecked={n.push}
                                    data-ocid={`settings.notifications.push_toggle.${i + 1}`}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Button
                        onClick={handleSaveNotifications}
                        data-ocid="settings.notifications.save_button"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeSection === "appearance" && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 space-y-6"
                      data-ocid="settings.appearance.panel"
                    >
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Appearance Settings
                      </h2>
                      <div className="space-y-5">
                        <div>
                          <Label className="text-sm font-semibold">Theme</Label>
                          <div className="flex gap-3 mt-2">
                            {(["light", "dark", "auto"] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setTheme(t)}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors capitalize",
                                  theme === t
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border text-muted-foreground hover:text-foreground",
                                )}
                                data-ocid={`settings.appearance.theme_${t}`}
                              >
                                <Monitor className="w-4 h-4" /> {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">
                            Font Size
                          </Label>
                          <div className="flex gap-3 mt-2">
                            {(["small", "medium", "large"] as const).map(
                              (s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setFontSize(s)}
                                  className={cn(
                                    "px-4 py-2 rounded-xl border text-sm font-medium transition-colors capitalize",
                                    fontSize === s
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border text-muted-foreground hover:text-foreground",
                                  )}
                                  data-ocid={`settings.appearance.fontsize_${s}`}
                                >
                                  {s}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">
                            Color Accent
                          </Label>
                          <div className="flex gap-3 mt-2 flex-wrap">
                            {accentColors.map((c) => (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => setAccentColor(c.value)}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
                                  accentColor === c.value
                                    ? "border-primary"
                                    : "border-border",
                                )}
                                aria-label={c.name}
                                data-ocid={`settings.appearance.accent_${c.value}`}
                              >
                                <span
                                  className={cn("w-4 h-4 rounded-full", c.cls)}
                                />
                                {c.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                          <div>
                            <p className="font-medium text-foreground">
                              Dense Mode
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Compact UI spacing
                            </p>
                          </div>
                          <Switch
                            checked={denseMode}
                            onCheckedChange={setDenseMode}
                            data-ocid="settings.appearance.dense_switch"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                          <div>
                            <p className="font-medium text-foreground">
                              Animations
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Enable Framer Motion transitions
                            </p>
                          </div>
                          <Switch
                            checked={animations}
                            onCheckedChange={setAnimations}
                            data-ocid="settings.appearance.animations_switch"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleSaveAppearance}
                        data-ocid="settings.appearance.save_button"
                      >
                        Save Appearance
                      </Button>
                    </div>
                  )}

                  {/* System Logs */}
                  {activeSection === "logs" && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 space-y-4"
                      data-ocid="settings.logs.panel"
                    >
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        System Logs
                      </h2>
                      <div className="rounded-xl border border-border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/40 border-b border-border">
                              {["Timestamp", "Level", "Module", "Message"].map(
                                (h) => (
                                  <th
                                    key={h}
                                    className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap"
                                  >
                                    {h}
                                  </th>
                                ),
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {systemLogs.map((log, i) => (
                              <tr
                                key={log.time}
                                className="border-b border-border/40 last:border-0"
                                data-ocid={`settings.logs.item.${i + 1}`}
                              >
                                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                  {log.time}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded text-xs font-semibold",
                                      log.level === "INFO"
                                        ? "bg-primary/10 text-primary"
                                        : log.level === "WARN"
                                          ? "bg-amber-500/15 text-amber-500"
                                          : "bg-red-500/15 text-red-500",
                                    )}
                                  >
                                    {log.level}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                                  {log.module}
                                </td>
                                <td className="px-4 py-2.5 text-foreground">
                                  {log.message}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
