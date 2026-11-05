import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { users } from "../../../../db/schema";
import { createSession, verifyPassword } from "../../../../lib/site-auth";

export async function POST(request: Request) {
  const formRequest = request.headers.get("content-type")?.includes("application/x-www-form-urlencoded") || request.headers.get("content-type")?.includes("multipart/form-data");
  const data = formRequest ? Object.fromEntries(await request.formData()) as { login?: string; password?: string } : await request.json().catch(() => null) as { login?: string; password?: string } | null;
  const login = data?.login?.trim().toLowerCase() ?? "";
  const row = (await getDb().select().from(users).where(eq(users.login, login)).limit(1))[0];
  if (!row || !row.active || !(await verifyPassword(data?.password ?? "", row.passwordHash))) return formRequest ? NextResponse.redirect(new URL(`/acesso?erro=${encodeURIComponent("Login ou senha incorretos.")}`, request.url), 303) : NextResponse.json({ error: "Login ou senha incorretos." }, { status: 401 });
  await createSession(row.id);
  return formRequest ? NextResponse.redirect(new URL(row.role === "member" ? "/minha-conta" : "/portal", request.url), 303) : NextResponse.json({ ok: true, role: row.role });
}
