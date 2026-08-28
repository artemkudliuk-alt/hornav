const globalForData = globalThis as unknown as {
  _sampleVessels?: any[];
  _sampleLeads?: any[];
  _samplePages?: any[];
  _sampleBranches?: any[];
  _sampleCompanyContacts?: any;
  _sampleUsers?: any[];
  _sampleSettings?: any;
};

const initialSampleVessels = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    imoNumber: "9613616",
    slug: "molpadia",
    name: {
      en: "MV MOLPADIA",
      ua: "Т/Х МОЛПАДІЯ",
      ru: "Т/Х МОЛПАДИЯ",
    },
    metaTitle: {
      en: "MV MOLPADIA — Technical Particulars & Capacities | Danamira Shipping",
      ua: "Т/Х МОЛПАДІЯ — Технічні характеристики | Danamira Shipping",
      ru: "Т/Х МОЛПАДИЯ — Технические характеристики | Danamira Shipping",
    },
    metaDescription: {
      en: "Commercial specifications, general arrangement plan, 2x 30MT crane capacities, grain capacity 315,000 cu.ft, and photo inspection gallery of 6,408 DWT geared bulk carrier MV MOLPADIA.",
      ua: "Комерційні характеристики, генеральний план та крани 2x 30MT суховантажного судна MV MOLPADIA (6,408 DWT).",
      ru: "Коммерческие характеристики, генеральный план и краны 2x 30MT сухогрузного судна MV MOLPADIA (6,408 DWT).",
    },
    ogImage: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg",
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
    id: "22222222-2222-2222-2222-222222222222",
    imoNumber: "9584724",
    slug: "metanira",
    name: {
      en: "MV METANIRA",
      ua: "Т/Х МЕТАНІРА",
      ru: "Т/Х МЕТАНИРА",
    },
    metaTitle: {
      en: "MV METANIRA — Technical Particulars & GA Plan | Danamira Shipping",
      ua: "Т/Х МЕТАНІРА — Технічні характеристики | Danamira Shipping",
      ru: "Т/Х МЕТАНИРА — Технические характеристики | Danamira Shipping",
    },
    metaDescription: {
      en: "Commercial specifications, general arrangement plan, crane capacities, and photo inspection gallery of 7,200 DWT geared general cargo vessel MV METANIRA.",
      ua: "Комерційні характеристики, генеральний план та крани 2x 30MT вантажного судна MV METANIRA (7,200 DWT).",
      ru: "Коммерческие характеристики, генеральный план и краны 2x 30MT грузового судна MV METANIRA (7,200 DWT).",
    },
    ogImage: "/fleet/metanira/PHOTO__MV_METANIRA.JPG",
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

