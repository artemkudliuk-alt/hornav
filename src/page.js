// src/page.js - Dynamic Page Loader for Danamira Shipping CMS Pages
import './style.css';
import { initMobileMenu, syncHeaderFooterPages } from './mobile-menu.js';

async function loadDynamicPage() {
  initMobileMenu();
  syncHeaderFooterPages();

  const urlParams = new URLSearchParams(window.location.search);
  let slug = urlParams.get('slug');

  if (!slug) {
    // If accessed via clean pathname e.g. /my-custom-page
    const path = window.location.pathname.replace(/^\/+/, '').replace(/\.html$/, '');
    if (path && path !== 'page' && path !== 'index') {
      slug = path;
    }
  }

  if (!slug) {
    slug = 'test1';
  }

  const heroTitle = document.getElementById('page-hero-title');
  const heroDesc = document.getElementById('page-hero-desc');
  const breadcrumb = document.getElementById('breadcrumb-title');
  const contentArea = document.getElementById('page-content-area');
  const metaTitle = document.getElementById('meta-title');
  const metaDesc = document.getElementById('meta-desc');

  try {
    const apiBase = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://danamiratest.vercel.app';
    
    const res = await fetch(`${apiBase}/api/public/pages/${slug}`).catch(() => fetch(`/api/public/pages/${slug}`));
    
    if (!res || !res.ok) {
      throw new Error('Page not found');
    }

    const data = await res.json();
    const pageTitle = typeof data.title === 'object' ? (data.title.en || slug) : (data.title || slug);
    const pageDesc = typeof data.metaDescription === 'object' ? (data.metaDescription.en || '') : (data.metaDescription || '');
    const rawContent = typeof data.content === 'object' ? (data.content.en || '') : (data.content || '');

    // Set Meta & Titles
    if (metaTitle) metaTitle.textContent = `${pageTitle} • Danamira Shipping Ltd`;
    if (metaDesc && pageDesc) metaDesc.setAttribute('content', pageDesc);
    if (breadcrumb) breadcrumb.textContent = pageTitle.toUpperCase();
    if (heroTitle) heroTitle.textContent = pageTitle;
    if (heroDesc) {
      heroDesc.textContent = pageDesc || 'Official document and information published by Danamira Shipping Ltd.';
    }

    // Set Content
    if (contentArea) {
      if (rawContent && rawContent.trim().length > 0) {
        contentArea.innerHTML = `
          <div class="prose prose-invert max-w-none text-neutral-200 text-base sm:text-lg leading-relaxed space-y-4">
            ${rawContent}
          </div>
        `;
      } else {
        contentArea.innerHTML = `
          <div class="p-8 bg-[#141416] border border-white/10 text-neutral-400 text-sm">
            <p>This page currently has no additional body content published.</p>
          </div>
        `;
      }
    }
  } catch (err) {
    console.warn('Could not load dynamic page:', err);
    if (heroTitle) heroTitle.textContent = 'Page Not Found';
    if (heroDesc) heroDesc.textContent = 'The requested custom page could not be located in the Danamira CMS.';
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="p-8 bg-[#141416] border border-red-500/20 text-neutral-300 flex flex-col gap-4">
          <p class="text-sm text-neutral-400">Please verify the URL slug or create and publish the page in the Danamira CMS.</p>
          <div>
            <a href="/" class="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-neutral-950 text-xs font-semibold uppercase tracking-wider">
              &larr; Return to Homepage
            </a>
          </div>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', loadDynamicPage);
