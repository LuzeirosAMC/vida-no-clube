import { NextResponse } from "next/server";
import { clearSession } from "../../../../lib/site-auth";

export async function POST(request: Request) {
  // Logout por POST evita encerramento acidental de sessão por pré-carregadores.
  await clearSession();
  return NextResponse.redirect(new URL("/", request.url), 303);
}
