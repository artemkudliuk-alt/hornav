/**
 * Danamira Shipping Ltd — Contacts Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
      });
    }

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Email Copy Buttons
  document.querySelectorAll('.btn-copy-email').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || btn.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="text-emerald-400 font-bold">? Copied!</span>`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy email:', err);
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
            <h3 class="text-2xl font-serif text-white font-medium">Message Dispatched</h3>
            <p class="text-xs sm:text-sm text-neutral-300 max-w-md font-light leading-relaxed">
              Thank you for contacting Danamira Shipping Ltd. Your message has been routed to our Glyfada office management desk. A designated representative will follow up with you promptly.
            </p>
            <div class="pt-4">
              <span class="text-[10px] font-mono uppercase tracking-widest text-gold/80 block">Direct Emergency Operations Line:</span>
              <a href="tel:+302113456550" class="text-sm font-mono text-white hover:text-gold transition-colors font-bold">+30 211 34 56 550</a>
            </div>
          </div>
        `;
      }, 700);
    });
  }
});
