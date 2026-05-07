import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockActivityLogs,
  mockCustomers,
  mockEMISchedules,
  mockEmployees,
  mockPayments,
} from "@/data/mockData";
import type { Customer } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(v: number) {
  return `₹${v.toLocaleString("en-IN")}`;
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
  return !!date && new Date(date) < new Date();
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Mock timeline entries ─────────────────────────────────────────────────────
const activityIcons: Record<string, React.ReactNode> = {
  payment: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  call: <Phone className="w-4 h-4 text-primary" />,
  visit: <User className="w-4 h-4 text-secondary" />,
  message: <MessageCircle className="w-4 h-4 text-amber-500" />,
  document: <FileText className="w-4 h-4 text-muted-foreground" />,
};

const mockTimeline = [
  {
    id: "t1",
    type: "payment",
    date: "2026-04-01",
    desc: "EMI payment of ₹15,000 collected",
    staff: "Anjali Pillai",
    note: "Collected via bank transfer",
  },
  {
    id: "t2",
    type: "call",
    date: "2026-03-25",
    desc: "Phone call — payment reminder sent",
    staff: "Anjali Pillai",
    note: "Customer confirmed payment on 1st",
  },
  {
    id: "t3",
    type: "payment",
    date: "2026-03-01",
    desc: "EMI payment of ₹15,000 collected",
    staff: "Anjali Pillai",
    note: "Paid via UPI",
  },
  {
    id: "t4",
    type: "visit",
    date: "2026-02-15",
    desc: "Field visit to customer premises",
    staff: "Vivek Krishnan",
    note: "KYC documents reviewed",
  },
  {
    id: "t5",
    type: "payment",
    date: "2026-02-01",
    desc: "EMI payment of ₹15,000 collected",
    staff: "Anjali Pillai",
    note: "Cash payment",
  },
  {
    id: "t6",
    type: "message",
    date: "2026-01-28",
    desc: "WhatsApp reminder sent",
    staff: "Anjali Pillai",
    note: "Delivered and read",
  },
  {
    id: "t7",
    type: "payment",
    date: "2026-01-01",
    desc: "EMI payment of ₹15,000 collected",
    staff: "Anjali Pillai",
    note: "Bank transfer",
  },
  {
    id: "t8",
    type: "document",
    date: "2025-12-10",
    desc: "PAN card uploaded and verified",
    staff: "Rajan Pillai",
    note: "KYC 100% complete",
  },
  {
    id: "t9",
    type: "payment",
    date: "2025-12-01",
    desc: "EMI payment of ₹15,000 collected",
    staff: "Anjali Pillai",
    note: "UPI transfer",
  },
  {
    id: "t10",
    type: "call",
    date: "2025-11-20",
    desc: "Customer called regarding statement",
    staff: "Anjali Pillai",
    note: "Sent email statement",
  },
  {
    id: "t11",
    type: "payment",
    date: "2025-11-01",
    desc: "EMI payment of ₹15,000 collected",
    staff: "Anjali Pillai",
    note: "Cash",
  },
  {
    id: "t12",
    type: "visit",
    date: "2025-10-15",
    desc: "Annual review visit",
    staff: "Rajan Pillai",
    note: "Loan restructuring discussed",
  },
];

const kycDocuments = [
  { id: "aadhaar", name: "Aadhaar Card", status: "verified" as const },
  { id: "pan", name: "PAN Card", status: "verified" as const },
  { id: "address", name: "Address Proof", status: "pending" as const },
  { id: "income", name: "Income Proof", status: "missing" as const },
  { id: "photo", name: "Passport Photo", status: "verified" as const },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function DetailRow({
  label,
  value,
}: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground font-medium text-right break-words">
        {value}
      </span>
    </div>
  );
}

function KycDocRow({
  doc,
}: {
  doc: { id: string; name: string; status: "verified" | "pending" | "missing" };
}) {
  const icons = {
    verified: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
    pending: <Clock className="w-4 h-4 text-amber-500" />,
    missing: <XCircle className="w-4 h-4 text-red-500" />,
  };
  const badgeMap = {
    verified: "approved" as const,
    pending: "pending" as const,
    missing: "overdue" as const,
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{doc.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {icons[doc.status]}
          <StatusBadge status={badgeMap[doc.status]} className="text-xs" />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => toast.info(`Upload ${doc.name}`)}
        data-ocid={`kyc.upload_button.${doc.id}`}
      >
        <Upload className="w-3.5 h-3.5" />
        {doc.status === "verified" ? "Replace" : "Upload"}
      </Button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CustomerDetailPage() {
  const { id } = useParams({ from: "/customers/$id" });
  const customer: Customer =
    mockCustomers.find((c) => c.id === id) ?? mockCustomers[0];

  const assignedStaff = mockEmployees.find(
    (e) => e.id === customer.assignedStaffId,
  );
  const emis = mockEMISchedules.filter((e) => e.customerId === customer.id);
  const payments = mockPayments.filter((p) => p.customerId === customer.id);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([
    {
      id: "n1",
      text: "Customer prefers phone calls in the evening.",
      at: "2026-03-15 14:30",
    },
    {
      id: "n2",
      text: "Requested EMI restructuring — under review.",
      at: "2026-02-20 10:00",
    },
  ]);
  const [timelineVisible, setTimelineVisible] = useState(6);

  const overdueEmis = emis.filter((e) => e.status === "overdue");
  const upcomingEmis = emis.filter(
    (e) =>
      e.status === "pending" &&
      daysUntil(e.dueDate) <= 10 &&
      daysUntil(e.dueDate) >= 0,
  );

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + p.amount, 0);
  const totalDue = customer.outstandingAmount;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNotes((prev) => [
      {
        id: `n${Date.now()}`,
        text: noteText,
        at: new Date().toLocaleString("en-IN"),
      },
      ...prev,
    ]);
    setNoteText("");
    toast.success("Note added");
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="customer_detail.page">
          {/* Back */}
          <Link
            to="/customers"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="customer_detail.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Link>

          {/* Due Alerts */}
          {overdueEmis.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              data-ocid="customer_detail.overdue_alert"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-red-600 dark:text-red-400">
                    {overdueEmis.length} Overdue EMI
                    {overdueEmis.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total overdue:{" "}
                    {formatINR(overdueEmis.reduce((s, e) => s + e.amount, 0))}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() =>
                  toast.error(`Overdue reminder sent to ${customer.name}`)
                }
                data-ocid="customer_detail.send_reminder_button"
              >
                <Send className="w-3.5 h-3.5" /> Send Reminder
              </Button>
            </motion.div>
          )}

          {upcomingEmis.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              data-ocid="customer_detail.upcoming_alert"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-amber-600 dark:text-amber-400">
                    EMI Due in{" "}
                    {Math.min(...upcomingEmis.map((e) => daysUntil(e.dueDate)))}{" "}
                    days
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatINR(upcomingEmis[0].amount)} due on{" "}
                    {upcomingEmis[0].dueDate}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0 border-amber-500/40"
                onClick={() =>
                  toast.success(`WhatsApp reminder sent to ${customer.name}`)
                }
                data-ocid="customer_detail.whatsapp_reminder_button"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Send WhatsApp
              </Button>
            </motion.div>
          )}

          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="border-border bg-card shadow-glow"
              data-ocid="customer_detail.profile_card"
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary text-2xl font-bold font-display shrink-0">
                    {getInitials(customer.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="font-display font-bold text-xl text-foreground">
                        {customer.name}
                      </h1>
                      <StatusBadge status={customer.status} />
                      <StatusBadge status={customer.riskLevel} />
                    </div>
                    <p className="text-xs font-mono text-muted-foreground uppercase">
                      {customer.id}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {customer.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />{" "}
                        {assignedStaff?.name ?? "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => toast.info(`Calling ${customer.phone}`)}
                      data-ocid="customer_detail.call_button"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                      onClick={() =>
                        toast.success(`WhatsApp opened for ${customer.name}`)
                      }
                      data-ocid="customer_detail.whatsapp_button"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => toast.info("Edit customer")}
                      data-ocid="customer_detail.edit_button"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => toast.info("Transfer lead initiated")}
                      data-ocid="customer_detail.transfer_button"
                    >
                      Transfer Lead
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" data-ocid="customer_detail.tabs">
            <TabsList
              className="w-full sm:w-auto"
              data-ocid="customer_detail.tabs_list"
            >
              <TabsTrigger
                value="overview"
                data-ocid="customer_detail.tab.overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger value="kyc" data-ocid="customer_detail.tab.kyc">
                KYC Documents
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                data-ocid="customer_detail.tab.payments"
              >
                Payments & EMI
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                data-ocid="customer_detail.tab.timeline"
              >
                Activity Timeline
              </TabsTrigger>
            </TabsList>

            {/* ─── Tab: Overview ─────────────────────────────────────────────── */}
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Personal Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailRow label="Full Name" value={customer.name} />
                    <DetailRow label="Phone" value={customer.phone} />
                    <DetailRow
                      label="Alt. Phone"
                      value={customer.alternatePhone || "—"}
                    />
                    <DetailRow label="Email" value={customer.email || "—"} />
                    <DetailRow label="Occupation" value={customer.occupation} />
                    <DetailRow
                      label="KYC Status"
                      value={
                        <StatusBadge
                          status={customer.kycVerified ? "approved" : "pending"}
                        />
                      }
                    />
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground leading-relaxed">
                      {customer.address}
                    </p>
                    <Separator className="my-3" />
                    <DetailRow
                      label="Aadhaar"
                      value={customer.aadhaarNumber || "—"}
                    />
                    <DetailRow label="PAN" value={customer.panNumber || "—"} />
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Loan Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailRow
                      label="Loan Amount"
                      value={
                        <span className="font-semibold">
                          {formatINR(customer.loanAmount)}
                        </span>
                      }
                    />
                    <DetailRow
                      label="Outstanding"
                      value={
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {formatINR(customer.outstandingAmount)}
                        </span>
                      }
                    />
                    <DetailRow
                      label="EMI Amount"
                      value={formatINR(customer.emiAmount)}
                    />
                    <DetailRow
                      label="Next Due Date"
                      value={
                        <span
                          className={
                            isOverdue(customer.nextDueDate)
                              ? "text-red-500 font-semibold"
                              : "font-medium"
                          }
                        >
                          {customer.nextDueDate || "—"}
                        </span>
                      }
                    />
                    <DetailRow
                      label="Last Payment"
                      value={customer.lastPaymentDate || "—"}
                    />
                    <DetailRow
                      label="Member Since"
                      value={customer.createdAt}
                    />
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="space-y-2 mb-4 max-h-40 overflow-y-auto"
                      data-ocid="customer_detail.notes_list"
                    >
                      {notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 rounded-lg bg-muted/40 border border-border/40"
                        >
                          <p className="text-sm text-foreground">{n.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {n.at}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={2}
                        placeholder="Add a note..."
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        data-ocid="customer_detail.note_textarea"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddNote}
                        data-ocid="customer_detail.add_note_button"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ─── Tab: KYC Documents ─────────────────────────────────────── */}
            <TabsContent value="kyc" className="mt-4">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" /> KYC
                      Documents
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("All documents verified!")}
                      data-ocid="kyc.verify_all_button"
                    >
                      Verify All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {kycDocuments.map((doc) => (
                    <KycDocRow key={doc.id} doc={doc} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ─── Tab: Payments & EMI ─────────────────────────────────────── */}
            <TabsContent value="payments" className="mt-4 space-y-4">
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Total Paid
                    </p>
                    <p className="font-display font-bold text-xl text-emerald-500">
                      {formatINR(totalPaid)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Outstanding Due
                    </p>
                    <p className="font-display font-bold text-xl text-amber-500">
                      {formatINR(totalDue)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* EMI Schedule */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">EMI Schedule</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            EMI #
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            Due Date
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            Paid Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {emis.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-6 text-center text-muted-foreground text-sm"
                            >
                              No EMI schedule found for this customer.
                            </td>
                          </tr>
                        ) : (
                          emis.map((emi, idx) => (
                            <tr
                              key={emi.id}
                              className={`border-b border-border/50 last:border-0 ${
                                emi.status === "paid"
                                  ? "bg-emerald-500/5"
                                  : emi.status === "overdue"
                                    ? "bg-red-500/5"
                                    : ""
                              }`}
                              data-ocid={`emi.row.${idx + 1}`}
                            >
                              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                {emi.installmentNo}
                              </td>
                              <td className="px-4 py-3">{emi.dueDate}</td>
                              <td className="px-4 py-3 text-right font-semibold">
                                {formatINR(emi.amount)}
                              </td>
                              <td className="px-4 py-3">
                                <StatusBadge
                                  status={
                                    emi.status === "paid"
                                      ? "completed"
                                      : emi.status
                                  }
                                />
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {emi.paidDate ?? "—"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Payment History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            Date
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            Method
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            Ref #
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-6 text-center text-muted-foreground text-sm"
                            >
                              No payment records found.
                            </td>
                          </tr>
                        ) : (
                          payments.map((p, idx) => (
                            <tr
                              key={p.id}
                              className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                              data-ocid={`payment.row.${idx + 1}`}
                            >
                              <td className="px-4 py-3">{p.date}</td>
                              <td className="px-4 py-3 text-right font-semibold">
                                {formatINR(p.amount)}
                              </td>
                              <td className="px-4 py-3 capitalize">
                                <Badge variant="secondary" className="text-xs">
                                  {p.method.replace("_", " ")}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                {p.transactionId}
                              </td>
                              <td className="px-4 py-3">
                                <StatusBadge status={p.status} />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ─── Tab: Activity Timeline ──────────────────────────────────── */}
            <TabsContent value="timeline" className="mt-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol
                    className="relative border-l border-border/60 pl-6 space-y-6"
                    data-ocid="timeline.list"
                  >
                    {mockTimeline.slice(0, timelineVisible).map((item, idx) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="relative"
                        data-ocid={`timeline.item.${idx + 1}`}
                      >
                        <div className="absolute -left-9 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border ring-2 ring-background">
                          {activityIcons[item.type] ?? (
                            <Clock className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                          <p className="font-medium text-sm text-foreground">
                            {item.desc}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.note}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {item.date}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="w-3 h-3" /> {item.staff}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                  {timelineVisible < mockTimeline.length && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-6 w-full"
                      onClick={() => setTimelineVisible((v) => v + 6)}
                      data-ocid="timeline.load_more_button"
                    >
                      Load More
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
