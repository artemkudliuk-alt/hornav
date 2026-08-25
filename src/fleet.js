import './style.css';
import { FLEET_DATABASE } from './vessel-data.js';

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
          <span class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white/90 text-[10px] font-mono px-2.5 py-1 rounded-none border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity">
            👁️ View Full Profile (${v.photos ? v.photos.length : 22} Photos) &rarr;
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
              <button type="button" data-pdf="${v.pdfGaPlanUrl}" data-vessel="${v.name}" class="btn-ga-plan inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white/5 hover:bg-gold/20 text-gold border border-gold/30 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer hover:border-gold active:scale-95">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                PDF GA-Plan
              </button>

              <a href="/vessel.html?id=${v.id}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-none bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/40 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200">
                Full Particulars &rarr;
              </a>
            </div>

            <a href="/vessel.html?id=${v.id}#charter-inquiry" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-white transition-colors duration-200">
              Inquire Vessel <span class="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
        </div>

      </div>
    `).join('');

    // Attach PDF modal triggers
    container.querySelectorAll('.btn-ga-plan').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-pdf');
        const name = btn.getAttribute('data-vessel');
        openPdfModal(url, name);
      });
    });
  }

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-gold', 'text-neutral-950');
        b.classList.add('bg-white/5', 'text-neutral-300');
      });
      btn.classList.add('bg-gold', 'text-neutral-950');
      btn.classList.remove('bg-white/5', 'text-neutral-300');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderVessels(filter);
    });
  });

  renderVessels('all');

  // PDF Modal
  const modal = document.getElementById('pdf-modal');
  const iframe = document.getElementById('pdf-modal-iframe');
  const title = document.getElementById('pdf-modal-title');
  const downloadBtn = document.getElementById('pdf-modal-download');
  const closeBtn = document.getElementById('pdf-modal-close');
  const backdrop = document.getElementById('pdf-modal-backdrop');

  function openPdfModal(pdfUrl, vesselName) {
    if (!modal || !iframe) return;
    if (title) title.textContent = `${vesselName} — General Arrangement Plan (GA-Plan)`;
    if (downloadBtn) {
      downloadBtn.href = pdfUrl;
      downloadBtn.setAttribute('download', `${vesselName.replace(/\s+/g, '_')}_GA_Plan.pdf`);
    }
    iframe.src = `${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    if (!modal || !iframe) return;
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    setTimeout(() => { iframe.src = 'about:blank'; }, 200);
  }

  if (closeBtn) closeBtn.addEventListener('click', closePdfModal);
  if (backdrop) backdrop.addEventListener('click', closePdfModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('opacity-0')) {
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
          if (submitBtn) submitBtn.textContent = 'Submit Direct Inquiry →';
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
