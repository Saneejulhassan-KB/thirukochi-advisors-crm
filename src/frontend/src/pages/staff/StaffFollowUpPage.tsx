import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  List,
  Phone,
  Plus,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type FollowUpStatus = "pending" | "called" | "visited" | "resolved";
type Urgency = "urgent" | "normal" | "low";
type CallOutcome = "call_answered" | "no_answer" | "visited" | "rescheduled";

interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  lastContactDate: string;
  nextAction: string;
  dueDate: string;
  remarks: string;
  status: FollowUpStatus;
  urgency: Urgency;
  loanType: string;
}

const DUMMY_FOLLOWUPS: FollowUp[] = [
  {
    id: "F001",
    customerId: "C001",
    customerName: "Ramachandran Nair",
    phone: "+91 9447201345",
    lastContactDate: "2026-05-19",
    nextAction: "Remind about EMI due on May 25",
    dueDate: "2026-05-22",
    remarks: "Spoke on phone, will pay by 25th",
    status: "pending",
    urgency: "urgent",
    loanType: "Gold Loan",
  },
  {
    id: "F002",
    customerId: "C003",
    customerName: "Biju Mathew",
    phone: "+91 9895001234",
    lastContactDate: "2026-05-10",
    nextAction: "Visit home for payment collection",
    dueDate: "2026-05-22",
    remarks: "Missed 2 EMIs, needs home visit",
    status: "pending",
    urgency: "urgent",
    loanType: "Vehicle Loan",
  },
  {
    id: "F003",
    customerId: "C005",
    customerName: "Pradeep Kumar",
    phone: "+91 9745678901",
    lastContactDate: "2026-05-15",
    nextAction: "Meeting with business partner for loan restructure",
    dueDate: "2026-05-22",
    remarks: "Business slowdown, awaiting bank decision",
    status: "pending",
    urgency: "urgent",
    loanType: "Business Loan",
  },
  {
    id: "F004",
    customerId: "C002",
    customerName: "Sunitha Thomas",
    phone: "+91 9846523112",
    lastContactDate: "2026-05-18",
    nextAction: "Confirm May EMI receipt",
    dueDate: "2026-05-22",
    remarks: "Regular payer, just confirming",
    status: "called",
    urgency: "normal",
    loanType: "Personal Loan",
  },
  {
    id: "F005",
    customerId: "C009",
    customerName: "Anilkumar P",
    phone: "+91 9447890123",
    lastContactDate: "2026-05-08",
    nextAction: "Field visit to assess business status",
    dueDate: "2026-05-23",
    remarks: "Shop income fell after floods",
    status: "pending",
    urgency: "urgent",
    loanType: "Personal Loan",
  },
  {
    id: "F006",
    customerId: "C004",
    customerName: "Sheeba Antony",
    phone: "+91 9562341090",
    lastContactDate: "2026-05-17",
    nextAction: "Send payment confirmation SMS",
    dueDate: "2026-05-24",
    remarks: "Paid on time this month",
    status: "resolved",
    urgency: "low",
    loanType: "Personal Loan",
  },
  {
    id: "F007",
    customerId: "C008",
    customerName: "Saji Varghese",
    phone: "+91 9895234089",
    lastContactDate: "2026-05-14",
    nextAction: "Discuss seasonal payment plan",
    dueDate: "2026-05-23",
    remarks: "Construction project delayed, may need grace period",
    status: "pending",
    urgency: "normal",
    loanType: "Business Loan",
  },
  {
    id: "F008",
    customerId: "C011",
    customerName: "Jose Kurian",
    phone: "+91 9895678012",
    lastContactDate: "2026-05-16",
    nextAction: "Remind for May EMI",
    dueDate: "2026-05-22",
    remarks: "Fishing season started, income expected",
    status: "pending",
    urgency: "normal",
    loanType: "Kisan Loan",
  },
  {
    id: "F009",
    customerId: "C006",
    customerName: "Meenakshi Iyer",
    phone: "+91 9847230567",
    lastContactDate: "2026-05-05",
    nextAction: "Update loan details after renewal",
    dueDate: "2026-05-25",
    remarks: "Loan renewed last month",
    status: "visited",
    urgency: "low",
    loanType: "Gold Loan",
  },
  {
    id: "F010",
    customerId: "C014",
    customerName: "Manju Krishnakumar",
    phone: "+91 9745012678",
    lastContactDate: "2026-05-12",
    nextAction: "Call about June EMI date change",
    dueDate: "2026-05-24",
    remarks: "Requested date change to 5th",
    status: "pending",
    urgency: "normal",
    loanType: "Personal Loan",
  },
  {
    id: "F011",
    customerId: "C007",
    customerName: "Vineeth Gopalan",
    phone: "+91 9946781234",
    lastContactDate: "2026-05-20",
    nextAction: "No action needed, check-in next month",
    dueDate: "2026-06-01",
    remarks: "Excellent payment history",
    status: "resolved",
    urgency: "low",
    loanType: "Home Loan",
  },
  {
    id: "F012",
    customerId: "C013",
    customerName: "Sudheer Namboodiri",
    phone: "+91 9447123890",
    lastContactDate: "2026-05-15",
    nextAction: "Collect May EMI",
    dueDate: "2026-05-25",
    remarks: "Prefer cash collection",
    status: "pending",
    urgency: "normal",
    loanType: "Gold Loan",
  },
  {
    id: "F013",
    customerId: "C010",
    customerName: "Resmi Rajesh",
    phone: "+91 9946012345",
    lastContactDate: "2026-05-10",
    nextAction: "Discuss loan enhancement",
    dueDate: "2026-05-27",
    remarks: "Interested in increasing loan limit",
    status: "called",
    urgency: "low",
    loanType: "Personal Loan",
  },
  {
    id: "F014",
    customerId: "C012",
    customerName: "Aswathy Menon",
    phone: "+91 9562098765",
    lastContactDate: "2026-05-18",
    nextAction: "Confirm salary deduction processed",
    dueDate: "2026-05-28",
    remarks: "Salary deduction mandate submitted",
    status: "pending",
    urgency: "low",
    loanType: "Personal Loan",
  },
  {
    id: "F015",
    customerId: "C015",
    customerName: "Chandran Velliyambalam",
    phone: "+91 9895567234",
    lastContactDate: "2026-05-19",
    nextAction: "Confirm EMI before month end",
    dueDate: "2026-05-31",
    remarks: "Pension credit date is 30th",
    status: "pending",
    urgency: "normal",
    loanType: "Gold Loan",
  },
  {
    id: "F016",
    customerId: "C003",
    customerName: "Biju Mathew",
    phone: "+91 9895001234",
    lastContactDate: "2026-05-05",
    nextAction: "Legal notice preparation if no payment",
    dueDate: "2026-05-23",
    remarks: "3rd attempt at collection",
    status: "pending",
    urgency: "urgent",
    loanType: "Vehicle Loan",
  },
  {
    id: "F017",
    customerId: "C008",
    customerName: "Saji Varghese",
    phone: "+91 9895234089",
    lastContactDate: "2026-05-20",
    nextAction: "Review project payment timeline",
    dueDate: "2026-05-26",
    remarks: "Client payment delayed, cascading effect",
    status: "pending",
    urgency: "normal",
    loanType: "Business Loan",
  },
  {
    id: "F018",
    customerId: "C002",
    customerName: "Sunitha Thomas",
    phone: "+91 9846523112",
    lastContactDate: "2026-05-21",
    nextAction: "Process May receipt and close",
    dueDate: "2026-05-22",
    remarks: "Payment done, update record",
    status: "resolved",
    urgency: "low",
    loanType: "Personal Loan",
  },
];

