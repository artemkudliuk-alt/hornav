// src/accountability.js - Interactivity for Accountability in Action (Regulatory Architecture)
import './style.css';

function initAccountability() {
  // 0. Scroll reveal observer
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
      const isOpen = mobileMenuBtn.classList.toggle('active');
      mobileMenuOverlay.classList.toggle('active', isOpen);
      
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    mobileMenuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Card Spotlight Cursor Tracking on Compliance Cards
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

  // 3. PDF Modal Viewer Logic
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

  if (pdfModalClose) pdfModalClose.addEventListener('click', closePdfModal);
  if (pdfModalBackdrop) pdfModalBackdrop.addEventListener('click', closePdfModal);
  if (pdfModalExpand) pdfModalExpand.addEventListener('click', () => toggleFullscreen());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('opacity-100')) {
      closePdfModal();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccountability);
} else {
  initAccountability();
}
