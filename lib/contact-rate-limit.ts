import type { NextRequest } from "next/server";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;

const stampBuckets = new Map<string, number[]>();

function clientIpFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function countInWindow(key: string, now: number): number {
  const arr = stampBuckets.get(key) ?? [];
  const windowStart = now - WINDOW_MS;
  return arr.filter((t) => t > windowStart).length;
}

function recordRequest(key: string, now: number): void {
  const windowStart = now - WINDOW_MS;
  const arr = (stampBuckets.get(key) ?? []).filter((t) => t > windowStart);
  arr.push(now);
  stampBuckets.set(key, arr);
}

/**
 * In-process rate limit: per email + per client IP, rolling 1h window.
 * Not distributed across serverless instances; for edge-level limits use Cloudflare WAF / rate rules.
 */
export function checkContactRateLimit(
  request: NextRequest,
  email: string
): { ok: true } | { ok: false; reason: "email" | "ip" } {
  const now = Date.now();
  const ip = clientIpFromRequest(request);
  const emailKey = `e:${email.toLowerCase()}`;
  const ipKey = `i:${ip}`;

  if (countInWindow(emailKey, now) >= MAX_PER_EMAIL) {
    return { ok: false, reason: "email" };
  }
  if (countInWindow(ipKey, now) >= MAX_PER_IP) {
    return { ok: false, reason: "ip" };
  }

  recordRequest(emailKey, now);
  recordRequest(ipKey, now);
  return { ok: true };
}
