import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ChartWrapper, chartColors } from "@/components/shared/ChartWrapper";
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
import { Textarea } from "@/components/ui/textarea";
import {
  mockBranches,
  mockEmployees,
  mockZoneRevenue,
  mockZones,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { Zone } from "@/types";
import {
  Award,
  BarChart2,
  Building2,
  ChevronUp,
  MapPin,
  Plus,
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
  Cell,
  Line,
  LineChart,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
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

const ZONE_COLORS: Record<string, string> = {
  z1: chartColors.primary,
  z2: chartColors.secondary,
  z3: chartColors.success,
  z4: chartColors.warning,
};

const ZONE_KEYS: Record<string, keyof (typeof mockZoneRevenue)[0]> = {
  z1: "kochi",
  z2: "thrissur",
  z3: "calicut",
  z4: "trivandrum",
};

function getRank(zoneId: string): number {
  const sorted = [...mockZones].sort((a, b) => b.totalRevenue - a.totalRevenue);
  return sorted.findIndex((z) => z.id === zoneId) + 1;
}

function getZoneSparkline(zoneId: string) {
  const key = ZONE_KEYS[zoneId];
  if (!key) return [];
  return mockZoneRevenue.slice(-7).map((row) => ({
    month: row.month.slice(0, 3),
    value: row[key] as number,
  }));
}

function ZoneCard({
  zone,
  onViewDetails,
  isExpanded,
}: {
  zone: Zone;
  onViewDetails: () => void;
  isExpanded: boolean;
}) {
  const manager = mockEmployees.find((e) => e.id === zone.managerId);
  const zoneBranches = mockBranches.filter((b) => b.zoneId === zone.id);
  const rank = getRank(zone.id);
  const sparkData = getZoneSparkline(zone.id);
  const color = ZONE_COLORS[zone.id] ?? chartColors.primary;
  const staffCount = mockEmployees.filter((e) => e.zoneId === zone.id).length;
  const avgCollection = Math.round(
    (zoneBranches.reduce((a, b) => a + b.monthlyCollection, 0) /
      zoneBranches.reduce((a, b) => a + b.monthlyCollection * 1.12, 0)) *
      100,
  );

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-glow relative overflow-hidden",
        "dark:before:absolute dark:before:inset-0 dark:before:rounded-2xl",
        "dark:before:bg-gradient-to-br dark:before:from-primary/5 dark:before:to-transparent",
        "dark:before:pointer-events-none",
        isExpanded && "ring-2 ring-primary/40",
      )}
      data-ocid={`zone.card.${zone.id}`}
    >
      {/* Rank badge */}
      <div
        className={cn(
          "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
          rank === 1
            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            : rank === 2
              ? "bg-slate-400/20 text-slate-400 border border-slate-400/30"
              : rank === 3
                ? "bg-orange-600/20 text-orange-500 border border-orange-600/30"
                : "bg-muted text-muted-foreground border border-border",
        )}
        title={`Rank #${rank}`}
      >
        #{rank}
      </div>

      {/* Zone name + manager */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <MapPin className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            {zone.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-[9px] font-bold text-secondary">
                {manager?.name.charAt(0) ?? "?"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {manager?.name ?? "Unassigned"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Branches", value: zone.branchCount, icon: Building2 },
          { label: "Staff", value: staffCount, icon: Users },
          {
            label: "Monthly Revenue",
            value: fmt(zone.totalRevenue),
            icon: Wallet,
          },
          {
            label: "Collection Rate",
            value: `${avgCollection}%`,
            icon: TrendingUp,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl bg-muted/40 border border-border/50 p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="font-semibold text-sm text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Branch badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {zoneBranches.map((b) => (
          <Badge
            key={b.id}
            variant="outline"
            className="text-[10px] px-1.5 py-0"
          >
            {b.name}
          </Badge>
        ))}
      </div>

      {/* Sparkline */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">
          7-day Revenue Trend
        </p>
        <ResponsiveContainer width="100%" height={50}>
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Button
        variant={isExpanded ? "default" : "outline"}
        size="sm"
        className="w-full gap-1.5"
        onClick={onViewDetails}
        data-ocid={`zone.view_details_button.${zone.id}`}
      >
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <BarChart2 className="w-3 h-3" />
        )}
        {isExpanded ? "Collapse" : "View Details"}
      </Button>
    </motion.div>
  );
}

