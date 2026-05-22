import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { type Column, DataTable } from "@/components/shared/DataTable";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilter } from "@/components/shared/SearchFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CalendarCheck,
  Clock,
  FileText,
  IndianRupee,
  User,
} from "lucide-react";
import { useState } from "react";

type RiskLevel = "low" | "medium" | "high" | "critical";
type CustomerStatus = "active" | "inactive" | "overdue" | "closed";

interface StaffCustomer {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  loanType: string;
  loanAmount: number;
  emiAmount: number;
  outstandingAmount: number;
  nextDueDate: string;
  lastPaymentDate: string;
  riskLevel: RiskLevel;
  status: CustomerStatus;
  notes: string;
}

const DUMMY_CUSTOMERS: StaffCustomer[] = [
  {
    id: "C001",
    name: "Ramachandran Nair",
    phone: "+91 9447201345",
    occupation: "Farmer",
    loanType: "Gold Loan",
    loanAmount: 250000,
    emiAmount: 8500,
    outstandingAmount: 185000,
    nextDueDate: "2026-05-25",
    lastPaymentDate: "2026-04-25",
    riskLevel: "low",
    status: "active",
    notes: "Reliable payer, always on time",
  },
  {
    id: "C002",
    name: "Sunitha Thomas",
    phone: "+91 9846523112",
    occupation: "Teacher",
    loanType: "Personal Loan",
    loanAmount: 150000,
    emiAmount: 5200,
    outstandingAmount: 112000,
    nextDueDate: "2026-05-22",
    lastPaymentDate: "2026-04-22",
    riskLevel: "low",
    status: "active",
    notes: "Teaching in Govt. school, stable income",
  },
  {
    id: "C003",
    name: "Biju Mathew",
    phone: "+91 9895001234",
    occupation: "Auto Driver",
    loanType: "Vehicle Loan",
    loanAmount: 350000,
    emiAmount: 11000,
    outstandingAmount: 290000,
    nextDueDate: "2026-05-20",
    lastPaymentDate: "2026-03-20",
    riskLevel: "high",
    status: "overdue",
    notes: "Missed 2 consecutive EMIs, needs follow-up",
  },
  {
    id: "C004",
    name: "Sheeba Antony",
    phone: "+91 9562341090",
    occupation: "Nurse",
    loanType: "Personal Loan",
    loanAmount: 200000,
    emiAmount: 6800,
    outstandingAmount: 156000,
    nextDueDate: "2026-05-28",
    lastPaymentDate: "2026-04-28",
    riskLevel: "medium",
    status: "active",
    notes: "Hospital employee, regular payment",
  },
  {
    id: "C005",
    name: "Pradeep Kumar",
    phone: "+91 9745678901",
    occupation: "Business",
    loanType: "Business Loan",
    loanAmount: 800000,
    emiAmount: 22000,
    outstandingAmount: 680000,
    nextDueDate: "2026-05-21",
    lastPaymentDate: "2026-04-15",
    riskLevel: "critical",
    status: "overdue",
    notes: "Business slowdown, requested restructuring",
  },
  {
    id: "C006",
    name: "Meenakshi Iyer",
    phone: "+91 9847230567",
    occupation: "Housewife",
    loanType: "Gold Loan",
    loanAmount: 120000,
    emiAmount: 4200,
    outstandingAmount: 78000,
    nextDueDate: "2026-06-05",
    lastPaymentDate: "2026-05-05",
    riskLevel: "low",
    status: "active",
    notes: "Recently renewed loan",
  },
  {
    id: "C007",
    name: "Vineeth Gopalan",
    phone: "+91 9946781234",
    occupation: "IT Professional",
    loanType: "Home Loan",
    loanAmount: 2500000,
    emiAmount: 21000,
    outstandingAmount: 2180000,
    nextDueDate: "2026-05-30",
    lastPaymentDate: "2026-04-30",
    riskLevel: "low",
    status: "active",
    notes: "Software engineer, excellent track record",
  },
  {
    id: "C008",
    name: "Saji Varghese",
    phone: "+91 9895234089",
    occupation: "Contractor",
    loanType: "Business Loan",
    loanAmount: 500000,
    emiAmount: 15500,
    outstandingAmount: 420000,
    nextDueDate: "2026-05-22",
    lastPaymentDate: "2026-04-22",
    riskLevel: "medium",
    status: "active",
    notes: "Construction business, seasonal income",
  },
  {
    id: "C009",
    name: "Anilkumar P",
    phone: "+91 9447890123",
    occupation: "Tailor",
    loanType: "Personal Loan",
    loanAmount: 100000,
    emiAmount: 3800,
    outstandingAmount: 45000,
    nextDueDate: "2026-05-18",
    lastPaymentDate: "2026-03-18",
    riskLevel: "high",
    status: "overdue",
    notes: "Shop income reduced post floods",
  },
  {
    id: "C010",
    name: "Resmi Rajesh",
    phone: "+91 9946012345",
    occupation: "Beautician",
    loanType: "Personal Loan",
    loanAmount: 80000,
    emiAmount: 2900,
    outstandingAmount: 32000,
    nextDueDate: "2026-06-10",
    lastPaymentDate: "2026-05-10",
    riskLevel: "low",
    status: "active",
    notes: "Parlor business, steady income",
  },
  {
    id: "C011",
    name: "Jose Kurian",
    phone: "+91 9895678012",
    occupation: "Fisherman",
    loanType: "Kisan Loan",
    loanAmount: 180000,
    emiAmount: 6200,
    outstandingAmount: 144000,
    nextDueDate: "2026-05-20",
    lastPaymentDate: "2026-04-20",
    riskLevel: "medium",
    status: "active",
    notes: "Seasonal income, payments during off-season may delay",
  },
  {
    id: "C012",
    name: "Aswathy Menon",
    phone: "+91 9562098765",
    occupation: "Govt Employee",
    loanType: "Personal Loan",
    loanAmount: 400000,
    emiAmount: 13500,
    outstandingAmount: 310000,
    nextDueDate: "2026-06-01",
    lastPaymentDate: "2026-05-01",
    riskLevel: "low",
    status: "active",
    notes: "State PSC employee, salary deduction",
  },
  {
    id: "C013",
    name: "Sudheer Namboodiri",
    phone: "+91 9447123890",
    occupation: "Temple Priest",
    loanType: "Gold Loan",
    loanAmount: 75000,
    emiAmount: 2800,
    outstandingAmount: 52000,
    nextDueDate: "2026-05-25",
    lastPaymentDate: "2026-04-25",
    riskLevel: "low",
    status: "active",
    notes: "Temple income, consistent payer",
  },
  {
    id: "C014",
    name: "Manju Krishnakumar",
    phone: "+91 9745012678",
    occupation: "ASHA Worker",
    loanType: "Personal Loan",
    loanAmount: 60000,
    emiAmount: 2100,
    outstandingAmount: 38000,
    nextDueDate: "2026-05-22",
    lastPaymentDate: "2026-04-22",
    riskLevel: "medium",
    status: "active",
    notes: "Incentive-based income, slight irregularity possible",
  },
  {
    id: "C015",
    name: "Chandran Velliyambalam",
    phone: "+91 9895567234",
    occupation: "Retired",
    loanType: "Gold Loan",
    loanAmount: 300000,
    emiAmount: 9500,
    outstandingAmount: 220000,
    nextDueDate: "2026-05-31",
    lastPaymentDate: "2026-04-30",
    riskLevel: "low",
    status: "active",
    notes: "Pension income, very reliable",
  },
];

