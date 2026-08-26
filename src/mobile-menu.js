// src/mobile-menu.js - Universal Mobile Navigation & Scroll Transitions Controller

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

// ── Universal Scroll Reveal & Swipe Transitions Engine (transitions-dev) ──
export function initScrollTransitions() {
  function setup() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal], [data-stagger-group]').forEach(el => {
        el.classList.add('reveal-visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 40px 0px',
      threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('reveal-visible');
          
          // Clean up will-change after transition
          const onTransitionEnd = () => {
            target.style.willChange = 'auto';
            target.removeEventListener('transitionend', onTransitionEnd);
          };
          target.addEventListener('transitionend', onTransitionEnd, { once: true });
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    function registerElements(root = document) {
      const elements = root.querySelectorAll('[data-reveal], [data-stagger-group]');
      const windowHeight = window.innerHeight;

      elements.forEach(el => {
        if (el.classList.contains('reveal-visible')) return;

        const rect = el.getBoundingClientRect();
        // Immediately reveal elements visible above the fold on initial load
        if (rect.top < windowHeight * 0.95 && rect.bottom > 0) {
          el.classList.add('reveal-visible');
        } else {
          el.style.willChange = 'transform, opacity, filter';
          revealObserver.observe(el);
        }
      });
    }

    registerElements();

    // Observe dynamically injected nodes (e.g. fleet cards, accordions)
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldRegister = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldRegister = true;
        }
      });
      if (shouldRegister) {
        registerElements();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}

// ── Universal Swipeable / Draggable Row Controller ──
export function initSwipeableRows() {
  function setup() {
    const containers = document.querySelectorAll('.swipeable-tabs-row, [data-swipeable]');
    containers.forEach(container => {
      if (container.dataset.swipeInitialized === 'true') return;
      container.dataset.swipeInitialized = 'true';

      let isDown = false;
      let startX = 0;
      let startScrollLeft = 0;
      let hasMoved = false;

      const getPageX = (e) => {
        if (e.touches && e.touches.length > 0) return e.touches[0].pageX;
        if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].pageX;
        return e.pageX || e.clientX || 0;
      };

      const startDrag = (e) => {
        isDown = true;
        hasMoved = false;
        startX = getPageX(e);
        startScrollLeft = container.scrollLeft;
        container.style.scrollBehavior = 'auto';
        container.style.scrollSnapType = 'none';
      };

      const moveDrag = (e) => {
        if (!isDown) return;
        const currentX = getPageX(e);
        const diff = currentX - startX;
        if (Math.abs(diff) > 4) {
          hasMoved = true;
        }
        container.scrollLeft = startScrollLeft - diff;
      };

      const endDrag = () => {
        if (!isDown) return;
        isDown = false;
        container.style.scrollBehavior = 'smooth';
        container.style.scrollSnapType = 'x proximity';
      };

      container.addEventListener('mousedown', startDrag);
      window.addEventListener('mousemove', moveDrag);
      window.addEventListener('mouseup', endDrag);

      container.addEventListener('touchstart', startDrag, { passive: true });
      window.addEventListener('touchmove', moveDrag, { passive: true });
      window.addEventListener('touchend', endDrag, { passive: true });
      window.addEventListener('touchcancel', endDrag, { passive: true });

      // Prevent button click if the user was swiping/dragging
      container.addEventListener('click', (e) => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}

// Auto-run on load across all 6 pages
initMobileMenu();
initScrollTransitions();
initSwipeableRows();


