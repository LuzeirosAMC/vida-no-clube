import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { submissions } from "../../../db/schema";
import { getSiteUser } from "../../../lib/site-auth";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageBytes = 8 * 1024 * 1024;

/**
 * Recebe relatos e fotos de qualquer usuário autenticado.
 * Todo conteúdo nasce pendente; esta rota nunca publica diretamente.
 */
export async function POST(request: Request) {
  const user = await getSiteUser();
  if (!user) {
    return NextResponse.json(
      { error: "Entre na sua conta para enviar conteúdo." },
      { status: 401 },
    );
  }

  const form = await request.formData();
  const requestedKind = form.get("kind") === "photo" ? "photo" : "comment";
  const title = String(form.get("title") ?? "").trim().slice(0, 100);
  const body = String(form.get("body") ?? "").trim().slice(0, 2000);
  const photo = form.get("photo");
  const hasPhoto = photo instanceof File && photo.size > 0;

  if (!title || !body) {
    return NextResponse.json(
      { error: "Preencha o título e o comentário." },
      { status: 400 },
    );
  }

  // BUCKET é opcional para permitir que relatos em texto continuem funcionando
  // enquanto a conta do clube ainda não ativou o R2.
  if (requestedKind === "photo" || hasPhoto) {
    if (!env.BUCKET) {
      return NextResponse.json(
        {
          error:
            "O envio de fotos será liberado em breve. Por enquanto, envie seu relato sem imagem.",
        },
        { status: 503 },
      );
    }

    if (!hasPhoto || !allowedImageTypes.has(photo.type) || photo.size > maxImageBytes) {
      return NextResponse.json(
        { error: "Envie JPG, PNG ou WebP com até 8 MB." },
        { status: 400 },
      );
    }
  }

  let objectKey: string | null = null;
  let mimeType: string | null = null;

  if (hasPhoto && env.BUCKET) {
    // A chave aleatória evita expor o nome original do arquivo e colisões.
    objectKey = `submissions/${user.id}/${crypto.randomUUID()}`;
    mimeType = photo.type;
    await env.BUCKET.put(objectKey, await photo.arrayBuffer(), {
      httpMetadata: { contentType: photo.type },
    });
  }

  await getDb().insert(submissions).values({
    id: crypto.randomUUID(),
    authorId: user.id,
    kind: objectKey ? "photo" : "comment",
    title,
    body,
    objectKey,
    mimeType,
  });

  return NextResponse.json({ ok: true });
}
