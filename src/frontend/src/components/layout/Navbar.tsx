import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useUIStore } from "@/store/uiStore";
import { useRouter } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  TrendingUp,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

interface NavbarProps {
  breadcrumb?: string;
}

export function Navbar({ breadcrumb }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const { unreadCount } = useNotificationStore();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) ?? "??";

  return (
    <header
      className="h-16 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-10 flex items-center px-4 gap-4"
      data-ocid="navbar"
    >
      {/* Hamburger + logo on mobile */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle sidebar"
          data-ocid="navbar.sidebar_toggle"
        >
          <Menu className="w-5 h-5" />
        </Button>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:hidden flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">
              TKA
            </span>
          </motion.div>
        )}
        {breadcrumb && (
          <span className="hidden sm:block text-sm text-muted-foreground font-medium">
            {breadcrumb}
          </span>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers, employees..."
            className={cn(
              "w-full pl-9 pr-4 py-2 rounded-lg text-sm",
              "bg-muted border border-border",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-smooth",
            )}
            data-ocid="navbar.search_input"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          onClick={() => router.navigate({ to: "/notifications" })}
          aria-label={`Notifications (${unreadCount} unread)`}
          data-ocid="navbar.notifications_button"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-destructive border-0"
              data-ocid="navbar.notifications_badge"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
          data-ocid="navbar.theme_toggle"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 hover:bg-muted"
              data-ocid="navbar.user_menu_button"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center text-primary-foreground text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                {user?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52"
            data-ocid="navbar.user_dropdown"
          >
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground font-normal truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.navigate({ to: "/settings" })}
              data-ocid="navbar.profile_link"
            >
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.navigate({ to: "/settings" })}
              data-ocid="navbar.settings_link"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
              data-ocid="navbar.logout_button"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
