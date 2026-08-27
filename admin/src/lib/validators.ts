import { z } from "zod";

// ─── Multilingual String Schema ──────────────────────────────
export const i18nStringSchema = z.object({
  en: z.string().default(""),
  ua: z.string().default(""),
  ru: z.string().default(""),
});

export type I18nString = z.infer<typeof i18nStringSchema>;

// ─── Auth Schemas ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager", "editor"]).default("editor"),
  telegramChatId: z.string().optional(),
});

export const userUpdateSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["admin", "manager", "editor"]).optional(),
  telegramChatId: z.string().nullable().optional(),
});

// ─── Vessel Schemas ───────────────────────────────────────────
export const vesselTypeEnumSchema = z.enum([
  "container",
  "bulk_carrier",
  "tanker",
  "roro",
  "barge",
  "tug",
]);

export const vesselStatusEnumSchema = z.enum([
  "available",
  "in_transit",
  "chartered",
  "maintenance",
]);

export const vesselFormSchema = z.object({
  imoNumber: z.string().max(20).optional().nullable().or(z.literal("")),
  name: i18nStringSchema.refine((val) => val.en.trim().length > 0, {
    message: "English vessel name is required",
    path: ["en"],
  }),
  type: vesselTypeEnumSchema.default("bulk_carrier"),
  status: vesselStatusEnumSchema.default("available"),
  charterRateUsd: z.coerce.number().min(0).optional().nullable(),
  salePriceUsd: z.coerce.number().min(0).optional().nullable(),
  priceOnRequest: z.boolean().default(false),
  currentLocation: z.string().max(255).optional().nullable().or(z.literal("")),
  tradingArea: z.string().max(255).optional().nullable().or(z.literal("")),

  // Technical specifications
  dwt: z.coerce.number().int().min(0).optional().nullable(),
  teu: z.coerce.number().int().min(0).optional().nullable(),
  cubicCapacity: z.coerce.number().min(0).optional().nullable(),
  yearBuilt: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  flag: z.string().max(100).optional().nullable().or(z.literal("")),
  loa: z.coerce.number().min(0).optional().nullable(),
  beam: z.coerce.number().min(0).optional().nullable(),
  draft: z.coerce.number().min(0).optional().nullable(),
  maxSpeed: z.coerce.number().min(0).optional().nullable(),
  ecoSpeed: z.coerce.number().min(0).optional().nullable(),
  classSociety: z.string().max(100).optional().nullable().or(z.literal("")),

  // Content
  description: i18nStringSchema.optional().nullable(),
  deckEquipment: i18nStringSchema.optional().nullable(),
  coverImageUrl: z.string().optional().nullable().or(z.literal("")),
});

export type VesselFormData = z.infer<typeof vesselFormSchema>;

// ─── Lead Schemas ─────────────────────────────────────────────
export const leadStatusEnumSchema = z.enum([
  "new",
  "in_progress",
  "completed",
  "declined",
]);

export const cargoTypeEnumSchema = z.enum([
  "bulk",
  "container",
  "liquid",
  "breakbulk",
]);

export const leadCreateSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientPhone: z.string().max(64).optional().nullable().or(z.literal("")),
  phone: z.string().max(64).optional().nullable().or(z.literal("")),
  clientEmail: z.string().email("Valid email required").optional().nullable().or(z.literal("")),
  email: z.string().email("Valid email required").optional().nullable().or(z.literal("")),
  clientWhatsapp: z.string().max(64).optional().nullable().or(z.literal("")),
  clientTelegram: z.string().max(64).optional().nullable().or(z.literal("")),
  loadingPort: z.string().max(255).optional().nullable().or(z.literal("")),
  dischargePort: z.string().max(255).optional().nullable().or(z.literal("")),
  cargoType: cargoTypeEnumSchema.optional().nullable(),
  cargoVolume: z.string().max(128).optional().nullable().or(z.literal("")),
  vesselId: z.string().optional().nullable().or(z.literal("")),
  comment: z.string().optional().nullable().or(z.literal("")),
  message: z.string().optional().nullable().or(z.literal("")),
  sourcePage: z.string().max(512).optional().nullable().or(z.literal("")),
});

export const leadUpdateStatusSchema = z.object({
  status: leadStatusEnumSchema,
  assignedTo: z.string().uuid().optional().nullable(),
  comment: z.string().optional().nullable(),
});

// ─── Page Schemas ─────────────────────────────────────────────
export const pageStatusEnumSchema = z.enum(["draft", "published"]);

export const pageFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  status: pageStatusEnumSchema.default("draft"),
  title: i18nStringSchema.refine((val) => val.en.trim().length > 0, {
    message: "English title is required",
    path: ["en"],
  }),
  metaDescription: i18nStringSchema.optional().nullable(),
  ogImage: i18nStringSchema.optional().nullable(),
  content: i18nStringSchema.default({ en: "", ua: "", ru: "" }),
});

export type PageFormData = z.infer<typeof pageFormSchema>;

// ─── Contacts & Branch Schemas ────────────────────────────────
export const companyContactsSchema = z.object({
  hotlinePhone: z.string().max(64).optional().nullable(),
  generalEmail: z.string().email().optional().nullable(),
  telegram: z.string().max(128).optional().nullable(),
  whatsapp: z.string().max(64).optional().nullable(),
});

export const branchOfficeFormSchema = z.object({
  name: z.string().min(2, "Office name is required"),
  portCity: z.string().min(2, "Port / City is required"),
  country: z.string().min(2, "Country is required"),
  address: z.string().optional().nullable(),
  phone: z.string().max(64).optional().nullable(),
  email: z.string().email().optional().nullable(),
  agentName: z.string().max(255).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export type BranchOfficeFormData = z.infer<typeof branchOfficeFormSchema>;