const STATUS_CFG: Record<
  FollowUpStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: <Clock className="w-3 h-3" />,
  },
  called: {
    label: "Called",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: <Phone className="w-3 h-3" />,
  },
  visited: {
    label: "Visited",
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

const URGENCY_CFG: Record<Urgency, { label: string; className: string }> = {
  urgent: {
    label: "Urgent",
    className: "bg-red-500/15 text-red-600 border-red-500/30",
  },
  normal: {
    label: "Normal",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const TODAY = new Date().toISOString().split("T")[0];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeeklyCalendar({ followups }: { followups: FollowUp[] }) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const dateStr = day.toISOString().split("T")[0];
        const dayFollowups = followups.filter((f) => f.dueDate === dateStr);
        const isToday = dateStr === TODAY;
        return (
          <div
            key={dateStr}
            className={cn(
              "rounded-lg p-2 border text-center min-h-[72px]",
              isToday ? "border-primary bg-primary/5" : "border-border bg-card",
            )}
          >
            <p className="text-xs font-semibold text-muted-foreground">
              {WEEK_DAYS[day.getDay()]}
            </p>
            <p
              className={cn(
                "text-sm font-bold mb-1",
                isToday ? "text-primary" : "text-foreground",
              )}
            >
              {day.getDate()}
            </p>
            <div className="space-y-0.5">
              {dayFollowups.slice(0, 2).map((f) => (
                <div
                  key={f.id}
                  className={cn(
                    "text-xs rounded px-1 py-0.5 truncate",
                    URGENCY_CFG[f.urgency].className,
                  )}
                >
                  {f.customerName.split(" ")[0]}
                </div>
              ))}
              {dayFollowups.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayFollowups.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StaffFollowUpPage() {
  const [followups, setFollowups] = useState<FollowUp[]>(DUMMY_FOLLOWUPS);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(
    null,
  );
  const [outcomeModal, setOutcomeModal] = useState(false);
  const [outcomeForm, setOutcomeForm] = useState<{
    outcome: CallOutcome;
    notes: string;
    nextDate: string;
  }>({ outcome: "call_answered", notes: "", nextDate: "" });

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const filtered = followups.filter((f) => {
    const q = search.toLowerCase();
    const ms =
      !search ||
      f.customerName.toLowerCase().includes(q) ||
      f.phone.includes(q);
    const mst = !filters.status || f.status === filters.status;
    const mu = !filters.urgency || f.urgency === filters.urgency;
    return ms && mst && mu;
  });

  const todayFollowups = followups.filter(
    (f) => f.dueDate === today && f.status !== "resolved",
  );
  const tomorrowFollowups = followups.filter(
    (f) => f.dueDate === tomorrow && f.status !== "resolved",
  );

  const stats = {
    pending: followups.filter((f) => f.status === "pending").length,
    overdue: followups.filter(
      (f) => f.dueDate < today && f.status !== "resolved",
    ).length,
    completedToday: followups.filter(
      (f) => f.dueDate === today && f.status === "resolved",
    ).length,
    scheduledTomorrow: tomorrowFollowups.length,
  };

  const handleOutcomeSave = () => {
    if (!selectedFollowUp) return;
    const newStatus: FollowUpStatus =
      outcomeForm.outcome === "rescheduled"
        ? "pending"
        : outcomeForm.outcome === "visited"
          ? "visited"
          : "called";
    setFollowups((prev) =>
      prev.map((f) =>
        f.id === selectedFollowUp.id
          ? {
              ...f,
              status: newStatus,
              lastContactDate: today,
              remarks: outcomeForm.notes || f.remarks,
            }
          : f,
      ),
    );
    setOutcomeModal(false);
    setSelectedFollowUp(null);
    setOutcomeForm({ outcome: "call_answered", notes: "", nextDate: "" });
  };

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <AppLayout>
        <div className="p-6 space-y-6">
          <PageHeader
            title="Follow-up Management"
            subtitle="Track and manage all customer follow-ups"
            badge={`${stats.pending} Pending`}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Pending"
              value={stats.pending}
              icon={<Clock className="w-5 h-5" />}
              iconColor="text-yellow-500"
            />
            <KPICard
              title="Overdue"
              value={stats.overdue}
              icon={<AlertCircle className="w-5 h-5" />}
              iconColor="text-red-500"
              trend="down"
            />
            <KPICard
              title="Completed Today"
              value={stats.completedToday}
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconColor="text-emerald-500"
              trend="up"
            />
            <KPICard
              title="Due Tomorrow"
              value={stats.scheduledTomorrow}
              icon={<CalendarDays className="w-5 h-5" />}
              iconColor="text-primary"
            />
          </div>

          {/* Today's Urgent Follow-Ups */}
          {todayFollowups.length > 0 && (
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardContent className="pt-4">
                <p className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Today's Follow-Ups ({todayFollowups.length})
                </p>
                <div className="space-y-2">
                  {todayFollowups.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className="flex items-center justify-between bg-card rounded-lg border border-border px-4 py-2.5 cursor-pointer hover:border-primary/30 transition-smooth w-full text-left"
                      onClick={() => setSelectedFollowUp(f)}
                      data-ocid={`followup.today_card.${f.id}`}
                    >
                      <div>
                        <p className="font-medium text-sm">{f.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.nextAction}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            URGENCY_CFG[f.urgency].className,
                          )}
                        >
                          {f.urgency}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFollowUp(f);
                            setOutcomeModal(true);
                          }}
                          data-ocid={`followup.log_outcome_button.${f.id}`}
                        >
                          <RefreshCw className="w-3 h-3" /> Log
                        </Button>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="list" data-ocid="followup.view_tabs">
            <TabsList>
              <TabsTrigger value="list" data-ocid="followup.list_tab">
                <List className="w-4 h-4 mr-1.5" />
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" data-ocid="followup.calendar_tab">
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Weekly Calendar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-4 space-y-4">
                  <SearchFilter
                    searchValue={search}
                    onSearch={setSearch}
                    filters={[
                      {
                        key: "status",
                        label: "Status",
                        options: [
                          { label: "Pending", value: "pending" },
                          { label: "Called", value: "called" },
                          { label: "Visited", value: "visited" },
                          { label: "Resolved", value: "resolved" },
                        ],
                      },
                      {
                        key: "urgency",
                        label: "Urgency",
                        options: [
                          { label: "Urgent", value: "urgent" },
                          { label: "Normal", value: "normal" },
                          { label: "Low", value: "low" },
                        ],
                      },
                    ]}
                    filterValues={filters}
                    onFilter={(k, v) =>
                      setFilters((prev) => ({ ...prev, [k]: v }))
                    }
                    onClear={() => {
                      setSearch("");
                      setFilters({});
                    }}
                  />
                  <div className="space-y-2">
                    {filtered.map((f, i) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 transition-smooth"
                        onClick={() => setSelectedFollowUp(f)}
                        data-ocid={`followup.list_item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-medium text-sm text-foreground">
                                {f.customerName}
                              </p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  URGENCY_CFG[f.urgency].className,
                                )}
                              >
                                {URGENCY_CFG[f.urgency].label}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  STATUS_CFG[f.status].className,
                                )}
                              >
                                {STATUS_CFG[f.status].label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {f.phone} &bull; {f.loanType}
                            </p>
                            <p className="text-xs text-foreground/80 mt-1">
                              {f.nextAction}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Last: {f.lastContactDate} &bull; Due: {f.dueDate}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFollowUp(f);
                              setOutcomeModal(true);
                            }}
                            data-ocid={`followup.log_button.${i + 1}`}
                          >
                            <RefreshCw className="w-3 h-3" /> Log Outcome
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="mt-4">
              <Card className="border-border bg-card">
                <CardContent className="pt-4">
                  <WeeklyCalendar followups={followups} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Log Outcome Modal */}
          <Dialog
            open={outcomeModal}
            onOpenChange={() => setOutcomeModal(false)}
          >
            <DialogContent
              className="max-w-md"
              data-ocid="followup.log_outcome_dialog"
            >
              <DialogHeader>
                <DialogTitle>Log Follow-up Outcome</DialogTitle>
              </DialogHeader>
              {selectedFollowUp && (
                <div className="space-y-4 py-2">
                  <div className="rounded-lg bg-muted/60 p-3 text-sm">
                    <p className="font-medium">
                      {selectedFollowUp.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedFollowUp.nextAction}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Outcome</Label>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      value={outcomeForm.outcome}
                      onChange={(e) =>
                        setOutcomeForm({
                          ...outcomeForm,
                          outcome: e.target.value as CallOutcome,
                        })
                      }
                      data-ocid="followup.outcome_select"
                    >
                      <option value="call_answered">Call Answered</option>
                      <option value="no_answer">No Answer</option>
                      <option value="visited">Visited</option>
                      <option value="rescheduled">Rescheduled</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Textarea
                      rows={3}
                      placeholder="What happened during this follow-up?"
                      value={outcomeForm.notes}
                      onChange={(e) =>
                        setOutcomeForm({
                          ...outcomeForm,
                          notes: e.target.value,
                        })
                      }
                      data-ocid="followup.outcome_notes_textarea"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Next Follow-up Date</Label>
                    <Input
                      type="date"
                      value={outcomeForm.nextDate}
                      onChange={(e) =>
                        setOutcomeForm({
                          ...outcomeForm,
                          nextDate: e.target.value,
                        })
                      }
                      data-ocid="followup.next_date_input"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOutcomeModal(false)}
                  data-ocid="followup.outcome_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOutcomeSave}
                  data-ocid="followup.outcome_save_button"
                >
                  Save Outcome
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Detail Modal */}
          {selectedFollowUp && !outcomeModal && (
            <Dialog
              open={!!selectedFollowUp && !outcomeModal}
              onOpenChange={() => setSelectedFollowUp(null)}
            >
              <DialogContent data-ocid="followup.detail_dialog">
                <DialogHeader>
                  <DialogTitle>
                    {selectedFollowUp.customerName} — Follow-up Detail
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedFollowUp.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Loan Type</p>
                      <p className="font-medium">{selectedFollowUp.loanType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-medium">{selectedFollowUp.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Contact
                      </p>
                      <p className="font-medium">
                        {selectedFollowUp.lastContactDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        STATUS_CFG[selectedFollowUp.status].className,
                      )}
                    >
                      {selectedFollowUp.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        URGENCY_CFG[selectedFollowUp.urgency].className,
                      )}
                    >
                      {selectedFollowUp.urgency}
                    </Badge>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Next Action
                    </p>
                    <p>{selectedFollowUp.nextAction}</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Remarks
                    </p>
                    <p>{selectedFollowUp.remarks}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFollowUp(null)}
                    data-ocid="followup.detail_close_button"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => setOutcomeModal(true)}
                    data-ocid="followup.detail_log_button"
                  >
                    Log Outcome
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
