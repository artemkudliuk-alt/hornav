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
  }
  .vessel-hero-right {
    width: 100% !important;
    min-width: 0 !important;
  }
  .vessel-stage-box {
    position: relative !important;
    width: 100% !important;
    height: 380px !important;
    min-height: 380px !important;
    max-height: 480px !important;
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
      height: 440px !important;
      min-height: 440px !important;
    }
  }
  .vessel-thumbs-5 {
    display: grid !important;
    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
    gap: 0.5rem !important;
    width: 100% !important;
    height: 60px !important;
  }
  .vessel-thumb-btn {
    position: relative !important;
    height: 60px !important;
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
      grid-template-columns: minmax(0, 1fr) 380px !important;
      align-items: start !important;
      gap: 2.5rem !important;
      width: 100% !important;
    }
    .vessel-hero-right {
      position: sticky !important;
      top: 6rem !important;
      width: 380px !important;
      max-width: 100% !important;
      align-self: start !important;
    }
    .vessel-advisor-card {
      height: auto !important;
      min-height: auto !important;
    }
  }
  @media (min-width: 1280px) {
    .vessel-hero-grid {
      grid-template-columns: minmax(0, 1fr) 400px !important;
      gap: 3rem !important;
    }
    .vessel-hero-right {
      width: 400px !important;
    }
  }
  .vessel-advisor-card {
    background-color: #17171a !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 0 !important;
    padding: 1.5rem !important;
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
    row-gap: 1rem !important;
    column-gap: 2rem !important;
    width: 100% !important;
    margin-top: 1rem !important;
  }
  @media (min-width: 640px) {
    .vessel-specs-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }
  @media (min-width: 1200px) {
    .vessel-specs-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      column-gap: 2.5rem !important;
    }
  }
  .vessel-spec-item {
    display: flex !important;
    align-items: baseline !important;
    justify-content: space-between !important;
    padding-bottom: 0.625rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    font-size: 0.75rem !important;
    gap: 1rem !important;
    min-width: 0 !important;
  }
  .vessel-spec-label {
    color: #a3a3a3 !important;
    font-family: var(--font-sans), "Plus Jakarta Sans", sans-serif !important;
    font-size: 0.8125rem !important;
    text-transform: none !important;
    letter-spacing: normal !important;
    white-space: normal !important;
    flex-shrink: 1 !important;
  }
  .vessel-spec-value {
    color: #f5f5f5 !important;
    font-family: var(--font-sans), "Plus Jakarta Sans", sans-serif !important;
    font-size: 0.8125rem !important;
    font-weight: 600 !important;
    text-align: right !important;
    white-space: normal !important;
    margin-left: auto !important;
    font-variant-numeric: tabular-nums !important;
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
    width: 96vw !important;
    max-width: 1440px !important;
    height: 92vh !important;
    max-height: 94vh !important;
    background-color: #141416 !important;
    border: 1px solid rgba(200, 155, 60, 0.4) !important;
    border-radius: 0 !important;
    box-shadow: 0 25px 70px -10px rgba(0, 0, 0, 0.98), 0 0 35px rgba(200, 155, 60, 0.15) !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }
  .lightbox-header-bar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0.75rem 1.25rem !important;
    background-color: #0d0d0f !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    flex-shrink: 0 !important;
  }
  .lightbox-stage-container {
    position: relative !important;
    width: 100% !important;
    flex: 1 1 auto !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    background-color: #08080a !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
    padding: 1rem 3.5rem !important;
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
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
  }
  .lightbox-nav-btn {
    position: absolute !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 48px !important;
    height: 48px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-color: rgba(18, 18, 20, 0.85) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 0 !important;
    cursor: pointer !important;
    z-index: 20 !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7) !important;
  }
  .lightbox-nav-btn:hover {
    background-color: #c89b3c !important;
    color: #000000 !important;
    border-color: #c89b3c !important;
    transform: translateY(-50%) scale(1.05) !important;
  }
  .lightbox-nav-btn.prev {
    left: 1rem !important;
  }
  .lightbox-nav-btn.next {
    right: 1rem !important;
  }
  .lightbox-footer-bar {
    padding: 0.625rem 1.25rem 0.75rem !important;
    background-color: #0d0d0f !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    flex-shrink: 0 !important;
  }
  #lightbox-thumbnails {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    overflow-x: auto !important;
    padding: 0.25rem 0 !important;
    max-width: 100% !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  #lightbox-thumbnails::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  .lb-thumb-btn {
    flex-shrink: 0 !important;
    width: 76px !important;
    height: 52px !important;
    border-radius: 0 !important;
    overflow: hidden !important;
    background-color: #000000 !important;
    cursor: pointer !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    opacity: 0.5 !important;
    transition: all 0.2s ease !important;
    padding: 0 !important;
  }
  .lb-thumb-btn:hover {
    opacity: 1 !important;
    border-color: rgba(255, 255, 255, 0.6) !important;
  }
  .lb-thumb-btn.active {
    opacity: 1 !important;
    border: 2px solid #c89b3c !important;
    box-shadow: 0 0 12px rgba(200, 155, 60, 0.5) !important;
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

  // Populate Top 4 KPI metrics
  const specDwt = document.getElementById('spec-dwt');
  if (specDwt) specDwt.textContent = vessel.dwt || '6,408 MT';

  const specGrain = document.getElementById('spec-grain');
  if (specGrain) specGrain.textContent = vessel.grainCapacity ? vessel.grainCapacity.split('(')[0].trim() : '315,000 cu.ft';

  const specCranes = document.getElementById('spec-cranes');
  if (specCranes) specCranes.textContent = vessel.deckGear || '2 x 30 MT Cranes';

  const specDraft = document.getElementById('spec-draft');
  if (specDraft) specDraft.textContent = vessel.draft ? vessel.draft.split('(')[0].trim() : '6.85 m';

  // Render Structured Technical Particulars (Matching Official Vessel Description Sheet)
  const structuredContainer = document.getElementById('vessel-structured-specs-container');
  if (structuredContainer && vessel.specSections) {
    const s = vessel.specSections;
    
    structuredContainer.innerHTML = `
      <!-- Row 1: INFORMATION + HOLDS/BALLAST/LOADS -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <!-- CARD 1: ① INFORMATION -->
        <div class="bg-[#17171a] border border-white/[0.08] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2.5 pb-3 mb-3 border-b border-border-gold/30">
              <span class="w-2 h-2 bg-gold shrink-0"></span>
              <h3 class="text-sm font-serif font-semibold tracking-wider uppercase text-gold">① Information</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 pt-1">
              ${(s.information || []).map(item => `
                <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.06] text-xs sm:text-sm gap-3">
                  <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                  <span class="text-neutral-100 font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- CARD 2: ③ HOLDS & HATCHES + ④ BALLAST & STRENGTH + ⑧ PERMISSIBLE LOADS -->
        <div class="bg-[#17171a] border border-white/[0.08] p-5 sm:p-6 shadow-2xl space-y-5">
          <!-- Holds & Hatches -->
          <div>
            <div class="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
              <span class="w-1.5 h-1.5 bg-gold shrink-0"></span>
              <h4 class="text-xs sm:text-sm font-serif font-semibold tracking-wider uppercase text-gold">③ Holds &amp; Hatches</h4>
            </div>
            <div class="space-y-0.5">
              ${(s.holdsHatches || []).map(item => `
                <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.04] text-xs sm:text-sm gap-3">
                  <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                  <span class="text-neutral-100 font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Ballast & Strength -->
          <div class="pt-2">
            <div class="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
              <span class="w-1.5 h-1.5 bg-gold shrink-0"></span>
              <h4 class="text-xs sm:text-sm font-serif font-semibold tracking-wider uppercase text-gold">④ Ballast &amp; Strength</h4>
            </div>
            <div class="space-y-0.5">
              ${(s.ballastStrength || []).map(item => `
                <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.04] text-xs sm:text-sm gap-3">
                  <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                  <span class="text-neutral-100 font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Permissible Loads -->
          <div class="pt-2">
            <div class="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
              <span class="w-1.5 h-1.5 bg-gold shrink-0"></span>
              <h4 class="text-xs sm:text-sm font-serif font-semibold tracking-wider uppercase text-gold">⑧ Permissible Loads</h4>
            </div>
            <div class="space-y-0.5">
              ${(s.permissibleLoads || []).map(item => `
                <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.04] text-xs sm:text-sm gap-3">
                  <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                  <span class="text-gold font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>

      <!-- Row 2: PARTICULARS + SPEED/TANKS/ENGINE -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <!-- CARD 3: ② PARTICULARS -->
        <div class="bg-[#17171a] border border-white/[0.08] p-5 sm:p-6 shadow-2xl space-y-3">
          <div class="flex items-center gap-2.5 pb-3 border-b border-border-gold/30">
            <span class="w-2 h-2 bg-gold shrink-0"></span>
            <h3 class="text-sm font-serif font-semibold tracking-wider uppercase text-gold">② Particulars &amp; Capacities</h3>
          </div>
          <div class="space-y-0.5">
            ${(s.particulars || []).map(item => `
              <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.06] text-xs sm:text-sm gap-3">
                <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                <span class="text-neutral-100 font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CARD 4: ⑤ SPEED & CONSUMPTION + ⑥ TANK CAPACITIES + ⑦ MAIN ENGINE -->
        <div class="bg-[#17171a] border border-white/[0.08] p-5 sm:p-6 shadow-2xl space-y-5">
          
          <!-- Speed & Consumption -->
          <div>
            <div class="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
              <span class="w-1.5 h-1.5 bg-gold shrink-0"></span>
              <h4 class="text-xs sm:text-sm font-serif font-semibold tracking-wider uppercase text-gold">⑤ Speed &amp; Consumption</h4>
            </div>
            <div class="space-y-0.5">
              ${(s.speedConsumption || []).map(item => `
                <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.04] text-xs sm:text-sm gap-3">
                  <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                  <span class="text-neutral-100 font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tank Capacities -->
          <div class="pt-2">
            <div class="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
              <span class="w-1.5 h-1.5 bg-gold shrink-0"></span>
              <h4 class="text-xs sm:text-sm font-serif font-semibold tracking-wider uppercase text-gold">⑥ Tank Capacities (100%)</h4>
            </div>
            <div class="space-y-0.5">
              ${(s.tankCapacities || []).map(item => `
                <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.04] text-xs sm:text-sm gap-3">
                  <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                  <span class="text-neutral-100 font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Main Engine & Auxiliary Machinery -->
          <div class="pt-2">
            <div class="flex items-center gap-2 pb-2 mb-2 border-b border-white/10">
              <span class="w-1.5 h-1.5 bg-gold shrink-0"></span>
              <h4 class="text-xs sm:text-sm font-serif font-semibold tracking-wider uppercase text-gold">⑦ Main Engine &amp; Machinery</h4>
            </div>
            <div class="space-y-0.5">
              ${(s.mainEngine || []).map(item => `
                <div class="flex items-baseline justify-between py-1.5 border-b border-white/[0.04] text-xs sm:text-sm gap-3">
                  <span class="text-neutral-400 font-sans text-xs sm:text-sm font-normal">${item.label}</span>
                  <span class="text-neutral-100 font-sans text-xs sm:text-sm font-semibold text-right tabular-nums">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // Render Feature Badges Bar
  const badgesBar = document.getElementById('vessel-feature-badges-bar');
  if (badgesBar) {
    badgesBar.innerHTML = `
      <div class="bg-[#111113] border border-white/10 p-3.5 flex flex-col items-center text-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5 text-gold"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        <span class="text-[11px] font-sans uppercase tracking-wider text-neutral-400 font-medium">Grain Capacity</span>
        <span class="text-xs sm:text-sm font-sans font-bold text-white tracking-tight">${vessel.grainCapacity ? vessel.grainCapacity.split('(')[0].trim() : '352,000 cu.ft'}</span>
      </div>
      <div class="bg-[#111113] border border-white/10 p-3.5 flex flex-col items-center text-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5 text-gold"><path d="M4 20h16M7 20V5l8 4v11M15 9l4 2v4a2 2 0 11-4 0"/></svg>
        <span class="text-[11px] font-sans uppercase tracking-wider text-neutral-400 font-medium">Tanktop Strength</span>
        <span class="text-xs sm:text-sm font-sans font-bold text-white tracking-tight">${vessel.tankTopStrength || '16.5 MT / m²'}</span>
      </div>
      <div class="bg-[#111113] border border-white/10 p-3.5 flex flex-col items-center text-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5 text-gold"><path d="M4 4h16v16H4zM4 10h16M10 4v16"/></svg>
        <span class="text-[11px] font-sans uppercase tracking-wider text-neutral-400 font-medium">Hatch Covers</span>
        <span class="text-xs sm:text-sm font-sans font-bold text-white tracking-tight">Hydraulic Folding</span>
      </div>
      <div class="bg-[#111113] border border-white/10 p-3.5 flex flex-col items-center text-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5 text-gold"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span class="text-[11px] font-sans uppercase tracking-wider text-neutral-400 font-medium">Fire Safety</span>
        <span class="text-xs sm:text-sm font-sans font-bold text-white tracking-tight">CO2 Fitted in Holds</span>
      </div>
      <div class="bg-[#111113] border border-white/10 p-3.5 flex flex-col items-center text-center gap-1.5 col-span-2 sm:col-span-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5 text-gold"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></svg>
        <span class="text-[11px] font-sans uppercase tracking-wider text-neutral-400 font-medium">Class Society</span>
        <span class="text-xs sm:text-sm font-sans font-bold text-white tracking-tight">${vessel.classSociety ? vessel.classSociety.split('(')[0].trim() : 'IACS Class'}</span>
      </div>
    `;
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
  const counterEl = document.getElementById('gallery-counter-tab');
  const thumbsContainer = document.getElementById('gallery-thumbnails');

  function renderGalleryThumbnails() {
    if (!thumbsContainer) return;
    const top4 = photos.slice(0, 4);
    const fifthPhoto = photos[4] || photos[0];
    const moreCount = Math.max(0, photos.length - 4);

    let html = top4.map((p, idx) => `
      <button type="button" data-idx="${idx}" class="vessel-thumb-btn relative h-20 sm:h-24 overflow-hidden border ${idx === currentPhotoIndex ? 'border-2 border-gold ring-2 ring-gold/40 opacity-100 shadow-md' : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'} transition-all cursor-pointer bg-black/60 group">
        <img src="${p.url}" alt="${p.title}" class="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300">
      </button>`
    ).join('');

    if (photos.length > 4) {
      html += `
        <button type="button" id="btn-open-gallery-more" class="vessel-thumb-more relative h-20 sm:h-24 overflow-hidden border border-gold/40 hover:border-gold transition-all cursor-pointer bg-black/80 group">
          <img src="${fifthPhoto.url}" alt="All Inspection Photos" class="w-full h-full object-cover opacity-35 group-hover:scale-105 group-hover:opacity-45 transition-all duration-300 pointer-events-none">
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center justify-center p-1 text-center pointer-events-none">
            <span class="text-xs sm:text-sm font-mono font-bold text-gold tracking-wider">+${moreCount}</span>
            <span class="text-[9px] font-mono text-white/90 uppercase tracking-widest mt-0.5">All Photos &rarr;</span>
          </div>
        </button>
      `;
    }

    thumbsContainer.innerHTML = html;
  }

  function updateGallery(idx) {
    currentPhotoIndex = idx;
    const p = photos[idx];
    if (stageImg) stageImg.src = p.url;
    if (stageTitle) stageTitle.textContent = p.title || `Photo #${idx + 1}`;
    if (counterEl) counterEl.textContent = `${idx + 1} / ${photos.length} photos`;

    // Highlight top 4 thumbnails if within range
    if (thumbsContainer) {
      const thumbs = thumbsContainer.querySelectorAll('.vessel-thumb-btn');
      thumbs.forEach((t, deg) => {
        if (deg === idx) {
          t.className = 'vessel-thumb-btn relative h-20 sm:h-24 overflow-hidden border-2 border-gold ring-2 ring-gold/40 opacity-100 shadow-md transition-all cursor-pointer bg-black/60 group';
        } else {
          t.className = 'vessel-thumb-btn relative h-20 sm:h-24 overflow-hidden border border-white/15 opacity-70 hover:opacity-100 hover:border-white/40 transition-all cursor-pointer bg-black/60 group';
        }
      });
    }
  }

  // Initialize gallery
  updateGallery(0);
  renderGalleryThumbnails();

  if (thumbsContainer) {
    thumbsContainer.addEventListener('click', (e) => {
      const moreBtn = e.target.closest('#btn-open-gallery-more');
      if (moreBtn) {
        openLightbox(4);
        return;
      }
      const btn = e.target.closest('.vessel-thumb-btn');
      if (btn) {
        const idx = Number(btn.getAttribute('data-idx'));
        updateGallery(idx);
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

  document.getElementById('btn-open-stage-lightbox')?.addEventListener('click', () => {
    openLightbox(currentPhotoIndex);
  });

  document.getElementById('btn-open-all-photos')?.addEventListener('click', () => {
    openLightbox(0);
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

    lightboxThumbsContainer.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        lightboxThumbsContainer.scrollLeft += e.deltaY * 1.5;
      }
    }, { passive: false });
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

  // Inquiry Modal Logic
  const inquiryModal = document.getElementById('inquiry-modal');
  const btnOpenInquiryModal = document.getElementById('btn-open-inquiry-modal');
  const inquiryModalClose = document.getElementById('inquiry-modal-close');
  const inquiryModalBackdrop = document.getElementById('inquiry-modal-backdrop');
  const inquirySubtitle = document.getElementById('inquiry-modal-vessel-subtitle');

  function openInquiryModal() {
    if (!inquiryModal) return;
    if (inquirySubtitle) inquirySubtitle.textContent = `Direct chartering desk inquiry for ${vessel.name} (IMO: ${vessel.imoNumber}).`;
    if (formVesselInput) formVesselInput.value = `${vessel.name} (IMO: ${vessel.imoNumber})`;
    inquiryModal.classList.remove('opacity-0', 'pointer-events-none');
    inquiryModal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.classList.add('overflow-hidden');
  }

  function closeInquiryModal() {
    if (!inquiryModal) return;
    inquiryModal.classList.add('opacity-0', 'pointer-events-none');
    inquiryModal.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.classList.remove('overflow-hidden');
  }

  if (btnOpenInquiryModal) btnOpenInquiryModal.addEventListener('click', openInquiryModal);
  if (inquiryModalClose) inquiryModalClose.addEventListener('click', closeInquiryModal);
  if (inquiryModalBackdrop) inquiryModalBackdrop.addEventListener('click', closeInquiryModal);

  // Keyboard navigation for gallery, lightbox, and inquiry modal
  window.addEventListener('keydown', (e) => {
    if (lightboxModal && !lightboxModal.classList.contains('pointer-events-none')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev?.click();
      if (e.key === 'ArrowRight') lightboxNext?.click();
    }
    if (inquiryModal && !inquiryModal.classList.contains('pointer-events-none')) {
      if (e.key === 'Escape') closeInquiryModal();
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
  const pdfModalContainer = document.getElementById('pdf-modal-container');
  const pdfIframe = document.getElementById('pdf-modal-iframe');
  const pdfTitle = document.getElementById('pdf-modal-title');
  const pdfModalDownload = document.getElementById('pdf-modal-download');
  const pdfCloseBtn = document.getElementById('pdf-modal-close');
  const pdfExpandBtn = document.getElementById('pdf-modal-expand');
  const expandBtnText = document.getElementById('expand-btn-text');
  const pdfBackdrop = document.getElementById('pdf-modal-backdrop');

  let isPdfFullscreen = false;

  function togglePdfFullscreen(forceState) {
    if (!pdfModalContainer) return;
    isPdfFullscreen = typeof forceState === 'boolean' ? forceState : !isPdfFullscreen;
    
    if (isPdfFullscreen) {
      pdfModalContainer.classList.remove('max-w-6xl', 'h-[94vh]', 'sm:h-[90vh]', 'rounded-xl');
      pdfModalContainer.classList.add('max-w-none', 'w-screen', 'h-screen', 'rounded-none', 'border-0');
      if (pdfModal) pdfModal.classList.remove('p-2', 'sm:p-4', 'md:p-6');
      if (expandBtnText) expandBtnText.textContent = 'Exit Fullscreen';
    } else {
      pdfModalContainer.classList.remove('max-w-none', 'w-screen', 'h-screen', 'rounded-none', 'border-0');
      pdfModalContainer.classList.add('max-w-6xl', 'h-[94vh]', 'sm:h-[90vh]', 'rounded-xl');
      if (pdfModal) pdfModal.classList.add('p-2', 'sm:p-4', 'md:p-6');
      if (expandBtnText) expandBtnText.textContent = 'Full Width';
    }
  }

  function openPdfModal(title, url) {
    if (!pdfModal || !pdfIframe) return;
    if (pdfTitle) pdfTitle.textContent = title;
    if (pdfModalDownload) {
      pdfModalDownload.href = url;
      pdfModalDownload.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
    }
    pdfIframe.src = `${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
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
      pdfIframe.src = 'about:blank';
    }, 300);
    if (isPdfFullscreen && pdfModalContainer) {
      togglePdfFullscreen(false);
    }
  }

  if (pdfExpandBtn) pdfExpandBtn.addEventListener('click', () => togglePdfFullscreen());

  document.getElementById('btn-open-pdf-hero')?.addEventListener('click', () => {
    openPdfModal(`${vessel.name} — General Arrangement Plan`, vessel.pdfGaPlanUrl);
  });

  document.getElementById('btn-tab-pdf-trigger')?.addEventListener('click', () => {
    openPdfModal(`${vessel.name} — General Arrangement Plan`, vessel.pdfGaPlanUrl);
  });

  document.getElementById('btn-view-ga-plan-tab')?.addEventListener('click', () => {
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
});