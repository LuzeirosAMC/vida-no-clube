import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { users } from "../../../../db/schema";
import { createSession, hashPassword } from "../../../../lib/site-auth";

export async function POST(request: Request) {
  const data = await request.json().catch(() => null) as { login?: string; password?: string; birthDate?: string } | null;
  const login = data?.login?.trim().toLowerCase() ?? "";
  const password = data?.password ?? "";
  const birthDate = data?.birthDate ?? "";
  if (!/^[a-z0-9._-]{3,32}$/.test(login)) return NextResponse.json({ error: "Use de 3 a 32 caracteres: letras, números, ponto, hífen ou sublinhado." }, { status: 400 });
  if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "A senha precisa ter entre 8 e 128 caracteres." }, { status: 400 });
  const birth = new Date(`${birthDate}T12:00:00Z`);
  const oldest = new Date(); oldest.setUTCFullYear(oldest.getUTCFullYear() - 120);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(birth.valueOf()) || birth > new Date() || birth < oldest) return NextResponse.json({ error: "Informe uma data de nascimento válida." }, { status: 400 });
  const db = getDb();
  if ((await db.select({ id: users.id }).from(users).where(eq(users.login, login)).limit(1))[0]) return NextResponse.json({ error: "Este login já está em uso." }, { status: 409 });
  const [{ value: userCount }] = await db.select({ value: count() }).from(users);
  const id = crypto.randomUUID();
  await db.insert(users).values({ id, login, passwordHash: await hashPassword(password), birthDate, role: userCount === 0 ? "director" : "member" });
  await createSession(id);
  return NextResponse.json({ ok: true, role: userCount === 0 ? "director" : "member" });
}
