import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import {
  ArrowLeft,
  Bell,
  Check,
  CircleUserRound,
  FileClock,
  FileImage,
  Gauge,
  Images,
  Info,
  LockKeyhole,
  MessageSquareText,
  Plus,
  Settings,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";
import { canAccessDashboard, getSiteUser } from "../../lib/site-auth";
import { canManageDonations, canModerate, isMinor } from "../../lib/site-auth";
import { getDb } from "../../db";
import { bankDetails, donationReports, submissions, users } from "../../db/schema";
import { BankForm, DonationActions, ModerationActions, RoleSelector } from "./dashboard-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal do clube",
  description: "Área privada de conteúdo e moderação do Clube Luzeiros.",
};

const recentContent = [
  {
    image: "/media/cerimonia-evento.webp",
    title: "Dia Mundial dos Desbravadores",
    meta: "Importado do Instagram · coleção inicial",
    state: "Publicado",
  },
  {
    image: "/media/atividade-grupo.webp",
    title: "Ensaio e atividade da fanfarra",
    meta: "Importado do Instagram · coleção inicial",
    state: "Publicado",
  },
  {
    image: "/media/42-anos.webp",
    title: "42 anos do Clube Luzeiros",
    meta: "Importado do Instagram · coleção inicial",
    state: "Publicado",
  },
];

