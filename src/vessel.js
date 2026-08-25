import './style.css';
import { FLEET_DATABASE } from './vessel-data.js';

// Inject Swiss Maritime Minimal layout styles
const vesselLayoutStyles = document.createElement('style');
vesselLayoutStyles.setAttribute('data-vessel-swiss-layout', 'true');
vesselLayoutStyles.textContent = `
  .vessel-hero-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 1.5rem !important;
    width: 100% !important;
  }
  .vessel-hero-left {
    width: 100% !important;
    min-width: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }
  .vessel-hero-right {
    width: 100% !important;
    min-width: 0 !important;
  }
  .vessel-stage-box {
    position: relative !important;
    width: 100% !important;
    height: 360px !important;
    min-height: 360px !important;
    max-height: 360px !important;
    overflow: hidden !important;
    border-radius: 0 !important;
    background-color: #111113 !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
  }
  #gallery-stage-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    display: block !important;
  }
  @media (min-width: 640px) {
    .vessel-stage-box {
      height: 420px !important;
      min-height: 420px !important;
      max-height: 420px !important;
    }
  }
  .vessel-thumbs-5 {
    display: grid !important;
    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
    gap: 0.5rem !important;
    width: 100% !important;
    height: 56px !important;
  }
  .vessel-thumb-btn {
    position: relative !important;
    height: 56px !important;
    width: 100% !important;
    overflow: hidden !important;
    border-radius: 0 !important;
    background-color: #000 !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .vessel-thumb-btn img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
  }
  @media (min-width: 1024px) {
    .vessel-hero-grid {
      display: grid !important;
      grid-template-columns: 1.75fr 1fr !important;
      align-items: stretch !important;
      gap: 2rem !important;
      width: 100% !important;
    }
    .vessel-hero-left {
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      height: 100% !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    .vessel-hero-right {
      height: 100% !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    .vessel-stage-box {
      height: 460px !important;
      min-height: 460px !important;
      max-height: 460px !important;
      flex: none !important;
      margin-bottom: 0.75rem !important;
    }
    .vessel-thumbs-5 {
      height: 64px !important;
      margin-bottom: 0.5rem !important;
    }
    .vessel-thumb-btn {
      height: 64px !important;
    }
    .vessel-advisor-card {
      height: 100% !important;
      min-height: 560px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      box-sizing: border-box !important;
    }
  }
  @media (min-width: 1200px) {
    .vessel-hero-grid {
      grid-template-columns: 1.8fr 1fr !important;
      gap: 2.25rem !important;
    }
  }
  .vessel-advisor-card {
    background-color: #17171a !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 0 !important;
    padding: 1.25rem 1.5rem !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
  }
  .vessel-avatar-circle {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    min-height: 44px !important;
    max-width: 44px !important;
    max-height: 44px !important;
    aspect-ratio: 1 / 1 !important;
    border-radius: 0 !important;
    background-color: #111113 !important;
    border: 1.5px solid rgba(200, 155, 60, 0.45) !important;
    flex-shrink: 0 !important;
    font-family: serif !important;
    font-weight: 700 !important;
    font-size: 0.875rem !important;
    color: #e6c36a !important;
    position: relative !important;
  }
  .vessel-messengers-row {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 0.75rem !important;
    margin-top: 1.25rem !important;
    margin-bottom: 1.25rem !important;
    width: 100% !important;
  }
  .vessel-btn-wa {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.5rem !important;
    min-height: 44px !important;
    height: 44px !important;
    padding: 0.625rem 0.875rem !important;
    font-size: 0.75rem !important;
    font-family: monospace !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    border-radius: 0 !important;
    background-color: #25D366 !important;
    color: #ffffff !important;
    border: 1px solid #20bd5a !important;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-sizing: border-box !important;
    text-decoration: none !important;
  }
  .vessel-btn-wa:hover {
    background-color: #20bd5a !important;
    transform: translateY(-1px) !important;
  }
  .vessel-btn-tg {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.5rem !important;
    min-height: 44px !important;
    height: 44px !important;
    padding: 0.625rem 0.875rem !important;
    font-size: 0.75rem !important;
    font-family: monospace !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    border-radius: 0 !important;
    background-color: #0088cc !important;
    color: #ffffff !important;
    border: 1px solid #0077b5 !important;
    box-shadow: 0 4px 12px rgba(0, 136, 204, 0.25) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-sizing: border-box !important;
    text-decoration: none !important;
  }
  .vessel-btn-tg:hover {
    background-color: #0077b5 !important;
    transform: translateY(-1px) !important;
  }
  .vessel-form-input {
    display: block !important;
    width: 100% !important;
    min-height: 42px !important;
    height: 42px !important;
    padding: 0.625rem 0.875rem !important;
    font-size: 0.8125rem !important;
    color: #fff !important;
    background-color: #111113 !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 0 !important;
    outline: none !important;
    box-sizing: border-box !important;
  }
  .vessel-form-input:focus {
    border-color: #c89b3c !important;
  }
  textarea.vessel-form-input {
    min-height: 64px !important;
    height: auto !important;
  }
  .vessel-btn-submit {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.5rem !important;
    width: 100% !important;
    min-height: 48px !important;
    height: 48px !important;
    padding: 0.75rem 1.25rem !important;
    font-size: 0.8125rem !important;
    font-family: monospace !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    border-radius: 0 !important;
    background-color: #c89b3c !important;
    color: #0b0b0d !important;
    border: 1px solid #d9ab4c !important;
    box-shadow: 0 4px 16px rgba(200, 155, 60, 0.35) !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-sizing: border-box !important;
    margin-top: 0.625rem !important;
  }
  .vessel-btn-submit:hover {
    background-color: #d9ab4c !important;
    box-shadow: 0 6px 20px rgba(200, 155, 60, 0.5) !important;
    transform: translateY(-1px) !important;
  }
  .vessel-btn-submit:active {
    transform: scale(0.99) !important;
  }
  .vessel-kpi-box {
    display: flex !important;
    align-items: center !important;
    gap: 0.875rem !important;
    padding: 0.875rem 1rem !important;
    background-color: #111113 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 0 !important;
    box-sizing: border-box !important;
  }
  .vessel-kpi-circle {
    display: grid !important;
    place-items: center !important;
    width: 44px !important;
    height: 44px !important;
    border-radius: 0 !important;
    background-color: rgba(200, 155, 60, 0.1) !important;
    border: 1px solid rgba(200, 155, 60, 0.35) !important;
    flex-shrink: 0 !important;
    color: #c89b3c !important;
  }
  .vessel-main-content {
    margin-top: 4.5rem !important;
    width: 100% !important;
  }
  @media (min-width: 1024px) {
    .vessel-main-content {
      margin-top: 5.5rem !important;
    }
  }
  .vessel-details-section {
    margin-top: 3.5rem !important;
    margin-bottom: 2rem !important;
  }
  .vessel-specs-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    row-gap: 1.25rem !important;
    column-gap: 3rem !important;
    width: 100% !important;
    margin-top: 1.5rem !important;
  }
  @media (min-width: 640px) {
    .vessel-specs-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }
  @media (min-width: 1024px) {
    .vessel-specs-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
  }
  .vessel-spec-item {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding-bottom: 0.75rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    font-size: 0.75rem !important;
    gap: 1.25rem !important;
    min-width: 0 !important;
  }
  .vessel-spec-label {
    color: #a3a3a3 !important;
    font-family: monospace !important;
    font-size: 0.6875rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
  }
  .vessel-spec-value {
    color: #ffffff !important;
    font-family: monospace !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    text-align: right !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    margin-left: auto !important;
  }
  #lightbox-modal {
    position: fixed !important;
    inset: 0 !important;
    z-index: 9999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1.25rem !important;
    background-color: rgba(0, 0, 0, 0.88) !important;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
    box-sizing: border-box !important;
  }
  #lightbox-modal.opacity-0 {
    opacity: 0 !important;
    pointer-events: none !important;
  }
  #lightbox-modal.opacity-100 {
    opacity: 1 !important;
    pointer-events: auto !important;
  }
  .lightbox-card-window {
    position: relative !important;
    z-index: 10 !important;
    width: 100% !important;
    max-width: 820px !important;
    max-height: 80vh !important;
    height: auto !important;
    background-color: #161619 !important;
    border: 1px solid rgba(200, 155, 60, 0.5) !important;
    border-radius: 0 !important;
    box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(200, 155, 60, 0.12) !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }
  .lightbox-header-bar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0.625rem 1rem !important;
    background-color: #101012 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    flex-shrink: 0 !important;
  }
  .lightbox-stage-container {
    position: relative !important;
    width: 100% !important;
    height: 44vh !important;
    max-height: 400px !important;
    min-height: 220px !important;
    background-color: #09090b !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
    padding: 0.5rem !important;
    box-sizing: border-box !important;
  }
  #lightbox-img {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
    object-fit: contain !important;
    display: block !important;
    margin: auto !important;
    user-select: none !important;
    -webkit-user-drag: none !important;
    pointer-events: none !important;
  }
  .lightbox-nav-btn {
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 40px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-color: rgba(22, 22, 25, 0.9) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    border-radius: 0 !important;
    cursor: pointer !important;
    z-index: 20 !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6) !important;
  }
  .lightbox-nav-btn:hover {
    background-color: #c89b3c !important;
    color: #000000 !important;
    border-color: #c89b3c !important;
  }
  .lightbox-nav-btn.prev {
    left: 0.75rem !important;
  }
  .lightbox-nav-btn.next {
    right: 0.75rem !important;
  }
  .lightbox-footer-bar {
    padding: 0.5rem 1rem !important;
    background-color: #101012 !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
    flex-shrink: 0 !important;
  }
  #lightbox-thumbnails {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    overflow-x: auto !important;
    padding: 0.25rem 0 !important;
    max-width: 100% !important;
  }
  .lb-thumb-btn {
    flex-shrink: 0 !important;
    width: 60px !important;
    height: 42px !important;
    border-radius: 0 !important;
    overflow: hidden !important;
    background-color: #000000 !important;
    cursor: pointer !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    opacity: 0.6 !important;
    transition: all 0.2s ease !important;
    padding: 0 !important;
  }
  .lb-thumb-btn:hover {
    opacity: 1 !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
  }
  .lb-thumb-btn.active {
    opacity: 1 !important;
    border: 2px solid #c89b3c !important;
    box-shadow: 0 0 10px rgba(200, 155, 60, 0.4) !important;
  }
  .lb-thumb-btn img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
    pointer-events: none !important;
  }
`;
document.head.appendChild(vesselLayoutStyles);

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const vesselId = params.get('id') || 'vessel-molpadia';

  let vessel = FLEET_DATABASE[vesselId];

  if (!vessel) {
    vessel = FLEET_DATABASE['vessel-molpadia'];
  }

  document.title = `${vessel.name} — Technical Particulars | Danamira Shipping`;

  const titleEl = document.getElementById('vessel-name-title');
  if (titleEl) titleEl.textContent = vessel.name;

  const breadcrumbEl = document.getElementById('breadcrumb-vessel');
  if (breadcrumbEl) breadcrumbEl.textContent = vessel.name;

  const categoryEl = document.getElementById('vessel-top-category');
  if (categoryEl) categoryEl.textContent = `${vessel.type.toUpperCase()} • ${vessel.flag.toUpperCase()} FLAG`;

  const taglineEl = document.getElementById('vessel-tagline');
  if (taglineEl) taglineEl.textContent = `IMO: ${vessel.imoNumber} • Built ${vessel.yearBuilt || 2014} • ${vessel.classSociety} • Call Sign: ${vessel.callSign || 'V2FX5'}`;

  // Populate Key Specifications Directly (100% match with FLEET_DATABASE)
  const specMap = {
    'spec-dwt': vessel.dwt || '6,408 MT',
    'spec-grain': vessel.grainCapacity ? vessel.grainCapacity.split('(')[0].trim() : '315,000 cu.ft',
    'spec-cranes': vessel.deckGear || '2 x 30 MT Cranes',
    'spec-draft': vessel.draft ? vessel.draft.split('(')[0].trim() : '6.85 m',
    'spec-imo': vessel.imoNumber || '9613616',
    'spec-year': `Built in ${vessel.yearBuilt || 2014}`,
    'spec-class': vessel.classSociety || 'DNV Class',
    'spec-gt': vessel.gt || '4,591',
    'spec-nt': vessel.nt || '2,352',
    'spec-loa': vessel.loa || '108.20 m',
    'spec-beam': vessel.beam || '18.20 m',
    'spec-holds': vessel.holdsCount || '2 Holds / 2 Hatches',
    'spec-bale': vessel.baleCapacity ? vessel.baleCapacity.split('(')[0].trim() : '305,000 cu.ft',
    'spec-hatch1': vessel.hatch1Dims || '25.60 m x 15.20 m',
    'spec-hatch2': vessel.hatch2Dims || '38.40 m x 15.20 m',
    'spec-strength': vessel.tankTopStrength || '15.0 MT / sq.m',
    'spec-speed': vessel.ecoSpeed || '11.0 knots',
    'spec-thruster': vessel.bowThruster || 'Fitted (350 kW)',
    'spec-flag': vessel.flag || 'Antigua & Barbuda'
  };

  Object.entries(specMap).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  });

  const descEl = document.getElementById('vessel-rich-description');
  if (descEl) {
    descEl.innerHTML = vessel.description || `
      <p class="mb-3"><strong>${vessel.name}</strong> is a high-specification geared multi-purpose general cargo vessel / bulk carrier operating in the commercial management of Danamira Shipping Ltd.</p>
      <p class="mb-3">Equipped with 2 heavy-duty 30 MT deck cranes (combinable up to 60 MT) and robust box-shaped cargo holds, the vessel is optimized for grain bulk cargoes, project heavy-lift modules, steel coils, wind energy components, and dangerous IMO-classed parcels.</p>
      <p>Classed under leading IACS classification society with full global trading certifications, ballast water management system (BWMS), and state-of-the-art fuel-efficient propulsion machinery.</p>
    `;
  }

  // Overview Expand / Collapse Toggle
  const overviewContent = document.getElementById('overview-content');
  const overviewToggleBtn = document.getElementById('overview-toggle-btn');
  const overviewToggleText = document.getElementById('overview-toggle-text');
  const overviewToggleIcon = document.getElementById('overview-toggle-icon');
  const overviewGradient = document.getElementById('overview-gradient');

  let isOverviewExpanded = false;
  if (overviewToggleBtn && overviewContent) {
    overviewToggleBtn.addEventListener('click', () => {
      isOverviewExpanded = !isOverviewExpanded;
      if (isOverviewExpanded) {
        overviewContent.classList.remove('max-h-[140px]');
        overviewContent.classList.add('max-h-[1200px]');
        if (overviewGradient) overviewGradient.classList.add('opacity-0');
        if (overviewToggleText) overviewToggleText.textContent = 'Show Less';
        if (overviewToggleIcon) overviewToggleIcon.classList.add('rotate-180');
      } else {
        overviewContent.classList.add('max-h-[140px]');
        overviewContent.classList.remove('max-h-[1200px]');
        if (overviewGradient) overviewGradient.classList.remove('opacity-0');
        if (overviewToggleText) overviewToggleText.textContent = 'Show More';
        if (overviewToggleIcon) overviewToggleIcon.classList.remove('rotate-180');
      }
    });
  }

  const formVesselInput = document.getElementById('form-vessel-name');
  if (formVesselInput) formVesselInput.value = `${vessel.name} (IMO: ${vessel.imoNumber})`;

  const pdfDownloadHero = document.getElementById('btn-download-pdf-hero');
  if (pdfDownloadHero) {
    pdfDownloadHero.href = vessel.pdfGaPlanUrl;
    pdfDownloadHero.setAttribute('download', `${vessel.name.replace(/\s+/g, '_')}_GA_Plan.pdf`);
  }

  // Photo Gallery & Lightbox Logic
  let currentPhotoIndex = 0;
  const photos = vessel.photos || [{ url: vessel.coverImageUrl, title: 'Main Exterior at Sea', category: 'hull' }];

  const stageImg = document.getElementById('gallery-stage-img');
  const stageTitle = document.getElementById('gallery-stage-title');
  const counterEl = document.getElementById('gallery-counter');
  const thumbsContainer = document.getElementById('gallery-thumbnails');
  const fullGridContainer = document.getElementById('gallery-full-grid');

  function updateGallery(idx) {
    currentPhotoIndex = idx;
    const p = photos[idx];
    if (stageImg) stageImg.src = p.url;
    if (stageTitle) stageTitle.textContent = p.title || `Photo #${idx + 1}`;
    if (counterEl) counterEl.textContent = `${idx + 1} / ${photos.length} photos`;

    // Highlight top 5 thumbnails if within range
    if (thumbsContainer) {
      const thumbs = thumbsContainer.querySelectorAll('button');
      thumbs.forEach((t, deg) => {
        if (deg === idx) {
          t.classList.add('border-amber-400', 'ring-2', 'ring-amber-400/40', 'opacity-100');
          t.classList.remove('border-white/10', 'opacity-70');
        } else {
          t.classList.remove('border-amber-400', 'ring-2', 'ring-amber-400/40', 'opacity-100');
          t.classList.add('border-white/10', 'opacity-70');
        }
      });
    }
  }

  // Render Top 5 Preview Thumbnails
  if (thumbsContainer) {
    const top5Photos = photos.slice(0, 5);
    thumbsContainer.innerHTML = top5Photos.map((p, idx) => `
      <button type="button" data-idx="${idx}" class="vessel-thumb-btn ${idx === 0 ? 'border-amber-400 ring-2 ring-amber-400/40 opacity-100 shadow-md' : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'}">
        <img src="${p.url}" alt="${p.title}" class="w-full h-full object-cover">
      </button>`
    ).join('');

    thumbsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const idx = Number(btn.getAttribute('data-idx'));
        updateGallery(idx);
      }
    });
  }

  // Render Full Photographic Archive Grid (6-column compact)
  if (fullGridContainer) {
    fullGridContainer.innerHTML = photos.map((p, idx) => `
      <div data-idx="${idx}" class="group relative h-24 sm:h-28 rounded-md overflow-hidden bg-[#111113] border border-white/10 cursor-pointer hover:border-gold transition-all shadow-md">
        <img src="${p.url}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
          <span class="text-[10px] text-white truncate font-mono">${p.title}</span>
        </div>
      </div>`
    ).join('');

    fullGridContainer.addEventListener('click', (e) => {
      const card = e.target.closest('[data-idx]');
      if (card) {
        const idx = Number(card.getAttribute('data-idx'));
        openLightbox(idx);
      }
    });
  }

  document.getElementById('gallery-prev-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const prev = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updateGallery(prev);
  });

  document.getElementById('gallery-next-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const next = (currentPhotoIndex + 1) % photos.length;
    updateGallery(next);
  });

  // Lightbox Modal Logic
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let lightboxIndex = 0;

  const lightboxThumbsContainer = document.getElementById('lightbox-thumbnails');
  const lightboxCategory = document.getElementById('lightbox-category');

  function renderLightboxThumbs() {
    if (!lightboxThumbsContainer) return;
    lightboxThumbsContainer.innerHTML = photos.map((p, idx) => `
      <button type="button" data-lb-idx="${idx}" class="lb-thumb-btn shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-none overflow-hidden border ${idx === lightboxIndex ? 'border-2 border-gold ring-2 ring-gold/40 scale-105 opacity-100 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'} transition-all cursor-pointer bg-black">
        <img src="${p.url}" alt="${p.title}" class="w-full h-full object-cover pointer-events-none">
      </button>
    `).join('');
  }

  function updateLightboxPhoto(idx) {
    lightboxIndex = idx;
    const p = photos[idx];
    if (lightboxImg) lightboxImg.src = p.url;
    if (lightboxCounter) lightboxCounter.textContent = `${idx + 1} / ${photos.length}`;
    if (lightboxTitle) lightboxTitle.textContent = `${vessel.name} — ${p.title || `Photo #${idx + 1}`}`;
    if (lightboxCategory) lightboxCategory.textContent = `Technical Survey: ${p.category ? p.category.toUpperCase() : 'INSPECTION'} ARCHIVE`;

    // Highlight active thumbnail in lightbox strip
    if (lightboxThumbsContainer) {
      const btns = lightboxThumbsContainer.querySelectorAll('.lb-thumb-btn');
      btns.forEach((btn, bIdx) => {
        if (bIdx === idx) {
          btn.className = 'lb-thumb-btn shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-none overflow-hidden border-2 border-gold ring-2 ring-gold/40 scale-105 opacity-100 shadow-lg transition-all cursor-pointer bg-black';
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          btn.className = 'lb-thumb-btn shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-none overflow-hidden border border-white/10 opacity-60 hover:opacity-100 hover:border-white/30 transition-all cursor-pointer bg-black';
        }
      });
    }
  }

  function openLightbox(idx = currentPhotoIndex) {
    if (!lightboxModal) return;
    renderLightboxThumbs();
    updateLightboxPhoto(idx);
    lightboxModal.classList.remove('opacity-0', 'pointer-events-none');
    lightboxModal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.classList.add('overflow-hidden');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('opacity-0', 'pointer-events-none');
    lightboxModal.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.classList.remove('overflow-hidden');
  }

  if (lightboxThumbsContainer) {
    lightboxThumbsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.lb-thumb-btn');
      if (btn) {
        const idx = Number(btn.getAttribute('data-lb-idx'));
        updateLightboxPhoto(idx);
      }
    });
  }

  document.getElementById('btn-open-stage-lightbox')?.addEventListener('click', () => openLightbox(currentPhotoIndex));
  document.getElementById('btn-open-all-photos')?.addEventListener('click', () => openLightbox(0));
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const prev = (lightboxIndex - 1 + photos.length) % photos.length;
      updateLightboxPhoto(prev);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = (lightboxIndex + 1) % photos.length;
      updateLightboxPhoto(next);
    });
  }

  // Keyboard navigation for gallery & lightbox
  window.addEventListener('keydown', (e) => {
    if (lightboxModal && !lightboxModal.classList.contains('pointer-events-none')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev?.click();
      if (e.key === 'ArrowRight') lightboxNext?.click();
    }
  });

  // Initial gallery call
  updateGallery(0);

  // Inquiry Form Submission Handler
  const inquiryForm = document.getElementById('vessel-inquiry-form');
  const successMsg = document.getElementById('form-success-msg');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      const payload = {
        vesselName: vessel.name,
        imo: vessel.imoNumber,
        clientName: document.getElementById('form-name')?.value,
        phone: document.getElementById('form-phone')?.value,
        email: document.getElementById('form-email')?.value,
        message: document.getElementById('form-message')?.value,
        submittedAt: new Date().toISOString()
      };

      try {
        await fetch('http://localhost:3000/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('CMS Leads API offline, continuing in demo mode:', err);
      }

      setTimeout(() => {
        if (successMsg) successMsg.classList.remove('hidden');
        inquiryForm.reset();
        if (formVesselInput) formVesselInput.value = `${vessel.name} (IMO: ${vessel.imoNumber})`;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Inquiry';
        }
      }, 600);
    });
  }

  // Modal PDF Viewer Handler
  const pdfModal = document.getElementById('pdf-modal');
  const pdfIframe = document.getElementById('pdf-modal-iframe');
  const pdfTitle = document.getElementById('pdf-modal-title');
  const pdfModalDownload = document.getElementById('pdf-modal-download');
  const pdfCloseBtn = document.getElementById('pdf-modal-close');
  const pdfBackdrop = document.getElementById('pdf-modal-backdrop');

  function openPdfModal(title, url) {
    if (!pdfModal || !pdfIframe) return;
    if (pdfTitle) pdfTitle.textContent = title;
    if (pdfModalDownload) {
      pdfModalDownload.href = url;
      pdfModalDownload.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
    }
    pdfIframe.src = url;
    pdfModal.classList.remove('opacity-0', 'pointer-events-none');
    pdfModal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.classList.add('overflow-hidden');
  }

  function closePdfModal() {
    if (!pdfModal || !pdfIframe) return;
    pdfModal.classList.add('opacity-0', 'pointer-events-none');
    pdfModal.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      pdfIframe.src = '';
    }, 300);
  }

  document.getElementById('btn-open-pdf-hero')?.addEventListener('click', () => {
    openPdfModal(`${vessel.name} — General Arrangement Plan`, vessel.pdfGaPlanUrl);
  });

  if (pdfCloseBtn) pdfCloseBtn.addEventListener('click', closePdfModal);
  if (pdfBackdrop) pdfBackdrop.addEventListener('click', closePdfModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && !pdfModal.classList.contains('pointer-events-none')) {
      closePdfModal();
    }
  });

  // Mobile Fullscreen Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  if (mobileMenuBtn && mobileMenuOverlay) {
    let isMenuOpen = false;
    mobileMenuBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenuOverlay.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
        mobileMenuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = '';
      }
    });

    mobileMenuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
        mobileMenuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = '';
      });
    });
  }

  // Exact height synchronization between left photo stage and right inquiry form on desktop
  function syncHeroHeight() {
    if (window.innerWidth < 1024) {
      const stage = document.querySelector('.vessel-stage-box');
      if (stage) stage.style.height = '';
      return;
    }
    const rightCard = document.querySelector('.vessel-advisor-card');
    const stage = document.querySelector('.vessel-stage-box');
    const thumbs = document.getElementById('gallery-thumbnails');
    const bottomBar = document.querySelector('.vessel-hero-left > div:last-child');
    
    if (rightCard && stage && thumbs) {
      const rightHeight = rightCard.getBoundingClientRect().height;
      const thumbsHeight = thumbs.getBoundingClientRect().height || 64;
      const bottomBarHeight = bottomBar ? bottomBar.getBoundingClientRect().height : 22;
      const gapTotal = 24; // clean gap between stage, thumbnails and action line
      const calculatedStageHeight = Math.round(rightHeight - thumbsHeight - bottomBarHeight - gapTotal);
      if (calculatedStageHeight > 320) {
        stage.style.height = `${calculatedStageHeight}px`;
      }
    }
  }

  syncHeroHeight();
  window.addEventListener('resize', syncHeroHeight);
  window.addEventListener('load', syncHeroHeight);
  setTimeout(syncHeroHeight, 200);
  setTimeout(syncHeroHeight, 600);
});