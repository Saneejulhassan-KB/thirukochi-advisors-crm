import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockCredentials } from "@/data/mockAuth";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@tanstack/react-router";
import {
  BarChart2,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const featureList = [
  { icon: ShieldCheck, label: "Role-based access control" },
  { icon: BarChart2, label: "Real-time analytics & reports" },
  { icon: Users, label: "Multi-branch team management" },
  { icon: Zap, label: "Enterprise-grade security" },
];

const demoCredentialCards = [
  {
    role: "super_admin",
    label: "Super Admin",
    email: "admin@thirukochi.com",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    textColor: "text-violet-400",
  },
  {
    role: "zonal_manager",
    label: "Zonal Manager",
    email: "zonal@thirukochi.com",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    textColor: "text-blue-400",
  },
  {
    role: "branch_manager",
    label: "Branch Manager",
    email: "branch@thirukochi.com",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    textColor: "text-emerald-400",
  },
  {
    role: "staff",
    label: "Staff",
    email: "staff@thirukochi.com",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
    textColor: "text-amber-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LoginPage() {
  const { login, isLoading, loginError, clearError } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login(email, password);
    if (ok) {
      toast.success("Signed in successfully!", {
        description: "Welcome to ThiruKochi Advisors CRM",
      });
      void router.navigate({ to: "/dashboard" });
    }
  };

  const fillDemo = (role: string) => {
    const cred = mockCredentials.find((c) => c.user.role === role);
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      setEmailError("");
      setPasswordError("");
      clearError();
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-background">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[80px]" />
      </div>

      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-xl text-foreground">
              ThiruKochi Advisors
            </p>
            <p className="text-xs text-muted-foreground">
              Enterprise Finance CRM
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeInOut" }}
          className="relative z-10 space-y-8"
        >
          <div className="w-full max-w-md">
            <svg viewBox="0 0 480 200" className="w-full" aria-hidden="true">
              <defs>
                <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.65 0.21 262)"
                    stopOpacity="0.4"
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.65 0.21 262)"
                    stopOpacity="0"
                  />
                </linearGradient>
                <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.72 0.15 280)"
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.72 0.15 280)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="480"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.06"
                  strokeWidth="1"
                />
              ))}
              <path
                d="M0,160 L60,130 L120,100 L180,120 L240,80 L300,90 L360,60 L420,70 L480,40 L480,200 L0,200 Z"
                fill="url(#chartGrad1)"
              />
              <path
                d="M0,160 L60,130 L120,100 L180,120 L240,80 L300,90 L360,60 L420,70 L480,40"
                stroke="oklch(0.65 0.21 262)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,180 L60,155 L120,140 L180,150 L240,120 L300,135 L360,100 L420,110 L480,90 L480,200 L0,200 Z"
                fill="url(#chartGrad2)"
              />
              <path
                d="M0,180 L60,155 L120,140 L180,150 L240,120 L300,135 L360,100 L420,110 L480,90"
                stroke="oklch(0.72 0.15 280)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 3"
              />
              {[
                [60, 130],
                [120, 100],
                [180, 120],
                [240, 80],
                [300, 90],
                [360, 60],
                [420, 70],
                [480, 40],
              ].map(([x, y]) => (
                <circle
                  key={`${x}-${y}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="oklch(0.65 0.21 262)"
                  opacity="0.8"
                />
              ))}
            </svg>
          </div>

          <div>
            <h2 className="font-display font-bold text-4xl xl:text-5xl text-foreground leading-tight">
              Empowering
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Financial Excellence
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base max-w-sm">
              Complete enterprise CRM platform for Kerala's leading advisory
              &amp; finance operations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featureList.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 relative z-10"
        >
          {[
            { label: "Active Branches", value: "12" },
            { label: "Customers Served", value: "933+" },
            { label: "Zones Covered", value: "4" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 border border-border/50"
            >
              <span className="font-display font-bold text-sm text-primary">
                {value}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div
            variants={childVariants}
            className="flex items-center gap-3 mb-8 lg:hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-xl text-foreground">
                ThiruKochi Advisors
              </p>
              <p className="text-xs text-muted-foreground">
                Enterprise Finance CRM
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={childVariants}
            className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-elevated p-8"
            data-ocid="login.card"
          >
            <motion.div
              variants={childVariants}
              className="flex items-center gap-4 mb-7"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow flex-shrink-0">
                <span className="font-display font-black text-2xl text-primary-foreground">
                  T
                </span>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">
                  ThiruKochi Advisors
                </h1>
                <p className="text-xs text-muted-foreground">
                  Enterprise CRM Platform
                </p>
              </div>
            </motion.div>

            <motion.div variants={childVariants}>
              <h2 className="font-display font-semibold text-lg text-foreground">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5 mb-6">
                Sign in to your account to continue
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate>
              <motion.div variants={childVariants} className="space-y-1.5 mb-4">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@thirukochi.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      clearError();
                    }}
                    required
                    autoComplete="email"
                    className="pl-9"
                    data-ocid="login.email_input"
                  />
                </div>
                {emailError && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="login.email_field_error"
                  >
                    {emailError}
                  </p>
                )}
              </motion.div>

              <motion.div variants={childVariants} className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    data-ocid="login.forgot_password_link"
                    onClick={() =>
                      toast.success("Password reset link sent to your email")
                    }
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      clearError();
                    }}
                    required
                    autoComplete="current-password"
                    className="pl-9 pr-10"
                    data-ocid="login.password_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    data-ocid="login.toggle_password_button"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="login.password_field_error"
                  >
                    {passwordError}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={childVariants}
                className="flex items-center gap-2 mb-5"
              >
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(!!c)}
                  data-ocid="login.remember_me_checkbox"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me for 30 days
                </Label>
              </motion.div>

              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4"
                  data-ocid="login.error_state"
                >
                  {loginError}
                </motion.p>
              )}

              <motion.div variants={childVariants}>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                  data-ocid="login.submit_button"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" /> Sign In Securely
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              variants={childVariants}
              className="mt-6 pt-5 border-t border-border"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoCredentialCards.map(
                  ({ role, label, email: demoEmail, color, textColor }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => fillDemo(role)}
                      className={`text-left px-3 py-2.5 rounded-xl bg-gradient-to-br ${color} border backdrop-blur-sm transition-smooth hover:scale-[1.02] active:scale-[0.98]`}
                      data-ocid={`login.demo_${role}`}
                    >
                      <p className={`text-xs font-semibold ${textColor}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {demoEmail}
                      </p>
                    </button>
                  ),
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 text-center">
                Password for all:{" "}
                <span className="font-mono text-foreground">Admin@123</span>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={childVariants}
            className="mt-6 flex items-center justify-center gap-4"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              <span>ThiruKochi Advisors © {new Date().getFullYear()}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
