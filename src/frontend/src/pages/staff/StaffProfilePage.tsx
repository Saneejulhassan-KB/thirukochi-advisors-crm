import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  Building2,
  Calendar,
  Edit3,
  IdCard,
  Lock,
  Mail,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  staff: "Staff",
  branch_manager: "Branch Manager",
  zonal_manager: "Zonal Manager",
  super_admin: "Super Admin",
};

export default function StaffProfilePage() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "Arjun Nair",
    phone: "+91 9876543210",
    email: user?.email ?? "arjun.nair@thirukochi.com",
    address: "Flat 3B, Panampilly Nagar, Kochi – 682036",
    bio: "Finance advisory specialist with 3 years of experience in personal loan processing and customer relationship management.",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    taskReminders: true,
    paymentAlerts: true,
    announcements: true,
  });

  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwSuccess, setPwSuccess] = useState(false);

  const completionFields = [
    !!form.name,
    !!form.phone,
    !!form.email,
    !!form.address,
    !!form.bio,
    true, // role always filled
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  );

  const handleSave = () => setEditing(false);
  const handlePwSave = () => {
    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      setChangingPassword(false);
      setPwForm({ current: "", newPw: "", confirm: "" });
    }, 1800);
  };

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <AppLayout>
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          <PageHeader
            title="My Profile"
            subtitle="View and update your personal information and preferences"
            badge={ROLE_LABELS[user?.role ?? "staff"]}
            actions={[
              editing
                ? {
                    label: "Cancel",
                    onClick: () => setEditing(false),
                    variant: "outline",
                    icon: <X className="w-4 h-4" />,
                  }
                : {
                    label: "Edit Profile",
                    onClick: () => setEditing(true),
                    icon: <Edit3 className="w-4 h-4" />,
                  },
            ]}
          />

          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4"
            data-ocid="profile.completion_card"
          >
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-foreground">
                  Profile Completion
                </span>
                <span className="text-primary font-bold">{completionPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                />
              </div>
              {completionPct < 100 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Complete all fields to reach 100%
                </p>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left – Avatar + read-only info */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <Card className="border-border bg-card shadow-glow">
                <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                  <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                    <AvatarImage src={user?.avatar} alt={form.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {form.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-display font-bold text-lg text-foreground">
                      {form.name}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {ROLE_LABELS[user?.role ?? "staff"]}
                    </Badge>
                  </div>
                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IdCard className="w-4 h-4 text-primary" />
                      <span className="font-mono text-xs">
                        EMP-{user?.id?.slice(-6).toUpperCase() ?? "001234"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span>Kochi – Ernakulam Branch</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Joined Jan 15, 2022</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right – Editable details */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 space-y-4"
            >
              <Card className="border-border bg-card shadow-glow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        disabled={!editing}
                        data-ocid="profile.name_input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        disabled={!editing}
                        data-ocid="profile.phone_input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        disabled={!editing}
                        data-ocid="profile.email_input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        disabled={!editing}
                        data-ocid="profile.address_input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Bio / About</Label>
                    <Textarea
                      id="bio"
                      value={form.bio}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      disabled={!editing}
                      rows={3}
                      data-ocid="profile.bio_textarea"
                    />
                  </div>
                  {editing && (
                    <Button
                      onClick={handleSave}
                      className="gap-2"
                      data-ocid="profile.save_button"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card className="border-border bg-card shadow-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Account Security
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChangingPassword(!changingPassword)}
                      data-ocid="profile.change_password_button"
                    >
                      {changingPassword ? "Cancel" : "Change Password"}
                    </Button>
                  </div>
                </CardHeader>
                {changingPassword && (
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="curpw">Current Password</Label>
                      <Input
                        id="curpw"
                        type="password"
                        value={pwForm.current}
                        onChange={(e) =>
                          setPwForm({ ...pwForm, current: e.target.value })
                        }
                        data-ocid="profile.current_password_input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="newpw">New Password</Label>
                        <Input
                          id="newpw"
                          type="password"
                          value={pwForm.newPw}
                          onChange={(e) =>
                            setPwForm({ ...pwForm, newPw: e.target.value })
                          }
                          data-ocid="profile.new_password_input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="confpw">Confirm Password</Label>
                        <Input
                          id="confpw"
                          type="password"
                          value={pwForm.confirm}
                          onChange={(e) =>
                            setPwForm({ ...pwForm, confirm: e.target.value })
                          }
                          data-ocid="profile.confirm_password_input"
                        />
                      </div>
                    </div>
                    {pwSuccess && (
                      <p className="text-sm text-emerald-500 font-medium">
                        ✓ Password updated successfully!
                      </p>
                    )}
                    <Button
                      onClick={handlePwSave}
                      size="sm"
                      data-ocid="profile.save_password_button"
                    >
                      Update Password
                    </Button>
                  </CardContent>
                )}
              </Card>

              {/* Notification Preferences */}
              <Card className="border-border bg-card shadow-glow">
                <CardHeader>
                  <CardTitle className="text-base">
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(
                    [
                      ["email", "Email Notifications"],
                      ["sms", "SMS Alerts"],
                      ["push", "Push Notifications"],
                      ["taskReminders", "Task Reminders"],
                      ["paymentAlerts", "Payment Due Alerts"],
                      ["announcements", "Announcements & Memos"],
                    ] as [keyof typeof notifications, string][]
                  ).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <Label
                        htmlFor={`notif-${key}`}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {label}
                      </Label>
                      <Switch
                        id={`notif-${key}`}
                        checked={notifications[key]}
                        onCheckedChange={(v) =>
                          setNotifications({ ...notifications, [key]: v })
                        }
                        data-ocid={`profile.notif_${key}_switch`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
