import Image from "next/image";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { submissions, users } from "../db/schema";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Compass,
  ExternalLink,
  Flag,
  Heart,
  LockKeyhole,
  MapPin,
  Menu,
  Music2,
  ShieldCheck,
  Sparkles,
  Star,
  TentTree,
  Users,
} from "lucide-react";

const clubProfileUrl = "https://desbravai.com.br/clube/mg/contagem/luzeiros";
const participationWhatsappUrl = `https://wa.me/553194709446?text=${encodeURIComponent("Olá! Gostaria de saber como participar do Clube Luzeiros. Vim pelo site!")}`;

const gallery = [
  {
    src: "/media/cerimonia-evento.webp",
    alt: "Grupo do Clube Luzeiros reunido em uma celebração do Dia Mundial dos Desbravadores",
    eyebrow: "Celebração",
    title: "Uma história vivida em conjunto",
    href: "https://www.instagram.com/luzeiros.amc/p/DdeY6-Sv7W3/",
    className: "memory-card memory-card--tall memory-card--celebration",
  },
  {
    src: "/media/atividade-grupo.webp",
    alt: "Fanfarra do Clube Luzeiros em atividade ao ar livre",
    eyebrow: "Fanfarra",
    title: "Disciplina que encontra ritmo",
    href: "https://www.instagram.com/luzeiros.amc/p/Depwm-6n1lX/",
    className: "memory-card memory-card--wide",
  },
  {
    src: "/media/42-anos.webp",
    alt: "Encontro comemorativo dos 42 anos do Clube Luzeiros",
    eyebrow: "42 anos",
    title: "Gerações que deixam sua luz",
    href: "https://www.instagram.com/luzeiros.amc/p/DZ5bWlzHMBM/",
    className: "memory-card memory-card--anniversary",
  },
  {
    src: "/media/comunidade-luzeiros.webp",
    alt: "Cerimônia de formação de um novo líder do Clube Luzeiros",
    eyebrow: "Formatura",
    title: "Uma nova liderança começa aqui",
    href: "https://www.instagram.com/luzeiros.amc/p/DdlsclNHEzY/",
    className: "memory-card memory-card--leadership",
  },
];

