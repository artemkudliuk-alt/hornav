import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;
console.log("Connecting to:", dbUrl ? dbUrl.replace(/:[^:@]+@/, ":***@") : "NO URL");

const sql = neon(dbUrl);

const MOLPADIA_ID = "11111111-1111-1111-1111-111111111111";
const METANIRA_ID = "22222222-2222-2222-2222-222222222222";

async function main() {
  console.log("Seeding MV MOLPADIA...");
  await sql`
    INSERT INTO vessels (
      id, name, type, status, imo_number, flag,
      year_built, class_society, dwt, loa, beam, draft,
      cubic_capacity, charter_rate_usd, sale_price_usd, price_on_request,
      current_location, trading_area, description, deck_equipment, cover_image_url
    ) VALUES (
      ${MOLPADIA_ID},
      ${JSON.stringify({ en: "MV MOLPADIA", ua: "Т/Х МОЛПАДІЯ", ru: "Т/Х МОЛПАДИЯ" })},
      'bulk_carrier', 'available', '9613616', 'Antigua & Barbuda',
      2014, 'DNV', 6408, 108.20, 18.20, 6.70,
      8950.00, 8200.00, 5900000.00, false,
      'Mediterranean / Black Sea', 'Mediterranean, Black Sea, Continent, Baltic',
      ${JSON.stringify({
        en: "Modern general cargo vessel built in 2014, 6,408 DWT with 2 Holds / 2 Hatches (2HO/2HA). Geared with 2x 30MT cranes. Fully equipped for agricultural bulk, steel products, project cargo, and solid fertilizers.",
        ua: "Сучасне судно генеральних вантажів 2014 року побудови, дедвейт 6,408 MT, 2 трюми / 2 люки (2HO/2HA), крани 2x 30 MT.",
        ru: "Современное судно генеральных грузов 2014 года постройки, дедвейт 6,408 MT, 2 трюма / 2 люка (2HO/2HA), краны 2x 30 MT."
      })},
      ${JSON.stringify({
        en: "2x 30MT SWL Electro-Hydraulic Cranes, hydraulic folding hatch covers (2HO/2HA)",
        ua: "2x 30MT електрогідравлічні крани, гідравлічні люкові закриття (2HO/2HA)",
        ru: "2x 30MT электрогидравлические краны, гидравлические люковые закрытия (2HO/2HA)"
      })},
      '/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg'
    ) ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      cover_image_url = EXCLUDED.cover_image_url,
      imo_number = EXCLUDED.imo_number,
      dwt = EXCLUDED.dwt,
      loa = EXCLUDED.loa,
      beam = EXCLUDED.beam,
      draft = EXCLUDED.draft,
      year_built = EXCLUDED.year_built,
      class_society = EXCLUDED.class_society,
      description = EXCLUDED.description,
      deck_equipment = EXCLUDED.deck_equipment;
  `;

  const molpadiaMedia = [
    { url: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg", type: "photo", filename: "MV_MOLPADIA__PHOTO.jpg", sortOrder: 0, isCover: true },
    { url: "/fleet/molpadia/Photo-1.jpg", type: "photo", filename: "Photo-1.jpg", sortOrder: 1, isCover: false },
    { url: "/fleet/molpadia/Photo-2.jpg", type: "photo", filename: "Photo-2.jpg", sortOrder: 2, isCover: false },
    { url: "/fleet/molpadia/Photo-3.jpg", type: "photo", filename: "Photo-3.jpg", sortOrder: 3, isCover: false },
    { url: "/fleet/molpadia/Photo-4.jpg", type: "photo", filename: "Photo-4.jpg", sortOrder: 4, isCover: false },
    { url: "/fleet/molpadia/Photo-5.jpg", type: "photo", filename: "Photo-5.jpg", sortOrder: 5, isCover: false },
    { url: "/fleet/molpadia/Photo-6.jpg", type: "photo", filename: "Photo-6.jpg", sortOrder: 6, isCover: false },
    { url: "/fleet/molpadia/2_GA-PLAN.pdf", type: "pdf", filename: "GA-PLAN_MV_MOLPADIA.pdf", sortOrder: 7, isCover: false },
  ];

  for (let i = 0; i < molpadiaMedia.length; i++) {
    const m = molpadiaMedia[i];
    const mId = `11111111-1111-1111-1111-${String(i + 1).padStart(12, '0')}`;
    await sql`
      INSERT INTO vessel_media (id, vessel_id, url, type, filename, sort_order, is_cover)
      VALUES (${mId}, ${MOLPADIA_ID}, ${m.url}, ${m.type}, ${m.filename}, ${m.sortOrder}, ${m.isCover})
      ON CONFLICT (id) DO UPDATE SET
        url = EXCLUDED.url,
        type = EXCLUDED.type,
        filename = EXCLUDED.filename,
        sort_order = EXCLUDED.sort_order,
        is_cover = EXCLUDED.is_cover;
    `;
  }

  console.log("Seeding MV METANIRA...");
  await sql`
    INSERT INTO vessels (
      id, name, type, status, imo_number, flag,
      year_built, class_society, dwt, loa, beam, draft,
      cubic_capacity, charter_rate_usd, sale_price_usd, price_on_request,
      current_location, trading_area, description, deck_equipment, cover_image_url
    ) VALUES (
      ${METANIRA_ID},
      ${JSON.stringify({ en: "MV METANIRA", ua: "Т/Х МЕТАНІРА", ru: "Т/Х МЕТАНИРА" })},
      'bulk_carrier', 'available', '9584724', 'Liberia',
      2012, 'Lloyd''s Register', 7200, 111.40, 18.60, 6.95,
      9650.00, 8700.00, 6400000.00, false,
      'Port of Motril, Spain', 'Mediterranean, Black Sea, Continent, West Africa',
      ${JSON.stringify({
        en: "Geared dry bulk and general cargo carrier, 7,200 DWT. Box-shaped holds with 2HO / 2HA. Equipped with 2x 30MT cranes, suitable for heavy bulk minerals, fertilizers, steel products, and grain.",
        ua: "Судно генеральних та навалювальних вантажів 7,200 DWT, 2 трюми / 2 люки, крани 2x 30 MT.",
        ru: "Судно генеральных и навалочных грузов 7,200 DWT, 2 трюма / 2 люка, краны 2x 30 MT."
      })},
      ${JSON.stringify({
        en: "2x 30MT SWL Electro-Hydraulic Cranes, hydraulic folding hatch covers (2HO/2HA)",
        ua: "2x 30MT крани, гідравлічні люкові закриття",
        ru: "2x 30MT краны, гидравлические люковые закрытия"
      })},
      '/fleet/metanira/PHOTO__MV_METANIRA.JPG'
    ) ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      cover_image_url = EXCLUDED.cover_image_url,
      imo_number = EXCLUDED.imo_number,
      dwt = EXCLUDED.dwt,
      loa = EXCLUDED.loa,
      beam = EXCLUDED.beam,
      draft = EXCLUDED.draft,
      year_built = EXCLUDED.year_built,
      class_society = EXCLUDED.class_society,
      description = EXCLUDED.description,
      deck_equipment = EXCLUDED.deck_equipment;
  `;

  const metaniraMedia = [
    { url: "/fleet/metanira/PHOTO__MV_METANIRA.JPG", type: "photo", filename: "PHOTO__MV_METANIRA.JPG", sortOrder: 0, isCover: true },
    { url: "/fleet/metanira/IMG_3293_800_600.JPG", type: "photo", filename: "Deck_Port_View.JPG", sortOrder: 1, isCover: false },
    { url: "/fleet/metanira/IMG_3300_800_600.JPG", type: "photo", filename: "Cranes_Structure.JPG", sortOrder: 2, isCover: false },
    { url: "/fleet/metanira/IMG_3305_800_600.JPG", type: "photo", filename: "Cargo_Hold_Overview.JPG", sortOrder: 3, isCover: false },
    { url: "/fleet/metanira/IMG_3310_800_600.JPG", type: "photo", filename: "Bow_Profile.JPG", sortOrder: 4, isCover: false },
    { url: "/fleet/metanira/IMG_3318_800_600.JPG", type: "photo", filename: "Bridge_Nav_Deck.JPG", sortOrder: 5, isCover: false },
    { url: "/fleet/metanira/1_GA_PLAN.pdf", type: "pdf", filename: "GA-PLAN_MV_METANIRA.pdf", sortOrder: 6, isCover: false },
    { url: "/fleet/metanira/Vessel_Description__METANIRA.png", type: "photo", filename: "Vessel_Description__METANIRA.png", sortOrder: 7, isCover: false },
  ];

  for (let i = 0; i < metaniraMedia.length; i++) {
    const m = metaniraMedia[i];
    const mId = `22222222-2222-2222-2222-${String(i + 1).padStart(12, '0')}`;
    await sql`
      INSERT INTO vessel_media (id, vessel_id, url, type, filename, sort_order, is_cover)
      VALUES (${mId}, ${METANIRA_ID}, ${m.url}, ${m.type}, ${m.filename}, ${m.sortOrder}, ${m.isCover})
      ON CONFLICT (id) DO UPDATE SET
        url = EXCLUDED.url,
        type = EXCLUDED.type,
        filename = EXCLUDED.filename,
        sort_order = EXCLUDED.sort_order,
        is_cover = EXCLUDED.is_cover;
    `;
  }

  // Remove test vessel if exists
  await sql`DELETE FROM vessels WHERE imo_number = '9887766' OR name->>'en' = 'test';`;

  const allVessels = await sql`SELECT id, imo_number, name->>'en' as en_name FROM vessels;`;
  console.log("✅ Current vessels in Neon DB:", allVessels);

  const allMedia = await sql`SELECT id, vessel_id, url, filename, type FROM vessel_media;`;
  console.log("✅ Total media rows in Neon DB:", allMedia.length);
}

main().catch(console.error);
