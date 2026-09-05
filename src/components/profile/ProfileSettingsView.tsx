import { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Shield,
  Coins,
  Eye,
  EyeOff,
  Save,
  Camera,
  Calendar,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface ProfileSettingsViewProps {
  onSuccess?: () => void;
  isAdminView?: boolean;
}

export function ProfileSettingsView({ onSuccess, isAdminView }: ProfileSettingsViewProps) {
  const { user, isAdmin, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Profile photo upload states
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_custom_avatar") || null;
    }
    return null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, WEBP).");
      return;
    }

    try {
      setPhotoUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_custom_avatar", base64);
        }
        toast.success("Foto profil berhasil diperbarui! ✨");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunggah foto. Coba lagi.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword.length < 6) {
      toast.error("Password baru minimal harus 6 karakter.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          currentPassword: currentPassword.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Profil berhasil disimpan! ✨");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await refreshUser();
        onSuccess?.();
      } else {
        toast.error(data.message || data.error || "Gagal memperbarui profil.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  const avatarUrl = photoPreview || null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-md shadow-lg ${
        isAdmin
          ? "border-purple-500/30 bg-gradient-to-br from-purple-950/20 via-card to-card"
          : "border-border/90 bg-gradient-to-br from-primary/5 via-card to-card"
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">

          {/* Avatar with Photo Upload */}
          <div className="relative shrink-0 group">
            {/* Avatar circle */}
            <div className={`relative flex size-24 sm:size-28 items-center justify-center rounded-3xl font-display text-3xl font-extrabold shadow-xl overflow-hidden ${
              isAdmin
                ? "border-2 border-purple-400/40 ring-4 ring-purple-500/15"
                : "border-2 border-primary/30 ring-4 ring-primary/10"
            }`}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile photo"
                  className="size-full object-cover"
                />
              ) : (
                <div className={`size-full flex items-center justify-center ${
                  isAdmin
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white"
                    : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                }`}>
                  <span>{initials}</span>
                </div>
              )}

              {/* Upload overlay on hover */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoUploading ? (
                  <Loader2 className="size-6 text-white animate-spin" />
                ) : (
                  <>
                    <Camera className="size-6 text-white mb-1" />
                    <span className="text-[10px] font-bold text-white">Ganti Foto</span>
                  </>
                )}
              </div>
            </div>

            {/* Camera button (always visible) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoUploading}
              className={`absolute -bottom-1.5 -right-1.5 flex size-8 items-center justify-center rounded-xl border border-border shadow-lg transition-all hover:scale-110 ${
                isAdmin
                  ? "bg-purple-600 text-white"
                  : "bg-primary text-primary-foreground"
              }`}
              title="Upload foto profil"
            >
              {photoUploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground truncate">
                {user?.name || user?.email?.split("@")[0]}
              </h2>
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                isAdmin
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}>
                {isAdmin ? <Shield className="size-3" /> : <User className="size-3" />}
                {isAdmin ? "Super Administrator" : "Creator User"}
              </span>
            </div>

            <p className="font-mono text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="size-3.5" />
              <span>{user?.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Coins className="size-3.5 text-amber-400" />
                <strong className="text-foreground">
                  {isAdmin ? "∞ Unlimited" : `${user?.tokens_balance || 0} Token`}
                </strong>
              </span>
              <span className="flex items-center gap-1 font-mono text-[10.5px]">
                <Calendar className="size-3" />
                <span>
                  Terdaftar:{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
                    : "-"}
                </span>
              </span>
            </div>

            <p className="text-[10px] text-muted-foreground/70 mt-1">
              💡 Klik avatar untuk mengganti foto profil (maks. 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="panel p-6 sm:p-8 bg-card border-border/90 shadow-sm space-y-6">
        <div className="border-b border-border/80 pb-4">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <User className="size-4 text-purple-400" />
            <span>Pengaturan Akun & Keamanan</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Perbarui nama tampilan dan kata sandi masuk Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Email (Read only) */}
          <div className="space-y-1.5">
            <label className="font-mono font-semibold text-muted-foreground flex items-center justify-between">
              <span>Alamat Email (Akun Login)</span>
              <span className="text-[10px] text-muted-foreground/80">Tidak dapat diubah</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full rounded-xl border border-border/60 bg-surface/50 pl-10 pr-4 py-2.5 text-xs font-mono text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {/* Name / Username */}
          <div className="space-y-1.5">
            <label className="font-mono font-semibold text-foreground">
              Nama Lengkap / Username Tampilan *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama tampilan Anda"
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 space-y-4">
            <div>
              <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <Lock className="size-3.5 text-amber-400" />
                <span>Ubah Password (Opsional)</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Kosongkan jika Anda tidak ingin mengubah password saat ini.
              </p>
            </div>

            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="font-mono font-semibold text-muted-foreground">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama Anda"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-10 text-xs font-mono text-foreground focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-foreground">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-10 text-xs font-mono text-foreground focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="font-mono font-semibold text-foreground">
                  Konfirmasi Password Baru
                </label>
                <input
                  type={showNewPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-display text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                isAdmin
                  ? "bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              }`}
            >
              <Save className="size-4" />
              <span>{submitting ? "Menyimpan..." : "Simpan Profil & Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
