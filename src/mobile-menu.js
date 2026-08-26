// src/mobile-menu.js - Universal Mobile Navigation Controller
export function initMobileMenu() {
  function setup() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    if (!mobileMenuBtn || !mobileMenuOverlay) return;

    if (mobileMenuBtn.dataset.menuInitialized === 'true') return;
    mobileMenuBtn.dataset.menuInitialized = 'true';

    function toggleMenu(forceState) {
      const isOpening = typeof forceState === 'boolean' 
        ? forceState 
        : !mobileMenuOverlay.classList.contains('active');

      if (isOpening) {
        mobileMenuBtn.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenuOverlay.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenuBtn.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
        mobileMenuOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = '';
      }
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    mobileMenuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}

// Auto-run on load
initMobileMenu();
