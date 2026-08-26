// src/company.js - Interactivity for Company Profile & Framework page
import './style.css';
import { initPdfModal } from './pdf-viewer.js';

function initCompany() {
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

  // 4. High-Precision PDF Viewer Engine
  initPdfModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCompany);
} else {
  initCompany();
}
