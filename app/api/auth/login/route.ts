import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { users } from "../../../../db/schema";
import { createSession, verifyPassword } from "../../../../lib/site-auth";

export async function POST(request: Request) {
  const data = await request.json().catch(() => null) as { login?: string; password?: string } | null;
  const login = data?.login?.trim().toLowerCase() ?? "";
  const row = (await getDb().select().from(users).where(eq(users.login, login)).limit(1))[0];
  if (!row || !row.active || !(await verifyPassword(data?.password ?? "", row.passwordHash))) return NextResponse.json({ error: "Login ou senha incorretos." }, { status: 401 });
  await createSession(row.id);
  return NextResponse.json({ ok: true, role: row.role });
}
