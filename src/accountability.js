// src/accountability.js - Interactivity for Accountability in Action (Regulatory Architecture)
import './style.css';
import { initPdfModal } from './pdf-viewer.js';
import { initMobileMenu } from './mobile-menu.js';

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
  initMobileMenu();

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

  // 3. High-Precision PDF Viewer Engine
  initPdfModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccountability);
} else {
  initAccountability();
}
