const globalForData = globalThis as unknown as {
  _sampleVessels?: any[];
  _sampleLeads?: any[];
  _samplePages?: any[];
  _sampleBranches?: any[];
  _sampleCompanyContacts?: any;
};

const initialSampleVessels = [
  {
    id: "vessel-molpadia",
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
    isFeatured: true,
    createdAt: new Date().toISOString(),
    media: [
      {
        id: "m-mol-cover",
        url: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg",
        type: "photo" as const,
        filename: "MV_MOLPADIA__PHOTO.jpg",
        sortOrder: 0,
        isCover: true,
      },
      {
        id: "m-mol-1",
        url: "/fleet/molpadia/Photo-1.jpg",
        type: "photo" as const,
        filename: "Photo-1.jpg",
        sortOrder: 1,
        isCover: false,
      },
      {
        id: "m-mol-2",
        url: "/fleet/molpadia/Photo-2.jpg",
        type: "photo" as const,
        filename: "Photo-2.jpg",
        sortOrder: 2,
        isCover: false,
      },
      {
        id: "m-mol-3",
        url: "/fleet/molpadia/Photo-3.jpg",
        type: "photo" as const,
        filename: "Photo-3.jpg",
        sortOrder: 3,
        isCover: false,
      },
      {
        id: "m-mol-4",
        url: "/fleet/molpadia/Photo-4.jpg",
        type: "photo" as const,
        filename: "Photo-4.jpg",
        sortOrder: 4,
        isCover: false,
      },
      {
        id: "m-mol-5",
        url: "/fleet/molpadia/Photo-5.jpg",
        type: "photo" as const,
        filename: "Photo-5.jpg",
        sortOrder: 5,
        isCover: false,
      },
      {
        id: "m-mol-6",
        url: "/fleet/molpadia/Photo-6.jpg",
        type: "photo" as const,
        filename: "Photo-6.jpg",
        sortOrder: 6,
        isCover: false,
      },
      {
        id: "m-mol-ga",
        url: "/fleet/molpadia/2_GA-PLAN.pdf",
        type: "pdf" as const,
        filename: "GA-PLAN_MV_MOLPADIA.pdf",
        sortOrder: 7,
        isCover: false,
      },
    ],
  },
  {
    id: "vessel-metanira",
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
    isFeatured: true,
    createdAt: new Date().toISOString(),
    media: [
      {
        id: "m-met-cover",
        url: "/fleet/metanira/PHOTO__MV_METANIRA.JPG",
        type: "photo" as const,
        filename: "PHOTO__MV_METANIRA.JPG",
        sortOrder: 0,
        isCover: true,
      },
      {
        id: "m-met-1",
        url: "/fleet/metanira/IMG_3293_800_600.JPG",
        type: "photo" as const,
        filename: "Deck_Port_View.JPG",
        sortOrder: 1,
        isCover: false,
      },
      {
        id: "m-met-2",
        url: "/fleet/metanira/IMG_3300_800_600.JPG",
        type: "photo" as const,
        filename: "Cranes_Structure.JPG",
        sortOrder: 2,
        isCover: false,
      },
      {
        id: "m-met-3",
        url: "/fleet/metanira/IMG_3305_800_600.JPG",
        type: "photo" as const,
        filename: "Cargo_Hold_Overview.JPG",
        sortOrder: 3,
        isCover: false,
      },
      {
        id: "m-met-4",
        url: "/fleet/metanira/IMG_3310_800_600.JPG",
        type: "photo" as const,
        filename: "Bow_Profile.JPG",
        sortOrder: 4,
        isCover: false,
      },
      {
        id: "m-met-5",
        url: "/fleet/metanira/IMG_3318_800_600.JPG",
        type: "photo" as const,
        filename: "Bridge_Nav_Deck.JPG",
        sortOrder: 5,
        isCover: false,
      },
      {
        id: "m-met-ga",
        url: "/fleet/metanira/1_GA_PLAN.pdf",
        type: "pdf" as const,
        filename: "GA-PLAN_MV_METANIRA.pdf",
        sortOrder: 6,
        isCover: false,
      },
      {
        id: "m-met-desc",
        url: "/fleet/metanira/Vessel_Description__METANIRA.png",
        type: "photo" as const,
        filename: "Vessel_Description__METANIRA.png",
        sortOrder: 7,
        isCover: false,
      },
    ],
  },
];

export const sampleVessels: any[] =
  globalForData._sampleVessels ||
  (globalForData._sampleVessels = initialSampleVessels);

const initialSampleLeads = [
  {
    id: "lead-001",
    status: "new",
    clientName: "AgroTrans Logistics BV",
    clientPhone: "+31 10 4455667",
    clientEmail: "chartering@agrotrans.nl",
    clientWhatsapp: "+31 6 12345678",
    clientTelegram: "@agrotrans_charter",
    loadingPort: "Port of Odesa (UA)",
    dischargePort: "Port of Ravenna (IT)",
    cargoType: "bulk",
    cargoVolume: "6,400 MT Wheat",
    vesselId: "vessel-molpadia",
    comment: "Prompt laycan window next week. Need geared vessel (MV MOLPADIA or sister) with 2x30t cranes.",
    sourcePage: "/routes/black-sea-grain-freight",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    vessel: sampleVessels[0],
  },
  {
    id: "lead-002",
    status: "in_progress",
    clientName: "Hellenic Steel Exports Ltd",
    clientPhone: "+30 210 9988776",
    clientEmail: "ops@hellenicsteel.gr",
    loadingPort: "Port of Motril (ES)",
    dischargePort: "Port of Alexandria (EG)",
    cargoType: "breakbulk",
    cargoVolume: "6,800 MT Steel Coils & Rebars",
    vesselId: "vessel-metanira",
    comment: "MV METANIRA fixture inspection requested. Please provide GA-plan and confirmation of crane SWL.",
    sourcePage: "landing-page",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    vessel: sampleVessels[1],
  },
  {
    id: "lead-003",
    status: "completed",
    clientName: "Black Sea Minerals LLC",
    clientPhone: "+380 48 7112233",
    clientEmail: "logistics@bs-minerals.com",
    loadingPort: "Port of Constanta (RO)",
    dischargePort: "Port of Mersin (TR)",
    cargoType: "bulk",
    cargoVolume: "5,000 MT Fertilizer",
    comment: "Fixture successfully agreed and signed. Charter in progress.",
    sourcePage: "landing-page",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export const sampleLeads: any[] =
  globalForData._sampleLeads ||
  (globalForData._sampleLeads = initialSampleLeads);

const initialSamplePages: any[] = [];

export const samplePages: any[] =
  globalForData._samplePages = initialSamplePages;

const initialSampleBranches = [
  {
    id: "branch-001",
    name: "Operational Head Office (Greek Branch)",
    portCity: "Glyfada, Athens",
    country: "Greece",
    address: "Zeppou 33, 166 75 Glyfada, Greece",
    phone: "+30 211 34 56 550",
    email: "chartering@danamira-shipping.com",
    agentName: "Capt. Operations / Law 89/1967",
    sortOrder: 1,
  },
];

export const sampleBranches: any[] =
  globalForData._sampleBranches = initialSampleBranches;

export const sampleCompanyContacts =
  globalForData._sampleCompanyContacts ||
  (globalForData._sampleCompanyContacts = {
    hotlinePhone: "+30 211 34 56 550",
    generalEmail: "chartering@danamira-shipping.com",
    telegram: "@danamira_ops",
    whatsapp: "+30 211 34 56 550",
  });
