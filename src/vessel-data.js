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
    officialNumber: '12467',
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
    sheetImageUrl: '/fleet/metanira/Vessel_Description__METANIRA.png',
    
    // Structured flyer data sections
    specSections: {
      information: [
        { label: 'Vessel Name', value: 'M/V MOLPADIA' },
        { label: 'IMO No.', value: '9613616' },
        { label: 'Vessel Type', value: 'General Cargo' },
        { label: 'BLT (Year Built)', value: '2014' },
        { label: 'Flag', value: 'Antigua & Barbuda' },
        { label: 'Class Society', value: 'DNV (Det Norske Veritas)' },
        { label: 'Call Sign', value: 'V2FX5' },
        { label: 'Official Number', value: '12467' }
      ],
      particulars: [
        { label: 'DWT (on 6.60 m SSW)', value: '6,200.00 MT' },
        { label: 'Summer DWT (on 6.85 m SSW)', value: '6,408.00 MT' },
        { label: 'Summer TPC', value: '16.2 t' },
        { label: 'Winter DWT', value: '6,220.00 MT' },
        { label: 'Winter TPC', value: '16.2 t' },
        { label: 'GT / NT', value: '4,591 / 2,352' },
        { label: 'Length Overall (LOA)', value: '108.20 m' },
        { label: 'Beam (Breadth)', value: '18.20 m' },
        { label: 'Depth (Moulded)', value: '9.00 m' },
        { label: 'Cargo Holds / Hatches', value: '2 Holds / 2 Hatches' },
        { label: 'Hold No. 1 (L x B x H)', value: '41.2 x 14.0 x 17.5 - 7.85 m' },
        { label: 'Hold No. 2 (L x B x H)', value: '36.8 x 14.0 x 17.5 - 7.85 m' },
        { label: 'Grain / Bale Capacity', value: '315,000 cu.ft / 305,000 cu.ft' },
        { label: 'CO2 Fitted', value: 'CO2 fitted in cargo holds' },
        { label: 'Bulkhead', value: 'IMO bulkhead fitted' },
        { label: 'Gear / Cranes', value: '2 x 30 MT Cranes (60 MT comb.)' },
        { label: 'Heavy Cargo Strengthened', value: 'Yes (Heavy Cargo in Holds)' },
        { label: 'Ice Class', value: '100 A5 E3 (Ice Strengthened)' }
      ],
      holdsHatches: [
        { label: 'Hatch No. 1 (L x B)', value: '25.60 m x 15.20 m' },
        { label: 'Hatch No. 2 (L x B)', value: '38.40 m x 15.20 m' },
        { label: 'Hatch Cover Type', value: 'Watertight hydraulic folding hatch covers' }
      ],
      ballastStrength: [
        { label: 'Ballast Waterline to Coaming Top', value: '5.6 m' },
        { label: 'Tank Top Strength', value: '15.0 MT / m²' },
        { label: 'Deck Gear Arrangement', value: '2 x 30 MT Cranes (Portside mounted)' }
      ],
      speedConsumption: [
        { label: 'Speed & Consumption (Ballast)', value: 'Abt 10.0 kn on abt 4.5 mt LSMGO / 24h' },
        { label: 'Speed & Consumption (Laden)', value: 'Abt 9.5 kn on abt 5.0 mt LSMGO / 24h' },
        { label: 'Eco Speed (Ballast)', value: 'Abt 9.0 kn on abt 4.0 mt LSMGO / 24h' },
        { label: 'Eco Speed (Laden)', value: 'Abt 8.5 kn on abt 4.5 mt LSMGO / 24h' },
        { label: 'In Port (Idle)', value: 'Abt 0.85 mt LSMGO / 24h' },
        { label: 'In Port (Working with Cranes)', value: 'Abt 1.50 mt LSMGO / 24h' }
      ],
      tankCapacities: [
        { label: 'Fuel Oil (MGO)', value: '285.00 m³' },
        { label: 'Diesel Oil (MGO)', value: '52.00 m³' },
        { label: 'Lube Oil', value: '9.80 m³' },
        { label: 'Fresh Water', value: '120.00 m³' },
        { label: 'Ballast Water', value: '2,850.00 m³' }
      ],
      mainEngine: [
        { label: 'Main Engine Model', value: '1 x MAN B&W 6L27/38' },
        { label: 'Engine Type', value: '6-Cylinder, 4-Stroke Marine Diesel' },
        { label: 'MCR Rating', value: '2,040 kW @ 800 rpm' },
        { label: 'Continuous Rating', value: '1,850 kW @ 750 rpm' },
        { label: 'Builder', value: 'MAN Energy Solutions' },
        { label: 'Propeller', value: '1 x CPP (Controllable Pitch Propeller)' },
        { label: 'Bow Thruster', value: '1 x 350 kW' },
        { label: 'Generator Sets', value: '3 x Yanmar 6EY18ALW 450 kW @ 720 rpm' },
        { label: 'Emergency Generator', value: '1 x Yanmar 4TNE98 41 kW @ 1800 rpm' }
      ],
      permissibleLoads: [
        { label: 'Permissible Load on Deck', value: '1.50 MT / m²' },
        { label: 'Permissible Load on Hatch', value: '1.80 MT / m²' }
      ]
    },

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
    officialNumber: '15147',
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
    sheetImageUrl: '/fleet/metanira/Vessel_Description__METANIRA.png',
    
    // Structured flyer data sections
    specSections: {
      information: [
        { label: 'Vessel Name', value: 'M/V METANIRA' },
        { label: 'IMO No.', value: '9584724' },
        { label: 'Vessel Type', value: 'General Cargo / Bulk Carrier' },
        { label: 'BLT (Year Built)', value: '2012' },
        { label: 'Flag', value: 'Liberia' },
        { label: 'Class Society', value: 'Bureau Veritas (BV)' },
        { label: 'Call Sign', value: '5LEN7' },
        { label: 'Official Number', value: '15147' }
      ],
      particulars: [
        { label: 'DWT (on 6.80 m SSW)', value: '7,020.45 MT' },
        { label: 'Summer DWT (on 7.10 m SSW)', value: '7,200.00 MT' },
        { label: 'Summer TPC', value: '17.5 t' },
        { label: 'Winter DWT', value: '7,010.20 MT' },
        { label: 'Winter TPC', value: '17.5 t' },
        { label: 'GT / NT', value: '5,087 / 2,654' },
        { label: 'Length Overall (LOA)', value: '114.50 m' },
        { label: 'Beam (Breadth)', value: '18.20 m' },
        { label: 'Depth (Moulded)', value: '9.40 m' },
        { label: 'Cargo Holds / Hatches', value: '2 Holds / 2 Hatches' },
        { label: 'Hold No. 1 (L x B x H)', value: '43.4 x 14.0 x 17.5 - 7.85 m' },
        { label: 'Hold No. 2 (L x B x H)', value: '38.4 x 14.0 x 17.5 - 7.85 m' },
        { label: 'Grain / Bale Capacity', value: '352,000 cu.ft / 340,000 cu.ft' },
        { label: 'CO2 Fitted', value: 'CO2 fitted in cargo holds' },
        { label: 'Bulkhead', value: 'IMO bulkhead fitted' },
        { label: 'Gear / Cranes', value: '2 x 30 MT Cranes (60 MT comb.)' },
        { label: 'Heavy Cargo Strengthened', value: 'Yes (Heavy Cargo in Holds)' },
        { label: 'Ice Class', value: 'Non-Ice Class / Unrestricted' }
      ],
      holdsHatches: [
        { label: 'Hatch No. 1 (L x B)', value: '27.20 m x 15.20 m' },
        { label: 'Hatch No. 2 (L x B)', value: '40.80 m x 15.20 m' },
        { label: 'Hatch Cover Type', value: 'Watertight hydraulic folding hatch covers' }
      ],
      ballastStrength: [
        { label: 'Ballast Waterline to Coaming Top', value: '5.9 m' },
        { label: 'Tank Top Strength', value: '16.5 MT / m²' },
        { label: 'Deck Gear Arrangement', value: '2 x 30 MT Cranes (TTS NMF)' }
      ],
      speedConsumption: [
        { label: 'Speed & Consumption (Ballast)', value: 'Abt 10.0 kn on abt 4.5 mt LSMGO / 24h' },
        { label: 'Speed & Consumption (Laden)', value: 'Abt 9.5 kn on abt 5.0 mt LSMGO / 24h' },
        { label: 'Eco Speed (Ballast)', value: 'Abt 9.0 kn on abt 4.0 mt LSMGO / 24h' },
        { label: 'Eco Speed (Laden)', value: 'Abt 8.5 kn on abt 4.5 mt LSMGO / 24h' },
        { label: 'In Port (Idle)', value: 'Abt 0.85 mt LSMGO / 24h' },
        { label: 'In Port (Working with Cranes)', value: 'Abt 1.50 mt LSMGO / 24h' }
      ],
      tankCapacities: [
        { label: 'Fuel Oil (MGO)', value: '301.50 m³' },
        { label: 'Diesel Oil (MGO)', value: '58.40 m³' },
        { label: 'Lube Oil', value: '10.30 m³' },
        { label: 'Fresh Water', value: '135.00 m³' },
        { label: 'Ballast Water', value: '3,073.00 m³' }
      ],
      mainEngine: [
        { label: 'Main Engine Model', value: '1 x Daihatsu 8DKM-28e' },
        { label: 'Engine Type', value: '8-Cylinder, 4-Stroke Marine Diesel' },
        { label: 'MCR Rating', value: '2,500 kW @ 750 rpm' },
        { label: 'Continuous Rating', value: '2,250 kW @ 720 rpm' },
        { label: 'Builder', value: 'Daihatsu Diesel Mfg. Co.' },
        { label: 'Propeller', value: '1 x CPP (Controllable Pitch Propeller)' },
        { label: 'Bow Thruster', value: '1 x 400 kW' },
        { label: 'Generator Sets', value: '3 x Yanmar 6EY18ALW 450 kW @ 720 rpm' },
        { label: 'Emergency Generator', value: '1 x Yanmar 4TNE98 41 kW @ 1800 rpm' }
      ],
      permissibleLoads: [
        { label: 'Permissible Load on Deck', value: '1.50 MT / m²' },
        { label: 'Permissible Load on Hatch', value: '1.80 MT / m²' }
      ]
    },

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
      { url: '/fleet/metanira/PHOTO__MV_METANIRA.JPG', title: 'Main Exterior Profile at Berth in Motril', category: 'hull' },
      { url: '/fleet/metanira/IMG_3294_800_600.JPG', title: 'Bow & Stem Profile from Quay', category: 'hull' },
      { url: '/fleet/metanira/IMG_3298_800_600.JPG', title: 'Portside Profile & Dual 30t Cranes', category: 'cranes' },
      { url: '/fleet/metanira/IMG_3305_800_600.JPG', title: 'Aft Transom & Stern Homeport Markings', category: 'hull' },
      { url: '/fleet/metanira/IMG_3300_800_600.JPG', title: 'Superstructure, Gangway & Boarding Station', category: 'deck' },
      { url: '/fleet/metanira/IMG_3309_800_600.JPG', title: 'Forecastle Mooring Winches & Windlass', category: 'deck' },
      { url: '/fleet/metanira/IMG_3310_800_600.JPG', title: 'Main Weather Deck Looking Aft to Bridge', category: 'deck' },
      { url: '/fleet/metanira/IMG_3311_800_600.JPG', title: 'Forward View from Forecastle Mast', category: 'deck' },
      { url: '/fleet/metanira/IMG_3315_800_600.JPG', title: 'Main Deck Pipelines & Ballast Manifolds', category: 'deck' },
      { url: '/fleet/metanira/IMG_3316_800_600.JPG', title: 'Accommodation Walkway & Safety Handrails', category: 'deck' },
      { url: '/fleet/metanira/IMG_3319_800_600.JPG', title: 'Navigation Bridge Wing & Vessel Nameplate', category: 'bridge' },
      { url: '/fleet/docx_media/METANIRA/1_METANIRA_PRESENTATION/image1.jpeg', title: 'Hold No.1 Forward Bulkhead & Clean Coating', category: 'holds' },
      { url: '/fleet/docx_media/METANIRA/1_METANIRA_PRESENTATION/image2.jpeg', title: 'Hold No.1 Hopper Plating & Tank Top Inspection', category: 'holds' },
      { url: '/fleet/docx_media/METANIRA/1_METANIRA_PRESENTATION/image13.jpeg', title: 'Hydraulic Folding Weather-Tight Hatch Underside', category: 'holds' },
      { url: '/fleet/docx_media/METANIRA/1_METANIRA_PRESENTATION/image14.jpeg', title: 'Hold No.2 Open Panoramic Deck View', category: 'holds' },
      { url: '/fleet/docx_media/METANIRA/1_METANIRA_PRESENTATION/image15.jpeg', title: 'Hold No.2 Corrugated Bulkheads & Access Ladders', category: 'holds' },
      { url: '/fleet/docx_media/METANIRA/1_METANIRA_PRESENTATION/image24.jpeg', title: 'Heavy Cargo Tank Top Plating Clean Surface', category: 'holds' },
      { url: '/fleet/metanira/Vessel_Description__METANIRA.png', title: 'Technical Specification Blueprint & GA Sheet', category: 'deck' }
    ]
  }
};