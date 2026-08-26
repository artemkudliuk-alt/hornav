import './style.css';
import { FLEET_DATABASE } from './vessel-data.js';
import { initPdfModal } from './pdf-viewer.js';
import { initMobileMenu } from './mobile-menu.js';

document.addEventListener('DOMContentLoaded', async () => {
  const fleetList = Object.values(FLEET_DATABASE);
  const container = document.getElementById('fleet-cards-container');
  const countIndicator = document.getElementById('fleet-count-indicator');
  const filterButtons = document.querySelectorAll('.fleet-filter-btn');

  function renderVessels(filter = 'all') {
    if (!container) return;

    let filtered = fleetList;
    if (filter === 'general-cargo') {
      filtered = fleetList.filter(v => v.type.toLowerCase().includes('general cargo') && !v.type.toLowerCase().includes('bulk carrier'));
    } else if (filter === 'bulk-carrier') {
      filtered = fleetList.filter(v => v.type.toLowerCase().includes('bulk carrier'));
    } else if (filter === 'geared') {
      filtered = fleetList.filter(v => v.deckGear && v.deckGear.includes('Cranes'));
    }

    if (countIndicator) {
      countIndicator.textContent = `Showing ${filtered.length} of ${fleetList.length} vessels`;
    }

    // Render Cards Grid
    container.innerHTML = filtered.map((v, idx) => `
      <div class="bg-bg-secondary/70 border border-neutral-800/80 hover:border-gold/40 rounded-none p-6 sm:p-7 flex flex-col gap-6 transition-all duration-500 hover:-translate-y-1 group relative shadow-xl text-left" id="f-card-${v.id}">
        
        <!-- High-Contrast Status Badge (Sharp Corners) -->
        <div class="absolute top-9 right-9 z-20 bg-neutral-950/95 text-white border-2 border-emerald-500 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-none shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
          <span class="w-2 h-2 rounded-none bg-emerald-400 shadow-[0_0_8px_#34d399] inline-block"></span>
          <span class="text-white font-bold tracking-wider">${v.status.toUpperCase()}</span>
        </div>

        <!-- Image Container (Sharp Corners) -->
        <a href="/vessel.html?id=${v.id}" class="block w-full h-72 overflow-hidden rounded-none relative bg-neutral-900 group/img" title="View Full Particulars of ${v.name}">
          <img src="${v.coverImageUrl}" alt="${v.name} Commercial Vessel Danamira Shipping" class="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-[#141416]/80 via-transparent to-transparent pointer-events-none"></div>
          <span class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white/90 text-[10px] font-mono px-2.5 py-1 rounded-none border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity inline-flex items-center gap-1.5">
            <span>👁️ View Full Profile (${v.photos ? v.photos.length : 22} Photos)</span>
            <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </a>

        <!-- Specs Container -->
        <div class="flex-1 flex flex-col justify-between text-left">
          <div>
            <div class="flex justify-between items-baseline mb-2">
              <div>
                <a href="/vessel.html?id=${v.id}" class="hover:text-gold transition-colors">
                  <h3 class="text-2xl sm:text-3xl font-serif font-medium text-white flex items-center gap-2">
                    ${v.name}
                  </h3>
                </a>
                <span class="text-[11px] font-mono text-neutral-400 mt-0.5 block">IMO: ${v.imoNumber} • Built ${v.yearBuilt}</span>
              </div>
              <span class="text-xl font-serif text-gold/40 select-none">0${idx + 1}</span>
            </div>
            <div class="h-[1px] w-12 bg-gold/30 mb-4"></div>
            
            <!-- Specifications Sheet (3 Columns x 2 Rows) -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 font-sans text-xs border-t border-white/10 pt-4 mt-3">
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">DWT</span>
                <span class="text-white font-medium text-sm font-sans">${v.dwt}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Flag</span>
                <span class="text-white font-medium text-sm font-sans">${v.flag}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Year Built</span>
                <span class="text-white font-medium text-sm font-sans">${v.yearBuilt}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Vessel Type</span>
                <span class="text-white font-medium text-sm font-sans">${v.type}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Holds / Hatches</span>
                <span class="text-white font-medium text-sm font-sans">${v.holdsCount ? v.holdsCount.split('(')[0].trim() : '2HO / 2HA'}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Deck Gear</span>
                <span class="text-white font-medium text-sm font-sans">${v.deckGear}</span>
              </div>
            </div>
          </div>
          
          <!-- Buttons & Actions Row (Sharp Corners) -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-white/5">
            <div class="flex items-center gap-2">
              <button type="button" data-pdf="${v.pdfGaPlanUrl}" data-vessel="${v.name}" class="btn-ga-plan group inline-flex items-center gap-2 px-3 py-2 rounded-none bg-[#141416] hover:bg-[#1a1a1d] text-white border border-white/20 hover:border-red-500/60 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-sm whitespace-nowrap shrink-0">
                <!-- Classic Red PDF Document Badge Icon -->
                <svg viewBox="0 0 32 36" class="w-4 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2C5.34315 2 4 3.34315 4 5V31C4 32.6569 5.34315 34 7 34H25C26.6569 34 28 32.6569 28 31V12L18 2H7Z" stroke="#EF4444" stroke-width="2.2" stroke-linejoin="round" fill="none"/>
                  <path d="M18 2V12H28" stroke="#EF4444" stroke-width="2.2" stroke-linejoin="round"/>
                  <line x1="8" y1="13" x2="15" y2="13" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
                  <line x1="8" y1="17.5" x2="24" y2="17.5" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
                  <line x1="8" y1="22" x2="24" y2="22" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
                  <rect x="2" y="21" width="18" height="11" rx="2" fill="#EF4444"/>
                  <text x="11" y="29.5" fill="white" font-size="7.5" font-weight="900" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle" letter-spacing="-0.3px">PDF</text>
                </svg>
                <span class="font-bold text-white tracking-wider whitespace-nowrap">GA&#8209;PLAN</span>
                <svg class="w-3 h-3 text-neutral-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17L17 7M7 7h10v10"/>
                </svg>
              </button>

              <a href="/vessel.html?id=${v.id}" class="group/part inline-flex items-center gap-1.5 px-3 py-2 rounded-none bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/40 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200">
                <span>Full Particulars</span>
                <svg class="w-3 h-3 shrink-0 transition-transform duration-300 group-hover/part:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            <a href="/vessel.html?id=${v.id}#charter-inquiry" class="group/inq inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold hover:text-white transition-colors duration-200">
              <span>Inquire Vessel</span>
              <svg class="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/inq:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    `).join(''); // PDF triggers are handled automatically by initPdfModal via event delegation
  }

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-gold', 'text-black', 'font-bold');
        b.classList.add('bg-white/5', 'text-neutral-300');
      });

      btn.classList.add('bg-gold', 'text-black', 'font-bold');
      btn.classList.remove('bg-white/5', 'text-neutral-300');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderVessels(filter);
    });
  });

  renderVessels('all');

  // Initialize High-Precision PDF Viewer Engine
  initPdfModal();

  // Mobile Fullscreen Menu Toggle
  initMobileMenu();

  // Chartering Consultation Modal Logic
  const charterModal = document.getElementById('charter-modal');
  const openCharterBtn = document.getElementById('btn-open-charter-modal');
  const closeCharterBtn = document.getElementById('charter-modal-close');
  const charterBackdrop = document.getElementById('charter-modal-backdrop');
  const charterForm = document.getElementById('charter-modal-form');
  const charterStatusMsg = document.getElementById('charter-status-msg');

  function openCharterModal() {
    if (!charterModal) return;
    charterModal.classList.remove('opacity-0', 'pointer-events-none');
    charterModal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closeCharterModal() {
    if (!charterModal) return;
    charterModal.classList.remove('opacity-100', 'pointer-events-auto');
    charterModal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }

  if (openCharterBtn) openCharterBtn.addEventListener('click', openCharterModal);
  if (closeCharterBtn) closeCharterBtn.addEventListener('click', closeCharterModal);
  if (charterBackdrop) charterBackdrop.addEventListener('click', closeCharterModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && charterModal && !charterModal.classList.contains('opacity-0')) {
      closeCharterModal();
    }
  });

  if (charterForm) {
    charterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('charter-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING INQUIRY...';
      }

      setTimeout(() => {
        if (charterStatusMsg) {
          charterStatusMsg.textContent = '✓ Inquiry received. Danamira Chartering Desk will respond promptly.';
          charterStatusMsg.classList.remove('hidden');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'INQUIRY SUBMITTED ✓';
        }
        showToast('✓ Direct freight inquiry transmitted to Danamira Desk');
        setTimeout(() => {
          closeCharterModal();
          charterForm.reset();
          if (charterStatusMsg) charterStatusMsg.classList.add('hidden');
          if (submitBtn) submitBtn.innerHTML = '<span>Submit Direct Inquiry</span><svg class="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }, 2000);
      }, 700);
    });
  }

  // Toast Notification Helper
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'bg-[#17171a] border border-gold/60 text-white text-xs font-mono px-4 py-3 shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 flex items-center gap-2';
    toast.innerHTML = `<span class="text-gold">●</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Copy Email to Clipboard Buttons with Fallback
  document.querySelectorAll('.btn-copy-email').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email') || 'chartering@danamira-shipping.com';
      let success = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          success = true;
        }
      } catch (e) {
        success = false;
      }

      if (!success) {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          success = true;
        } catch (err) {
          success = false;
        }
      }

      showToast(`✓ Email copied: ${email}`);
    });
  });
});
