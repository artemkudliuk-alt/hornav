// src/company.js - Interactivity for Company Profile & Framework page
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Make all reveal elements visible with smooth trigger
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '50px' });
    reveals.forEach(r => obs.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('reveal-visible'));
  }

  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuOverlay.classList.contains('opacity-100');
      if (isOpen) {
        mobileMenuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      } else {
        mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenuOverlay.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileMenuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Interactive Cargo Matrix Tabs
  const cargoTabs = document.querySelectorAll('.cargo-tab-btn');
  const cargoPanels = document.querySelectorAll('.cargo-panel');

  if (cargoTabs.length > 0 && cargoPanels.length > 0) {
    cargoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetCategory = tab.getAttribute('data-cargo-category');

        // Update Tab Active States
        cargoTabs.forEach(t => {
          if (t === tab) {
            t.classList.remove('bg-white/5', 'text-neutral-400', 'border-white/10');
            t.classList.add('bg-gold', 'text-neutral-950', 'border-gold', 'shadow-lg');
          } else {
            t.classList.remove('bg-gold', 'text-neutral-950', 'border-gold', 'shadow-lg');
            t.classList.add('bg-white/5', 'text-neutral-400', 'border-white/10');
          }
        });

        // Show Corresponding Panel
        cargoPanels.forEach(panel => {
          if (panel.getAttribute('data-cargo-panel') === targetCategory) {
            panel.classList.remove('hidden');
            panel.classList.add('grid');
          } else {
            panel.classList.add('hidden');
            panel.classList.remove('grid');
          }
        });
      });
    });
  }

  // 3. Card Spotlight Cursor Tracking on Compliance Cards
  const cards = document.querySelectorAll('.framework-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-x', `${x}px`);
      card.style.setProperty('--card-y', `${y}px`);
    });
  });

  // 4. PDF Modal Viewer Logic
  const pdfModal = document.getElementById('pdf-modal');
  const pdfModalContainer = document.getElementById('pdf-modal-container');
  const pdfModalIframe = document.getElementById('pdf-modal-iframe');
  const pdfModalBackdrop = document.getElementById('pdf-modal-backdrop');
  const pdfModalClose = document.getElementById('pdf-modal-close');
  const pdfModalExpand = document.getElementById('pdf-modal-expand');
  const expandBtnText = document.getElementById('expand-btn-text');
  const btnViewMedicalPdf = document.getElementById('btn-view-medical-pdf');

  let isFullscreen = false;

  function openPdfModal(pdfUrl) {
    if (!pdfModal || !pdfModalIframe) return;
    // Set URL with fit to width and navigation panes enabled for smooth scrolling
    pdfModalIframe.src = `${pdfUrl}#view=FitH&toolbar=1&navpanes=1`;
    pdfModal.classList.remove('opacity-0', 'pointer-events-none');
    pdfModal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    if (!pdfModal || !pdfModalIframe) return;
    pdfModal.classList.remove('opacity-100', 'pointer-events-auto');
    pdfModal.classList.add('opacity-0', 'pointer-events-none');
    pdfModalIframe.src = '';
    document.body.style.overflow = '';
    
    // Reset fullscreen if was expanded
    if (isFullscreen && pdfModalContainer) {
      toggleFullscreen(false);
    }
  }

  function toggleFullscreen(forceState) {
    if (!pdfModalContainer) return;
    isFullscreen = typeof forceState === 'boolean' ? forceState : !isFullscreen;
    
    if (isFullscreen) {
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

  if (btnViewMedicalPdf) {
    btnViewMedicalPdf.addEventListener('click', () => {
      openPdfModal('/fleet/docs/Guidelines_on_the_medical.pdf');
    });
  }

  if (pdfModalExpand) {
    pdfModalExpand.addEventListener('click', () => toggleFullscreen());
  }

  if (pdfModalBackdrop) {
    pdfModalBackdrop.addEventListener('click', closePdfModal);
  }

  if (pdfModalClose) {
    pdfModalClose.addEventListener('click', closePdfModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('opacity-100')) {
      closePdfModal();
    }
  });
});
