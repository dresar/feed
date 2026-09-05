import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProfileSettingsView } from "@/components/profile/ProfileSettingsView";

export const Route = createFileRoute("/profile")({
  component: UserProfilePage,
});

export function UserProfilePage() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        void navigate({ to: "/login" });
      } else if (isAdmin) {
        void navigate({ to: "/admin/profile" });
      }
    }
  }, [isLoading, user, isAdmin, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-xs font-mono text-primary animate-pulse">
          Memuat profil pengguna...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6 animate-in fade-in duration-200">
      <ProfileSettingsView isAdminView={false} />
    </div>
  );
}
