import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { type Column, DataTable } from "@/components/shared/DataTable";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilter } from "@/components/shared/SearchFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowRightLeft,
  Flame,
  Phone,
  Plus,
  Target,
  ThermometerSun,
  TrendingDown,
  Users,
} from "lucide-react";
import { useState } from "react";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
type LeadPriority = "hot" | "warm" | "cold";
type InterestType = "loan" | "investment" | "insurance";
type LeadSource = "walk-in" | "referral" | "online" | "cold-call";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  interestType: InterestType;
  source: LeadSource;
  priority: LeadPriority;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  lastContact: string;
}

const DUMMY_LEADS: Lead[] = [
  {
    id: "L001",
    name: "Sreekumar Pillai",
    phone: "+91 9847201345",
    email: "sreekumar.p@gmail.com",
    address: "Vyttila, Kochi",
    interestType: "loan",
    source: "walk-in",
    priority: "hot",
    status: "contacted",
    notes: "Interested in gold loan, asked for 5L",
    createdAt: "2026-05-01",
    lastContact: "2026-05-18",
  },
  {
    id: "L002",
    name: "Lekha Menon",
    phone: "+91 9562341120",
    email: "lekha.m@yahoo.com",
    address: "Palakkad",
    interestType: "investment",
    source: "referral",
    priority: "warm",
    status: "qualified",
    notes: "Looking for SIP options",
    createdAt: "2026-05-03",
    lastContact: "2026-05-19",
  },
  {
    id: "L003",
    name: "Binu Jose",
    phone: "+91 9895120034",
    email: "binu.jose@gmail.com",
    address: "Thrissur",
    interestType: "insurance",
    source: "online",
    priority: "cold",
    status: "new",
    notes: "Term plan inquiry",
    createdAt: "2026-05-05",
    lastContact: "2026-05-05",
  },
  {
    id: "L004",
    name: "Divya Suresh",
    phone: "+91 9446231987",
    email: "divya.s@gmail.com",
    address: "Angamaly",
    interestType: "loan",
    source: "cold-call",
    priority: "hot",
    status: "qualified",
    notes: "Personal loan 3L for medical",
    createdAt: "2026-05-06",
    lastContact: "2026-05-20",
  },
  {
    id: "L005",
    name: "Rajan Varghese",
    phone: "+91 9961234567",
    email: "rajan.v@rediffmail.com",
    address: "Kothamangalam",
    interestType: "loan",
    source: "referral",
    priority: "warm",
    status: "new",
    notes: "Vehicle loan inquiry",
    createdAt: "2026-05-07",
    lastContact: "2026-05-07",
  },
  {
    id: "L006",
    name: "Anitha Krishnan",
    phone: "+91 8547890231",
    email: "anitha.k@gmail.com",
    address: "Perumbavoor",
    interestType: "investment",
    source: "walk-in",
    priority: "hot",
    status: "converted",
    notes: "Opened FD account",
    createdAt: "2026-04-20",
    lastContact: "2026-05-10",
  },
  {
    id: "L007",
    name: "Suresh Kumar Nair",
    phone: "+91 9745123098",
    email: "suresh.nair@gmail.com",
    address: "Muvattupuzha",
    interestType: "insurance",
    source: "online",
    priority: "cold",
    status: "lost",
    notes: "Not interested, went with competitor",
    createdAt: "2026-04-25",
    lastContact: "2026-05-02",
  },
  {
    id: "L008",
    name: "Meera Babu",
    phone: "+91 9447891234",
    email: "meera.babu@gmail.com",
    address: "Thodupuzha",
    interestType: "loan",
    source: "walk-in",
    priority: "hot",
    status: "contacted",
    notes: "Business loan 10L",
    createdAt: "2026-05-08",
    lastContact: "2026-05-21",
  },
  {
    id: "L009",
    name: "Arun Mohan",
    phone: "+91 9895671230",
    email: "arun.m@gmail.com",
    address: "Irinjalakuda",
    interestType: "investment",
    source: "referral",
    priority: "warm",
    status: "qualified",
    notes: "Mutual fund SIP",
    createdAt: "2026-05-09",
    lastContact: "2026-05-20",
  },
  {
    id: "L010",
    name: "Priya Nambiar",
    phone: "+91 9746123890",
    email: "priya.n@gmail.com",
    address: "Chalakudy",
    interestType: "insurance",
    source: "cold-call",
    priority: "warm",
    status: "new",
    notes: "Health insurance for family",
    createdAt: "2026-05-10",
    lastContact: "2026-05-10",
  },
  {
    id: "L011",
    name: "George Thomas",
    phone: "+91 9562890456",
    email: "george.t@gmail.com",
    address: "Aluva",
    interestType: "loan",
    source: "referral",
    priority: "hot",
    status: "contacted",
    notes: "Home loan pre-approval",
    createdAt: "2026-05-11",
    lastContact: "2026-05-21",
  },
  {
    id: "L012",
    name: "Sindhu Rajan",
    phone: "+91 9847234560",
    email: "sindhu.r@gmail.com",
    address: "North Paravur",
    interestType: "investment",
    source: "walk-in",
    priority: "cold",
    status: "new",
    notes: "Just browsing options",
    createdAt: "2026-05-12",
    lastContact: "2026-05-12",
  },
  {
    id: "L013",
    name: "Rajeev Chandrasekharan",
    phone: "+91 9446012345",
    email: "rajeev.c@gmail.com",
    address: "Paravur",
    interestType: "loan",
    source: "online",
    priority: "warm",
    status: "qualified",
    notes: "Education loan for son",
    createdAt: "2026-05-13",
    lastContact: "2026-05-19",
  },
  {
    id: "L014",
    name: "Jiji Mathew",
    phone: "+91 9895234009",
    email: "jiji.m@gmail.com",
    address: "Piravom",
    interestType: "insurance",
    source: "referral",
    priority: "hot",
    status: "contacted",
    notes: "Life insurance 50L cover",
    createdAt: "2026-05-14",
    lastContact: "2026-05-20",
  },
  {
    id: "L015",
    name: "Vinitha Gopinath",
    phone: "+91 9562341978",
    email: "vinitha.g@gmail.com",
    address: "Tripunithura",
    interestType: "loan",
    source: "cold-call",
    priority: "cold",
    status: "lost",
    notes: "Budget constraint",
    createdAt: "2026-05-15",
    lastContact: "2026-05-16",
  },
];

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> =
  {
    new: {
      label: "New",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    contacted: {
      label: "Contacted",
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    qualified: {
      label: "Qualified",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    converted: {
      label: "Converted",
      className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    lost: {
      label: "Lost",
      className: "bg-red-500/10 text-red-600 border-red-500/20",
    },
  };

const PRIORITY_CONFIG: Record<
  LeadPriority,
  { label: string; className: string }
> = {
  hot: {
    label: "Hot",
    className: "bg-red-500/15 text-red-600 border-red-500/30",
  },
  warm: {
    label: "Warm",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  },
  cold: {
    label: "Cold",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  },
};

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
];

export default function StaffLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(DUMMY_LEADS);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const [newLead, setNewLead] = useState<Partial<Lead>>({
    priority: "warm",
    source: "walk-in",
    interestType: "loan",
    status: "new",
  });

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search || l.name.toLowerCase().includes(q) || l.phone.includes(q);
    const matchStatus = !filters.status || l.status === filters.status;
    const matchPriority = !filters.priority || l.priority === filters.priority;
    return matchSearch && matchStatus && matchPriority;
  });

  const kpis = {
    total: leads.length,
    hot: leads.filter((l) => l.priority === "hot").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  const columns: Column<Lead>[] = [
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
      key: "priority",
      header: "Priority",
      render: (v) => (
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            PRIORITY_CONFIG[v as LeadPriority].className,
          )}
        >
          {PRIORITY_CONFIG[v as LeadPriority].label}
        </Badge>
      ),
    },
    {
      key: "interestType",
      header: "Interest",
      render: (v) => <span className="capitalize text-sm">{String(v)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <Badge
          variant="outline"
          className={cn("text-xs", STATUS_CONFIG[v as LeadStatus].className)}
        >
          {STATUS_CONFIG[v as LeadStatus].label}
        </Badge>
      ),
    },
    {
      key: "source",
      header: "Source",
      render: (v) => (
        <span className="capitalize text-sm text-muted-foreground">
          {String(v)}
        </span>
      ),
    },
    {
      key: "lastContact",
      header: "Last Contact",
      render: (v) => (
        <span className="text-xs text-muted-foreground">{String(v)}</span>
      ),
    },
  ];

  const handleStatusChange = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const handleConvert = (id: string) => {
    handleStatusChange(id, "converted");
    setConvertingId(null);
  };

  const handleAddLead = () => {
    const id = `L${String(leads.length + 1).padStart(3, "0")}`;
    setLeads((prev) => [
      {
        ...(newLead as Lead),
        id,
        createdAt: new Date().toISOString().split("T")[0],
        lastContact: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
    setShowForm(false);
    setNewLead({
      priority: "warm",
      source: "walk-in",
      interestType: "loan",
      status: "new",
    });
  };

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <AppLayout>
        <div className="p-6 space-y-6">
          <PageHeader
            title="Lead Management"
            subtitle="Create and manage your customer leads"
            actions={[
              {
                label: "Add Lead",
                onClick: () => setShowForm(true),
                icon: <Plus className="w-4 h-4" />,
              },
            ]}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Leads"
              value={kpis.total}
              icon={<Users className="w-5 h-5" />}
              iconColor="text-primary"
            />
            <KPICard
              title="Hot Leads"
              value={kpis.hot}
              icon={<Flame className="w-5 h-5" />}
              iconColor="text-red-500"
            />
            <KPICard
              title="Converted"
              value={kpis.converted}
              icon={<Target className="w-5 h-5" />}
              iconColor="text-emerald-500"
              trend="up"
            />
            <KPICard
              title="Lost"
              value={kpis.lost}
              icon={<TrendingDown className="w-5 h-5" />}
              iconColor="text-muted-foreground"
              trend="down"
            />
          </div>

          <Card className="border-border bg-card shadow-glow">
            <CardContent className="pt-4 space-y-4">
              <SearchFilter
                searchValue={search}
                onSearch={setSearch}
                filters={[
                  {
                    key: "status",
                    label: "Status",
                    options: STATUSES.map((s) => ({
                      label: STATUS_CONFIG[s].label,
                      value: s,
                    })),
                  },
                  {
                    key: "priority",
                    label: "Priority",
                    options: [
                      { label: "Hot", value: "hot" },
                      { label: "Warm", value: "warm" },
                      { label: "Cold", value: "cold" },
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
                searchable={false}
                actions={(row) => (
                  <div className="flex items-center gap-1 justify-end">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        handleStatusChange(row.id, e.target.value as LeadStatus)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleStatusChange(
                            row.id,
                            (e.target as HTMLSelectElement).value as LeadStatus,
                          );
                        }
                      }}
                      className="text-xs h-7 rounded border border-input bg-background px-1.5 text-foreground"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Update status"
                      data-ocid={`leads.status_select.${row.id}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                    {row.status !== "converted" && row.status !== "lost" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                        onClick={() => setConvertingId(row.id)}
                        data-ocid={`leads.convert_button.${row.id}`}
                      >
                        <ArrowRightLeft className="w-3 h-3" /> Convert
                      </Button>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>

          {/* Add Lead Modal */}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent
              className="max-w-lg"
              data-ocid="leads.add_lead_dialog"
            >
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="col-span-2 space-y-1.5">
                  <Label>Customer Name</Label>
                  <Input
                    placeholder="Full name"
                    value={newLead.name ?? ""}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                    data-ocid="leads.add_name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    value={newLead.phone ?? ""}
                    onChange={(e) =>
                      setNewLead({ ...newLead, phone: e.target.value })
                    }
                    data-ocid="leads.add_phone_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    placeholder="email@example.com"
                    value={newLead.email ?? ""}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                    data-ocid="leads.add_email_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Interest Type</Label>
                  <select
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    value={newLead.interestType}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        interestType: e.target.value as InterestType,
                      })
                    }
                    data-ocid="leads.add_interest_select"
                  >
                    <option value="loan">Loan</option>
                    <option value="investment">Investment</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Source</Label>
                  <select
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    value={newLead.source}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        source: e.target.value as LeadSource,
                      })
                    }
                    data-ocid="leads.add_source_select"
                  >
                    <option value="walk-in">Walk-in</option>
                    <option value="referral">Referral</option>
                    <option value="online">Online</option>
                    <option value="cold-call">Cold Call</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <select
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    value={newLead.priority}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        priority: e.target.value as LeadPriority,
                      })
                    }
                    data-ocid="leads.add_priority_select"
                  >
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Address</Label>
                  <Input
                    placeholder="City, District"
                    value={newLead.address ?? ""}
                    onChange={(e) =>
                      setNewLead({ ...newLead, address: e.target.value })
                    }
                    data-ocid="leads.add_address_input"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Notes</Label>
                  <Textarea
                    rows={2}
                    placeholder="Additional notes..."
                    value={newLead.notes ?? ""}
                    onChange={(e) =>
                      setNewLead({ ...newLead, notes: e.target.value })
                    }
                    data-ocid="leads.add_notes_textarea"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  data-ocid="leads.add_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddLead}
                  disabled={!newLead.name || !newLead.phone}
                  data-ocid="leads.add_submit_button"
                >
                  Add Lead
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Convert Confirm Modal */}
          <Dialog
            open={!!convertingId}
            onOpenChange={() => setConvertingId(null)}
          >
            <DialogContent data-ocid="leads.convert_dialog">
              <DialogHeader>
                <DialogTitle>Convert Lead to Customer</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground py-2">
                Are you sure you want to convert this lead to an active
                customer? This action will mark the lead as converted.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConvertingId(null)}
                  data-ocid="leads.convert_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => convertingId && handleConvert(convertingId)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  data-ocid="leads.convert_confirm_button"
                >
                  Yes, Convert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
