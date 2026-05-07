import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/employees": "Employees",
  "/branches": "Branches",
  "/zones": "Zones",
  "/transfers": "Transfers",
  "/attendance": "Attendance",
  "/analytics": "Analytics",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/activity-logs": "Activity Logs",
};

const SESSION_WARN_MS = 25 * 60 * 1000;

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const routerState = useRouterState();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [showTimeout, setShowTimeout] = useState(false);
  const [countdown, setCountdown] = useState(300);

  const breadcrumb = Object.entries(routeLabels).find(
    ([key]) =>
      routerState.location.pathname === key ||
      routerState.location.pathname.startsWith(`${key}/`),
  )?.[1];

  const extendSession = useCallback(() => {
    setShowTimeout(false);
    setCountdown(300);
  }, []);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    let warningTimer: ReturnType<typeof setTimeout> | null = null;
    let countdownTimer: ReturnType<typeof setInterval> | null = null;

    const doReset = () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (countdownTimer) clearInterval(countdownTimer);
      setShowTimeout(false);
      warningTimer = setTimeout(() => {
        setShowTimeout(true);
        setCountdown(300);
        countdownTimer = setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) {
              clearInterval(countdownTimer!);
              logout();
              void router.navigate({ to: "/login" });
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      }, SESSION_WARN_MS);
    };

    const handler = () => doReset();
    for (const e of events)
      document.addEventListener(e, handler, { passive: true });
    doReset();
    return () => {
      for (const e of events) document.removeEventListener(e, handler);
      if (warningTimer) clearTimeout(warningTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [logout, router]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        <Navbar breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto" data-ocid="main_content">
          <AnimatePresence mode="wait">
            <motion.div
              key={routerState.location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Session timeout modal */}
      <AnimatePresence>
        {showTimeout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-elevated max-w-sm w-full mx-4 text-center"
              data-ocid="session_timeout.dialog"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⏱️</span>
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-2">
                Session Expiring
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Your session will expire due to inactivity.
              </p>
              <p className="font-mono text-3xl font-bold text-destructive mb-6">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => logout()}
                  data-ocid="session_timeout.logout_button"
                >
                  Logout Now
                </Button>
                <Button
                  onClick={extendSession}
                  data-ocid="session_timeout.extend_button"
                >
                  Stay Logged In
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
