// Complete Maritime Particulars & Media Archive for Managed Fleet
export const FLEET_DATABASE = {
  'vessel-molpadia': {
    id: 'vessel-molpadia',
    name: 'MV MOLPADIA',
    type: 'General Cargo',
    status: 'Available for Charter',
    yearBuilt: 2014,
    builder: 'Yangzijiang Shipbuilding Group',
    flag: 'Antigua & Barbuda',
    portOfRegistry: "St. John's",
    callSign: 'V2FX5',
    imoNumber: '9613616',
    classSociety: 'DNV (Det Norske Veritas)',
    classNotation: '100 A5 E3 G NAV-O BWM SOLAS-II-2 Reg.19',
    dwt: '6,408 MT',
    gt: '4,591',
    nt: '2,352',
    loa: '108.20 m',
    beam: '18.20 m',
    draft: '6.85 m (Summer)',
    depthMoulded: '9.00 m',
    holdsCount: '2 Holds / 2 Hatches (2HO / 2HA)',
    grainCapacity: '315,000 cu.ft (8,920 cu.m)',
    baleCapacity: '305,000 cu.ft (8,637 cu.m)',
    hatch1Dims: '25.60 m x 15.20 m',
    hatch2Dims: '38.40 m x 15.20 m',
    hatchType: 'Hydraulic Folding Steel Weather-tight',
    tankTopStrength: '15.0 MT / sq.m',
    deckGear: '2 x 30 MT Cranes',
    craneDetails: 'Port-side mounted electro-hydraulic cranes. SWL 30 MT at 24.0 m outreach. Combinable up to 60 MT.',
    maxSpeed: '13.5 knots',
    ecoSpeed: '11.0 knots',
    fuelConsumption: 'Eco: ~9.5 MT VLSFO/day at sea',
    mainEngine: 'MAN B&W 6L27/38 (2,040 kW @ 800 RPM)',
    bowThruster: 'Fitted (350 kW)',
    coverImageUrl: '/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg',
    pdfGaPlanUrl: '/fleet/molpadia/2_GA-PLAN.pdf',
    description: `
      <p class="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
        <strong>MV MOLPADIA</strong> is a modern 6,408 DWT geared general cargo vessel constructed in 2014 under high-spec DNV classification. Designed for optimal fuel efficiency and versatile cargo flexibility, she features two large box-shaped holds, wide unobstructed hatch openings, and strengthened tank top plating rated at 15 MT/m².
      </p>
      <h3 class="text-base font-serif text-gold mt-6 mb-2">Key Cargo Capabilities & Trade Lanes:</h3>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-neutral-300">
        <li><strong>Dry Bulk:</strong> Grains, fertilizers, coal, minerals, and clinker. Fully compliant with IMSBC code.</li>
        <li><strong>Project & Heavy Cargo:</strong> Equipped with dual 30 MT port-side electro-hydraulic cranes with up to 24 m outreach (combinable for heavy lifts up to 60 MT).</li>
        <li><strong>Breakbulk & Steel:</strong> Box-shaped holds suitable for steel coils, pipes, timber packs, and bagged commodities.</li>
        <li><strong>IMO Dangerous Cargo:</strong> Hold ventilation and fire safety systems certified for IMDG classes under SOLAS II-2 Reg. 19.</li>
      </ul>
    `,
    photos: [
      { url: '/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg', title: 'Main Exterior at Sea', category: 'hull' },
      { url: '/fleet/molpadia/Photo-1.jpg', title: 'Cargo Hold No.1 & Hatch Covers', category: 'holds' },
      { url: '/fleet/molpadia/Photo-2.jpg', title: 'Deck View & 30t Crane Jib', category: 'cranes' },
      { url: '/fleet/molpadia/Photo-3.jpg', title: 'Portside Waterline & Hull', category: 'hull' },
      { url: '/fleet/molpadia/Photo-4.jpg', title: 'Lifeboat & Davit Rigging', category: 'deck' },
      { url: '/fleet/molpadia/Photo-5.jpg', title: 'Aft Safety & Mooring Stations', category: 'deck' },
      { url: '/fleet/molpadia/Photo-6.jpg', title: 'Gangway & Pilot Boarding Area', category: 'deck' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image1.jpeg', title: 'Full Ship Profile in Calm Waters', category: 'hull' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image2.jpeg', title: 'Deck Overview Looking Forward', category: 'deck' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image3.jpeg', title: 'Hold No.1 Open with Clean Bulkhead', category: 'holds' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image4.jpeg', title: 'Hold No.2 Tank Top Plating', category: 'holds' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image5.jpeg', title: 'Crane No.1 Cabin & Winch Assembly', category: 'cranes' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image6.jpeg', title: 'Crane No.2 Hook & Rigging Block', category: 'cranes' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image7.jpeg', title: 'Hydraulic Hatch Ram Cylinders', category: 'holds' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image8.jpeg', title: 'Forecastle Mooring Winches & Windlass', category: 'deck' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image9.jpeg', title: 'Navigation Bridge Console & Radar', category: 'bridge' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image10.jpeg', title: 'ECDIS & Engine Controls Bridge Station', category: 'bridge' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image11.jpeg', title: 'Main Engine Cylinder Heads & Gallery', category: 'engine' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image12.jpeg', title: 'Auxiliary Diesel Generators', category: 'engine' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image13.jpeg', title: 'Emergency Fire & Bilge Pump Station', category: 'engine' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image14.jpeg', title: 'Crew Mess Room & Galley', category: 'accom' },
      { url: '/fleet/docx_media/MOLPADIA/1_MOLPADIA_PRESENTATION/image15.jpeg', title: 'Officer Day Cabin & Quarters', category: 'accom' }
    ]
  },

  'vessel-metanira': {
    id: 'vessel-metanira',
    name: 'MV METANIRA',
    type: 'Bulk Carrier / General Cargo',
    status: 'Available for Charter',
    yearBuilt: 2012,
    builder: 'Taizhou Sanfu Ship Engineering Co., Ltd',
    flag: 'Liberia',
    portOfRegistry: 'Monrovia',
    callSign: '5LEN7',
    imoNumber: '9584724',
    classSociety: 'Bureau Veritas (BV)',
    classNotation: 'I +Hull +Mach General Cargo Ship Heavy Cargo In Holds Non-Homogeneous Loading Unrestricted',
    dwt: '7,200 MT',
    gt: '5,087',
    nt: '2,654',
    loa: '114.50 m',
    beam: '18.20 m',
    draft: '7.10 m (Summer)',
    depthMoulded: '9.40 m',
    holdsCount: '2 Holds / 2 Hatches (2HO / 2HA)',
    grainCapacity: '352,000 cu.ft (9,967 cu.m)',
    baleCapacity: '340,000 cu.ft (9,627 cu.m)',
    hatch1Dims: '27.20 m x 15.20 m',
    hatch2Dims: '40.80 m x 15.20 m',
    hatchType: 'Hydraulic Folding Steel Weather-tight',
    tankTopStrength: '16.5 MT / sq.m',
    deckGear: '2 x 30 MT Cranes',
    craneDetails: 'Port-side electro-hydraulic cranes (TTS NMF). SWL 30 MT at 24.0 m outreach, combinable up to 60 MT lift capacity.',
    maxSpeed: '13.0 knots',
    ecoSpeed: '10.5 knots',
    fuelConsumption: 'Eco: ~9.2 MT VLSFO/day at sea',
    mainEngine: 'Daihatsu 8DKM-28e (2,500 kW @ 750 RPM)',
    bowThruster: 'Fitted (400 kW)',
    coverImageUrl: '/fleet/metanira/PHOTO__MV_METANIRA.JPG',
    pdfGaPlanUrl: '/fleet/metanira/1_GA_PLAN.pdf',
    description: `
      <p class="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
        <strong>MV METANIRA</strong> is a premium 7,200 DWT heavy-duty geared bulk carrier / general cargo vessel built under Bureau Veritas class. Featuring double-skin hull construction, high cubic capacity of 352,000 cu.ft, and dual 30 MT cranes, she provides reliable freight transport across European, Mediterranean, and transatlantic trade lanes.
      </p>
      <h3 class="text-base font-serif text-gold mt-6 mb-2">Key Cargo Capabilities & Trade Lanes:</h3>
      <ul class="list-disc pl-5 space-y-1.5 text-xs text-neutral-300">
        <li><strong>Agricultural Bulk & Grain:</strong> Grain-fitted with certified stability calculations for high-density grains, corn, wheat, barley, and sunflower seeds.</li>
        <li><strong>Project & Heavy Lift:</strong> High deck and tank top load rating (16.5 t/m²), dual 30 MT cranes capable of handling heavy machinery, wind components, and oversize project items.</li>
        <li><strong>Steel & Industrial Goods:</strong> Perfect for steel plates, hot-rolled coils (2x 30t coils with dunnage), beams, rebar, and packaged lumber.</li>
        <li><strong>Port Flexibility:</strong> Shallow summer draft (7.10 m) and powerful 400 kW bow thruster enable berthing at restricted river and regional seaports without tug assistance.</li>
      </ul>
    `,
    photos: [
      { url: '/fleet/metanira/PHOTO__MV_METANIRA.JPG', title: 'Port Berth Overview in Motril', category: 'hull' },
      { url: '/fleet/metanira/IMG_3293_800_600.JPG', title: 'Hold No.1 Clean Plating & Hopper Walls', category: 'holds' },
      { url: '/fleet/metanira/IMG_3294_800_600.JPG', title: 'Internal Tank Top Inspection Point', category: 'holds' },
      { url: '/fleet/metanira/IMG_3295_800_600.JPG', title: 'Hatch Coaming Rubber Sealing & Channel', category: 'holds' },
      { url: '/fleet/metanira/IMG_3296_800_600.JPG', title: 'Forward Crane No.1 Hydraulic Motor', category: 'cranes' },
      { url: '/fleet/metanira/IMG_3297_800_600.JPG', title: 'Crane Jib Rest & Securing Latch', category: 'cranes' },
      { url: '/fleet/metanira/IMG_3298_800_600.JPG', title: 'Hydraulic Folding Hatch Panel Hinge', category: 'holds' },
      { url: '/fleet/metanira/IMG_3299_800_600.JPG', title: 'Hold No.2 Vertical Access Ladders', category: 'holds' },
      { url: '/fleet/metanira/IMG_3300_800_600.JPG', title: 'Hold Bilge Well Cleanliness Check', category: 'holds' },
      { url: '/fleet/metanira/IMG_3301_800_600.JPG', title: 'Main Deck Catwalk & Pipe Guarding', category: 'deck' },
      { url: '/fleet/metanira/IMG_3302_800_600.JPG', title: 'Midship Ballast Manifold Valves', category: 'deck' },
      { url: '/fleet/metanira/IMG_3303_800_600.JPG', title: 'Forward Mooring Fairleads & Bollards', category: 'deck' },
      { url: '/fleet/metanira/IMG_3304_800_600.JPG', title: 'Windlass Brake Band & Chain Stopper', category: 'deck' },
      { url: '/fleet/metanira/IMG_3305_800_600.JPG', title: 'Starboard Freeboard & Draft Marks', category: 'hull' },
      { url: '/fleet/metanira/IMG_3306_800_600.JPG', title: 'Bulbous Bow & Stem Inspection', category: 'hull' },
      { url: '/fleet/metanira/IMG_3307_800_600.JPG', title: 'Aft Transom & Steering Gear Flat', category: 'hull' },
      { url: '/fleet/metanira/IMG_3308_800_600.JPG', title: 'Freefall Lifeboat Launch Rail', category: 'deck' },
      { url: '/fleet/metanira/IMG_3309_800_600.JPG', title: 'Wheelhouse Bridge Wing Starboard', category: 'bridge' },
      { url: '/fleet/metanira/IMG_3310_800_600.JPG', title: 'Bridge Electronic Navigation Suite', category: 'bridge' },
      { url: '/fleet/metanira/IMG_3311_800_600.JPG', title: 'GMDSS Radio Communication Station', category: 'bridge' },
      { url: '/fleet/metanira/IMG_3312_800_600.JPG', title: 'Engine Control Room (ECR) Automation', category: 'engine' },
      { url: '/fleet/metanira/IMG_3313_800_600.JPG', title: 'Main Propulsion Engine Turbocharger', category: 'engine' },
      { url: '/fleet/metanira/IMG_3314_800_600.JPG', title: 'Auxiliary Diesel Generator Units', category: 'engine' },
      { url: '/fleet/metanira/IMG_3315_800_600.JPG', title: 'Fuel Oil Purifier Centrifuges', category: 'engine' },
      { url: '/fleet/metanira/IMG_3316_800_600.JPG', title: 'Oily Water Separator & Bilge Filter', category: 'engine' },
      { url: '/fleet/metanira/IMG_3317_800_600.JPG', title: 'Ballast Water Treatment System (BWTS)', category: 'engine' },
      { url: '/fleet/metanira/IMG_3318_800_600.JPG', title: 'Emergency Diesel Generator Room', category: 'engine' },
      { url: '/fleet/metanira/IMG_3319_800_600.JPG', title: 'CO2 Fire Extinguishing Battery Bank', category: 'engine' },
      { url: '/fleet/metanira/IMG_3320_800_600.JPG', title: 'Crew Accommodation Corridor & Cabins', category: 'accom' },
      { url: '/fleet/metanira/IMG_3321_800_600.JPG', title: 'Galley & Mess Facilities', category: 'accom' },
      { url: '/fleet/metanira/IMG_3322_800_600.JPG', title: 'Hospital & Medical Treatment Room', category: 'accom' },
      { url: '/fleet/metanira/Vessel_Description__METANIRA.png', title: 'General Vessel Blueprint & Specs Sheet', category: 'deck' }
    ]
  }
};