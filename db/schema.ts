import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Fonte de verdade do banco D1. Mudanças aqui devem ser acompanhadas por uma
// nova migração em drizzle/; alterar apenas este arquivo não modifica produção.
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  login: text("login").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  birthDate: text("birth_date").notNull(),
  role: text("role", { enum: ["director", "treasurer", "media", "member", "guest"] }).notNull().default("guest"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const bankDetails = sqliteTable("bank_details", {
  // Existe uma única linha, sempre com id 1. O campo enabled funciona como o
  // interruptor público: os dados podem permanecer salvos sem aparecer no site.
  id: integer("id").primaryKey().default(1),
  pixKey: text("pix_key").notNull().default(""),
  pixType: text("pix_type").notNull().default(""),
  accountHolder: text("account_holder").notNull().default(""),
  bankName: text("bank_name").notNull().default(""),
  instructions: text("instructions").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
  updatedBy: text("updated_by").references(() => users.id),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const donationReports = sqliteTable("donation_reports", {
  // Um relato de doação não comprova a transferência; a tesouraria ainda deve
  // classificá-lo como confirmed ou not_found pelo painel.
  id: text("id").primaryKey(),
  donorName: text("donor_name"),
  donorUserId: text("donor_user_id").references(() => users.id, { onDelete: "set null" }),
  amountCents: integer("amount_cents").notNull(),
  purpose: text("purpose").notNull(),
  note: text("note").notNull().default(""),
  status: text("status", { enum: ["reported", "confirmed", "not_found"] }).notNull().default("reported"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  reviewedBy: text("reviewed_by").references(() => users.id),
  reviewedAt: text("reviewed_at"),
});

export const submissions = sqliteTable("submissions", {
  // Fotos ficam privadas no R2. objectKey só é servido pela rota de mídia
  // depois que status passa para approved.
  id: text("id").primaryKey(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["comment", "photo"] }).notNull(),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  objectKey: text("object_key"),
  mimeType: text("mime_type"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  moderationNote: text("moderation_note").notNull().default(""),
  reviewedBy: text("reviewed_by").references(() => users.id),
  reviewedAt: text("reviewed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const auditLog = sqliteTable("audit_log", {
  // Registro append-only das ações administrativas relevantes.
  id: text("id").primaryKey(),
  actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  details: text("details").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
