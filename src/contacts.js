import './style.css';
import { initMobileMenu } from './mobile-menu.js';

/**
 * Danamira Shipping Ltd - Contacts Page Logic
 */

function initContacts() {
  // 1. Mobile Menu Toggle
  initMobileMenu();

  // 2. Email Copy Buttons
  document.querySelectorAll('.btn-copy-email').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || btn.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="text-gold font-bold">✓ Copied to clipboard!</span>`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      } catch (err) {
        // Fallback: open mail client
        window.location.href = `mailto:${email}`;
      }
    });
  });

  // 3. Direct Contact Form Submission
  const contactForm = document.getElementById('contact-page-form');
  const formCard = document.getElementById('contact-form-card');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && formCard && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('c-name')?.value.trim() || '';
      const company = document.getElementById('c-company')?.value.trim() || '';
      const email = document.getElementById('c-email')?.value.trim() || '';
      const department = document.getElementById('c-department')?.value || 'General Inquiry';
      const message = document.getElementById('c-message')?.value.trim() || '';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-950 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>TRANSMITTING MESSAGE...</span>
      `;

      // Simulating API dispatch
      try {
        await fetch('/api/public/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            company,
            email,
            notes: `[Department: ${department}] ${message}`,
            source: 'contacts_page'
          })
        }).catch(() => null);
      } catch (err) {
        // Fallback gracefully
      }

      setTimeout(() => {
        formCard.innerHTML = `
          <div class="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
            <div class="w-14 h-14 rounded-none border border-gold flex items-center justify-center text-gold shadow-lg shadow-gold/10">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-2xl font-serif text-white font-medium uppercase">Message Dispatched</h3>
            <p class="text-xs sm:text-sm text-neutral-300 max-w-md font-light leading-relaxed">
              Thank you for contacting Danamira Shipping Ltd. Your message has been routed to our Glyfada office management desk. A designated representative will follow up with you promptly.
            </p>
            <div class="pt-4">
              <span class="text-[10px] font-mono uppercase tracking-widest text-gold/80 block">Direct Emergency Operations Line:</span>
              <a href="tel:+302113456550" class="text-sm font-mono text-white hover:text-gold transition-colors font-bold whitespace-nowrap">+30 211 34 56 550</a>
            </div>
          </div>
        `;
      }, 700);
    });
  }
  // 4. Sync Branch Offices & Regional Agencies from Danamira CMS
  async function syncBranchesFromCMS() {
    const grid = document.getElementById('branches-cards-grid');
    const countBadge = document.getElementById('branches-count-badge');
    if (!grid) return;

    try {
      const apiBase = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://danamiratest.vercel.app';
      const res = await fetch(`${apiBase}/api/public/contacts`).catch(() => fetch('/api/public/contacts'));
      if (!res || !res.ok) return;

      const data = await res.json();
      const offices = data.offices || [];
      if (!Array.isArray(offices) || offices.length === 0) return;

      if (countBadge) {
        countBadge.textContent = `${offices.length} Active Stations`;
      }

      grid.innerHTML = offices.map((office, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        return `
          <div class="p-6 sm:p-7 bg-[#141416]/95 border border-neutral-800 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between gap-5 relative group shadow-xl text-left backdrop-blur-md rounded-none">
            <div>
              <div class="flex items-start justify-between gap-2 mb-3">
                <span class="text-[10px] font-mono font-bold tracking-[0.2em] text-gold uppercase">
                  ${office.country || 'Port Agency'} &bull; ${office.portCity || ''}
                </span>
                <span class="text-sm font-serif text-gold/40 select-none font-bold">${num}</span>
              </div>
              <h3 class="text-lg sm:text-xl font-serif text-white font-medium group-hover:text-gold transition-colors">
                ${office.name}
              </h3>
              <p class="text-xs text-neutral-400 font-light mt-1.5 leading-relaxed">
                ${office.address || 'Port Terminal & Agency Desk'}
              </p>
            </div>

            <div class="border-t border-white/10 pt-4 flex flex-col gap-2.5 font-sans text-xs">
              ${office.agentName ? `
                <div class="flex items-center justify-between text-neutral-300">
                  <span class="text-[10px] font-mono uppercase text-neutral-500">Representative:</span>
                  <span class="font-medium text-white">${office.agentName}</span>
                </div>
              ` : ''}
              ${office.phone ? `
                <div class="flex items-center justify-between text-neutral-300">
                  <span class="text-[10px] font-mono uppercase text-neutral-500">Telephone:</span>
                  <a href="tel:${office.phone.replace(/[^+\d]/g, '')}" class="font-mono text-white hover:text-gold transition-colors font-medium">${office.phone}</a>
                </div>
              ` : ''}
              ${office.email ? `
                <div class="flex items-center justify-between text-neutral-300 pt-1">
                  <span class="text-[10px] font-mono uppercase text-neutral-500">Email:</span>
                  <button type="button" class="btn-copy-email font-mono text-xs text-gold hover:underline transition-colors truncate text-right cursor-pointer" data-email="${office.email}">
                    ${office.email}
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.log('Branches sync skipped:', e);
    }
  }

  syncBranchesFromCMS();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContacts);
} else {
  initContacts();
}

