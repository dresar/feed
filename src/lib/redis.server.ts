/**
 * Upstash Redis REST Client for Sub-10ms Server Caching & Edge Storage
 */

const REDIS_URL =
  process.env["UPSTASH_REDIS_REST_URL"] ||
  process.env["REDIS_URL"] ||
  "";

const REDIS_TOKEN =
  process.env["UPSTASH_REDIS_REST_TOKEN"] ||
  process.env["REDIS_TOKEN"] ||
  "";

export async function redisCommand(command: string, ...args: (string | number)[]): Promise<any> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const url = `${REDIS_URL.replace(/\/$/, "")}/${[command, ...args.map(encodeURIComponent)].join("/")}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result ?? null;
  } catch (err) {
    console.warn("Upstash Redis error:", err);
    return null;
  }
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  try {
    const result = await redisCommand("get", `feed:${key}`);
    if (!result) return null;
    return typeof result === "string" ? JSON.parse(result) : result;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  data: any,
  ttlSeconds = 60,
): Promise<boolean> {
  try {
    const serialized = JSON.stringify(data);
    await redisCommand("set", `feed:${key}`, serialized, "EX", ttlSeconds);
    return true;
  } catch {
    return false;
  }
}

export async function deleteCache(key: string): Promise<boolean> {
  try {
    await redisCommand("del", `feed:${key}`);
    return true;
  } catch {
    return false;
  }
}

export async function getCachedPrompt<T = any>(key: string): Promise<T | null> {
  return getCache<T>(`prompt:${key}`);
}

export async function setCachedPrompt(
  key: string,
  data: any,
  ttlSeconds = 86400,
): Promise<boolean> {
  return setCache(`prompt:${key}`, data, ttlSeconds);
}

export async function testRedisConnection(): Promise<{
  ok: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const res = await redisCommand("ping");
    const latencyMs = Date.now() - start;
    if (res === "PONG" || res) {
      return { ok: true, latencyMs };
    }
    return { ok: false, latencyMs, error: "Unexpected response from Redis" };
  } catch (err: any) {
    return { ok: false, latencyMs: Date.now() - start, error: err.message };
  }
}