function ZoneDetailPanel({
  zone,
  onClose,
}: { zone: Zone; onClose: () => void }) {
  const zoneBranches = mockBranches.filter((b) => b.zoneId === zone.id);
  const topStaff = mockEmployees
    .filter((e) => e.zoneId === zone.id)
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 6);

  const zoneKey = ZONE_KEYS[zone.id];
  const revenueData = mockZoneRevenue.slice(-6).map((row) => ({
    month: row.month.slice(0, 3),
    revenue: zoneKey ? (row[zoneKey] as number) : 0,
    target: (zoneKey ? (row[zoneKey] as number) : 0) * 1.1,
  }));

  // All zones bar chart data (latest month)
  const latestRow = mockZoneRevenue[mockZoneRevenue.length - 1];
  const zoneCompareData = mockZones.map((z) => ({
    name: z.name,
    revenue: ZONE_KEYS[z.id] ? (latestRow[ZONE_KEYS[z.id]] as number) : 0,
    color: ZONE_COLORS[z.id] ?? chartColors.primary,
  }));

  const totalTarget = zoneBranches.reduce(
    (a, b) => a + b.monthlyCollection * 1.1,
    0,
  );
  const totalActual = zoneBranches.reduce((a, b) => a + b.monthlyCollection, 0);
  const progressPct = Math.round((totalActual / totalTarget) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow space-y-6"
      data-ocid="zone.detail_panel"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${ZONE_COLORS[zone.id]}20`,
              border: `1px solid ${ZONE_COLORS[zone.id]}40`,
            }}
          >
            <MapPin
              className="w-5 h-5"
              style={{ color: ZONE_COLORS[zone.id] }}
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">
              {zone.name} Zone — Detailed View
            </h2>
            <p className="text-sm text-muted-foreground">
              Rank #{getRank(zone.id)} · {zone.branchCount} Branches
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          data-ocid="zone.detail_close_button"
        >
          <ChevronUp className="w-4 h-4" />
          Collapse
        </Button>
      </div>

      {/* Revenue vs Target progress */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">
            Monthly Revenue vs Target
          </p>
          <span
            className={cn(
              "text-sm font-bold",
              progressPct >= 100
                ? "text-emerald-500"
                : progressPct >= 80
                  ? "text-amber-500"
                  : "text-red-500",
            )}
          >
            {progressPct}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPct, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              progressPct >= 100
                ? "bg-emerald-500"
                : progressPct >= 80
                  ? "bg-amber-500"
                  : "bg-red-500",
            )}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>Actual: {fmt(totalActual)}</span>
          <span>Target: {fmt(Math.round(totalTarget))}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend chart */}
        <ChartWrapper
          title="6-Month Revenue Trend"
          subtitle={`${zone.name} Zone`}
          height={200}
        >
          <LineChart data={revenueData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.3 0.01 255 / 0.3)"
            />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
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
              stroke={ZONE_COLORS[zone.id] ?? chartColors.primary}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke={chartColors.muted}
              strokeWidth={1}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ChartWrapper>

        {/* Zone comparison bar chart */}
        <ChartWrapper
          title="Zone Comparison"
          subtitle="Monthly revenue (Apr 2026)"
          height={200}
        >
          <BarChart data={zoneCompareData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.3 0.01 255 / 0.3)"
            />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
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
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {zoneCompareData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartWrapper>
      </div>

      {/* Branches table */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">
          Branches in {zone.name} Zone
        </h3>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[
                  "Branch",
                  "Manager",
                  "Staff",
                  "Customers",
                  "Revenue",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zoneBranches.map((branch, idx) => {
                const mgr = mockEmployees.find(
                  (e) => e.id === branch.managerId,
                );
                return (
                  <tr
                    key={branch.id}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                    data-ocid={`zone.branch_row.${idx + 1}`}
                  >
                    <td className="px-4 py-2.5 font-semibold text-foreground">
                      {branch.name}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {mgr?.name ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-sm">
                      {branch.employeeCount}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-sm">
                      {branch.customerCount}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-sm">
                      {fmt(branch.monthlyCollection)}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={branch.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top staff */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">
          Top Performers — {zone.name}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topStaff.map((emp, i) => (
            <div
              key={emp.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3"
              data-ocid={`zone.staff_row.${i + 1}`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {emp.name.charAt(0)}
                  </span>
                </div>
                {i < 3 && (
                  <Award
                    className={cn(
                      "w-3 h-3 absolute -top-1 -right-1",
                      i === 0
                        ? "text-amber-400"
                        : i === 1
                          ? "text-slate-400"
                          : "text-orange-500",
                    )}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {emp.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {emp.designation}
                </p>
              </div>
              <span
                className={cn(
                  "text-xs font-bold shrink-0",
                  emp.performanceScore >= 85
                    ? "text-emerald-500"
                    : emp.performanceScore >= 70
                      ? "text-amber-500"
                      : "text-red-500",
                )}
              >
                {emp.performanceScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface AddZoneForm {
  name: string;
  managerId: string;
  description: string;
}

function AddZoneModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<AddZoneForm>({
    name: "",
    managerId: "",
    description: "",
  });

  const zonalManagers = mockEmployees.filter(
    (e) => e.role === "zonal_manager" || e.role === "super_admin",
  );

  const set = (k: keyof AddZoneForm) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name) {
      toast.error("Zone name is required");
      return;
    }
    toast.success(`Zone "${form.name}" created successfully!`);
    setForm({ name: "", managerId: "", description: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" data-ocid="add_zone.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Zone</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="z-name">Zone Name *</Label>
            <Input
              id="z-name"
              placeholder="e.g. Kannur"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              data-ocid="add_zone.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="z-manager">Zonal Manager</Label>
            <Select value={form.managerId} onValueChange={set("managerId")}>
              <SelectTrigger id="z-manager" data-ocid="add_zone.manager_select">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {zonalManagers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} — {m.designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="z-desc">Description</Label>
            <Textarea
              id="z-desc"
              placeholder="Describe the zone coverage area"
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              rows={3}
              data-ocid="add_zone.description_textarea"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="add_zone.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            data-ocid="add_zone.submit_button"
          >
            Create Zone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ZonesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // Summary KPIs
  const totalBranches = mockZones.reduce((a, z) => a + z.branchCount, 0);
  const totalStaff = mockEmployees.length;
  const totalRevenue = mockZones.reduce((a, z) => a + z.totalRevenue, 0);
  const totalCustomers = mockZones.reduce((a, z) => a + z.totalCustomers, 0);

  return (
    <ProtectedRoute allowedRoles={["super_admin", "zonal_manager"]}>
      <AppLayout>
        <div className="p-6 space-y-6" data-ocid="zones.page">
          <PageHeader
            title="Zone Management"
            subtitle="Manage zones and zonal performance across Kerala"
            badge={`${mockZones.length} Zones`}
            actions={[
              {
                label: "Add Zone",
                onClick: () => setAddOpen(true),
                icon: <Plus className="w-4 h-4" />,
              },
            ]}
          />

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPICard
              title="Total Zones"
              value={mockZones.length}
              trend="neutral"
              icon={<MapPin className="w-5 h-5" />}
              iconColor="text-primary"
            />
            <KPICard
              title="Total Branches"
              value={totalBranches}
              trend="up"
              trendValue={4.2}
              icon={<Building2 className="w-5 h-5" />}
              iconColor="text-secondary"
            />
            <KPICard
              title="Total Staff"
              value={totalStaff}
              trend="up"
              trendValue={3.8}
              icon={<Users className="w-5 h-5" />}
              iconColor="text-emerald-500"
            />
            <KPICard
              title="Total Revenue"
              value={fmt(totalRevenue)}
              subtitle={`${totalCustomers} active customers`}
              trend="up"
              trendValue={7.3}
              icon={<TrendingUp className="w-5 h-5" />}
              iconColor="text-amber-500"
            />
          </div>

          {/* Zone cards 2x2 grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            data-ocid="zones.cards_grid"
          >
            {mockZones.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                isExpanded={expandedId === zone.id}
                onViewDetails={() => toggleExpand(zone.id)}
              />
            ))}
          </div>

          {/* Zone detail panel */}
          <AnimatePresence>
            {expandedId &&
              (() => {
                const zone = mockZones.find((z) => z.id === expandedId);
                if (!zone) return null;
                return (
                  <ZoneDetailPanel
                    key={expandedId}
                    zone={zone}
                    onClose={() => setExpandedId(null)}
                  />
                );
              })()}
          </AnimatePresence>
        </div>

        <AddZoneModal open={addOpen} onClose={() => setAddOpen(false)} />
      </AppLayout>
    </ProtectedRoute>
  );
}
