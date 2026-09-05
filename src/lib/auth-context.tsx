import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  tokens_balance: number;
  status?: ("active" | "blocked") | undefined;
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  showTopUpModal: boolean;
  setShowTopUpModal: (show: boolean) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  register: (
    email: string,
    pass: string,
    name?: string,
  ) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  deductLocalToken: (newBalance?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Consistent SSR initial state (null) to strictly eliminate React Hydration Error #418
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if ((data.authenticated || data.success) && data.user) {
          setUser(data.user);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("app_user_profile", JSON.stringify(data.user));
            } catch {}
          }
          return;
        }
      }
      setUser(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("app_user_profile");
        } catch {}
      }
    } catch {
      // Don't wipe cached user on transient network disconnect
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Safely hydrate from localStorage on client-side mount
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("app_user_profile");
        if (cached) {
          setUser(JSON.parse(cached));
          setLoading(false);
        }
      } catch {}
    }
    void refreshUser();
  }, [refreshUser]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("app_user_profile", JSON.stringify(data.user));
            sessionStorage.removeItem("just_logged_out");
          } catch {}
        }
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || "Gagal masuk. Periksa email dan password." };
    } catch (err: any) {
      return { success: false, error: err.message || "Gagal terhubung ke server." };
    }
  };

  const register = async (email: string, pass: string, name?: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass, name }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("app_user_profile", JSON.stringify(data.user));
          } catch {}
        }
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || "Gagal mendaftar." };
    } catch (err: any) {
      return { success: false, error: err.message || "Gagal terhubung ke server." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("app_user_profile");
        sessionStorage.setItem("just_logged_out", "1");
      } catch {}
    }
  };

  const deductLocalToken = useCallback((newBalance?: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedBalance = typeof newBalance === "number" ? newBalance : Math.max(0, (prev.tokens_balance || 0) - 1);
      const updated = { ...prev, tokens_balance: updatedBalance };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("app_user_profile", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        isAdmin,
        showTopUpModal,
        setShowTopUpModal,
        login,
        register,
        logout,
        refreshUser,
        deductLocalToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
