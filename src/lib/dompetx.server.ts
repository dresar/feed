import crypto from "crypto";

const DOMPETX_BASE_URL = "https://api.dompetx.com";

export function getDompetxApiKey(): string {
  return (
    process.env.DOMPETX_KEY ||
    process.env.dompetx_KEY ||
    process.env.DOMPETX_API_KEY ||
    ""
  ).trim();
}

/**
 * Generate HMAC-SHA256 signature for DompetX API requests
 * Signature input: timestamp + '.' + body
 */
export function generateDompetxSignature(body: string, timestamp: number, apiKey: string): string {
  const signatureData = `${timestamp}.${body}`;
  return crypto.createHmac("sha256", apiKey).update(signatureData).digest("hex");
}

export interface CreateCheckoutParams {
  amount: number;
  reference: string;
  redirectUrl: string;
  metadata: {
    order_name: string;
    product_name: string;
    customer_name: string;
    customer_email: string;
    notes?: string;
    user_id: string;
    package_id: string;
    token_amount: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface DompetxCheckoutResponse {
  id: string;
  amount: number;
  currency: string;
  payment_url: string;
  redirectUrl: string;
  status: "pending" | "paid" | "failed" | "expired" | "cancelled";
  createdAt: string;
  expiresAt?: string;
  [key: string]: any;
}

export interface DompetxDetailResponse {
  id: string;
  reference: string;
  merchantId?: string;
  merchantName?: string;
  status: "pending" | "paid" | "success" | "settled" | "failed" | "expired" | "cancelled" | string;
  amount: number;
  totalAmount?: number;
  paymentUrl?: string;
  redirectUrl?: string;
  orderDetails?: any;
  [key: string]: any;
}

/**
 * 1. Create a hosted payment checkout via DompetX
 */
export async function createDompetxCheckout(
  params: CreateCheckoutParams
): Promise<{ success: boolean; data?: DompetxCheckoutResponse; error?: string }> {
  const apiKey = getDompetxApiKey();
  if (!apiKey) {
    return {
      success: false,
      error: "DompetX API Key belum dikonfigurasi di environment variable (DOMPETX_KEY).",
    };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    amount: params.amount,
    currency: "IDR",
    reference: params.reference,
    redirectUrl: params.redirectUrl,
    metadata: params.metadata,
  };

  const body = JSON.stringify(payload);
  const signature = generateDompetxSignature(body, timestamp, apiKey);

  try {
    const res = await fetch(`${DOMPETX_BASE_URL}/v1/payments/checkout`, {
      method: "POST",
      headers: {
        "X-DOMPAY-API-Key": apiKey,
        "X-DOMPAY-Signature": signature,
        "X-DOMPAY-Timestamp": String(timestamp),
        "Idempotency-Key": `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();
    if (res.ok && (data.payment_url || data.id)) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.message || data.error || "Gagal membuat link pembayaran DompetX.",
    };
  } catch (err: any) {
    console.error("DompetX checkout creation error:", err.message);
    return { success: false, error: err.message || "Koneksi ke DompetX gagal." };
  }
}

/**
 * 2. Get checkout detail by checkout ID
 */
export async function getDompetxCheckoutDetail(
  checkoutId: string
): Promise<{ success: boolean; data?: DompetxDetailResponse; error?: string }> {
  const apiKey = getDompetxApiKey();
  if (!apiKey) return { success: false, error: "DompetX API Key missing" };

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateDompetxSignature("", timestamp, apiKey);

  try {
    const res = await fetch(`${DOMPETX_BASE_URL}/v1/payments/checkout/detail/${checkoutId}`, {
      method: "GET",
      headers: {
        "X-DOMPAY-API-Key": apiKey,
        "X-DOMPAY-Signature": signature,
        "X-DOMPAY-Timestamp": String(timestamp),
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok && data.id) {
      return { success: true, data };
    }
    return { success: false, error: data.message || "Gagal mengecek detail transaksi." };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 3. Check status by merchant reference
 */
export async function checkDompetxStatusByReference(
  reference: string
): Promise<{ success: boolean; data?: DompetxDetailResponse; error?: string }> {
  const apiKey = getDompetxApiKey();
  if (!apiKey) return { success: false, error: "DompetX API Key missing" };

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateDompetxSignature("", timestamp, apiKey);

  try {
    const res = await fetch(
      `${DOMPETX_BASE_URL}/v1/payments/checkout/check-status?reference=${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          "X-DOMPAY-API-Key": apiKey,
          "X-DOMPAY-Signature": signature,
          "X-DOMPAY-Timestamp": String(timestamp),
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (res.ok && data.id) {
      return { success: true, data };
    }
    return { success: false, error: data.message || "Gagal mengecek status pembayaran." };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 4. Verify DompetX Webhook Signature
 */
export function verifyDompetxWebhookSignature(
  rawBody: string,
  timestamp: string | number,
  receivedSignature: string
): boolean {
  const apiKey = getDompetxApiKey();
  if (!apiKey || !receivedSignature) return false;

  const expectedSignature = generateDompetxSignature(rawBody, Number(timestamp), apiKey);
  return (
    crypto.timingSafeEqual(Buffer.from(receivedSignature, "utf8"), Buffer.from(expectedSignature, "utf8")) ||
    receivedSignature === expectedSignature
  );
}
