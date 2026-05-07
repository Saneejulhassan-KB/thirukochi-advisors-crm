import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { type Column, DataTable } from "@/components/shared/DataTable";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilter } from "@/components/shared/SearchFilter";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  mockBranches,
  mockCustomers,
  mockEmployees,
  mockZones,
} from "@/data/mockData";
import { useAuthStore } from "@/store/authStore";
import type { Customer, CustomerStatus, RiskLevel } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Eye,
  MessageCircle,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AddCustomerForm {
  fullName: string;
  phone: string;
  alternatePhone: string;
  email: string;
  dob: string;
  occupation: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  loanAmount: string;
  emiAmount: string;
  emiDueDay: string;
  loanType: string;
  startDate: string;
  tenure: string;
  riskLevel: RiskLevel;
  assignedStaffId: string;
  notes: string;
}

const initialForm: AddCustomerForm = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  email: "",
  dob: "",
  occupation: "",
  street: "",
  city: "",
  district: "",
  state: "Kerala",
  pinCode: "",
  loanAmount: "",
  emiAmount: "",
  emiDueDay: "",
  loanType: "Gold Loan",
  startDate: "",
  tenure: "",
  riskLevel: "low",
  assignedStaffId: "",
  notes: "",
};

// ─── Step labels ───────────────────────────────────────────────────────────────
const STEPS = [
  "Personal Details",
  "Address",
  "Loan Details",
  "Risk & Assignment",
];

