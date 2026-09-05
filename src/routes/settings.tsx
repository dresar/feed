import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/settings")({
  component: SettingsRedirectPage,
});

export function SettingsRedirectPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAdmin) {
        void navigate({ to: "/admin/settings" });
      } else if (user) {
        void navigate({ to: "/user/dashboard" });
      } else {
        void navigate({ to: "/login" });
      }
    }
  }, [isLoading, user, isAdmin, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="text-xs font-mono text-purple-400 animate-pulse">
        Mengalihkan ke pengaturan...
      </span>
    </div>
  );
}