const activities = [
  {
    icon: TentTree,
    number: "01",
    title: "Aventura ao ar livre",
    description:
      "Acampamentos, desafios e experiências que ensinam autonomia, cuidado e trabalho em equipe.",
    href: "https://www.instagram.com/p/DZgEPc9vqaA/",
  },
  {
    icon: Music2,
    number: "02",
    title: "Fanfarra",
    description:
      "Ritmo, presença e disciplina em uma das tradições que movimentam a vida do clube.",
    href: "https://www.instagram.com/p/Depwm-6n1lX/?img_index=4",
  },
  {
    icon: Compass,
    number: "03",
    title: "Classes e especialidades",
    description:
      "Aprendizado prático para desenvolver habilidades, curiosidade e responsabilidade.",
    href: "https://www.instagram.com/stories/highlights/18352995976026850/",
  },
  {
    icon: Heart,
    number: "04",
    title: "Fé e serviço",
    description:
      "Uma comunidade que cresce ao servir, acolher e construir vínculos que atravessam gerações.",
    href: "https://www.instagram.com/p/DIZDnKFO4tO/?img_index=6",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  // A página inicial mostra somente os três relatos aprovados mais recentes.
  // A listagem completa fica em /relatos.
  const communityMemories = await getDb().select({ id: submissions.id, title: submissions.title, body: submissions.body, kind: submissions.kind, objectKey: submissions.objectKey, author: users.login, createdAt: submissions.createdAt }).from(submissions).innerJoin(users, eq(submissions.authorId, users.id)).where(and(eq(submissions.status, "approved"), eq(submissions.kind, "comment"))).orderBy(desc(submissions.createdAt)).limit(3);
  return (
    <main>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <div className="site-shell header-inner">
          <a className="brand" href="#inicio" aria-label="Luzeiros — início">
            <span className="brand-mark">
              <Image
                src="/media/logo-luzeiros.jpg"
                alt=""
                width={56}
                height={56}
                priority
              />
            </span>
            <span className="brand-copy">
              <strong>Luzeiros</strong>
              <small>Clube de Desbravadores</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#historia">Nossa história</a>
            <a href="#vida-no-clube">Vida no clube</a>
            <a href="#memorias">Memórias</a>
            <a href="#participar">Participar</a>
          </nav>

          <a className="header-portal" href="/portal">
            Portal do clube
            <ArrowUpRightIcon />
          </a>

          <details className="mobile-menu">
            <summary aria-label="Abrir menu">
              <Menu size={22} />
            </summary>
            <nav aria-label="Navegação móvel">
              <a href="#historia">Nossa história</a>
              <a href="#vida-no-clube">Vida no clube</a>
              <a href="#memorias">Memórias</a>
              <a href="#participar">Participar</a>
              <a href="/portal">Portal do clube</a>
            </nav>
          </details>
        </div>
      </header>

      <div id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
          <div className="site-shell hero-grid">
            <div className="hero-copy">
              <div className="eyebrow eyebrow--light">
                <Sparkles size={15} />
                Desde 1984 · Contagem, MG
              </div>
              <h1>
                Gerações que
                <span>aprendem.</span>
                <span>Servem.</span>
                <span className="hero-accent">Iluminam.</span>
              </h1>
              <p className="hero-lead">
                No Luzeiros, cada encontro vira descoberta, cada desafio vira
                crescimento e cada geração deixa uma memória para a próxima.
              </p>
              <div className="hero-actions">
                <a className="button button--yellow" href="#vida-no-clube">
                  Conheça o clube
                  <ArrowDownRight size={18} />
                </a>
                <a
                  className="button button--ghost"
                  href="https://www.instagram.com/luzeiros.amc/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon size={18} />
                  Acompanhe no Instagram
                </a>
              </div>
              <div className="hero-location">
                <MapPin size={18} />
                <span>
                  Bandeirantes / Flamengo
                  <small>Contagem · Minas Gerais</small>
                </span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Momentos do Clube Luzeiros">
              <div className="hero-photo hero-photo--main">
                <Image
                  src="/media/cerimonia-evento.webp"
                  alt="Integrantes do Clube Luzeiros reunidos em celebração"
                  fill
                  priority
                  sizes="(max-width: 800px) 88vw, 42vw"
                />
              </div>
              <div className="hero-photo hero-photo--small">
                <Image
                  src="/media/42-anos.webp"
                  alt="Celebração dos 42 anos do Clube Luzeiros"
                  fill
                  sizes="(max-width: 800px) 42vw, 18vw"
                />
              </div>
              <div className="hero-stamp" aria-label="42 anos de história">
                <Star size={18} fill="currentColor" />
                <strong>42</strong>
                <span>anos de história</span>
              </div>
              <div className="hero-note">
                <span className="hero-note-line" />
                <p>O melhor lugar para crescer e criar memórias.</p>
              </div>
            </div>
          </div>
          <div className="hero-marquee" aria-hidden="true">
            <div>
              <span>AMIZADE</span><Star size={18} fill="currentColor" />
              <span>AVENTURA</span><Star size={18} fill="currentColor" />
              <span>FÉ</span><Star size={18} fill="currentColor" />
              <span>SERVIÇO</span><Star size={18} fill="currentColor" />
              <span>MEMÓRIAS</span><Star size={18} fill="currentColor" />
            </div>
          </div>
        </section>

        <section className="story section" id="historia">
          <div className="site-shell story-grid">
            <div className="section-intro">
              <div className="eyebrow">
                <Flag size={15} />
                Nossa história
              </div>
              <h2>Uma luz acesa em 1984. Um caminho que continua.</h2>
            </div>

            <div className="story-body">
              <p className="story-lead">
                A história começou depois de um congresso conduzido pelo pastor
                Dirceu Prates. Inspiradas pelo que viram, Lourdes e Vanete
                decidiram criar um clube na igreja de Bandeirantes.
              </p>
              <p>
                Em uma noite de maio, o nome “Luzeiros” surgiu sob um céu
                estrelado. A inauguração aconteceu em 22 de junho de 1984, com 25
                juvenis uniformizados. No mês seguinte, o grupo já participava do
                seu primeiro campori, em Divinópolis.
              </p>
              <a
                className="text-link"
                href={clubProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ler o histórico do clube
                <ArrowRight size={18} />
              </a>
            </div>

            <div className="timeline" aria-label="Linha do tempo do Luzeiros">
              <article>
                <span className="timeline-year">1984</span>
                <div>
                  <h3>Fundação</h3>
                  <p>25 juvenis uniformizados inauguram o Luzeiros em Bandeirantes.</p>
                </div>
              </article>
              <article>
                <span className="timeline-year">JUL · 1984</span>
                <div>
                  <h3>Primeiro campori</h3>
                  <p>O clube participa do seu primeiro grande encontro, em Divinópolis.</p>
                </div>
              </article>
              <article>
                <span className="timeline-year">2026</span>
                <div>
                  <h3>42 anos iluminando</h3>
                  <p>Gerações seguem aprendendo, servindo e escrevendo novos capítulos.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="club-facts" aria-labelledby="club-facts-title">
          <div className="site-shell">
            <div className="facts-heading">
              <div>
                <div className="eyebrow">
                  <Star size={15} fill="currentColor" />
                  Luzeiros hoje
                </div>
                <h2 id="club-facts-title">Uma comunidade ativa, reconhecida e de portas abertas.</h2>
              </div>
              <a
                className="text-link"
                href={clubProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver ficha atual do clube <ExternalLink size={16} />
              </a>
            </div>

            <div className="facts-grid">
              <article className="fact-card fact-card--red">
                <span className="fact-icon"><Users size={22} /></span>
                <strong>75</strong>
                <h3>Pessoas no clube</h3>
                <p>49 membros e 26 integrantes da diretoria cadastrados no portal oficial.</p>
              </article>
              <article className="fact-card fact-card--yellow">
                <span className="fact-icon"><Star size={22} fill="currentColor" /></span>
                <strong>5×</strong>
                <h3>Clube 5 Estrelas</h3>
                <p>Reconhecido em 2016 e novamente de 2022 a 2025.</p>
              </article>
              <article className="fact-card">
                <span className="fact-icon"><CalendarDays size={22} /></span>
                <strong className="fact-time">Sáb · Dom</strong>
                <h3>Dias de encontro</h3>
                <p>Sábados, das 15h às 18h; domingos, a partir das 8h.</p>
              </article>
              <article className="fact-card fact-card--photo">
                <Image
                  src="/media/grupo-luzeiros-dia-mundial.png"
                  alt="Grupo completo do Clube Luzeiros reunido no Dia Mundial dos Desbravadores"
                  fill
                  sizes="(max-width: 800px) 92vw, 25vw"
                />
                <span className="fact-photo-overlay" />
                <span className="fact-photo-copy">
                  <MapPin size={18} />
                  <span>
                    <small>Nosso endereço</small>
                    <strong>Rua dos Jesuítas, 223</strong>
                    <em>Bandeirantes · Contagem/MG</em>
                  </span>
                </span>
              </article>
            </div>
          </div>
        </section>

        <section className="activities section" id="vida-no-clube">
          <div className="site-shell">
            <div className="section-heading-row">
              <div>
                <div className="eyebrow eyebrow--light">
                  <Compass size={15} />
                  Vida no clube
                </div>
                <h2>Aprender fazendo.<br />Crescer pertencendo.</h2>
              </div>
              <p>
                Muito além de uma agenda de atividades: uma experiência que
                desenvolve habilidades, valores e vínculos para a vida toda.
              </p>
            </div>

            <div className="activity-grid">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <article className="activity-card" key={activity.number}>
                    <div className="activity-top">
                      <span>{activity.number}</span>
                      <Icon size={25} strokeWidth={1.7} />
                    </div>
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                    <a
                      className="activity-corner"
                      href={activity.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Ver ${activity.title} no Instagram`}
                    >
                      <ArrowDownRight size={20} />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="memories section" id="memorias">
          <div className="site-shell">
            <div className="section-heading-row section-heading-row--dark">
              <div>
                <div className="eyebrow">
                  <Camera size={15} />
                  Memórias Luzeiros
                </div>
                <h2>O tempo passa.<br />O que vivemos permanece.</h2>
              </div>
              <div className="memories-intro">
                <p>
                  Um lugar para reencontrar histórias, celebrar o presente e
                  guardar os capítulos que ainda estamos escrevendo.
                </p>
                <span>Seleção inicial do Instagram oficial</span>
              </div>
            </div>

            <div className="memory-grid">
              {gallery.map((item) => (
                <a
                  className={item.className}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.src}
                >
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 800px) 92vw, 45vw" />
                  <span className="memory-overlay" />
                  <span className="memory-copy">
                    <small>{item.eyebrow}</small>
                    <strong>{item.title}</strong>
                  </span>
                  <span className="memory-open" aria-label="Abrir publicação no Instagram">
                    <ExternalLink size={17} />
                  </span>
                </a>
              ))}
            </div>

            {communityMemories.length > 0 && <div className="community-memory-section"><div className="community-memory-heading"><div><span>Memórias da comunidade</span><h3>Aprovadas pela equipe Luzeiros</h3></div><a href="/relatos">Ver todos os relatos <ArrowRight size={16}/></a></div><div className="community-memory-grid">{communityMemories.map(item => <article className="community-memory-card" key={item.id}><div><small>Relato · {item.author}</small><strong>{item.title}</strong><p>{item.body}</p></div></article>)}</div></div>}

            <div className="memory-cta">
              <div className="memory-cta-icon">
                <Camera size={28} />
              </div>
              <div>
                <strong>Você também faz parte dessa memória?</strong>
                <p>
                  Pessoas cadastradas já podem enviar comentários e relatos pelo portal. O envio
                  de fotos será liberado após a ativação do armazenamento do clube.
                </p>
              </div>
              <a className="button button--dark" href="/acesso">
                Entrar no portal
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section className="participate section" id="participar">
          <div className="site-shell participate-grid">
            <div className="participate-photo">
              <Image
                src="/media/comunidade-luzeiros.webp"
                alt="Cerimônia de reconhecimento no Clube Luzeiros"
                fill
                sizes="(max-width: 800px) 92vw, 44vw"
              />
              <div className="photo-badge">
                <Users size={18} />
                <span>Um clube feito por pessoas</span>
              </div>
            </div>

            <div className="participate-copy">
              <div className="eyebrow">
                <Heart size={15} />
                Faça parte
              </div>
              <h2>O próximo capítulo pode começar com você.</h2>
              <p>
                Quer conhecer o clube, conversar com a direção ou apoiar nossas
                próximas atividades? O canal oficial está aberto para você.
              </p>

              <div className="participate-options">
                <a
                  href="https://www.instagram.com/luzeiros.amc/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="option-icon"><InstagramIcon size={21} /></span>
                  <span>
                    <small>Conhecer e conversar</small>
                    <strong>@luzeiros.amc</strong>
                  </span>
                  <ChevronRight size={19} />
                </a>
                <a href="/doacoes">
                  <span className="option-icon"><Heart size={21} /></span>
                  <span>
                    <small>Apoiar o clube</small>
                    <strong>Conheça a área de doações</strong>
                  </span>
                  <ChevronRight size={19} />
                </a>
                <a
                  href={participationWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="option-icon"><CalendarDays size={21} /></span>
                  <span>
                    <small>Quero participar</small>
                    <strong>Converse com o clube pelo WhatsApp</strong>
                  </span>
                  <span className="soon-tag soon-tag--link">Acessar</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="safe-community">
          <div className="site-shell safe-grid">
            <div className="safe-title">
              <span className="safe-icon"><ShieldCheck size={28} /></span>
              <div>
                <small>Comunidade protegida</small>
                <h2>Memórias publicadas com cuidado.</h2>
              </div>
            </div>
            <ul>
              <li><Check size={17} /> Envio por usuários autenticados</li>
              <li><Check size={17} /> Revisão humana antes de aparecer no site</li>
              <li><Check size={17} /> Canal para correção ou remoção de conteúdo</li>
            </ul>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <div className="site-shell footer-main">
          <div className="footer-brand">
            <Image src="/media/logo-luzeiros.jpg" alt="Logotipo do Clube Luzeiros" width={70} height={70} />
            <div>
              <strong>Luzeiros</strong>
              <span>Clube de Desbravadores</span>
            </div>
            <p>Desde 1984, iluminando caminhos e construindo memórias.</p>
          </div>
          <div className="footer-column">
            <strong>Explore</strong>
            <a href="#historia">Nossa história</a>
            <a href="#vida-no-clube">Vida no clube</a>
            <a href="#memorias">Memórias</a>
            <a href="#participar">Participar</a>
            <a href="/doacoes">Doações</a>
          </div>
          <div className="footer-column">
            <strong>Clube</strong>
            <span>Bandeirantes / Flamengo</span>
            <span>Rua dos Jesuítas, 223 · Contagem/MG</span>
            <a href="mailto:luzeirosamc@gmail.com">luzeirosamc@gmail.com</a>
            <a href="/acesso"><LockKeyhole size={15} /> Portal do clube</a>
          </div>
          <div className="footer-social">
            <span>Siga a nossa história</span>
            <a href="https://www.instagram.com/luzeiros.amc/" target="_blank" rel="noreferrer">
              <InstagramIcon size={20} />
              @luzeiros.amc
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
        <div className="site-shell footer-bottom">
          <span>© 2026 Clube de Desbravadores Luzeiros</span>
          <span>AMC · Associação Mineira Central</span>
        </div>
      </footer>
    </main>
  );
}

function ArrowUpRightIcon() {
  return <ArrowDownRight className="arrow-up-right" size={17} />;
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
