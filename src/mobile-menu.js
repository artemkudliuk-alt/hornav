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

// ── Universal CMS Dynamic Pages Menu & Footer Sync Engine ──
export async function syncHeaderFooterPages() {
  try {
    const apiBase = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://danamiratest.vercel.app';
    const res = await fetch(`${apiBase}/api/public/pages`).catch(() => fetch('/api/public/pages'));
    if (!res || !res.ok) return;

    const pages = await res.json();
    if (!Array.isArray(pages) || pages.length === 0) return;

    const staticSlugs = ['company.html', 'fleet.html', 'contacts.html', 'accountability.html', 'vessel.html', 'index.html', ''];
    const customPages = pages.filter(p => !staticSlugs.includes(p.slug.replace(/^\/+/, '')));

    if (customPages.length === 0) return;

    // 1. Sync Desktop Header "More ▾" Dropdown
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
      const navCustomPages = customPages.filter(p => p.includeInNav !== false);
      if (navCustomPages.length > 0) {
        let moreContainer = document.getElementById('nav-more-dropdown-container');
        if (!moreContainer) {
          moreContainer = document.createElement('div');
          moreContainer.id = 'nav-more-dropdown-container';
          moreContainer.className = 'relative group';
          moreContainer.innerHTML = `
            <button type="button" class="inline-flex items-center gap-1.5 hover:text-gold transition-colors py-2 uppercase tracking-[0.25em] cursor-pointer text-xs font-semibold">
              <span>More</span>
              <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-gold/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="absolute top-full left-0 pt-2 hidden group-hover:block min-w-[240px] z-50 animate-in fade-in slide-in-from-top-1 duration-200">
              <div class="bg-[#141416]/95 border border-neutral-800 p-2 shadow-2xl backdrop-blur-md flex flex-col gap-1 rounded-none" id="nav-more-items">
              </div>
            </div>
          `;
          // Insert right before Contact or at the end
          const contactLink = document.getElementById('nav-contacts');
          if (contactLink && contactLink.parentNode === navLinks) {
            navLinks.insertBefore(moreContainer, contactLink);
          } else {
            navLinks.appendChild(moreContainer);
          }
        } else {
          moreContainer.classList.remove('hidden');
        }

        const moreItems = document.getElementById('nav-more-items');
        if (moreItems) {
          moreItems.innerHTML = navCustomPages.map(p => {
            const pageUrl = `/page.html?slug=${p.slug.replace(/^\/+/, '')}`;
            return `<a href="${pageUrl}" class="px-3 py-2 text-xs text-neutral-300 hover:text-gold hover:bg-white/5 transition-colors uppercase tracking-wider block">${p.pageName || p.title}</a>`;
          }).join('');
        }
      }
    }

    // 2. Sync Mobile Menu
    const mobileMoreLinks = document.getElementById('mobile-more-links');
    if (mobileMoreLinks) {
      const navCustomPages = customPages.filter(p => p.includeInNav !== false);
      if (navCustomPages.length > 0) {
        mobileMoreLinks.classList.remove('hidden');
        mobileMoreLinks.innerHTML = `
          <span class="text-[10px] font-mono text-gold uppercase tracking-widest pt-2">Additional Pages</span>
          ${navCustomPages.map(p => {
            const pageUrl = `/page.html?slug=${p.slug.replace(/^\/+/, '')}`;
            return `<a href="${pageUrl}" class="text-neutral-300 hover:text-gold py-1.5 border-b border-white/5">${p.pageName || p.title}</a>`;
          }).join('')}
        `;
      }
    }

    // 3. Sync Footer Links
    const footerCustomLinks = document.getElementById('footer-custom-links');
    if (footerCustomLinks) {
      const footerPages = customPages.filter(p => p.includeInFooter !== false);
      if (footerPages.length > 0) {
        const extraHtml = footerPages.map(p => {
          const pageUrl = `/page.html?slug=${p.slug.replace(/^\/+/, '')}`;
          return `<a href="${pageUrl}" class="hover:text-white transition-colors block">${p.pageName || p.title}</a>`;
        }).join('');
        footerCustomLinks.innerHTML = extraHtml;
      }
    }
  } catch (e) {
    console.log('CMS public pages sync skipped:', e);
  }
}

// Auto-run on load across all pages
initMobileMenu();
initScrollTransitions();
initSwipeableRows();
syncHeaderFooterPages();



