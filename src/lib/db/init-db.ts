import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { sampleVessels, sampleLeads, sampleBranches } from "./mock-data";

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.STORAGE_URL ||
    process.env.NEON_DATABASE_URL;

  if (!dbUrl || dbUrl.includes("user:password") || dbUrl.includes("localhost/danamira") || (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://"))) {
    return;
  }

  if (isInitialized) return;

  try {
    const sql = neon(dbUrl);

    // 1. Create tables if not exist
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
        imo_number VARCHAR(20) UNIQUE,
        name JSONB NOT NULL DEFAULT '{"en":"Vessel"}',
        type VARCHAR(64) NOT NULL DEFAULT 'bulk_carrier',
        status VARCHAR(64) NOT NULL DEFAULT 'available',
        charter_rate_usd NUMERIC(12,2),
        sale_price_usd NUMERIC(14,2),
        price_on_request BOOLEAN DEFAULT FALSE,
        current_location VARCHAR(255),
        trading_area VARCHAR(255),
        dwt INTEGER,
        teu INTEGER,
        cubic_capacity NUMERIC(10,2),
        year_built INTEGER,
        flag VARCHAR(100),
        loa NUMERIC(8,2),
        beam NUMERIC(8,2),
        draft NUMERIC(8,2),
        max_speed NUMERIC(6,2),
        eco_speed NUMERIC(6,2),
        class_society VARCHAR(100),
        description JSONB,
        deck_equipment JSONB,
        cover_image_url TEXT,
        created_by UUID,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vessel_media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vessel_id UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        blob_key TEXT,
        type VARCHAR(32) NOT NULL DEFAULT 'photo',
        filename VARCHAR(512),
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_cover BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        status VARCHAR(32) NOT NULL DEFAULT 'new',
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(64),
        client_email VARCHAR(255),
        client_whatsapp VARCHAR(64),
        client_telegram VARCHAR(64),
        loading_port VARCHAR(255),
        discharge_port VARCHAR(255),
        cargo_type VARCHAR(64),
        cargo_volume VARCHAR(128),
        vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
        assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
        comment TEXT,
        source_page VARCHAR(512) DEFAULT 'Website Contact Form',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(512) NOT NULL UNIQUE,
        status VARCHAR(32) NOT NULL DEFAULT 'published',
        title JSONB NOT NULL DEFAULT '{"en":"Page"}',
        meta_description JSONB,
        og_image JSONB,
        content JSONB NOT NULL DEFAULT '{"en":""}',
        created_by UUID,
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

    // 2. Comprehensive ALTER TABLE to ensure all columns exist
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS loa NUMERIC(8,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS beam NUMERIC(8,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS draft NUMERIC(8,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS dwt INTEGER;`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS teu INTEGER;`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS cubic_capacity NUMERIC(10,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS year_built INTEGER;`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS flag VARCHAR(100);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS max_speed NUMERIC(6,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS eco_speed NUMERIC(6,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS class_society VARCHAR(100);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS description JSONB;`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS deck_equipment JSONB;`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS cover_image_url TEXT;`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS created_by UUID;`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS current_location VARCHAR(255);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS trading_area VARCHAR(255);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS charter_rate_usd NUMERIC(12,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS sale_price_usd NUMERIC(14,2);`;
    await sql`ALTER TABLE vessels ADD COLUMN IF NOT EXISTS price_on_request BOOLEAN DEFAULT FALSE;`;

    await sql`ALTER TABLE pages ADD COLUMN IF NOT EXISTS og_image JSONB;`;
    await sql`ALTER TABLE pages ADD COLUMN IF NOT EXISTS meta_description JSONB;`;
    await sql`ALTER TABLE pages ADD COLUMN IF NOT EXISTS created_by UUID;`;

    await sql`ALTER TABLE vessel_media ADD COLUMN IF NOT EXISTS is_cover BOOLEAN DEFAULT FALSE;`;
    await sql`ALTER TABLE vessel_media ADD COLUMN IF NOT EXISTS blob_key TEXT;`;
    await sql`ALTER TABLE vessel_media ADD COLUMN IF NOT EXISTS filename VARCHAR(512);`;
    await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_page VARCHAR(512);`;

    // 3. Seed SuperAdmin if not exists
    const existingUsers = await sql`SELECT id FROM users LIMIT 1`;
    if (existingUsers.length === 0) {
      const adminHash = await bcrypt.hash("AdminPassword123!", 10);
      const managerHash = await bcrypt.hash("ManagerPassword123!", 10);

      await sql`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ('00000000-0000-0000-0000-000000000001', 'Danamira SuperAdmin', 'admin@danamirashipping.com', ${adminHash}, 'admin')
        ON CONFLICT DO NOTHING;
      `;

      await sql`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ('00000000-0000-0000-0000-000000000002', 'Fleet Operations Manager', 'manager@danamirashipping.com', ${managerHash}, 'manager')
        ON CONFLICT DO NOTHING;
      `;
    }

    // 4. Seed sample vessels if empty
    const existingVessels = await sql`SELECT id FROM vessels LIMIT 1`;
    if (existingVessels.length === 0) {
      for (const v of sampleVessels) {
        const vName = typeof v.name === "object" ? v.name : { en: v.name, ua: "", ru: "" };
        await sql`
          INSERT INTO vessels (
            id, name, type, status, imo_number, flag,
            year_built, class_society, dwt, loa, beam, draft,
            description, cover_image_url
          ) VALUES (
            ${v.id}, ${JSON.stringify(vName)}, ${v.type || 'bulk_carrier'}, ${v.status || 'available'},
            ${v.imoNumber || '9613616'}, ${v.flag || 'Panama'}, ${v.builtYear || 2012},
            ${v.classificationSociety || 'DNV'}, ${v.dwtTonnage || 6400},
            ${v.lengthOverallM || 108.2}, ${v.beamM || 18.2}, ${v.summerDraftM || 6.7},
            ${JSON.stringify(v.description || { en: 'Bulk Carrier', ua: '', ru: '' })},
            ${v.coverImageUrl || '/ship1_screen3.png'}
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