const RISK_CFG: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  medium: {
    label: "Medium",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  high: {
    label: "High",
    className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

const STATUS_CFG: Record<CustomerStatus, { label: string; className: string }> =
  {
    active: {
      label: "Active",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    inactive: {
      label: "Inactive",
      className: "bg-muted text-muted-foreground border-border",
    },
    overdue: {
      label: "Overdue",
      className: "bg-red-500/10 text-red-600 border-red-500/20",
    },
    closed: {
      label: "Closed",
      className: "bg-muted text-muted-foreground border-border",
    },
  };

const fmtCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function StaffCustomersPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedCustomer, setSelectedCustomer] =
    useState<StaffCustomer | null>(null);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const thisWeekEnd = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .split("T")[0];

  const filtered = DUMMY_CUSTOMERS.filter((c) => {
    const q = search.toLowerCase();
    const ms =
      !search || c.name.toLowerCase().includes(q) || c.phone.includes(q);
    const mr = !filters.riskLevel || c.riskLevel === filters.riskLevel;
    const mst = !filters.status || c.status === filters.status;
    return ms && mr && mst;
  });

  const kpis = {
    total: DUMMY_CUSTOMERS.length,
    emiDue: DUMMY_CUSTOMERS.filter(
      (c) => c.nextDueDate <= thisWeekEnd && c.status !== "closed",
    ).length,
    overdue: DUMMY_CUSTOMERS.filter((c) => c.status === "overdue").length,
    paid: DUMMY_CUSTOMERS.filter(
      (c) =>
        c.lastPaymentDate >=
        new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
    ).length,
  };

  const columns: Column<StaffCustomer>[] = [
    {
      key: "name",
      header: "Customer",
      render: (_, row) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.phone}</p>
        </div>
      ),
    },
    {
      key: "loanType",
      header: "Loan Type",
      render: (v) => <span className="text-sm">{String(v)}</span>,
    },
    {
      key: "emiAmount",
      header: "EMI",
      numeric: true,
      render: (v) => (
        <span className="font-mono text-sm">{fmtCurrency(v as number)}</span>
      ),
    },
    {
      key: "nextDueDate",
      header: "Due Date",
      render: (v) => {
        const isNear = String(v) <= thisWeekEnd && String(v) >= today;
        return (
          <span
            className={cn(
              "text-xs font-medium",
              isNear ? "text-orange-500" : "text-muted-foreground",
            )}
          >
            {String(v)}
          </span>
        );
      },
    },
    {
      key: "riskLevel",
      header: "Risk",
      render: (v) => (
        <Badge
          variant="outline"
          className={cn("text-xs", RISK_CFG[v as RiskLevel].className)}
        >
          {RISK_CFG[v as RiskLevel].label}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <Badge
          variant="outline"
          className={cn("text-xs", STATUS_CFG[v as CustomerStatus].className)}
        >
          {STATUS_CFG[v as CustomerStatus].label}
        </Badge>
      ),
    },
  ];

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
    setNote("");
  };

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <AppLayout>
        <div className="p-6 space-y-6">
          <PageHeader
            title="My Customers"
            subtitle="Assigned customers, EMI status, and loan details"
            badge={`${DUMMY_CUSTOMERS.length} Assigned`}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="My Customers"
              value={kpis.total}
              icon={<User className="w-5 h-5" />}
              iconColor="text-primary"
            />
            <KPICard
              title="EMI Due This Week"
              value={kpis.emiDue}
              icon={<CalendarCheck className="w-5 h-5" />}
              iconColor="text-yellow-500"
            />
            <KPICard
              title="Overdue"
              value={kpis.overdue}
              icon={<AlertTriangle className="w-5 h-5" />}
              iconColor="text-red-500"
              trend="down"
            />
            <KPICard
              title="Paid This Month"
              value={kpis.paid}
              icon={<IndianRupee className="w-5 h-5" />}
              iconColor="text-emerald-500"
              trend="up"
            />
          </div>

          <Card className="border-border bg-card shadow-glow">
            <CardContent className="pt-4 space-y-4">
              <SearchFilter
                searchValue={search}
                onSearch={setSearch}
                filters={[
                  {
                    key: "riskLevel",
                    label: "Risk",
                    options: [
                      { label: "Low", value: "low" },
                      { label: "Medium", value: "medium" },
                      { label: "High", value: "high" },
                      { label: "Critical", value: "critical" },
                    ],
                  },
                  {
                    key: "status",
                    label: "Status",
                    options: [
                      { label: "Active", value: "active" },
                      { label: "Overdue", value: "overdue" },
                      { label: "Inactive", value: "inactive" },
                      { label: "Closed", value: "closed" },
                    ],
                  },
                ]}
                filterValues={filters}
                onFilter={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
                onClear={() => {
                  setSearch("");
                  setFilters({});
                }}
              />
              <DataTable
                columns={columns}
                data={filtered}
                keyExtractor={(r) => r.id}
                onRowClick={setSelectedCustomer}
              />
            </CardContent>
          </Card>

          {/* Customer Detail Modal */}
          {selectedCustomer && (
            <Dialog
              open={!!selectedCustomer}
              onOpenChange={() => setSelectedCustomer(null)}
            >
              <DialogContent
                className="max-w-lg"
                data-ocid="customers.detail_dialog"
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {selectedCustomer.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Occupation
                      </p>
                      <p className="font-medium">
                        {selectedCustomer.occupation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Loan Type</p>
                      <p className="font-medium">{selectedCustomer.loanType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Loan Amount
                      </p>
                      <p className="font-medium">
                        {fmtCurrency(selectedCustomer.loanAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        EMI Amount
                      </p>
                      <p className="font-medium text-primary">
                        {fmtCurrency(selectedCustomer.emiAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Outstanding
                      </p>
                      <p className="font-medium">
                        {fmtCurrency(selectedCustomer.outstandingAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Next Due Date
                      </p>
                      <p className="font-medium">
                        {selectedCustomer.nextDueDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Payment
                      </p>
                      <p className="font-medium">
                        {selectedCustomer.lastPaymentDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        RISK_CFG[selectedCustomer.riskLevel].className,
                      )}
                    >
                      Risk: {RISK_CFG[selectedCustomer.riskLevel].label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        STATUS_CFG[selectedCustomer.status].className,
                      )}
                    >
                      {STATUS_CFG[selectedCustomer.status].label}
                    </Badge>
                  </div>
                  {selectedCustomer.notes && (
                    <div className="rounded-lg bg-muted/60 border border-border p-3">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Notes
                      </p>
                      <p className="text-sm">{selectedCustomer.notes}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Add Note
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="Add a note about this customer interaction..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      data-ocid="customers.add_note_textarea"
                    />
                    {noteSaved && (
                      <p className="text-xs text-emerald-500">✓ Note saved</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCustomer(null)}
                    data-ocid="customers.detail_close_button"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleSaveNote}
                    disabled={!note}
                    data-ocid="customers.save_note_button"
                  >
                    Save Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