const initialSamplePages: any[] = [
  {
    id: "page-about",
    slug: "company.html",
    pageName: "About Company",
    status: "published",
    includeInNav: true,
    includeInFooter: true,
    title: { en: "About Danamira Shipping Ltd", ua: "Про компанію Danamira Shipping", ru: "О компании Danamira Shipping" },
    metaTitle: { en: "About Us • Company Profile & Mission | Danamira Shipping Ltd", ua: "Про нас • Профіль компанії та місія | Danamira Shipping", ru: "О нас • Профиль компании и миссия | Danamira Shipping" },
    metaDescription: { en: "Official company profile of Danamira Shipping Ltd: Independent ship-management under Greek Law 89/1967, corporate mission, strategic expansion vision, and dry bulk fleet portfolio.", ua: "Офіційний профіль Danamira Shipping Ltd: незалежний менеджмент суден за Законом Греції 89/1967.", ru: "Официальный профиль Danamira Shipping Ltd: независимый менеджмент судов по Закону Греции 89/1967." },
    ogImage: { en: "/fleet/molpadia/Photo-1.jpg", ua: "/fleet/molpadia/Photo-1.jpg", ru: "/fleet/molpadia/Photo-1.jpg" },
    content: { en: "<p>Danamira Shipping Ltd is an established maritime ship-management corporation operating under Greek Law 89/1967, providing commercial chartering, technical superintendence, and crewing management.</p>", ua: "<p>Danamira Shipping Ltd — судноплавна компанія, що працює за грецьким законодавством 89/1967.</p>", ru: "<p>Danamira Shipping Ltd — судоходная компания, работающая в соответствии с законодательством Греции 89/1967.</p>" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "page-fleet",
    slug: "fleet.html",
    pageName: "Fleet Catalog",
    status: "published",
    includeInNav: true,
    includeInFooter: true,
    title: { en: "Commercial Managed Fleet", ua: "Комерційний флот", ru: "Коммерческий флот" },
    metaTitle: { en: "Commercial Fleet Catalog & Technical Particulars | Danamira Shipping", ua: "Каталог флоту та технічні характеристики | Danamira Shipping", ru: "Каталог флота и технические характеристики | Danamira Shipping" },
    metaDescription: { en: "Browse Danamira Shipping active fleet of geared general cargo and dry bulk carriers (6,000–8,000 DWT), equipped with heavy-lift cranes and modern navigation suites.", ua: "Огляд комерційного флоту Danamira Shipping: сучасні судна 6,000–8,000 DWT з кранами 2x 30MT.", ru: "Обзор коммерческого флота Danamira Shipping: современные суда 6,000–8,000 DWT с кранами 2x 30MT." },
    ogImage: { en: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg", ua: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg", ru: "/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg" },
    content: { en: "<p>Commercially and technically managed fleet of modern geared dry bulk carriers operating worldwide with focus on Mediterranean, Black Sea, Continent, and Baltic trade lanes.</p>", ua: "<p>Флот сучасних суховантажних суден під комерційним та технічним менеджментом Danamira Shipping.</p>", ru: "<p>Флот современных сухогрузных судов под коммерческим и техническим менеджментом Danamira Shipping.</p>" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "page-contacts",
    slug: "contacts.html",
    pageName: "Contact & Desks",
    status: "published",
    includeInNav: true,
    includeInFooter: true,
    title: { en: "Corporate & Operational Contacts", ua: "Контакти та операційні відділи", ru: "Контакты и операционные отделы" },
    metaTitle: { en: "Contact Us & Global Port Agency Desks | Danamira Shipping Ltd", ua: "Контакти та агентські відділи | Danamira Shipping Ltd", ru: "Контакты и агентские отделы | Danamira Shipping Ltd" },
    metaDescription: { en: "Get in touch with Danamira Shipping chartering, operations, crewing, and technical management desks in Athens (Glyfada), Greece and regional agency offices.", ua: "Прямі контакти комерційного відділу, фрахтування, технічного менеджменту та крюїнгу Danamira Shipping.", ru: "Прямые контакты коммерческого отдела, фрахтования, технического менеджмента и крюинга Danamira Shipping." },
    ogImage: { en: "/fleet/metanira/IMG_3318_800_600.JPG", ua: "/fleet/metanira/IMG_3318_800_600.JPG", ru: "/fleet/metanira/IMG_3318_800_600.JPG" },
    content: { en: "<p>Direct communication channels to our executive leadership, commercial chartering desk, technical superintendence, and crew management department in Glyfada, Greece.</p>", ua: "<p>Канали зв'язку з головним офісом Danamira Shipping у Гліфаді (Греція).</p>", ru: "<p>Каналы связи с главным офисом Danamira Shipping в Глифаде (Греция).</p>" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "page-accountability",
    slug: "accountability.html",
    pageName: "Accountability & Compliance",
    status: "published",
    includeInNav: false,
    includeInFooter: true,
    title: { en: "Accountability in Action", ua: "Відповідальність та комплаєнс", ru: "Ответственность и комплаенс" },
    metaTitle: { en: "Corporate Accountability & Safety Compliance | Danamira Shipping", ua: "Корпоративна відповідальність та стандарти безпеки | Danamira Shipping", ru: "Корпоративная ответственность и стандарты безопасности | Danamira Shipping" },
    metaDescription: { en: "Danamira commitment to maritime safety, environmental stewardship, ISM/ISPS code compliance, and transparent governance under Greek Law 89/1967.", ua: "Стандарти безпеки, екологічна відповідальність та відповідність кодексам ISM/ISPS у Danamira Shipping.", ru: "Стандарты безопасности, экологическая ответственность и соответствие кодексам ISM/ISPS в Danamira Shipping." },
    ogImage: { en: "/fleet/molpadia/Photo-2.jpg", ua: "/fleet/molpadia/Photo-2.jpg", ru: "/fleet/molpadia/Photo-2.jpg" },
    content: { en: "<p>Comprehensive overview of Danamira corporate governance, safety management system (SMS), class compliance with IACS members, and ethical shipping standards.</p>", ua: "<p>Корпоративне управління та безпека мореплавства Danamira Shipping.</p>", ru: "<p>Корпоративное управление и безопасность мореплавания Danamira Shipping.</p>" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "page-careers",
    slug: "careers",
    pageName: "Maritime Careers & Crewing",
    status: "published",
    includeInNav: true,
    includeInFooter: true,
    title: { en: "Maritime Careers & Crewing Desk", ua: "Морська кар'єра та крюїнг", ru: "Морская карьера и крюинг" },
    metaTitle: { en: "Maritime Careers & Crewing Opportunities | Danamira Shipping Ltd", ua: "Вакансії в морі та крюїнг | Danamira Shipping Ltd", ru: "Вакансии в море и крюинг | Danamira Shipping Ltd" },
    metaDescription: { en: "Explore maritime career opportunities at Danamira Shipping: Senior officers, engineers, crew positions, and shore-based chartering operators.", ua: "Кар'єрні можливості для офіцерів, механіків, рядового складу та берегового персоналу в Danamira Shipping.", ru: "Карьерные возможности для офицеров, механиков, рядового состава и берегового персонала в Danamira Shipping." },
    ogImage: { en: "/fleet/metanira/Bridge_Nav_Deck.JPG", ua: "/fleet/metanira/Bridge_Nav_Deck.JPG", ru: "/fleet/metanira/Bridge_Nav_Deck.JPG" },
    content: { en: "<h2>Join Danamira Shipping Maritime Team</h2><p>We are continuously seeking qualified Master Mariners, Chief Engineers, Watchkeeping Officers, and shore-based chartering professionals for our growing fleet.</p>", ua: "<h2>Приєднуйтесь до команди Danamira Shipping</h2><p>Відкриті вакансії для капітанів, старших механіків, помічників капітана та берегових операторів.</p>", ru: "<h2>Присоединяйтесь к команде Danamira Shipping</h2><p>Открытые вакансии для капитанов, старших механиков, помощников капитана и береговых операторов.</p>" },
    createdAt: new Date().toISOString(),
  },
];

export const samplePages: any[] =
  globalForData._samplePages ||
  (globalForData._samplePages = initialSamplePages);

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

const initialSampleUsers = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Danamira SuperAdmin",
    email: "admin@danamirashipping.com",
    role: "admin",
    telegramChatId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Fleet Operations Manager",
    email: "manager@danamirashipping.com",
    role: "manager",
    telegramChatId: "987654321",
    createdAt: new Date().toISOString(),
  },
];

export const sampleUsers: any[] =
  globalForData._sampleUsers ||
  (globalForData._sampleUsers = initialSampleUsers);

export const sampleSettings =
  globalForData._sampleSettings ||
  (globalForData._sampleSettings = {
    userName: "Danamira SuperAdmin",
    userEmail: "admin@danamirashipping.com",
    leadNotificationEmails: "chartering@danamirashipping.com, ops@danamirashipping.com",
    emailSenderName: "Danamira Shipping Freight Desk",
    autoReplySubject: "Inquiry Received — Danamira Shipping Ltd",
    autoReplyMessage: "Thank you for contacting Danamira Shipping. Our commercial chartering desk has received your freight / vessel inquiry and will respond promptly with particulars and rate indications.",
    companyName: "DANAMIRA SHIPPING LTD",
    defaultCurrency: "USD",
    timezone: "Europe/Athens",
  });
