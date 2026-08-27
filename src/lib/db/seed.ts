import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("user:password") || dbUrl.includes("localhost/danamira")) {
    console.log("ℹ️  Skipping remote DB seed: DATABASE_URL is in local fallback mode.");
    return;
  }

  console.log("🌱 Starting Danamira Shipping CMS database seeding...");
  const sql = neon(dbUrl);
  const db = drizzle(sql, { schema });

  // 1. Seed Admin & Manager users
  const adminPasswordHash = await bcrypt.hash("AdminPassword123!", 10);
  const managerPasswordHash = await bcrypt.hash("ManagerPassword123!", 10);

  console.log("👤 Creating default admin and manager users...");
  const [adminUser] = await db
    .insert(schema.users)
    .values({
      name: "Danamira SuperAdmin",
      email: "admin@danamirashipping.com",
      passwordHash: adminPasswordHash,
      role: "admin",
    })
    .onConflictDoNothing()
    .returning();

  await db
    .insert(schema.users)
    .values({
      name: "Fleet Operations Manager",
      email: "manager@danamirashipping.com",
      passwordHash: managerPasswordHash,
      role: "manager",
    })
    .onConflictDoNothing();

  const creatorId = adminUser?.id || "00000000-0000-0000-0000-000000000001";

  // 2. Seed Real Company Contacts (Zeppou 33, Glyfada, Greece)
  console.log("🏢 Seeding company headquarters contacts...");
  await db
    .insert(schema.companyContacts)
    .values({
      hotlinePhone: "+30 211 34 56 550",
      generalEmail: "chartering@danamira-shipping.com",
      telegram: "@danamira_ops",
      whatsapp: "+30 211 34 56 550",
    })
    .onConflictDoNothing();

  // 3. Seed Regional Branch Offices
  console.log("📍 Seeding port agency branch offices...");
  await db
    .insert(schema.branchOffices)
    .values([
      {
        name: "Operational Head Office (Greek Branch)",
        portCity: "Glyfada, Athens",
        country: "Greece",
        address: "Zeppou 33, 166 75 Glyfada, Greece",
        phone: "+30 211 34 56 550",
        email: "chartering@danamira-shipping.com",
        agentName: "Capt. Operations / Law 89/1967",
        sortOrder: 1,
      },
      {
        name: "Black Sea Agency Office",
        portCity: "Odesa",
        country: "Ukraine",
        address: "Prymorska St 6, Odesa 65000",
        phone: "+380 48 7001234",
        email: "odesa@danamirashipping.com",
        agentName: "Dmitry Kovalenko",
        sortOrder: 2,
      },
      {
        name: "North Europe Commercial Office",
        portCity: "Rotterdam",
        country: "Netherlands",
        address: "Wilhelminakade 123, 3072 AP Rotterdam",
        phone: "+31 10 9876543",
        email: "rotterdam@danamirashipping.com",
        agentName: "Jan van den Berg",
        sortOrder: 3,
      },
      {
        name: "Middle East Logistics Agency",
        portCity: "Dubai",
        country: "UAE",
        address: "JAFZA One, Jebel Ali Free Zone, Dubai",
        phone: "+971 4 8812345",
        email: "dubai@danamirashipping.com",
        agentName: "Tariq Al-Mansoor",
        sortOrder: 4,
      },
    ])
    .onConflictDoNothing();

  // 4. Seed Real Vessels: MV MOLPADIA & MV METANIRA
  console.log("🚢 Seeding real fleet catalog (MV MOLPADIA & MV METANIRA)...");
  const [vessel1] = await db
    .insert(schema.vessels)
    .values({
      imoNumber: "9613616",
      name: {
        en: "MV MOLPADIA",
        ua: "Т/Х МОЛПАДІЯ",
        ru: "Т/Х МОЛПАДИЯ",
      },
      type: "bulk_carrier",
      status: "available",
      charterRateUsd: "8200.00",
      salePriceUsd: "5900000.00",
      priceOnRequest: false,
      currentLocation: "Mediterranean / Black Sea",
      tradingArea: "Mediterranean, Black Sea, Continent, Baltic",
      dwt: 6408,
      teu: 390,
      cubicCapacity: "8950.00",
      yearBuilt: 2014,
      flag: "Antigua & Barbuda",
      loa: "108.20",
      beam: "18.20",
      draft: "6.70",
      maxSpeed: "13.00",
      ecoSpeed: "11.00",
      classSociety: "DNV",
      description: {
        en: "Modern general cargo vessel built in 2014, 6,408 DWT with 2 Holds / 2 Hatches (2HO/2HA). Geared with 2x 30MT cranes. Fully equipped for agricultural bulk, steel products, project cargo, and solid fertilizers.",
        ua: "Сучасне судно генеральних вантажів 2014 року побудови, дедвейт 6,408 MT, 2 трюми / 2 люки (2HO/2HA), крани 2x 30 MT.",
        ru: "Современное судно генеральных грузов 2014 года постройки, дедвейт 6,408 MT, 2 трюма / 2 люка (2HO/2HA), краны 2x 30 MT.",
      },
      deckEquipment: {
        en: "2x 30MT SWL Electro-Hydraulic Cranes, hydraulic folding hatch covers (2HO/2HA)",
        ua: "2x 30MT електрогідравлічні крани, гідравлічні люкові закриття (2HO/2HA)",
        ru: "2x 30MT электрогидравлические краны, гидравлические люковые закрытия (2HO/2HA)",
      },
      coverImageUrl: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg",
      createdBy: creatorId,
    })
    .onConflictDoNothing()
    .returning();

  if (vessel1) {
    await db.insert(schema.vesselMedia).values([
      {
        vesselId: vessel1.id,
        url: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg",
        type: "photo",
        filename: "MV_MOLPADIA__PHOTO.jpg",
        sortOrder: 0,
        isCover: true,
      },
      {
        vesselId: vessel1.id,
        url: "/fleet/molpadia/Photo-1.jpg",
        type: "photo",
        filename: "Photo-1.jpg",
        sortOrder: 1,
        isCover: false,
      },
      {
        vesselId: vessel1.id,
        url: "/fleet/molpadia/2_GA-PLAN.pdf",
        type: "pdf",
        filename: "GA-PLAN_MV_MOLPADIA.pdf",
        sortOrder: 2,
        isCover: false,
      },
    ]);
  }

  const [vessel2] = await db
    .insert(schema.vessels)
    .values({
      imoNumber: "9584724",
      name: {
        en: "MV METANIRA",
        ua: "Т/Х МЕТАНІРА",
        ru: "Т/Х МЕТАНИРА",
      },
      type: "bulk_carrier",
      status: "available",
      charterRateUsd: "8700.00",
      salePriceUsd: "6400000.00",
      priceOnRequest: false,
      currentLocation: "Port of Motril, Spain",
      tradingArea: "Mediterranean, Black Sea, Continent, West Africa",
      dwt: 7200,
      teu: 440,
      cubicCapacity: "9650.00",
      yearBuilt: 2012,
      flag: "Liberia",
      loa: "111.40",
      beam: "18.60",
      draft: "6.95",
      maxSpeed: "13.20",
      ecoSpeed: "11.20",
      classSociety: "Lloyd's Register",
      description: {
        en: "Geared dry bulk and general cargo carrier, 7,200 DWT. Box-shaped holds with 2HO / 2HA. Equipped with 2x 30MT cranes, suitable for heavy bulk minerals, fertilizers, steel products, and grain.",
        ua: "Судно генеральних та навалювальних вантажів 7,200 DWT, 2 трюми / 2 люки, крани 2x 30 MT.",
        ru: "Судно генеральных и навалочных грузов 7,200 DWT, 2 трюма / 2 люка, краны 2x 30 MT.",
      },
      deckEquipment: {
        en: "2x 30MT SWL Electro-Hydraulic Cranes, hydraulic folding hatch covers (2HO/2HA)",
        ua: "2x 30MT крани, гідравлічні люкові закриття",
        ru: "2x 30MT краны, гидравлические люковые закрытия",
      },
      coverImageUrl: "/fleet/metanira/PHOTO__MV_METANIRA.JPG",
      createdBy: creatorId,
    })
    .onConflictDoNothing()
    .returning();

  if (vessel2) {
    await db.insert(schema.vesselMedia).values([
      {
        vesselId: vessel2.id,
        url: "/fleet/metanira/PHOTO__MV_METANIRA.JPG",
        type: "photo",
        filename: "PHOTO__MV_METANIRA.JPG",
        sortOrder: 0,
        isCover: true,
      },
      {
        vesselId: vessel2.id,
        url: "/fleet/metanira/IMG_3293_800_600.JPG",
        type: "photo",
        filename: "Deck_Port_View.JPG",
        sortOrder: 1,
        isCover: false,
      },
      {
        vesselId: vessel2.id,
        url: "/fleet/metanira/1_GA_PLAN.pdf",
        type: "pdf",
        filename: "GA-PLAN_MV_METANIRA.pdf",
        sortOrder: 2,
        isCover: false,
      },
    ]);
  }

  console.log("✅ Seeding completed successfully!");
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  });
