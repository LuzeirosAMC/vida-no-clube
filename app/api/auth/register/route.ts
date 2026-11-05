import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { users } from "../../../../db/schema";
import { createSession, hashPassword } from "../../../../lib/site-auth";

export async function POST(request: Request) {
  const formRequest = request.headers.get("content-type")?.includes("application/x-www-form-urlencoded") || request.headers.get("content-type")?.includes("multipart/form-data");
  const data = formRequest ? Object.fromEntries(await request.formData()) as { login?: string; password?: string; birthDate?: string } : await request.json().catch(() => null) as { login?: string; password?: string; birthDate?: string } | null;
  const fail = (error: string, status: number) => formRequest ? NextResponse.redirect(new URL(`/cadastro?erro=${encodeURIComponent(error)}`, request.url), 303) : NextResponse.json({ error }, { status });
  const login = data?.login?.trim().toLowerCase() ?? "";
  const password = data?.password ?? "";
  const birthDate = data?.birthDate ?? "";
  if (!/^[a-z0-9._-]{3,32}$/.test(login)) return fail("Use de 3 a 32 caracteres: letras, números, ponto, hífen ou sublinhado.", 400);
  if (password.length < 8 || password.length > 128) return fail("A senha precisa ter entre 8 e 128 caracteres.", 400);
  const birth = new Date(`${birthDate}T12:00:00Z`);
  const oldest = new Date(); oldest.setUTCFullYear(oldest.getUTCFullYear() - 120);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(birth.valueOf()) || birth > new Date() || birth < oldest) return fail("Informe uma data de nascimento válida.", 400);
  const db = getDb();
  if ((await db.select({ id: users.id }).from(users).where(eq(users.login, login)).limit(1))[0]) return fail("Este login já está em uso.", 409);
  const id = crypto.randomUUID();
  await db.insert(users).values({ id, login, passwordHash: await hashPassword(password), birthDate, role: "guest" });
  await createSession(id);
  const role = "guest";
  return formRequest ? NextResponse.redirect(new URL("/minha-conta", request.url), 303) : NextResponse.json({ ok: true, role });
}
