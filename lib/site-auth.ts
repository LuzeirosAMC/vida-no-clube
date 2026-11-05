import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "../db";
import { sessions, users } from "../db/schema";

export type SiteRole = "director" | "treasurer" | "media" | "member";
export type SiteUser = {
  id: string;
  login: string;
  birthDate: string;
  role: SiteRole;
  active: boolean;
};

export const SESSION_COOKIE = "luzeiros_session";
const SESSION_DAYS = 30;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomHex(size = 32) {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(size)));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" }, key, 256);
  return `pbkdf2-sha256$100000$${bytesToHex(salt)}$${bytesToHex(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, iterationsText, saltHex, expected] = stored.split("$");
  if (algorithm !== "pbkdf2-sha256" || !iterationsText || !saltHex || !expected) return false;
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)?.map((part) => Number.parseInt(part, 16)) ?? []);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: Number(iterationsText), hash: "SHA-256" }, key, 256);
  const actual = bytesToHex(new Uint8Array(bits));
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  return difference === 0;
}

export async function createSession(userId: string) {
  const token = randomHex();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await getDb().insert(sessions).values({ id: crypto.randomUUID(), userId, tokenHash: await sha256(token), expiresAt: expires.toISOString() });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires });
}

export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await getDb().delete(sessions).where(eq(sessions.tokenHash, await sha256(token)));
  jar.delete(SESSION_COOKIE);
}

export async function getSiteUser(): Promise<SiteUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await getDb().select({ id: users.id, login: users.login, birthDate: users.birthDate, role: users.role, active: users.active })
    .from(sessions).innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, await sha256(token)), gt(sessions.expiresAt, new Date().toISOString()), eq(users.active, true))).limit(1);
  return (rows[0] as SiteUser | undefined) ?? null;
}

export function canAccessDashboard(role: SiteRole) {
  return role === "director" || role === "treasurer" || role === "media";
}

export function canModerate(role: SiteRole) {
  return role === "director" || role === "media";
}

export function canManageDonations(role: SiteRole) {
  return role === "director" || role === "treasurer";
}

export function isMinor(birthDate: string, now = new Date()) {
  const birth = new Date(`${birthDate}T12:00:00Z`);
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const month = now.getUTCMonth() - birth.getUTCMonth();
  if (month < 0 || (month === 0 && now.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age < 18;
}
