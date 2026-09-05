const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const APP_URL = process.env.APP_URL || "https://instafeedpro.vercel.app";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Insta Prompt Forge <onboarding@resend.dev>",
}: SendEmailParams): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn("Resend email skipped: RESEND_API_KEY is not set.");
    return { success: false, error: "RESEND_API_KEY is not set." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (res.ok && data.id) {
      return { success: true, data };
    }
    console.warn("Resend API warning:", data);
    return { success: false, error: data.message || "Failed to send email" };
  } catch (err: any) {
    console.error("Resend email delivery error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Send Welcome Email with Free Tokens
 */
export async function sendWelcomeEmail(
  toEmail: string,
  userName?: string,
  tokens = 10,
): Promise<{ success: boolean; error?: string }> {
  const name = userName || toEmail.split("@")[0] || "Kreator";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid #1f293d; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background-color: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
    h1 { color: #ffffff; font-size: 22px; margin-top: 0; margin-bottom: 12px; font-weight: 800; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 18px; }
    .token-box { background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .token-amount { font-size: 32px; font-weight: 800; color: #fbbf24; margin: 4px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✨ Selamat Datang di Studio AI</div>
    <h1>Halo, ${name}! 👋</h1>
    <p>Akun Anda di <strong>Insta Prompt Forge</strong> telah aktif. Kini Anda memiliki akses penuh ke 12 modul generator formula prompt AI komersial level studio.</p>
    
    <div class="token-box">
      <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Bonus Pendaftaran Anda</div>
      <div class="token-amount">🪙 ${tokens} Token Generasi</div>
      <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Siap digunakan langsung untuk meracik prompt visual Midjourney, ChatGPT, & Flux.</div>
    </div>

    <div style="text-align: center;">
      <a href="${APP_URL}/user/dashboard" class="btn">Buka Studio & Mulai Meracik →</a>
    </div>

    <div class="footer">
      © 2026 Insta Prompt Forge · AI Commercial Visual Prompt Engine
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: toEmail,
    subject: `🎁 Selamat Datang di Insta Prompt Forge! ${tokens} Token Gratis Anda Telah Aktif`,
    html,
  });
}

/**
 * 2. Send Token Top-Up Confirmation Email
 */
export async function sendTokenTopUpEmail(
  toEmail: string,
  userName: string,
  addedTokens: number,
  newBalance: number,
): Promise<{ success: boolean; error?: string }> {
  const name = userName || toEmail.split("@")[0] || "Kreator";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid #1f293d; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background-color: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
    h1 { color: #ffffff; font-size: 22px; margin-top: 0; margin-bottom: 12px; font-weight: 800; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 18px; }
    .token-box { background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .token-amount { font-size: 32px; font-weight: 800; color: #34d399; margin: 4px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">💳 Isi Ulang Token Berhasil</div>
    <h1>Halo, ${name}! 👋</h1>
    <p>Top up saldo token akun Anda telah berhasil diproses ke dalam database.</p>
    
    <div class="token-box">
      <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Penambahan Token</div>
      <div class="token-amount">+${addedTokens} Token 🪙</div>
      <div style="font-size: 13px; color: #fbbf24; margin-top: 8px; font-weight: bold;">Total Saldo Sekarang: ${newBalance} Token</div>
    </div>

    <div style="text-align: center;">
      <a href="${APP_URL}/user/dashboard" class="btn">Lanjutkan Meracik Prompt →</a>
    </div>

    <div class="footer">
      © 2026 Insta Prompt Forge · AI Commercial Visual Prompt Engine
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: toEmail,
    subject: `⚡ Isi Ulang Token Berhasil (+${addedTokens} Token) — Insta Prompt Forge`,
    html,
  });
}

/**
 * 3. Send Password Reset / Recovery Email
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  resetTokenOrLink: string,
  userName?: string,
): Promise<{ success: boolean; error?: string }> {
  const name = userName || toEmail.split("@")[0] || "Kreator";
  const resetUrl = resetTokenOrLink.startsWith("http")
    ? resetTokenOrLink
    : `${APP_URL}/reset-password?token=${resetTokenOrLink}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid #1f293d; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background-color: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
    h1 { color: #ffffff; font-size: 22px; margin-top: 0; margin-bottom: 12px; font-weight: 800; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 18px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🔒 Pemulihan Kata Sandi</div>
    <h1>Halo, ${name}!</h1>
    <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun <strong>Insta Prompt Forge</strong> Anda.</p>
    <p>Klik tombol di bawah ini untuk membuat kata sandi baru. Tautan ini hanya berlaku selama 1 jam.</p>
    
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn">Atur Ulang Kata Sandi →</a>
    </div>

    <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
      Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini. Akun Anda tetap aman.
    </p>

    <div class="footer">
      © 2026 Insta Prompt Forge · AI Commercial Visual Prompt Engine
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: toEmail,
    subject: `🔑 Instruksi Reset Kata Sandi — Insta Prompt Forge`,
    html,
  });
}
