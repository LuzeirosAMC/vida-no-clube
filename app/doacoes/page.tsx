import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Backpack,
  HeartHandshake,
  Camera,
  Music2,
  ShieldCheck,
  Sparkles,
  TentTree,
} from "lucide-react";
import { DonationReport } from "./donation-report";
import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { bankDetails } from "../../db/schema";

export const dynamic = "force-dynamic";

const whatsappUrl = `https://wa.me/553194709446?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre as doações!(Vim pelo site! 🤭)")}`;

const destinations = [
  {
    icon: TentTree,
    title: "Acampamentos e eventos",
    text: "Transporte, inscrições e estrutura para experiências que marcam a caminhada dos desbravadores.",
  },
  {
    icon: Music2,
    title: "Fanfarra e atividades",
    text: "Manutenção de instrumentos, materiais e recursos usados nas atividades regulares do clube.",
  },
  {
    icon: Backpack,
    title: "Apoio aos membros",
    text: "Ajuda para que nenhuma criança deixe de participar por falta de recursos essenciais.",
  },
];

export default async function DonationsPage() {
  const bank = (await getDb().select().from(bankDetails).where(eq(bankDetails.id, 1)).limit(1))[0];
  const bankAvailable = Boolean(bank?.enabled && bank.pixKey && bank.accountHolder);
  return (
    <main className="donations-page">
      <header className="donations-header">
        <div className="site-shell donations-nav">
          <Link href="/" className="donations-back">
            <ArrowLeft size={18} />
            Voltar ao site
          </Link>
          <Link href="/" className="donations-brand" aria-label="Luzeiros — início">
            <Image src="/media/logo-luzeiros.jpg" alt="" width={46} height={46} />
            <span><strong>Luzeiros</strong><small>Clube de Desbravadores</small></span>
          </Link>
          <a
            className="donations-instagram"
            href="https://www.instagram.com/luzeiros.amc/"
            target="_blank"
            rel="noreferrer"
          >
            <Camera size={17} /> @luzeiros.amc
          </a>
        </div>
      </header>

      <section className="donations-hero">
        <div className="site-shell donations-hero-grid">
          <div className="donations-copy">
            <div className="eyebrow"><HeartHandshake size={16} /> Apoie o Luzeiros</div>
            <h1>Ajude novas histórias a <span>ganharem luz.</span></h1>
            <p>
              Cada contribuição fortalece atividades que desenvolvem fé, autonomia,
              disciplina e amizade. O valor é livre — o impacto é coletivo.
            </p>
            <div className="donations-trust">
              <span><ShieldCheck size={18} /> Dados conferidos pela direção</span>
              <span><BadgeCheck size={18} /> Prestação de contas</span>
            </div>
          </div>

          <aside className="donation-card" aria-labelledby="donation-card-title">
            <span className="donation-card-icon"><Sparkles size={25} /></span>
            <small>Canal oficial de contribuição</small>
            <h2 id="donation-card-title">{bankAvailable ? "Contribua por Pix" : "Doações em preparação"}</h2>
            {bankAvailable ? <div className="bank-public-data"><span>{bank.pixType || "Chave Pix"}</span><strong>{bank.pixKey}</strong><span>Titular</span><strong>{bank.accountHolder}</strong>{bank.bankName && <em>{bank.bankName}</em>}{bank.instructions && <p>{bank.instructions}</p>}</div> : <><p>A chave Pix oficial ainda será confirmada pela direção. Assim que os dados forem fornecidos, este cartão será liberado.</p><div className="donation-pending"><span /> Aguardando os dados oficiais</div></>}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="button button--yellow donation-contact"
            >
              Falar com o clube <ArrowRight size={18} />
            </a>
            <DonationReport />
            <em>Nunca faça transferências para dados enviados por perfis não oficiais.</em>
          </aside>
        </div>
      </section>

      <section className="donation-destinations">
        <div className="site-shell">
          <div className="donation-section-heading">
            <div>
              <small>Onde sua ajuda chega</small>
              <h2>Um apoio que vira experiência.</h2>
            </div>
            <p>Os recursos serão direcionados às necessidades do clube e acompanhados pela liderança responsável.</p>
          </div>
          <div className="donation-destination-grid">
            {destinations.map(({ icon: Icon, title, text }, index) => (
              <article key={title}>
                <span className="donation-number">0{index + 1}</span>
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="donation-transparency">
        <div className="site-shell donation-transparency-inner">
          <span className="donation-transparency-icon"><ShieldCheck size={30} /></span>
          <div>
            <small>Compromisso com a comunidade</small>
            <h2>Clareza em cada contribuição.</h2>
          </div>
          <p>
            Os dados publicados são controlados pela direção e podem ser atualizados pela
            tesouraria. Dúvidas podem ser encaminhadas pelo WhatsApp oficial.
          </p>
        </div>
      </section>
    </main>
  );
}
