import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "manager",
  "editor",
]);

export const vesselTypeEnum = pgEnum("vessel_type", [
  "container",
  "bulk_carrier",
  "tanker",
  "roro",
  "barge",
  "tug",
]);

export const vesselStatusEnum = pgEnum("vessel_status", [
  "available",
  "in_transit",
  "chartered",
  "maintenance",
]);

export const mediaTypeEnum = pgEnum("media_type", ["photo", "pdf"]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "in_progress",
  "completed",
  "declined",
]);

export const cargoTypeEnum = pgEnum("cargo_type", [
  "bulk",
  "container",
  "liquid",
  "breakbulk",
]);

export const pageStatusEnum = pgEnum("page_status", ["draft", "published"]);

// ─── I18n JSON Type ──────────────────────────────────────────

/**
 * Shape of multilingual JSON fields: { en: string, ua: string, ru: string }
 * Stored as JSONB in Postgres.
 */
export interface I18nField {
  en: string;
  ua: string;
  ru: string;
}

// ─── Users ───────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("editor"),
  telegramChatId: varchar("telegram_chat_id", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Vessels ─────────────────────────────────────────────────

export const vessels = pgTable("vessels", {
  id: uuid("id").primaryKey().defaultRandom(),
  imoNumber: varchar("imo_number", { length: 20 }).unique(),
  name: jsonb("name").$type<I18nField>().notNull(),
  type: vesselTypeEnum("type").notNull(),
  status: vesselStatusEnum("status").notNull().default("available"),
  charterRateUsd: decimal("charter_rate_usd", { precision: 12, scale: 2 }),
  salePriceUsd: decimal("sale_price_usd", { precision: 14, scale: 2 }),
  priceOnRequest: boolean("price_on_request").notNull().default(false),
  currentLocation: varchar("current_location", { length: 255 }),
  tradingArea: varchar("trading_area", { length: 255 }),

  // Technical specifications
  dwt: integer("dwt"),
  teu: integer("teu"),
  cubicCapacity: decimal("cubic_capacity", { precision: 10, scale: 2 }),
  yearBuilt: integer("year_built"),
  flag: varchar("flag", { length: 100 }),
  loa: decimal("loa", { precision: 8, scale: 2 }),
  beam: decimal("beam", { precision: 8, scale: 2 }),
  draft: decimal("draft", { precision: 8, scale: 2 }),
  maxSpeed: decimal("max_speed", { precision: 6, scale: 2 }),
  ecoSpeed: decimal("eco_speed", { precision: 6, scale: 2 }),
  classSociety: varchar("class_society", { length: 100 }),

  // Multilingual content
  description: jsonb("description").$type<I18nField>(),
  deckEquipment: jsonb("deck_equipment").$type<I18nField>(),

  // Cover image URL (denormalized for fast list queries)
  coverImageUrl: text("cover_image_url"),

  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Vessel Media ────────────────────────────────────────────

export const vesselMedia = pgTable("vessel_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  vesselId: uuid("vessel_id")
    .notNull()
    .references(() => vessels.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  blobKey: text("blob_key"),
  type: mediaTypeEnum("type").notNull(),
  filename: varchar("filename", { length: 512 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isCover: boolean("is_cover").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Leads ───────────────────────────────────────────────────

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: leadStatusEnum("status").notNull().default("new"),

  // Client data
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientPhone: varchar("client_phone", { length: 64 }),
  clientEmail: varchar("client_email", { length: 255 }),
  clientWhatsapp: varchar("client_whatsapp", { length: 64 }),
  clientTelegram: varchar("client_telegram", { length: 64 }),

  // Logistics data
  loadingPort: varchar("loading_port", { length: 255 }),
  dischargePort: varchar("discharge_port", { length: 255 }),
  cargoType: cargoTypeEnum("cargo_type"),
  cargoVolume: varchar("cargo_volume", { length: 128 }),

  // Relations
  vesselId: uuid("vessel_id").references(() => vessels.id, {
    onDelete: "set null",
  }),
  assignedTo: uuid("assigned_to").references(() => users.id, {
    onDelete: "set null",
  }),

  comment: text("comment"),
  sourcePage: varchar("source_page", { length: 512 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Pages ───────────────────────────────────────────────────

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 512 }).notNull().unique(),
  status: pageStatusEnum("status").notNull().default("draft"),

  title: jsonb("title").$type<I18nField>().notNull(),
  metaDescription: jsonb("meta_description").$type<I18nField>(),
  ogImage: jsonb("og_image").$type<I18nField>(),
  content: jsonb("content").$type<I18nField>().notNull(),

  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

// ─── Company Contacts ────────────────────────────────────────

export const companyContacts = pgTable("company_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  hotlinePhone: varchar("hotline_phone", { length: 64 }),
  generalEmail: varchar("general_email", { length: 255 }),
  telegram: varchar("telegram", { length: 128 }),
  whatsapp: varchar("whatsapp", { length: 64 }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Branch Offices ──────────────────────────────────────────

export const branchOffices = pgTable("branch_offices", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  portCity: varchar("port_city", { length: 255 }).notNull(),
  country: varchar("country", { length: 128 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 64 }),
  email: varchar("email", { length: 255 }),
  agentName: varchar("agent_name", { length: 255 }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