// ─── Add Customer Modal ────────────────────────────────────────────────────────
function AddCustomerModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (c: Customer) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AddCustomerForm>(initialForm);

  const set = useCallback(
    (key: keyof AddCustomerForm, val: string) =>
      setForm((f) => ({ ...f, [key]: val })),
    [],
  );

  const stepValid = () => {
    if (step === 0)
      return (
        form.fullName.trim() && form.phone.trim() && form.occupation.trim()
      );
    if (step === 1)
      return (
        form.street.trim() &&
        form.city.trim() &&
        form.district.trim() &&
        form.pinCode.trim()
      );
    if (step === 2)
      return (
        form.loanAmount.trim() &&
        form.emiAmount.trim() &&
        form.startDate.trim() &&
        form.tenure.trim()
      );
    return true;
  };

  const handleSubmit = () => {
    const newCustomer: Customer = {
      id: `c${Date.now()}`,
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      alternatePhone: form.alternatePhone,
      address: `${form.street}, ${form.city}, ${form.district}, ${form.state} - ${form.pinCode}`,
      occupation: form.occupation,
      branchId: "b1",
      zoneId: "z1",
      assignedStaffId: form.assignedStaffId || "e17",
      loanAmount: Number(form.loanAmount),
      emiAmount: Number(form.emiAmount),
      outstandingAmount: Number(form.loanAmount),
      riskLevel: form.riskLevel,
      status: "active",
      kycVerified: false,
      aadhaarNumber: "",
      panNumber: "",
      createdAt: new Date().toISOString().split("T")[0],
      lastPaymentDate: "",
      nextDueDate: "",
      paymentHistory: [],
    };
    onAdd(newCustomer);
    toast.success(`Customer ${form.fullName} added successfully`);
    setForm(initialForm);
    setStep(0);
    onClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    setStep(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg" data-ocid="add_customer.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Customer</DialogTitle>
        </DialogHeader>

        {/* Step progress */}
        <div className="flex items-center gap-1 mb-4">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-1 flex-1">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded transition-colors ${
                    i < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Step {step + 1} of {STEPS.length}:{" "}
          <span className="text-foreground font-medium">{STEPS[step]}</span>
        </p>

        {/* Step 0: Personal Details */}
        {step === 0 && (
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Full Name *</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Gopalan Nair"
                  data-ocid="add_customer.fullName_input"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="9876543210"
                  data-ocid="add_customer.phone_input"
                />
              </div>
              <div>
                <Label>Alternate Phone</Label>
                <Input
                  value={form.alternatePhone}
                  onChange={(e) => set("alternatePhone", e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="col-span-2">
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  type="email"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  value={form.dob}
                  onChange={(e) => set("dob", e.target.value)}
                  type="date"
                />
              </div>
              <div>
                <Label>Occupation *</Label>
                <Input
                  value={form.occupation}
                  onChange={(e) => set("occupation", e.target.value)}
                  placeholder="Businessman"
                  data-ocid="add_customer.occupation_input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="grid gap-3">
            <div>
              <Label>Street Address *</Label>
              <Input
                value={form.street}
                onChange={(e) => set("street", e.target.value)}
                placeholder="MG Road, Near Bus Stand"
                data-ocid="add_customer.street_input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Kochi"
                />
              </div>
              <div>
                <Label>District *</Label>
                <Input
                  value={form.district}
                  onChange={(e) => set("district", e.target.value)}
                  placeholder="Ernakulam"
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  placeholder="Kerala"
                />
              </div>
              <div>
                <Label>PIN Code *</Label>
                <Input
                  value={form.pinCode}
                  onChange={(e) => set("pinCode", e.target.value)}
                  placeholder="682001"
                  maxLength={6}
                  data-ocid="add_customer.pinCode_input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Loan Details */}
        {step === 2 && (
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Loan Amount (₹) *</Label>
                <Input
                  value={form.loanAmount}
                  onChange={(e) => set("loanAmount", e.target.value)}
                  type="number"
                  placeholder="500000"
                  data-ocid="add_customer.loanAmount_input"
                />
              </div>
              <div>
                <Label>EMI Amount (₹) *</Label>
                <Input
                  value={form.emiAmount}
                  onChange={(e) => set("emiAmount", e.target.value)}
                  type="number"
                  placeholder="15000"
                  data-ocid="add_customer.emiAmount_input"
                />
              </div>
              <div>
                <Label>EMI Due Day</Label>
                <Input
                  value={form.emiDueDay}
                  onChange={(e) => set("emiDueDay", e.target.value)}
                  type="number"
                  placeholder="1"
                  min="1"
                  max="28"
                />
              </div>
              <div>
                <Label>Loan Type</Label>
                <select
                  value={form.loanType}
                  onChange={(e) => set("loanType", e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="add_customer.loanType_select"
                >
                  <option>Gold Loan</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                </select>
              </div>
              <div>
                <Label>Start Date *</Label>
                <Input
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  type="date"
                  data-ocid="add_customer.startDate_input"
                />
              </div>
              <div>
                <Label>Tenure (months) *</Label>
                <Input
                  value={form.tenure}
                  onChange={(e) => set("tenure", e.target.value)}
                  type="number"
                  placeholder="36"
                  data-ocid="add_customer.tenure_input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Risk & Assignment */}
        {step === 3 && (
          <div className="grid gap-3">
            <div>
              <Label>Risk Level</Label>
              <select
                value={form.riskLevel}
                onChange={(e) => set("riskLevel", e.target.value as RiskLevel)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="add_customer.riskLevel_select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <Label>Assign Staff</Label>
              <select
                value={form.assignedStaffId}
                onChange={(e) => set("assignedStaffId", e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="add_customer.staff_select"
              >
                <option value="">Select Staff</option>
                {mockEmployees
                  .filter((e) => e.role === "staff")
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} — {e.designation}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label>Notes</Label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Any additional notes about the customer..."
                data-ocid="add_customer.notes_textarea"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 0 ? handleClose() : setStep((s) => s - 1))}
            data-ocid="add_customer.back_button"
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!stepValid()}
              data-ocid="add_customer.next_button"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              data-ocid="add_customer.submit_button"
            >
              Add Customer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(val: number) {
  return `₹${val.toLocaleString("en-IN")}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function isOverdue(date: string) {
  return new Date(date) < new Date();
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [extraCustomers, setExtraCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const allCustomers = useMemo(
    () => [...mockCustomers, ...extraCustomers],
    [extraCustomers],
  );

  // Role-based filtering
  const roleFiltered = useMemo(() => {
    if (!user) return allCustomers;
    if (user.role === "branch_manager") {
      return allCustomers.filter((c) => c.branchId === user.branchId);
    }
    if (user.role === "staff") {
      return allCustomers.filter((c) => c.assignedStaffId === user.id);
    }
    if (user.role === "zonal_manager") {
      return allCustomers.filter((c) => c.zoneId === user.zoneId);
    }
    return allCustomers;
  }, [user, allCustomers]);

  // Search + filter
  const filtered = useMemo(() => {
    let rows = roleFiltered;
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q),
      );
    }
    if (filters.status) {
      rows = rows.filter((c) => c.status === filters.status);
    }
    if (filters.branch) {
      rows = rows.filter((c) => c.branchId === filters.branch);
    }
    if (filters.zone) {
      rows = rows.filter((c) => c.zoneId === filters.zone);
    }
    return rows;
  }, [roleFiltered, search, filters]);

  // KPI counts
  const kpiTotal = roleFiltered.length;
  const kpiActive = roleFiltered.filter((c) => c.status === "active").length;
  const kpiDefaulters = roleFiltered.filter(
    (c) => c.status === "overdue",
  ).length;
  const kpiHighRisk = roleFiltered.filter(
    (c) => c.riskLevel === "high" || c.riskLevel === "critical",
  ).length;

  const handleFilter = useCallback(
    (key: string, val: string) => setFilters((f) => ({ ...f, [key]: val })),
    [],
  );

  const handleClear = useCallback(() => {
    setSearch("");
    setFilters({});
  }, []);

  const filterConfigs = useMemo(
    () => [
      {
        key: "status",
        label: "Status",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Overdue", value: "overdue" },
          { label: "Closed", value: "closed" },
        ],
      },
      {
        key: "branch",
        label: "Branch",
        options: mockBranches.map((b) => ({ label: b.name, value: b.id })),
      },
      {
        key: "zone",
        label: "Zone",
        options: mockZones.map((z) => ({ label: z.name, value: z.id })),
      },
    ],
    [],
  );

  const columns: Column<Customer>[] = [
    {
      key: "id",
      header: "Customer ID",
      render: (_, row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.id.toUpperCase()}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortKey: "name",
      render: (_, row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">
            {getInitials(row.name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{row.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (_, row) => (
        <span className="font-mono text-sm">{row.phone}</span>
      ),
    },
    {
      key: "loanAmount",
      header: "Loan Amount",
      sortKey: "loanAmount",
      numeric: true,
      render: (_, row) => (
        <span className="font-semibold">{formatINR(row.loanAmount)}</span>
      ),
    },
    {
      key: "emiAmount",
      header: "EMI/Month",
      numeric: true,
      render: (_, row) => <span>{formatINR(row.emiAmount)}</span>,
    },
    {
      key: "nextDueDate",
      header: "Due Date",
      sortKey: "nextDueDate",
      render: (_, row) => (
        <span
          className={`text-sm font-medium ${
            row.nextDueDate && isOverdue(row.nextDueDate)
              ? "text-red-500 dark:text-red-400"
              : "text-foreground"
          }`}
        >
          {row.nextDueDate || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => <StatusBadge status={row.status as CustomerStatus} />,
    },
    {
      key: "riskLevel",
      header: "Risk",
      render: (_, row) => <StatusBadge status={row.riskLevel as RiskLevel} />,
    },
    {
      key: "assignedStaffId",
      header: "Staff",
      render: (_, row) => {
        const staff = mockEmployees.find((e) => e.id === row.assignedStaffId);
        return (
          <span className="text-sm text-muted-foreground">
            {staff?.name ?? "—"}
          </span>
        );
      },
    },
  ];

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="customers.page">
          <PageHeader
            title="Customer Management"
            subtitle="Manage all customer records, KYC, and payments"
            actions={[
              {
                label: "Add Customer",
                icon: <Plus className="w-4 h-4" />,
                onClick: () => setModalOpen(true),
                variant: "default",
              },
            ]}
          />

          {/* KPI Bar */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            data-ocid="customers.kpi_section"
          >
            <KPICard
              title="Total Customers"
              value={kpiTotal}
              icon={<Users className="w-5 h-5" />}
              trend="up"
              trendValue={4.2}
              subtitle="All branches"
            />
            <KPICard
              title="Active"
              value={kpiActive}
              icon={<UserCheck className="w-5 h-5" />}
              trend="up"
              iconColor="text-emerald-500"
              subtitle={`${Math.round((kpiActive / Math.max(kpiTotal, 1)) * 100)}% of total`}
            />
            <KPICard
              title="Defaulters"
              value={kpiDefaulters}
              icon={<AlertTriangle className="w-5 h-5" />}
              trend={kpiDefaulters > 0 ? "down" : "neutral"}
              iconColor="text-amber-500"
              subtitle="Overdue EMIs"
            />
            <KPICard
              title="High Risk"
              value={kpiHighRisk}
              icon={<ShieldAlert className="w-5 h-5" />}
              trend={kpiHighRisk > 0 ? "down" : "neutral"}
              iconColor="text-red-500"
              subtitle="High + Critical risk"
            />
          </div>

          {/* Search + Filters */}
          <SearchFilter
            searchValue={search}
            onSearch={setSearch}
            filters={filterConfigs}
            filterValues={filters}
            onFilter={handleFilter}
            onClear={handleClear}
          />

          {/* Table */}
          <DataTable
            columns={columns}
            data={filtered}
            pageSize={10}
            keyExtractor={(row) => row.id}
            onRowClick={(row) =>
              navigate({ to: "/customers/$id", params: { id: row.id } })
            }
            emptyMessage="No customers found"
            actions={(row) => (
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() =>
                    navigate({ to: "/customers/$id", params: { id: row.id } })
                  }
                  aria-label="View customer"
                  data-ocid="customers.view_button"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => toast.info(`Edit ${row.name}`)}
                  aria-label="Edit customer"
                  data-ocid="customers.edit_button"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-emerald-500"
                  onClick={() =>
                    toast.success(`WhatsApp reminder sent to ${row.name}`, {
                      description: `+91 ${row.phone}`,
                    })
                  }
                  aria-label="Send WhatsApp"
                  data-ocid="customers.whatsapp_button"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-destructive"
                  onClick={() =>
                    toast.error(`Delete ${row.name}?`, {
                      description: "This action cannot be undone.",
                    })
                  }
                  aria-label="Delete customer"
                  data-ocid="customers.delete_button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          />
        </div>

        <AddCustomerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={(c) => setExtraCustomers((prev) => [c, ...prev])}
        />
      </AppLayout>
    </ProtectedRoute>
  );
}
