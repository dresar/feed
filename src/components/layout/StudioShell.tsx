import { useEffect, useState, type ReactNode } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { SidebarContent } from "./Sidebar";
import { Topbar } from "./Topbar";
import { FloatingEngineLauncher } from "@/components/studio/FloatingEngineLauncher";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Consistent SSR default to avoid React hydration error #418
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ics.sidebar_collapsed");
      if (saved === "true") {
        setIsSidebarCollapsed(true);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("ics.sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  // Public Routes that any visitor can access without login
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // Strict Role-Based & Guest Protection Guard
  useEffect(() => {
    if (isLoading) return;

    // 1. Unauthenticated Guests CANNOT access internal studio / dashboard / engines
    if (!user) {
      if (!isPublicRoute) {
        void navigate({ to: "/login" });
        return;
      }
      return;
    }

    // 2. Super Admin Access Rules
    if (user && isAdmin) {
      if (pathname === "/settings") {
        void navigate({ to: "/admin/settings" });
        return;
      }
      if (pathname === "/profile") {
        void navigate({ to: "/admin/profile" });
        return;
      }
      // Super Admin has full clearance to use studio routes and admin console
      return;
    }

    // 3. Regular User is confined strictly to user studio & /user/* & /profile (NO /admin/*)
    if (user && !isAdmin) {
      if (pathname.startsWith("/admin") || pathname === "/settings") {
        void navigate({ to: "/user/dashboard" });
        return;
      }
    }
  }, [user, isAdmin, isLoading, pathname, navigate, isPublicRoute]);

  // Clean full-screen presentation for auth pages and landing page (ALWAYS NO sidebar, NO topbar)
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
        {children}
      </div>
    );
  }

  // If not logged in and on a protected route, prevent child content until redirection completes
  if (!user && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Aside (Fixed on Left with Smooth Width Transition) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border lg:block transition-all duration-300 bg-sidebar",
        isSidebarCollapsed ? "w-[72px]" : "w-[224px]"
      )}>
        <SidebarContent
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </aside>

      {/* Main Content Area (Automatically Padded to Match Sidebar Width) */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[224px]"
      )}>
        <Topbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <main className="studio-grid flex-1 min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>

      {/* ⚡ Quick Floating Engine Launcher FAB (User Studio only, NEVER for Admin) */}
      {!isAdmin && !pathname.startsWith("/admin") && <FloatingEngineLauncher />}
    </div>
  );
}
