/**
 * DANAMIRA SHIPPING — High-Precision Canvas PDF Viewer Engine
 * Fully compatible with Mobile Safari, Mobile Chrome (iOS & Android), and Desktop.
 * Renders technical GA-Plans and statutory documents directly to HTML5 Canvas via PDF.js.
 */

let pdfjsLibInstance = null;
let pdfjsLoadingPromise = null;

let currentPdfDoc = null;
let currentPdfUrl = '';
let currentPdfTitle = '';
let currentScale = 1.0;
let baseFitScale = 1.0;
let isFullscreen = false;
let renderTokens = [];

// Dynamic PDF.js Standalone Loader (0KB initial overhead)
export function loadPdfJs() {
  if (window.pdfjsLib) {
    pdfjsLibInstance = window.pdfjsLib;
    return Promise.resolve(pdfjsLibInstance);
  }
  if (pdfjsLoadingPromise) return pdfjsLoadingPromise;

  pdfjsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/libs/pdfjs/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        pdfjsLibInstance = window.pdfjsLib;
        pdfjsLibInstance.GlobalWorkerOptions.workerSrc = '/libs/pdfjs/pdf.worker.min.js';
        resolve(pdfjsLibInstance);
      } else {
        reject(new Error('PDF.js failed to initialize on window object.'));
      }
    };
    script.onerror = () => {
      reject(new Error('Could not load /libs/pdfjs/pdf.min.js'));
    };
    document.head.appendChild(script);
  });

  return pdfjsLoadingPromise;
}

// Cancel any active render tasks
function cancelActiveRenderTasks() {
  renderTokens.forEach(task => {
    try {
      if (task && typeof task.cancel === 'function') {
        task.cancel();
      }
    } catch (_) {}
  });
  renderTokens = [];
}

/**
 * Open the PDF Viewer Modal with given options
 * @param {string} url - PDF URL
 * @param {string} title - Document title
 * @param {string} [subtitle] - Document subtitle
 * @param {string} [downloadName] - Suggested download filename
 */
