import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
import { DataTable } from "@/components/shared/DataTable";
import type { Column } from "@/components/shared/DataTable";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mockBranches, mockEmployees, mockZones } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types";
import {
  Building2,
  ChevronUp,
  Eye,
  LayoutGrid,
  Pencil,
  Phone,
  Plus,
  Table2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const fmt = (n: number) =>
  n >= 1000000
    ? `₹${(n / 1000000).toFixed(2)}M`
    : n >= 1000
      ? `₹${(n / 1000).toFixed(0)}K`
      : `₹${n}`;

const collectionRate = (b: Branch) =>
  Math.round((b.monthlyCollection / (b.monthlyCollection * 1.12)) * 100);

const branchRevenueTrend = (b: Branch) =>
  Array.from({ length: 3 }, (_, i) => ({
    month: ["Feb", "Mar", "Apr"][i],
    revenue: Math.round(b.monthlyCollection * (0.88 + i * 0.06)),
  }));

interface AddBranchForm {
  name: string;
  zoneId: string;
  address: string;
  city: string;
  pin: string;
  phone: string;
  email: string;
  managerId: string;
  notes: string;
}

const emptyForm: AddBranchForm = {
  name: "",
  zoneId: "",
  address: "",
  city: "",
  pin: "",
  phone: "",
  email: "",
  managerId: "",
  notes: "",
};

function BranchCard({
  branch,
  onViewDetails,
  onEdit,
  isExpanded,
}: {
  branch: Branch;
  onViewDetails: () => void;
  onEdit: () => void;
  isExpanded: boolean;
}) {
  const zone = mockZones.find((z) => z.id === branch.zoneId);
  const manager = mockEmployees.find((e) => e.id === branch.managerId);
  const rate = collectionRate(branch);
  const staffInBranch = mockEmployees.filter((e) => e.branchId === branch.id);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-glow overflow-hidden",
        "dark:before:absolute dark:before:inset-0 dark:before:rounded-2xl",
        "dark:before:bg-gradient-to-br dark:before:from-primary/5 dark:before:to-transparent",
        "dark:before:pointer-events-none relative",
        isExpanded && "ring-2 ring-primary/40",
      )}
      data-ocid={`branch.card.${branch.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-base text-foreground truncate">
              {branch.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {zone && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  {zone.name}
                </Badge>
              )}
              <StatusBadge status={branch.status} />
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 mt-1">
          #{branch.id}
        </span>
      </div>

      {/* Manager */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
          <span className="text-xs font-bold text-secondary">
            {manager?.name.charAt(0) ?? "?"}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {manager?.name ?? "Unassigned"}
        </span>
        <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
          <Phone className="w-3 h-3" />
          {branch.phone}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: Users, label: "Staff", value: branch.employeeCount },
          { icon: Users, label: "Customers", value: branch.customerCount },
          {
            icon: Wallet,
            label: "Monthly",
            value: fmt(branch.monthlyCollection),
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="font-semibold text-sm text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Collection rate bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Collection Rate</span>
          <span
            className={cn(
              "text-xs font-bold",
              rate >= 90
                ? "text-emerald-500"
                : rate >= 75
                  ? "text-amber-500"
                  : "text-red-500",
            )}
          >
            {rate}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              rate >= 90
                ? "bg-emerald-500"
                : rate >= 75
                  ? "bg-amber-500"
                  : "bg-red-500",
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 text-xs"
          onClick={onViewDetails}
          data-ocid={`branch.view_button.${branch.id}`}
        >
          {isExpanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <Eye className="w-3 h-3" />
          )}
          {isExpanded ? "Collapse" : "View Details"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-xs"
          onClick={onEdit}
          data-ocid={`branch.edit_button.${branch.id}`}
        >
          <Pencil className="w-3 h-3" />
          Edit
        </Button>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Separator className="my-4" />
            {/* Mini revenue chart */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                3-Month Revenue Trend
              </p>
              <div style={{ height: 100 }}>
                <BarChart
                  width={220}
                  height={100}
                  data={branchRevenueTrend(branch)}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.3 0.01 255 / 0.3)"
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis
                    tickFormatter={(v: number) =>
                      `${(v / 1000000).toFixed(1)}M`
                    }
                    tick={{ fontSize: 10 }}
                  />
                  <RechartTooltip
                    formatter={(v: number) => fmt(v)}
                    contentStyle={{
                      background: "oklch(0.16 0.01 255)",
                      border: "1px solid oklch(0.25 0.01 255)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill={chartColors.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </div>
            </div>
            {/* Staff roster */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Staff Roster ({staffInBranch.length})
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {staffInBranch.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary">
                        {emp.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-foreground font-medium truncate max-w-[100px]">
                      {emp.name}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {emp.designation}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddBranchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<AddBranchForm>(emptyForm);

  const managers = mockEmployees.filter(
    (e) => e.role === "branch_manager" || e.role === "zonal_manager",
  );

  const set = (k: keyof AddBranchForm) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.zoneId) {
      toast.error("Branch name and zone are required");
      return;
    }
    toast.success(`Branch "${form.name}" created successfully!`);
    setForm(emptyForm);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="add_branch.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Add New Branch</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="b-name">Branch Name *</Label>
              <Input
                id="b-name"
                placeholder="e.g. Ernakulam South"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                data-ocid="add_branch.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-zone">Zone *</Label>
              <Select value={form.zoneId} onValueChange={set("zoneId")}>
                <SelectTrigger id="b-zone" data-ocid="add_branch.zone_select">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {mockZones.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="b-address">Address</Label>
            <Input
              id="b-address"
              placeholder="Street address"
              value={form.address}
              onChange={(e) => set("address")(e.target.value)}
              data-ocid="add_branch.address_input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="b-city">City</Label>
              <Input
                id="b-city"
                placeholder="City"
                value={form.city}
                onChange={(e) => set("city")(e.target.value)}
                data-ocid="add_branch.city_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-pin">PIN Code</Label>
              <Input
                id="b-pin"
                placeholder="6-digit PIN"
                value={form.pin}
                onChange={(e) => set("pin")(e.target.value)}
                data-ocid="add_branch.pin_input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="b-phone">Phone</Label>
              <Input
                id="b-phone"
                placeholder="0484-XXXXXXX"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                data-ocid="add_branch.phone_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-email">Email</Label>
              <Input
                id="b-email"
                type="email"
                placeholder="branch@thirukochi.com"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                data-ocid="add_branch.email_input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="b-manager">Branch Manager</Label>
            <Select value={form.managerId} onValueChange={set("managerId")}>
              <SelectTrigger
                id="b-manager"
                data-ocid="add_branch.manager_select"
              >
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} — {m.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="b-notes">Notes</Label>
            <Textarea
              id="b-notes"
              placeholder="Additional notes about the branch"
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              rows={2}
              data-ocid="add_branch.notes_textarea"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="add_branch.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            data-ocid="add_branch.submit_button"
          >
            Create Branch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BranchesPage() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [addOpen, setAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const tableColumns: Column<Branch>[] = [
    {
      key: "id",
      header: "Branch ID",
      sortKey: "id",
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground">
          {String(v)}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortKey: "name",
      render: (v) => (
        <span className="font-semibold text-foreground">{String(v)}</span>
      ),
    },
    {
      key: "zoneId",
      header: "Zone",
      render: (_v, row) => {
        const zone = mockZones.find((z) => z.id === row.zoneId);
        return zone ? (
          <Badge variant="secondary" className="text-xs">
            {zone.name}
          </Badge>
        ) : null;
      },
    },
    {
      key: "address",
      header: "Address",
      render: (v) => (
        <span className="text-xs text-muted-foreground max-w-[160px] block truncate">
          {String(v)}
        </span>
      ),
    },
    {
      key: "managerId",
      header: "Manager",
      render: (_v, row) => {
        const mgr = mockEmployees.find((e) => e.id === row.managerId);
        return <span className="text-sm">{mgr?.name ?? "—"}</span>;
      },
    },
    {
      key: "employeeCount",
      header: "Staff",
      sortKey: "employeeCount",
      numeric: true,
    },
    {
      key: "customerCount",
      header: "Customers",
      sortKey: "customerCount",
      numeric: true,
    },
    {
      key: "monthlyCollection",
      header: "Monthly Revenue",
      sortKey: "monthlyCollection",
      numeric: true,
      render: (v) => (
        <span className="font-mono text-sm">{fmt(Number(v))}</span>
      ),
    },
    {
      key: "id",
      header: "Collection Rate",
      render: (_v, row) => {
        const rate = collectionRate(row);
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
              <div
                style={{ width: `${rate}%` }}
                className={cn(
                  "h-full rounded-full",
                  rate >= 90
                    ? "bg-emerald-500"
                    : rate >= 75
                      ? "bg-amber-500"
                      : "bg-red-500",
                )}
              />
            </div>
            <span className="text-xs font-semibold">{rate}%</span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <StatusBadge status={v as "active" | "inactive" | "pending"} />
      ),
    },
  ];

  // Summary KPIs
  const totalStaff = mockBranches.reduce((a, b) => a + b.employeeCount, 0);
  const totalCustomers = mockBranches.reduce((a, b) => a + b.customerCount, 0);
  const totalRevenue = mockBranches.reduce(
    (a, b) => a + b.monthlyCollection,
    0,
  );
  const avgRate = Math.round(
    mockBranches.reduce((a, b) => a + collectionRate(b), 0) /
      mockBranches.length,
  );

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="branches.page">
          <PageHeader
            title="Branch Management"
            subtitle="Manage all branches and their operations"
            badge={`${mockBranches.length} Branches`}
            actions={[
              {
                label: view === "cards" ? "Table View" : "Cards View",
                onClick: () =>
                  setView((v) => (v === "cards" ? "table" : "cards")),
                icon:
                  view === "cards" ? (
                    <Table2 className="w-4 h-4" />
                  ) : (
                    <LayoutGrid className="w-4 h-4" />
                  ),
                variant: "outline",
              },
              {
                label: "Add Branch",
                onClick: () => setAddOpen(true),
                icon: <Plus className="w-4 h-4" />,
              },
            ]}
          />

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPICard
              title="Total Branches"
              value={mockBranches.length}
              trend="up"
              trendValue={8.3}
              icon={<Building2 className="w-5 h-5" />}
              iconColor="text-primary"
            />
            <KPICard
              title="Total Staff"
              value={totalStaff}
              trend="up"
              trendValue={4.2}
              icon={<Users className="w-5 h-5" />}
              iconColor="text-secondary"
            />
            <KPICard
              title="Active Customers"
              value={totalCustomers}
              trend="up"
              trendValue={6.7}
              icon={<Users className="w-5 h-5" />}
              iconColor="text-emerald-500"
            />
            <KPICard
              title="Monthly Revenue"
              value={fmt(totalRevenue)}
              subtitle={`Avg rate ${avgRate}%`}
              trend="up"
              trendValue={5.1}
              icon={<TrendingUp className="w-5 h-5" />}
              iconColor="text-amber-500"
            />
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {view === "cards" ? (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                data-ocid="branches.cards_grid"
              >
                {mockBranches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    isExpanded={expandedId === branch.id}
                    onViewDetails={() => toggleExpand(branch.id)}
                    onEdit={() => setEditingBranch(branch)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border bg-card shadow-glow overflow-hidden"
                data-ocid="branches.table"
              >
                <DataTable
                  columns={tableColumns}
                  data={mockBranches}
                  searchable
                  searchPlaceholder="Search branches..."
                  pageSize={8}
                  keyExtractor={(row) => row.id}
                  actions={(row) => (
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => toggleExpand(row.id)}
                        data-ocid={`branch.table_view_button.${row.id}`}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => setEditingBranch(row)}
                        data-ocid={`branch.table_edit_button.${row.id}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded branch detail panel (table view) */}
          <AnimatePresence>
            {view === "table" &&
              expandedId &&
              (() => {
                const branch = mockBranches.find((b) => b.id === expandedId);
                if (!branch) return null;
                const staffInBranch = mockEmployees.filter(
                  (e) => e.branchId === branch.id,
                );
                const zone = mockZones.find((z) => z.id === branch.zoneId);
                return (
                  <motion.div
                    key={expandedId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow space-y-6"
                    data-ocid="branch.detail_panel"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="font-display font-bold text-lg text-foreground">
                            {branch.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {zone?.name} Zone · {branch.address}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(null)}
                        data-ocid="branch.detail_close_button"
                      >
                        <ChevronUp className="w-4 h-4" />
                        Collapse
                      </Button>
                    </div>

                    {/* KPI cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <KPICard
                        title="Staff Count"
                        value={branch.employeeCount}
                        icon={<Users className="w-5 h-5" />}
                        iconColor="text-primary"
                      />
                      <KPICard
                        title="Customers"
                        value={branch.customerCount}
                        icon={<Users className="w-5 h-5" />}
                        iconColor="text-secondary"
                      />
                      <KPICard
                        title="Monthly Revenue"
                        value={fmt(branch.monthlyCollection)}
                        icon={<Wallet className="w-5 h-5" />}
                        iconColor="text-amber-500"
                      />
                      <KPICard
                        title="Collection Rate"
                        value={`${collectionRate(branch)}%`}
                        icon={<TrendingUp className="w-5 h-5" />}
                        iconColor="text-emerald-500"
                      />
                    </div>

                    {/* Chart + Staff table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChartWrapper
                        title="3-Month Revenue Trend"
                        subtitle="Feb — Apr 2026"
                        height={200}
                      >
                        <LineChart data={branchRevenueTrend(branch)}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="oklch(0.3 0.01 255 / 0.3)"
                          />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis
                            tickFormatter={(v: number) =>
                              `${(v / 1000000).toFixed(1)}M`
                            }
                            tick={{ fontSize: 11 }}
                          />
                          <RechartTooltip
                            formatter={(v: number) => [fmt(v), "Revenue"]}
                            contentStyle={{
                              background: "oklch(0.16 0.01 255)",
                              border: "1px solid oklch(0.25 0.01 255)",
                              borderRadius: 8,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke={chartColors.primary}
                            strokeWidth={2}
                            dot={{ fill: chartColors.primary, r: 4 }}
                          />
                        </LineChart>
                      </ChartWrapper>

                      <div className="rounded-xl border border-border overflow-hidden">
                        <div className="px-4 py-3 border-b border-border bg-muted/30">
                          <h3 className="font-semibold text-sm text-foreground">
                            Staff Roster
                          </h3>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border/50">
                                <th className="px-4 py-2 text-left text-xs text-muted-foreground font-semibold">
                                  Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs text-muted-foreground font-semibold">
                                  Designation
                                </th>
                                <th className="px-4 py-2 text-right text-xs text-muted-foreground font-semibold">
                                  Score
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {staffInBranch.map((emp) => (
                                <tr
                                  key={emp.id}
                                  className="border-b border-border/30 last:border-0"
                                >
                                  <td className="px-4 py-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-primary">
                                          {emp.name.charAt(0)}
                                        </span>
                                      </div>
                                      <span className="font-medium text-foreground">
                                        {emp.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-xs text-muted-foreground">
                                    {emp.designation}
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    <span
                                      className={cn(
                                        "text-xs font-bold",
                                        emp.performanceScore >= 85
                                          ? "text-emerald-500"
                                          : emp.performanceScore >= 70
                                            ? "text-amber-500"
                                            : "text-red-500",
                                      )}
                                    >
                                      {emp.performanceScore}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </div>

        <AddBranchModal open={addOpen} onClose={() => setAddOpen(false)} />

        {/* Edit modal reuses add, pre-fills data */}
        {editingBranch && (
          <Dialog
            open={!!editingBranch}
            onOpenChange={(o) => !o && setEditingBranch(null)}
          >
            <DialogContent className="max-w-md" data-ocid="edit_branch.dialog">
              <DialogHeader>
                <DialogTitle className="font-display">
                  Edit Branch: {editingBranch.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Branch Name</Label>
                  <Input
                    defaultValue={editingBranch.name}
                    data-ocid="edit_branch.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Address</Label>
                  <Input
                    defaultValue={editingBranch.address}
                    data-ocid="edit_branch.address_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    defaultValue={editingBranch.phone}
                    data-ocid="edit_branch.phone_input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingBranch(null)}
                  data-ocid="edit_branch.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success(`Branch "${editingBranch.name}" updated!`);
                    setEditingBranch(null);
                  }}
                  data-ocid="edit_branch.save_button"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
