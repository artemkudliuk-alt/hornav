import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { sampleVessels, sampleLeads, sampleBranches } from "./mock-data";

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("user:password") || dbUrl.includes("localhost/danamira") || !dbUrl.startsWith("postgresql://")) {
    return;
  }

  if (isInitialized) return;

  try {
    const sql = neon(dbUrl);

    // 1. Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'editor',
        telegram_chat_id VARCHAR(64),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vessels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(64) NOT NULL DEFAULT 'bulk_carrier',
        status VARCHAR(64) NOT NULL DEFAULT 'available',
        imo_number VARCHAR(16) NOT NULL UNIQUE,
        flag VARCHAR(64) NOT NULL,
        call_sign VARCHAR(32),
        built_year INTEGER NOT NULL,
        classification_society VARCHAR(64) NOT NULL,
        dwt_tonnage NUMERIC(12,2) NOT NULL,
        grt_tonnage NUMERIC(12,2) NOT NULL,
        nrt_tonnage NUMERIC(12,2) NOT NULL,
        length_overall_m NUMERIC(8,2) NOT NULL,
        beam_m NUMERIC(8,2) NOT NULL,
        depth_m NUMERIC(8,2) NOT NULL,
        summer_draft_m NUMERIC(8,2) NOT NULL,
        holds_count INTEGER NOT NULL DEFAULT 1,
        hatches_count INTEGER NOT NULL DEFAULT 1,
        grain_capacity_cbm NUMERIC(12,2),
        bale_capacity_cbm NUMERIC(12,2),
        main_engine_model VARCHAR(128),
        main_engine_power_kw NUMERIC(10,2),
        generators VARCHAR(255),
        bow_thruster BOOLEAN DEFAULT FALSE,
        description JSONB,
        pdf_ga_plan_url TEXT,
        cover_image_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vessel_media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vessel_id UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
        type VARCHAR(32) NOT NULL DEFAULT 'photo',
        url TEXT NOT NULL,
        title VARCHAR(255),
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        client_email VARCHAR(255),
        client_phone VARCHAR(64),
        whatsapp VARCHAR(64),
        telegram VARCHAR(64),
        vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
        target_vessel_name VARCHAR(255),
        loading_port VARCHAR(255),
        discharge_port VARCHAR(255),
        cargo_type VARCHAR(64),
        cargo_volume VARCHAR(128),
        comment TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'new',
        source VARCHAR(64) DEFAULT 'contacts_page',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(255) NOT NULL UNIQUE,
        title JSONB NOT NULL,
        content JSONB NOT NULL,
        meta_description JSONB,
        status VARCHAR(32) NOT NULL DEFAULT 'published',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS branch_offices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        city VARCHAR(128) NOT NULL,
        country VARCHAR(128) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        email VARCHAR(255),
        is_headquarters BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS system_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(255) DEFAULT 'DANAMIRA SHIPPING LTD',
        lead_notification_emails TEXT,
        email_sender_name VARCHAR(255),
        default_currency VARCHAR(8) DEFAULT 'USD',
        timezone VARCHAR(64) DEFAULT 'Europe/Athens',
        auto_reply_subject VARCHAR(255),
        auto_reply_message TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 2. Check if admin user exists, if not seed defaults
    const existingUsers = await sql`SELECT id FROM users LIMIT 1`;
    if (existingUsers.length === 0) {
      const adminHash = await bcrypt.hash("AdminPassword123!", 10);
      const managerHash = await bcrypt.hash("ManagerPassword123!", 10);

      await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Danamira SuperAdmin', 'admin@danamirashipping.com', ${adminHash}, 'admin')
        ON CONFLICT DO NOTHING;
      `;

      await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Fleet Operations Manager', 'manager@danamirashipping.com', ${managerHash}, 'manager')
        ON CONFLICT DO NOTHING;
      `;

      // Seed vessels
      for (const v of sampleVessels) {
        await sql`
          INSERT INTO vessels (
            id, name, type, status, imo_number, flag, call_sign, built_year,
            classification_society, dwt_tonnage, grt_tonnage, nrt_tonnage,
            length_overall_m, beam_m, depth_m, summer_draft_m, holds_count, hatches_count,
            grain_capacity_cbm, main_engine_model, main_engine_power_kw, generators,
            bow_thruster, description, pdf_ga_plan_url, cover_image_url
          ) VALUES (
            ${v.id}, ${v.name}, ${v.type}, ${v.status}, ${v.imoNumber}, ${v.flag}, ${v.callSign}, ${v.builtYear},
            ${v.classificationSociety}, ${v.dwtTonnage}, ${v.grtTonnage}, ${v.nrtTonnage},
            ${v.lengthOverallM}, ${v.beamM}, ${v.depthM}, ${v.summerDraftM}, ${v.holdsCount}, ${v.hatchesCount},
            ${v.grainCapacityCbm}, ${v.mainEngineModel}, ${v.mainEnginePowerKw}, ${v.generators},
            ${v.bowThruster}, ${JSON.stringify(v.description)}, ${v.pdfGaPlanUrl}, ${v.coverImageUrl}
          ) ON CONFLICT DO NOTHING;
        `;
      }

      // Seed branches
      for (const b of sampleBranches) {
        await sql`
          INSERT INTO branch_offices (
            id, city, country, address, phone, email, is_headquarters, sort_order
          ) VALUES (
            ${b.id}, ${b.city}, ${b.country}, ${b.address}, ${b.phone}, ${b.email}, ${b.isHeadquarters}, ${b.sortOrder}
          ) ON CONFLICT DO NOTHING;
        `;
      }

      // Seed sample leads
      for (const l of sampleLeads) {
        await sql`
          INSERT INTO leads (
            id, client_name, company, client_email, client_phone, whatsapp, telegram,
            target_vessel_name, loading_port, discharge_port, cargo_type, cargo_volume,
            comment, status, source
          ) VALUES (
            ${l.id}, ${l.clientName}, ${l.company}, ${l.clientEmail}, ${l.clientPhone}, ${l.whatsapp}, ${l.telegram},
            ${l.targetVesselName}, ${l.loadingPort}, ${l.dischargePort}, ${l.cargoType}, ${l.cargoVolume},
            ${l.comment}, ${l.status}, ${l.source}
          ) ON CONFLICT DO NOTHING;
        `;
      }
    }

    isInitialized = true;
    console.log("✅ PostgreSQL schema and defaults verified and synchronized.");
  } catch (err) {
    console.error("Failed to auto-initialize database:", err);
  }
}