export async function openPdfModal(url, title = 'Technical Document', subtitle = '', downloadName = '') {
  const modal = document.getElementById('pdf-modal');
  const container = document.getElementById('pdf-modal-container');
  const titleEl = document.getElementById('pdf-modal-title');
  const subtitleEl = document.getElementById('pdf-modal-subtitle');
  const downloadBtn = document.getElementById('pdf-modal-download');
  const openNativeBtn = document.getElementById('pdf-open-native');
  const errorDirectLink = document.getElementById('pdf-error-direct-link');
  const loadingState = document.getElementById('pdf-loading-state');
  const errorState = document.getElementById('pdf-error-state');
  const pagesContainer = document.getElementById('pdf-pages-container');
  const pageIndicator = document.getElementById('pdf-page-indicator');
  const zoomLevelEl = document.getElementById('pdf-zoom-level');

  if (!modal || !pagesContainer) return;

  currentPdfUrl = url;
  currentPdfTitle = title;
  const fileName = downloadName || `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle || 'Official Technical Document • Danamira Shipping Ltd';
  
  if (downloadBtn) {
    downloadBtn.href = url;
    downloadBtn.setAttribute('download', fileName);
  }
  if (openNativeBtn) openNativeBtn.href = url;
  if (errorDirectLink) {
    errorDirectLink.href = url;
    errorDirectLink.setAttribute('download', fileName);
  }

  // Clear previous canvases
  cancelActiveRenderTasks();
  pagesContainer.innerHTML = '';
  if (loadingState) loadingState.classList.remove('opacity-0', 'pointer-events-none', 'hidden');
  if (errorState) errorState.classList.add('hidden');
  if (pageIndicator) pageIndicator.textContent = 'Loading...';

  // Reveal Modal
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100', 'pointer-events-auto');
  document.body.style.overflow = 'hidden';

  try {
    const pdfjs = await loadPdfJs();
    const loadingTask = pdfjs.getDocument({
      url: url,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true
    });

    currentPdfDoc = await loadingTask.promise;
    const numPages = currentPdfDoc.numPages;

    if (pageIndicator) {
      pageIndicator.textContent = numPages === 1 ? '1 Page (Complete)' : `1 / ${numPages} Pages`;
    }

    // Get first page to compute default responsive fit scale
    const firstPage = await currentPdfDoc.getPage(1);
    const unscaledViewport = firstPage.getViewport({ scale: 1.0 });

    const viewportEl = document.getElementById('pdf-viewer-viewport');
    const availableWidth = viewportEl ? Math.max(300, viewportEl.clientWidth - (window.innerWidth < 640 ? 16 : 48)) : 800;
    
    // Fit page width comfortably into screen
    const targetWidth = availableWidth - (window.innerWidth < 640 ? 8 : 24);
    baseFitScale = Math.max(0.25, Math.min(3.0, targetWidth / unscaledViewport.width));
    currentScale = baseFitScale;

    if (zoomLevelEl) {
      zoomLevelEl.textContent = `${Math.round((currentScale / baseFitScale) * 100)}%`;
    }

    await renderAllPages();

    if (loadingState) {
      loadingState.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => loadingState.classList.add('hidden'), 200);
    }
  } catch (err) {
    console.error('PDF load / render error:', err);
    if (loadingState) loadingState.classList.add('hidden');
    if (errorState) errorState.classList.remove('hidden');
  }
}

// Render all pages in document at current scale
async function renderAllPages() {
  if (!currentPdfDoc) return;
  const pagesContainer = document.getElementById('pdf-pages-container');
  if (!pagesContainer) return;

  cancelActiveRenderTasks();
  pagesContainer.innerHTML = '';

  const numPages = currentPdfDoc.numPages;
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Cap DPR to 2.5 for memory performance

  for (let i = 1; i <= numPages; i++) {
    const page = await currentPdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: currentScale * dpr });
    const cssWidth = Math.round(viewport.width / dpr);
    const cssHeight = Math.round(viewport.height / dpr);

    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'pdf-page-card relative bg-white border border-neutral-800 shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-200 mx-auto my-2 shrink-0';
    pageWrapper.style.width = `${cssWidth}px`;
    pageWrapper.style.height = `${cssHeight}px`;

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.className = 'block w-full h-full';

    pageWrapper.appendChild(canvas);

    // Optional page tag for multi-page documents
    if (numPages > 1) {
      const pageTag = document.createElement('span');
      pageTag.className = 'absolute bottom-2 right-2 px-2 py-0.5 bg-black/75 text-white/90 font-mono text-[9px] pointer-events-none';
      pageTag.textContent = `Page ${i} of ${numPages}`;
      pageWrapper.appendChild(pageTag);
    }

    pagesContainer.appendChild(pageWrapper);

    const ctx = canvas.getContext('2d', { alpha: false });
    const renderTask = page.render({
      canvasContext: ctx,
      viewport: viewport
    });

    renderTokens.push(renderTask);

    try {
      await renderTask.promise;
    } catch (e) {
      if (e.name !== 'RenderingCancelledException') {
        console.error(`Page ${i} render error:`, e);
      }
    }
  }
}

// Update Zoom Level
export async function setZoom(newScale) {
  if (!currentPdfDoc) return;
  const clamped = Math.max(baseFitScale * 0.4, Math.min(baseFitScale * 4.0, newScale));
  if (Math.abs(clamped - currentScale) < 0.02) return;

  currentScale = clamped;
  const zoomLevelEl = document.getElementById('pdf-zoom-level');
  if (zoomLevelEl) {
    zoomLevelEl.textContent = `${Math.round((currentScale / baseFitScale) * 100)}%`;
  }

  const loadingState = document.getElementById('pdf-loading-state');
  if (loadingState) {
    loadingState.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  }

  await renderAllPages();

  if (loadingState) {
    loadingState.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => loadingState.classList.add('hidden'), 150);
  }
}

export function zoomIn() {
  setZoom(currentScale * 1.25);
}

export function zoomOut() {
  setZoom(currentScale / 1.25);
}

export function resetZoom() {
  setZoom(baseFitScale);
}

export function toggleFullscreen(forceState) {
  const modal = document.getElementById('pdf-modal');
  const container = document.getElementById('pdf-modal-container');
  if (!container) return;

  isFullscreen = typeof forceState === 'boolean' ? forceState : !isFullscreen;

  if (isFullscreen) {
    container.classList.remove('max-w-6xl', 'h-[94vh]', 'sm:h-[90vh]');
    container.classList.add('max-w-none', 'w-screen', 'h-screen', 'border-0');
    if (modal) modal.classList.remove('p-2', 'sm:p-4', 'md:p-6');
  } else {
    container.classList.remove('max-w-none', 'w-screen', 'h-screen', 'border-0');
    container.classList.add('max-w-6xl', 'h-[94vh]', 'sm:h-[90vh]');
    if (modal) modal.classList.add('p-2', 'sm:p-4', 'md:p-6');
  }

  // Recalculate fit scale on resize
  setTimeout(() => {
    resetZoom();
  }, 100);
}

export function closePdfModal() {
  const modal = document.getElementById('pdf-modal');
  const pagesContainer = document.getElementById('pdf-pages-container');
  if (!modal) return;

  cancelActiveRenderTasks();
  modal.classList.remove('opacity-100', 'pointer-events-auto');
  modal.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';

  if (pagesContainer) {
    setTimeout(() => {
      pagesContainer.innerHTML = '';
      currentPdfDoc = null;
    }, 250);
  }

  if (isFullscreen) {
    toggleFullscreen(false);
  }
}

/**
 * Initialize all PDF listeners and setup modal bindings
 */
export function initPdfModal() {
  const modal = document.getElementById('pdf-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('pdf-modal-close');
  const backdrop = document.getElementById('pdf-modal-backdrop');
  const expandBtn = document.getElementById('pdf-modal-expand');
  const zoomInBtn = document.getElementById('pdf-zoom-in');
  const zoomOutBtn = document.getElementById('pdf-zoom-out');
  const zoomFitBtn = document.getElementById('pdf-zoom-fit');
  const zoomLevelEl = document.getElementById('pdf-zoom-level');
  const viewportEl = document.getElementById('pdf-viewer-viewport');

  if (closeBtn) closeBtn.onclick = closePdfModal;
  if (backdrop) backdrop.onclick = closePdfModal;
  if (expandBtn) expandBtn.onclick = () => toggleFullscreen();
  if (zoomInBtn) zoomInBtn.onclick = zoomIn;
  if (zoomOutBtn) zoomOutBtn.onclick = zoomOut;
  if (zoomFitBtn) zoomFitBtn.onclick = resetZoom;
  if (zoomLevelEl) zoomLevelEl.onclick = resetZoom;

  // Keyboard shortcut Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('opacity-0')) {
      closePdfModal();
    }
  });

  // Touch Pinch-to-Zoom handling on mobile viewport
  if (viewportEl) {
    let initialDistance = 0;
    let initialScaleOnTouch = 1.0;

    viewportEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        initialScaleOnTouch = currentScale;
      }
    }, { passive: true });

    viewportEl.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const factor = dist / initialDistance;
        const targetScale = initialScaleOnTouch * factor;
        const zoomLevelEl = document.getElementById('pdf-zoom-level');
        if (zoomLevelEl) {
          zoomLevelEl.textContent = `${Math.round((targetScale / baseFitScale) * 100)}%`;
        }
      }
    }, { passive: true });

    viewportEl.addEventListener('touchend', (e) => {
      if (initialDistance > 0 && e.touches.length < 2) {
        initialDistance = 0;
        // debounce final scale render
        const zoomText = document.getElementById('pdf-zoom-level')?.textContent;
        if (zoomText) {
          const parsed = parseInt(zoomText, 10);
          if (!isNaN(parsed)) {
            setZoom((parsed / 100) * baseFitScale);
          }
        }
      }
    }, { passive: true });
  }

  // Global delegated click handler for all buttons triggering PDFs
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-open-pdf, .btn-ga-plan, .btn-open-desc-pdf, #btn-open-desc-pdf, #btn-open-desc-pdf-desktop, #btn-view-medical-pdf, #btn-open-pdf-hero, #btn-open-pdf-hero-desktop, #btn-tab-pdf-trigger, #btn-view-ga-plan-tab, [data-pdf-trigger]');
    if (!trigger) return;

    const rawUrl = trigger.getAttribute('data-pdf') || 
                   trigger.getAttribute('data-pdf-url') || 
                   (trigger.tagName === 'A' ? trigger.getAttribute('href') : null);

    if (!rawUrl || rawUrl === '#' || rawUrl.startsWith('javascript:')) return;

    e.preventDefault();
    const pdfUrl = rawUrl;
    const vesselName = trigger.getAttribute('data-vessel') || 
                       trigger.getAttribute('data-title') || 
                       'Vessel';

    let title = `${vesselName} — General Arrangement Plan (GA-Plan)`;
    let subtitle = 'Official Technical Blueprint • Danamira Managed Fleet';
    let downloadName = `${vesselName.replace(/\s+/g, '_')}_GA_Plan.pdf`;

    if (trigger.id === 'btn-view-medical-pdf' || pdfUrl.includes('medical')) {
      title = 'Guidelines on the Medical Examinations of Seafarers';
      subtitle = 'Official ILO / IMO / WHO Joint International Standard • 70 Pages';
      downloadName = 'Guidelines_on_the_medical_examinations_of_seafarers.pdf';
    } else if (pdfUrl.toLowerCase().includes('description') || vesselName.toLowerCase().includes('description')) {
      const cleanName = vesselName.replace(/\s*—\s*Description/gi, '').trim();
      title = `${cleanName} — Vessel Description & Particulars`;
      subtitle = 'Official Vessel Specification Sheet • Danamira Managed Fleet';
      downloadName = `${cleanName.replace(/\s+/g, '_')}_Description.pdf`;
    }

    openPdfModal(pdfUrl, title, subtitle, downloadName);
  });
}
