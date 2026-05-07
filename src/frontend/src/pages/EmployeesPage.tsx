import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ExportButton } from "@/components/shared/ExportButton";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilter } from "@/components/shared/SearchFilter";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { mockBranches, mockEmployees, mockZones } from "@/data/mockData";
import type { Employee, EmployeeStatus, Role } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  Eye,
  Pencil,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ROLE_BADGE: Record<Role, { label: string; className: string }> = {
  super_admin: {
    label: "Super Admin",
    className: "bg-red-500/15 text-red-500 border-red-500/30",
  },
  zonal_manager: {
    label: "Zonal Manager",
    className: "bg-secondary/15 text-secondary border-secondary/30",
  },
  branch_manager: {
    label: "Branch Manager",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  staff: {
    label: "Staff",
    className: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  },
};

function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_BADGE[role];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        cfg.className
      }`}
    >
      {cfg.label}
    </span>
  );
}

// ─── AddEmployeeModal ─────────────────────────────────────────────────────────

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["Personal Info", "Role & Assignment", "Employment", "Documents"];

function AddEmployeeModal({ open, onClose }: AddEmployeeModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    role: "staff" as Role,
    zoneId: "",
    branchId: "",
    manager: "",
    hireDate: "",
    empType: "full_time",
    salary: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    toast.success("Employee added successfully", {
      description: `${form.name} has been added to the system.`,
    });
    setStep(0);
    setForm({
      name: "",
      phone: "",
      email: "",
      dob: "",
      gender: "",
      address: "",
      role: "staff",
      zoneId: "",
      branchId: "",
      manager: "",
      hireDate: "",
      empType: "full_time",
      salary: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" data-ocid="add_employee.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex gap-2 mb-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
              <p
                className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                  i === step ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {i + 1}. {s}
              </p>
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 0 && (
          <div className="grid gap-4" data-ocid="add_employee.step1">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="e.g. Anjali Menon"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  data-ocid="add_employee.name_input"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  data-ocid="add_employee.phone_input"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="user@thirukochi.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  data-ocid="add_employee.email_input"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => set("dob", e.target.value)}
                  data-ocid="add_employee.dob_input"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="add_employee.gender_select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input
                  placeholder="House, Street, City"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  data-ocid="add_employee.address_input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="grid gap-4" data-ocid="add_employee.step2">
            <div>
              <Label>Role</Label>
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="add_employee.role_select"
              >
                <option value="staff">Staff</option>
                <option value="branch_manager">Branch Manager</option>
                <option value="zonal_manager">Zonal Manager</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div>
              <Label>Zone</Label>
              <select
                value={form.zoneId}
                onChange={(e) => set("zoneId", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="add_employee.zone_select"
              >
                <option value="">Select Zone</option>
                {mockZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Branch</Label>
              <select
                value={form.branchId}
                onChange={(e) => set("branchId", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="add_employee.branch_select"
              >
                <option value="">Select Branch</option>
                {mockBranches
                  .filter((b) => !form.zoneId || b.zoneId === form.zoneId)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label>Reporting Manager</Label>
              <select
                value={form.manager}
                onChange={(e) => set("manager", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="add_employee.manager_select"
              >
                <option value="">Select Manager</option>
                {mockEmployees
                  .filter((e) =>
                    ["branch_manager", "zonal_manager", "super_admin"].includes(
                      e.role,
                    ),
                  )
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="grid gap-4" data-ocid="add_employee.step3">
            <div>
              <Label>Hire Date</Label>
              <Input
                type="date"
                value={form.hireDate}
                onChange={(e) => set("hireDate", e.target.value)}
                data-ocid="add_employee.hire_date_input"
              />
            </div>
            <div>
              <Label>Employee Type</Label>
              <select
                value={form.empType}
                onChange={(e) => set("empType", e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="add_employee.emp_type_select"
              >
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <Label>Monthly Salary (₹)</Label>
              <Input
                type="number"
                placeholder="e.g. 35000"
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
                data-ocid="add_employee.salary_input"
              />
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 3 && (
          <div className="grid gap-4" data-ocid="add_employee.step4">
            {[
              "Aadhaar Card",
              "PAN Card",
              "Education Certificate",
              "Experience Letter",
            ].map((doc) => (
              <div
                key={doc}
                className="flex items-center justify-between p-3 rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">
                  {doc}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="text-xs"
                  data-ocid="add_employee.upload_button"
                  onClick={() =>
                    toast.info(`Upload ${doc}`, {
                      description: "File upload would open here in production.",
                    })
                  }
                >
                  Upload
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            data-ocid="add_employee.back_button"
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              data-ocid="add_employee.next_button"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              data-ocid="add_employee.submit_button"
            >
              Add Employee
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── TransferModal ────────────────────────────────────────────────────────────

function TransferModal({
  employee,
  onClose,
}: {
  employee: Employee | null;
  onClose: () => void;
}) {
  const [toBranch, setToBranch] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    toast.success("Transfer request submitted", {
      description: `Transfer request for ${employee?.name} has been submitted for approval.`,
    });
    onClose();
  };

  return (
    <Dialog open={!!employee} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" data-ocid="transfer.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Initiate Transfer
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="p-3 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Employee</p>
            <p className="text-sm font-semibold text-foreground">
              {employee?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {mockBranches.find((b) => b.id === employee?.branchId)?.name ??
                "—"}
            </p>
          </div>
          <div>
            <Label>Transfer To Branch</Label>
            <select
              value={toBranch}
              onChange={(e) => setToBranch(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              data-ocid="transfer.branch_select"
            >
              <option value="">Select Branch</option>
              {mockBranches
                .filter((b) => b.id !== employee?.branchId)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <Label>Reason</Label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for transfer..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none mt-1"
              data-ocid="transfer.reason_textarea"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            data-ocid="transfer.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!toBranch}
            data-ocid="transfer.submit_button"
          >
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main EmployeesPage ───────────────────────────────────────────────────────

export default function EmployeesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [transferEmployee, setTransferEmployee] = useState<Employee | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const employees = useMemo(() => {
    return mockEmployees.filter((emp) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q);
      const matchRole = !filters.role || emp.role === filters.role;
      const matchZone = !filters.zone || emp.zoneId === filters.zone;
      const matchBranch = !filters.branch || emp.branchId === filters.branch;
      const matchStatus = !filters.status || emp.status === filters.status;
      return (
        matchSearch && matchRole && matchZone && matchBranch && matchStatus
      );
    });
  }, [search, filters]);

  const handleFilter = (key: string, val: string) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const clearFilters = () => {
    setSearch("");
    setFilters({});
  };

  const handleDeactivate = (emp: Employee) => {
    toast.success(`${emp.name} deactivated`, {
      description: "Employee status updated to inactive.",
    });
  };

  const stats = useMemo(() => {
    const total = mockEmployees.length;
    const active = mockEmployees.filter((e) => e.status === "active").length;
    const onLeave = mockEmployees.filter((e) => e.status === "on_leave").length;
    return { total, active, onLeave };
  }, []);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="employees.page">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <PageHeader
              title="Employee Management"
              subtitle="Manage staff, roles, and performance"
            />
            <div className="flex gap-2 shrink-0">
              <ExportButton label="Export" />
              <Button
                onClick={() => setAddOpen(true)}
                className="gap-2"
                data-ocid="employees.add_button"
              >
                <UserPlus className="w-4 h-4" />
                Add Employee
              </Button>
            </div>
          </div>

          {/* Summary KPI bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                title: "Total Employees",
                value: stats.total,
                icon: <Users className="w-5 h-5" />,
                iconColor: "text-primary",
                trend: "up" as const,
                trendValue: 4,
              },
              {
                title: "Active",
                value: stats.active,
                icon: <span className="text-xl">✅</span>,
                iconColor: "text-emerald-500",
                trend: "neutral" as const,
              },
              {
                title: "On Leave",
                value: stats.onLeave,
                icon: <span className="text-xl">🏖️</span>,
                iconColor: "text-amber-500",
                trend: "neutral" as const,
              },
              {
                title: "Pending Transfers",
                value: 5,
                icon: <ArrowRightLeft className="w-5 h-5" />,
                iconColor: "text-secondary",
                trend: "neutral" as const,
              },
            ].map((kpi, i) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <KPICard
                  title={kpi.title}
                  value={kpi.value}
                  icon={kpi.icon}
                  iconColor={kpi.iconColor}
                  trend={kpi.trend}
                  trendValue={kpi.trendValue}
                />
              </motion.div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <SearchFilter
              searchValue={search}
              onSearch={setSearch}
              filterValues={filters}
              onFilter={handleFilter}
              onClear={clearFilters}
              filters={[
                {
                  key: "role",
                  label: "Role",
                  options: [
                    { label: "Super Admin", value: "super_admin" },
                    { label: "Zonal Manager", value: "zonal_manager" },
                    { label: "Branch Manager", value: "branch_manager" },
                    { label: "Staff", value: "staff" },
                  ],
                },
                {
                  key: "zone",
                  label: "Zone",
                  options: mockZones.map((z) => ({
                    label: z.name,
                    value: z.id,
                  })),
                },
                {
                  key: "branch",
                  label: "Branch",
                  options: mockBranches.map((b) => ({
                    label: b.name,
                    value: b.id,
                  })),
                },
                {
                  key: "status",
                  label: "Status",
                  options: [
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                    { label: "On Leave", value: "on_leave" },
                    { label: "Transferred", value: "transferred" },
                  ],
                },
              ]}
            />
          </div>

          {/* Employee Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <p className="font-semibold text-foreground">
                Employees
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({employees.length} results)
                </span>
              </p>
              <Badge variant="outline" className="text-xs">
                {employees.filter((e) => e.status === "active").length} Active
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {[
                      "Employee ID",
                      "Name",
                      "Role",
                      "Branch / Zone",
                      "Phone",
                      "Hire Date",
                      "Performance",
                      "Customers",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-16 text-center text-muted-foreground"
                        data-ocid="employees.empty_state"
                      >
                        No employees found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp, idx) => {
                      const branch = mockBranches.find(
                        (b) => b.id === emp.branchId,
                      );
                      const zone = mockZones.find((z) => z.id === emp.zoneId);
                      const initials = emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                      const assignedCount = (idx % 7) + 2;

                      return (
                        <motion.tr
                          key={emp.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors last:border-0"
                          data-ocid={`employees.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                              {emp.id.toUpperCase()}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-primary">
                                  {initials}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-[140px]">
                                  {emp.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {emp.designation}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <RoleBadge role={emp.role} />
                          </td>

                          <td className="px-4 py-3">
                            <p className="text-sm text-foreground whitespace-nowrap">
                              {branch?.name ?? "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {zone?.name ?? "—"} Zone
                            </p>
                          </td>

                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-foreground">
                              {emp.phone}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(emp.hireDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <Progress
                                value={emp.performanceScore}
                                className="h-1.5 flex-1"
                              />
                              <span className="text-xs font-semibold text-foreground w-8 text-right">
                                {emp.performanceScore}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {assignedCount}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <StatusBadge
                              status={emp.status as EmployeeStatus}
                            />
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link to="/employees/$id" params={{ id: emp.id }}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8"
                                  title="View"
                                  data-ocid={`employees.view_button.${idx + 1}`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                title="Edit"
                                onClick={() =>
                                  toast.info("Edit Employee", {
                                    description: `Edit form for ${emp.name} would open here.`,
                                  })
                                }
                                data-ocid={`employees.edit_button.${idx + 1}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-secondary"
                                title="Transfer"
                                onClick={() => setTransferEmployee(emp)}
                                data-ocid={`employees.transfer_button.${idx + 1}`}
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-destructive"
                                title="Deactivate"
                                onClick={() => handleDeactivate(emp)}
                                data-ocid={`employees.delete_button.${idx + 1}`}
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <AddEmployeeModal open={addOpen} onClose={() => setAddOpen(false)} />
        <TransferModal
          employee={transferEmployee}
          onClose={() => setTransferEmployee(null)}
        />
      </AppLayout>
    </ProtectedRoute>
  );
}
