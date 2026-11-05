import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { getDb } from "../../db";
import { submissions, users } from "../../db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Relatos da comunidade",
  description: "Relatos e memórias da comunidade do Clube de Desbravadores Luzeiros.",
};

export default async function StoriesPage() {
  // Não há paginação ainda porque o volume é pequeno. Se a coleção crescer,
  // este é o ponto onde devem entrar cursor e limite por página.
  const stories = await getDb()
    .select({
      id: submissions.id,
      title: submissions.title,
      body: submissions.body,
      author: users.login,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.authorId, users.id))
    .where(and(eq(submissions.status, "approved"), eq(submissions.kind, "comment")))
    .orderBy(desc(submissions.createdAt));

  return (
    <main className="stories-page">
      <header className="stories-header">
        <div className="site-shell stories-nav">
          <Link className="portal-brand" href="/">
            <Image src="/media/logo-luzeiros.jpg" alt="" width={46} height={46} />
            <span><strong>Luzeiros</strong><small>Clube de Desbravadores</small></span>
          </Link>
          <Link className="stories-back" href="/#memorias"><ArrowLeft size={17}/> Voltar às memórias</Link>
        </div>
      </header>

      <section className="site-shell stories-content">
        <div className="stories-intro">
          <span><MessageSquareText size={16}/> Vozes da comunidade</span>
          <h1>Histórias que continuam iluminando.</h1>
          <p>Relatos enviados pela comunidade e publicados após a revisão da equipe Luzeiros.</p>
        </div>

        {stories.length > 0 ? (
          <div className="stories-grid">
            {stories.map((story) => (
              <article className="story-card" key={story.id}>
                <small>Relato · {story.author}</small>
                <h2>{story.title}</h2>
                <p>{story.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="stories-empty">
            <MessageSquareText size={28}/>
            <h2>Os próximos relatos aparecerão aqui.</h2>
            <p>Ainda não há histórias aprovadas para exibição.</p>
          </div>
        )}
      </section>
    </main>
  );
}
