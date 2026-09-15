import "server-only";
import { cookies, headers } from "next/headers";
import { sha256Hex } from "./utils";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, createSessionToken, verifySessionToken } from "./session";

export { ADMIN_COOKIE };

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16,
  );
}


/**
 * Admin authentication.
 *
 * A single administrator password (ADMIN_PASSWORD) and a signing secret
 * (ADMIN_SESSION_SECRET) come from the environment. Sessions are HMAC-signed,
 * HttpOnly cookies. Nothing here is ever shipped to the browser bundle.
 */

export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare fixed-length digests to avoid leaking length/timing information.
  const [a, b] = await Promise.all([sha256Hex(candidate), sha256Hex(expected)]);
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value, process.env.ADMIN_SESSION_SECRET);
}

/** Throws when the current request is not an authenticated admin. Use in every server action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function setSessionCookie(): Promise<void> {
  const token = await createSessionToken(process.env.ADMIN_SESSION_SECRET as string);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

/** Hashed client IP for rate limiting; never stores the raw address. */
export async function clientIpHash(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for") ?? store.get("x-real-ip") ?? "unknown";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  return sha256Hex(`${process.env.CONTACT_IP_SALT ?? "orion"}:${ip}`);
}