export default async function PortalPage() {
  const user = await getSiteUser();
  if (!user) redirect("/acesso");
  if (!canAccessDashboard(user.role)) redirect("/minha-conta");
  const roleNames = { director: "Diretor", treasurer: "Tesoureiro", media: "Mídia", member: "Membro", guest: "Convidado" };
  const db = getDb();
  const moderationRows = canModerate(user.role) ? await db.select({ id: submissions.id, title: submissions.title, body: submissions.body, kind: submissions.kind, status: submissions.status, createdAt: submissions.createdAt, author: users.login, birthDate: users.birthDate }).from(submissions).innerJoin(users, eq(submissions.authorId, users.id)).orderBy(desc(submissions.createdAt)).limit(30) : [];
  const donationRows = canManageDonations(user.role) ? await db.select().from(donationReports).orderBy(desc(donationReports.createdAt)).limit(50) : [];
  const people = user.role === "director" ? await db.select({ id: users.id, login: users.login, role: users.role, birthDate: users.birthDate, active: users.active }).from(users).orderBy(desc(users.createdAt)).limit(100) : [];
  const bank = canManageDonations(user.role) ? (await db.select().from(bankDetails).where(eq(bankDetails.id, 1)).limit(1))[0] : undefined;
  const pendingModeration = moderationRows.filter((item) => item.status === "pending").length;
  const reportedDonations = donationRows.filter((item) => item.status === "reported").length;

  return (
    <main className="portal-shell">
      <div className="portal-layout">
        <aside className="portal-sidebar">
          <Link className="portal-brand" href="/">
            <Image src="/media/logo-luzeiros.jpg" alt="" width={42} height={42} />
            <span>
              <strong>Luzeiros</strong>
              <small>Portal do clube</small>
            </span>
          </Link>

          <div className="portal-role">
            <small>{roleNames[user.role]}</small>
            <strong>{user.login}</strong>
          </div>

          <nav className="portal-nav" aria-label="Navegação do portal">
            <a className="is-active" href="#visao-geral"><Gauge size={17} /> Visão geral</a>
            <a href="#conteudos"><Images size={17} /> Conteúdos</a>
            <a href="#revisao"><FileClock size={17} /> Fila de revisão</a>
            <a href="#pessoas"><UsersRound size={17} /> Pessoas e cargos</a>
            <a href="#configuracoes"><Settings size={17} /> Configurações</a>
          </nav>

          <Link className="portal-back" href="/">
            <ArrowLeft size={16} /> Voltar ao site
          </Link>
        </aside>

        <section className="portal-main" id="visao-geral">
          <header className="portal-topbar">
            <div>
              <h1>Visão geral</h1>
              <p>Painel de gestão do Clube de Desbravadores Luzeiros.</p>
            </div>
            <div className="portal-actions">
              <span className="portal-status">Acesso protegido</span>
              <a className="portal-button" href="#revisao" aria-label="Ver itens aguardando revisão">
                <Bell size={16} />
              </a>
              <a className="portal-button portal-button--primary" href="/minha-conta">
                <Plus size={16} /> Novo conteúdo
              </a>
            </div>
          </header>

          <div className="portal-summary-grid">
            <SummaryCard icon={FileImage} label="Coleção inicial" value="6" detail="mídias selecionadas" />
            <SummaryCard icon={FileClock} label="Aguardando revisão" value={String(pendingModeration)} detail="fotos e comentários" />
            <SummaryCard icon={UsersRound} label="Pessoas cadastradas" value={String(people.length || "—")} detail="visível conforme o cargo" />
            <SummaryCard icon={MessageSquareText} label="Doações informadas" value={String(reportedDonations)} detail="aguardando conferência" />
          </div>

          <div className="portal-grid">
            <div>
              <section className="portal-panel" id="conteudos">
                <div className="portal-panel-header">
                  <h2>Conteúdos recentes</h2>
                  <a href="https://www.instagram.com/luzeiros.amc/" target="_blank" rel="noreferrer">
                    Ver origem
                  </a>
                </div>
                <div className="content-list">
                  {recentContent.map((content) => (
                    <article className="content-row" key={content.title}>
                      <div className="content-thumb">
                        <Image src={content.image} alt="" fill sizes="54px" />
                      </div>
                      <div>
                        <strong>{content.title}</strong>
                        <small>{content.meta}</small>
                      </div>
                      <span className={`content-state${content.state === "Em revisão" ? " content-state--review" : ""}`}>
                        {content.state}
                      </span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-card" id="pessoas">
                <div className="admin-card-top">
                  <span className="admin-card-icon"><UserCog size={20} /></span>
                  <span className="content-state content-state--review">Configuração inicial</span>
                </div>
                <h3>Administração sob sua responsabilidade</h3>
                <p>
                  Enquanto o portal estiver em construção, sua conta permanece como
                  administradora principal. A transferência futura será confirmada em etapas
                  e registrada no histórico do sistema.
                </p>
                <ul>
                  <li><Check size={15} /> Nenhuma transferência automática de cargo</li>
                  <li><Check size={15} /> Sempre haverá ao menos um administrador ativo</li>
                  <li><Check size={15} /> Ações administrativas terão registro de auditoria</li>
                </ul>
              </section>
            </div>

            <div>
              <section className="portal-panel" id="revisao">
                <div className="portal-panel-header">
                  <h2>Como a moderação funciona</h2>
                </div>
                <div className="workflow">
                  <WorkflowStep number="1" title="Usuário envia" description="Comentário ou relato entra de forma privada." />
                  <WorkflowStep number="2" title="Equipe revisa" description="Conteúdo, autoria e contexto são conferidos." />
                  <WorkflowStep number="3" title="Direção publica" description="Somente materiais aprovados ficam visíveis ao público." />
                </div>
              </section>

              <div className="portal-note">
                <Info size={18} />
                <span>
                  Contas, relatos, doações e a fila de aprovação estão conectados ao banco
                  de dados do clube. O envio de fotos será ativado após a liberação do armazenamento.
                </span>
              </div>

              <div className="portal-note" id="configuracoes">
                <ShieldCheck size={18} />
                <span>
                  Fotos de menores terão revisão de consentimento e poderão ser ocultadas
                  preventivamente quando houver pedido de remoção.
                </span>
              </div>

              <form action="/api/auth/logout" method="post">
              <button className="portal-note portal-note--button" type="submit">
                <LockKeyhole size={18} />
                <span>Sair da conta de {user.login}</span>
              </button>
              </form>
            </div>
          </div>

          <div className="dashboard-management">
            {canModerate(user.role) && <section className="portal-panel"><div className="portal-panel-header"><h2>Fila de aprovação</h2><span>{pendingModeration} pendente(s)</span></div><div className="dashboard-list">{moderationRows.length === 0 ? <p className="dashboard-empty">Nenhum conteúdo enviado.</p> : moderationRows.map(item => <article className="dashboard-row" key={item.id}><div><strong>{item.title}</strong><small>{item.kind === "photo" ? "Foto" : "Comentário"} · por {item.author} {isMinor(item.birthDate) && <b className="minor-badge">Criança</b>}</small><p>{item.body}</p></div><span className={`content-state${item.status === "pending" ? " content-state--review" : ""}`}>{item.status === "pending" ? "Em revisão" : item.status === "approved" ? "Aprovado" : "Rejeitado"}</span>{item.status === "pending" && <ModerationActions id={item.id}/>}</article>)}</div></section>}

            {canManageDonations(user.role) && <section className="portal-panel"><div className="portal-panel-header"><h2>Dados bancários</h2><span>Diretor e tesoureiro</span></div><BankForm initial={{pixKey:bank?.pixKey??"",pixType:bank?.pixType??"",accountHolder:bank?.accountHolder??"",bankName:bank?.bankName??"",instructions:bank?.instructions??"",enabled:bank?.enabled??false}}/></section>}

            {canManageDonations(user.role) && <section className="portal-panel"><div className="portal-panel-header"><h2>Entradas informadas</h2><span>{reportedDonations} aguardando</span></div><div className="dashboard-list">{donationRows.length === 0 ? <p className="dashboard-empty">Nenhuma doação informada.</p> : donationRows.map(item => <article className="dashboard-row" key={item.id}><div><strong>{(item.amountCents/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</strong><small>{item.donorName || "Doador não identificado"} · {item.purpose}</small>{item.note && <p>{item.note}</p>}</div><span className={`content-state${item.status === "reported" ? " content-state--review" : ""}`}>{item.status === "reported" ? "Informada" : item.status === "confirmed" ? "Confirmada" : "Não localizada"}</span>{item.status === "reported" && <DonationActions id={item.id}/>}</article>)}</div></section>}

            {user.role === "director" && <section className="portal-panel"><div className="portal-panel-header"><h2>Pessoas e cargos</h2><span>Somente diretor</span></div><div className="dashboard-list">{people.map(person => <article className="dashboard-row dashboard-row--person" key={person.id}><div><strong>{person.login}</strong><small>{isMinor(person.birthDate) && <b className="minor-badge">Criança</b>}</small></div><RoleSelector id={person.id} current={person.role}/></article>)}</div></section>}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof CircleUserRound;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="summary-card">
      <div className="summary-card-top">
        <small>{label}</small>
        <span className="summary-card-icon"><Icon size={18} /></span>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function WorkflowStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="workflow-step">
      <span className="workflow-number">{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
