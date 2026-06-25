document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal (IntersectionObserver)
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.style.willChange = 'transform, opacity';
        
        requestAnimationFrame(() => {
          target.classList.add('reveal-visible');
        });
        
        target.addEventListener('transitionend', () => {
          target.style.willChange = 'auto';
        }, { once: true });
        
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  const initReveal = () => {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
    
    // Immediately reveal hero typography to ensure it is visible above the fold on load
    const heroTextCol = document.getElementById('hero-text-col');
    if (heroTextCol) {
      heroTextCol.classList.add('reveal-visible');
    }
  };

  if (document.body.classList.contains('page-loaded') || !document.getElementById('preloader')) {
    initReveal();
  } else {
    window.addEventListener('site-loaded', initReveal, { once: true });
  }


  // 2. Magnetic Hover Effect
  document.querySelectorAll('[data-magnetic]').forEach(element => {
    const handleMouseMove = (e) => {
      const bound = element.getBoundingClientRect();
      const x = e.clientX - bound.left - (bound.width / 2);
      const y = e.clientY - bound.top - (bound.height / 2);
      
      element.style.setProperty('--mx', `${x * 0.3}px`);
      element.style.setProperty('--my', `${y * 0.3}px`);
      element.style.setProperty('will-change', 'transform');
    };

    const handleMouseLeave = () => {
      element.style.setProperty('--mx', '0px');
      element.style.setProperty('--my', '0px');
      
      const handleTransitionEnd = () => {
        element.style.setProperty('will-change', 'auto');
      };
      element.addEventListener('transitionend', handleTransitionEnd, { once: true });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
  });

  // 3. Parallax Scrolling Effect for Background & Content Videos
  const heroVideo = document.getElementById('hero-video');
  const heroVideoMobile = document.getElementById('hero-video-mobile');
  const missionVideo = document.getElementById('mission-video');
  const missionSec = document.getElementById('company');
  const blueprintVideo = document.getElementById('blueprint-video');
  const cargoSec = document.getElementById('cargo');
  const contactVideo = document.getElementById('contact-video');
  const complianceVideo = document.getElementById('compliance-bg-video');

  const handleParallax = () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (isDesktop) {
      // 1. Hero video (idx = 0)
      if (heroVideo) {
        const progress = Math.min(scrollY / vh, 1);
        const scale = 1.08 - (progress * 0.08);
        heroVideo.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0) scale(${scale})`;
      }

      // 2. Mission video (idx = 1)
      if (missionVideo) {
        const relativeScroll = scrollY - vh;
        const offset = -relativeScroll * 0.12;
        missionVideo.style.transform = `translate3d(0, ${offset}px, 0)`;
      }

      // 3. Contact video (idx = 7)
      if (contactVideo) {
        const relativeScroll = scrollY - 7 * vh;
        const offset = -relativeScroll * 0.12;
        contactVideo.style.transform = `translate3d(0, ${offset}px, 0)`;
      }

      // 4. Compliance video (idx = 5)
      if (complianceVideo) {
        const relativeScroll = scrollY - 5 * vh;
        const offset = -relativeScroll * 0.12;
        complianceVideo.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    } else {
      // Standard mobile fallback using bounding client rects
      if (heroVideoMobile && scrollY < vh) {
        const progress = Math.min(scrollY / vh, 1);
        const scale = 1.08 - (progress * 0.08);
        heroVideoMobile.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0) scale(${scale})`;
      }

      if (missionVideo && missionSec) {
        const rect = missionSec.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const offset = -rect.top * 0.12;
          missionVideo.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      }

      if (contactVideo) {
        const contactSecEl = document.getElementById('contact');
        if (contactSecEl) {
          const rect = contactSecEl.getBoundingClientRect();
          if (rect.top < vh && rect.bottom > 0) {
            const offset = -rect.top * 0.12;
            contactVideo.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        }
      }

      if (complianceVideo) {
        const complianceSecEl = document.getElementById('compliance');
        if (complianceSecEl) {
          const rect = complianceSecEl.getBoundingClientRect();
          if (rect.top < vh && rect.bottom > 0) {
            const offset = -rect.top * 0.12;
            complianceVideo.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        }
      }
    }
  };

  // Add scroll listener with passive: true for maximal performance
  window.addEventListener('scroll', () => {
    requestAnimationFrame(handleParallax);
  }, { passive: true });

  // Run on initial load to set correct offsets
  handleParallax();

  // 3b. Stats Ticker counting animation
  const statsGrid = document.getElementById('hero-stats-grid');
  const statsElements = [
    { id: 'stat-est-val', start: 2000 },
    { id: 'stat-capacity-min', start: 0 },
    { id: 'stat-capacity-max', start: 0 }
  ];
  
  if (statsGrid) {
    let animated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statsElements.forEach(elInfo => {
            const el = document.getElementById(elInfo.id);
            if (el) {
              const target = parseInt(el.getAttribute('data-target'), 10);
              animateNumber(el, elInfo.start, target);
            }
          });
          statsObserver.unobserve(statsGrid);
        }
      });
    }, { threshold: 0.1 });
    
    statsObserver.observe(statsGrid);
  }
  
  function animateNumber(el, start, target) {
    const duration = 1600; // ms
    const startTime = performance.now();
    
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const ease = progress * (2 - progress);
      
      const current = Math.floor(start + (target - start) * ease);
      
      if (el.id === 'stat-est-val') {
        el.textContent = current.toString();
      } else {
        el.textContent = current.toLocaleString('en-US');
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (el.id === 'stat-est-val') {
          el.textContent = target.toString();
        } else {
          el.textContent = target.toLocaleString('en-US');
        }
      }
    }
    requestAnimationFrame(update);
  }
  // 5. Card Hover Spotlight & 3D Tilt Effect
  const complianceSec = document.querySelector('#compliance');
  if (complianceSec) {
    const cards = complianceSec.querySelectorAll('#compliance-memberships-grid > div');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const cardX = e.clientX - cardRect.left;
        const cardY = e.clientY - cardRect.top;
        card.style.setProperty('--card-x', `${cardX}px`);
        card.style.setProperty('--card-y', `${cardY}px`);

        // 3D Tilt calculations
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        const tiltX = (centerY - cardY) / centerY * 8; // Max 8 degrees tilt
        const tiltY = (cardX - centerX) / centerX * 8;

        card.style.setProperty('--rx', `${tiltX}deg`);
        card.style.setProperty('--ry', `${tiltY}deg`);
        card.style.setProperty('--scale', `1.025`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', `0deg`);
        card.style.setProperty('--ry', `0deg`);
        card.style.setProperty('--scale', `1`);
      });
    });

    // 6. Interactive Canvas Gold Dust Particles
    const canvas = document.getElementById('compliance-particles');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let width = canvas.width = complianceSec.offsetWidth;
      let height = canvas.height = complianceSec.offsetHeight;
      
      const mouse = { x: null, y: null, radius: 130 };

      // Handle resize
      window.addEventListener('resize', () => {
        width = canvas.width = complianceSec.offsetWidth;
        height = canvas.height = complianceSec.offsetHeight;
      });

      complianceSec.addEventListener('mousemove', (e) => {
        const rect = complianceSec.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      complianceSec.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.35;
          this.vy = (Math.random() - 0.5) * 0.35;
          this.size = Math.random() * 1.5 + 0.5;
          this.alpha = Math.random() * 0.35 + 0.1;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          // Wrap edges
          if (this.x < 0) this.x = width;
          if (this.x > width) this.x = 0;
          if (this.y < 0) this.y = height;
          if (this.y > height) this.y = 0;

          // Repelled by mouse
          if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
              const force = (mouse.radius - distance) / mouse.radius;
              const angle = Math.atan2(dy, dx);
              this.x += Math.cos(angle) * force * 1.5;
              this.y += Math.sin(angle) * force * 1.5;
            }
          }
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 155, 60, ${this.alpha})`;
          ctx.fill();
        }
      }

      // Initialize based on screen size
      const count = Math.min(80, Math.floor((width * height) / 12000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
        requestAnimationFrame(animate);
      }
      animate();
    }
  }

  // 7. Section 07 — Careers Interactive File Uploads & Path Selection
  const cardShore = document.getElementById('card-shore');
  const cardOnboard = document.getElementById('card-onboard');
  const applyBtn = document.getElementById('careers-btn-apply');
  const submitBanner = document.getElementById('careers-submit-banner');
  const submitSubtitle = document.getElementById('careers-submit-subtitle');

  let activePath = null;
  const uploadedFiles = {
    shore: { cv: null, cl: null, docs: null },
    onboard: { cv: null, cl: null, docs: null }
  };

  const fileInputs = [
    { id: 'cv-shore', card: 'shore', slot: 'cv', desc: 'desc-cv-shore', defaultText: 'Upload your CV and professional profile.', circle: 'circle-cv-shore' },
    { id: 'cl-shore', card: 'shore', slot: 'cl', desc: 'desc-cl-shore', defaultText: 'Attach your cover letter.', circle: 'circle-cl-shore' },
    { id: 'docs-shore', card: 'shore', slot: 'docs', desc: 'desc-docs-shore', defaultText: 'Provide any relevant certificates or documents.', circle: 'circle-docs-shore' },
    { id: 'cv-onboard', card: 'onboard', slot: 'cv', desc: 'desc-cv-onboard', defaultText: 'Upload your CV and professional profile.', circle: 'circle-cv-onboard' },
    { id: 'cl-onboard', card: 'onboard', slot: 'cl', desc: 'desc-cl-onboard', defaultText: 'Attach your cover letter.', circle: 'circle-cl-onboard' },
    { id: 'docs-onboard', card: 'onboard', slot: 'docs', desc: 'desc-docs-onboard', defaultText: 'Provide any relevant certificates or documents.', circle: 'circle-docs-onboard' }
  ];

  fileInputs.forEach(inputInfo => {
    const inputEl = document.getElementById(inputInfo.id);
    const descEl = document.getElementById(inputInfo.desc);
    const circleEl = document.getElementById(inputInfo.circle);

    if (inputEl && descEl && circleEl) {
      inputEl.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          uploadedFiles[inputInfo.card][inputInfo.slot] = file;
          descEl.textContent = `✓ ${file.name}`;
          descEl.classList.add('text-gold');
          descEl.classList.remove('text-neutral-400');
          circleEl.classList.add('border-gold', 'bg-gold/10');

          // Switch active path
          activePath = inputInfo.card;
          updateCardSelectionStates();
        } else {
          uploadedFiles[inputInfo.card][inputInfo.slot] = null;
          descEl.textContent = inputInfo.defaultText;
          descEl.classList.remove('text-gold');
          descEl.classList.add('text-neutral-400');
          circleEl.classList.remove('border-gold', 'bg-gold/10');

          // Recalculate active path if this card has no more files
          checkAndResetActivePath();
        }
      });
    }
  });

  function updateCardSelectionStates() {
    if (activePath === 'shore') {
      cardShore.classList.add('card-active');
      cardShore.classList.remove('card-dimmed');
      cardOnboard.classList.add('card-dimmed');
      cardOnboard.classList.remove('card-active');
    } else if (activePath === 'onboard') {
      cardOnboard.classList.add('card-active');
      cardOnboard.classList.remove('card-dimmed');
      cardShore.classList.add('card-dimmed');
      cardShore.classList.remove('card-active');
    } else {
      cardShore.classList.remove('card-active', 'card-dimmed');
      cardOnboard.classList.remove('card-active', 'card-dimmed');
    }
  }

  function checkAndResetActivePath() {
    const shoreHasFiles = Object.values(uploadedFiles.shore).some(val => val !== null);
    const onboardHasFiles = Object.values(uploadedFiles.onboard).some(val => val !== null);

    if (!shoreHasFiles && !onboardHasFiles) {
      activePath = null;
    } else if (shoreHasFiles && !onboardHasFiles) {
      activePath = 'shore';
    } else if (!shoreHasFiles && onboardHasFiles) {
      activePath = 'onboard';
    }
    updateCardSelectionStates();
  }

  // Handle Apply Now Submit Button
  if (applyBtn && submitBanner) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Check if a CV has been uploaded for the active path
      if (!activePath || !uploadedFiles[activePath].cv) {
        // Shake feedback
        const targetCard = activePath === 'onboard' ? cardOnboard : (activePath === 'shore' ? cardShore : null);
        
        if (targetCard) {
          targetCard.classList.add('shake-error');
          setTimeout(() => targetCard.classList.remove('shake-error'), 450);
        } else {
          // Shake both if none selected
          cardShore.classList.add('shake-error');
          cardOnboard.classList.add('shake-error');
          setTimeout(() => {
            cardShore.classList.remove('shake-error');
            cardOnboard.classList.remove('shake-error');
          }, 450);
        }

        if (submitSubtitle) {
          submitSubtitle.textContent = 'Please attach your CV inside the selected card before submitting.';
          submitSubtitle.classList.add('text-gold');
          submitSubtitle.classList.remove('text-neutral-400');
        }
        return;
      }

      // Success State Morph
      submitBanner.style.opacity = '0';
      setTimeout(() => {
        submitBanner.innerHTML = `
          <div class="flex items-center gap-4 py-2 text-left" id="careers-success-group">
            <div class="w-12 h-12 flex items-center justify-center text-gold bg-black/40 border border-gold rounded-full shrink-0" id="careers-success-icon">
              <svg class="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div class="flex flex-col text-left">
              <h4 class="text-xl font-serif font-medium text-gold">Application Submitted Successfully</h4>
              <p class="text-neutral-300 font-sans text-xs font-light mt-0.5">Thank you for taking the first step. Our crew manager will review your credentials and contact you shortly.</p>
            </div>
          </div>
        `;
        submitBanner.style.opacity = '1';
        submitBanner.style.borderColor = 'rgba(200, 155, 60, 0.4)';
        submitBanner.style.boxShadow = '0 0 20px rgba(200, 155, 60, 0.1)';
      }, 300);
    });
  }

  // 8. Section 08 — Contact Lead Form Handling
  const contactForm = document.getElementById('contact-inquiry-form');
  const contactCard = document.getElementById('contact-form-card');
  const contactSubmitBtn = document.getElementById('contact-btn-submit');

  if (contactForm && contactCard && contactSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Morph button to loading state
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-neutral-950 mr-2" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Sending Inquiry...
      `;
      contactSubmitBtn.classList.add('bg-gold', 'text-neutral-950');

      // Simulate network request
      setTimeout(() => {
        // Morph card to Success State
        contactCard.style.opacity = '0';
        setTimeout(() => {
          contactCard.innerHTML = `
            <div class="flex flex-col items-center justify-center text-center py-16" id="contact-success-state">
              <div class="w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold mb-6 animate-pulse" id="contact-success-icon">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <h3 class="text-2xl font-serif text-gold mb-3">Inquiry Sent</h3>
              <p class="text-xs text-neutral-300 font-light max-w-sm leading-relaxed">
                Thank you for contacting Horton Navigation S.A. Your inquiry has been routed to our Piraeus office, and a representative will follow up with you within 24 business hours.
              </p>
            </div>
          `;
          contactCard.style.opacity = '1';
          contactCard.style.borderColor = 'rgba(200, 155, 60, 0.4)';
          contactCard.style.boxShadow = '0 0 25px rgba(200, 155, 60, 0.08)';
        }, 300);
      }, 1500);
    });
  }


  // 9. Section 08 — Interactive Ocean Currents Canvas Particles
  const contactSec = document.getElementById('contact');
  const currentsCanvas = document.getElementById('contact-currents');
  if (contactSec && currentsCanvas) {
    const ctx = currentsCanvas.getContext('2d');
    let width = currentsCanvas.width = contactSec.offsetWidth;
    let height = currentsCanvas.height = contactSec.offsetHeight;
    
    let animationFrameId = null;
    const mouse = { x: null, y: null, radius: 150 };
    
    // Handle resize
    const handleResize = () => {
      width = currentsCanvas.width = contactSec.offsetWidth;
      height = currentsCanvas.height = contactSec.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    
    contactSec.addEventListener('mousemove', (e) => {
      const rect = contactSec.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    
    contactSec.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    // Define flow lines (currents)
    const linesCount = 8;
    const lines = [];
    
    for (let i = 0; i < linesCount; i++) {
      lines.push({
        y: (height / (linesCount + 1)) * (i + 1),
        speed: 0.08 + Math.random() * 0.1,
        amplitude: 15 + Math.random() * 20,
        frequency: 0.0008 + Math.random() * 0.001,
        phase: Math.random() * Math.PI * 2,
        thickness: 0.5 + Math.random() * 0.8
      });
    }
    
    let time = 0;
    function drawCurrents() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(200, 155, 60, 0.07)'; // Subtle gold
      
      time += 0.25;
      
      lines.forEach((line) => {
        ctx.beginPath();
        ctx.lineWidth = line.thickness;
        
        for (let x = 0; x <= width; x += 15) {
          // Base sine wave
          let y = line.y + Math.sin(x * line.frequency + time * line.speed + line.phase) * line.amplitude;
          
          // Mouse interaction (repelling force)
          if (mouse.x !== null && mouse.y !== null) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
              const force = (mouse.radius - distance) / mouse.radius;
              // Push y direction away from mouse
              y += (dy > 0 ? 1 : -1) * force * 30;
            }
          }
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });
      
      animationFrameId = requestAnimationFrame(drawCurrents);
    }
    
    drawCurrents();
  }

  // 10. Section 04 — Background Waves Canvas Animation
  const marketsSec = document.getElementById('markets');
  const wavesCanvas = document.getElementById('markets-waves');
  if (marketsSec && wavesCanvas) {
    const ctx = wavesCanvas.getContext('2d');
    let width = wavesCanvas.width = marketsSec.offsetWidth;
    let height = wavesCanvas.height = marketsSec.offsetHeight;
    
    let animationFrameId = null;
    
    const handleResize = () => {
      width = wavesCanvas.width = marketsSec.offsetWidth;
      height = wavesCanvas.height = marketsSec.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const waves = [
      { yRatio: 0.25, speed: 0.003, amplitude: 45, frequency: 0.0035, phase: 0, color: 'rgba(140, 102, 21, 0.06)' },
      { yRatio: 0.45, speed: 0.0018, amplitude: 65, frequency: 0.002, phase: Math.PI / 3, color: 'rgba(0, 0, 0, 0.02)' },
      { yRatio: 0.65, speed: 0.0024, amplitude: 50, frequency: 0.004, phase: Math.PI * 2 / 3, color: 'rgba(140, 102, 21, 0.04)' },
      { yRatio: 0.85, speed: 0.0012, amplitude: 35, frequency: 0.003, phase: Math.PI, color: 'rgba(0, 0, 0, 0.015)' }
    ];
    
    let time = 0;
    function drawWaves() {
      ctx.clearRect(0, 0, width, height);
      time += 1.5;
      
      waves.forEach(w => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 1.0;
        
        const yCenter = height * w.yRatio;
        
        for (let x = 0; x <= width; x += 15) {
          const angle = x * w.frequency + time * w.speed + w.phase;
          const y = yCenter + Math.sin(angle) * w.amplitude + Math.cos(angle * 0.4) * (w.amplitude * 0.25);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });
      
      animationFrameId = requestAnimationFrame(drawWaves);
    }
    
    drawWaves();
  }

  // 11. Stacking Scroll Parallax Controller (Desktop only)
  let sectionData = [];
  let isScrollListenerRegistered = false;

  const handleStickyTransitions = () => {
    if (sectionData.length === 0) return;
    const scrollY = window.scrollY;
    const currentVh = window.innerHeight;

    sectionData.forEach((secInfo, idx) => {
      const H_N = secInfo.height;
      const Offset_N = secInfo.offsetTop;

      // The last section doesn't get covered by anything, it just scrolls naturally
      if (idx === sectionData.length - 1) {
        secInfo.el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        secInfo.el.style.opacity = 1;
        secInfo.el.style.visibility = 'visible';
        return;
      }

      const nextSecInfo = sectionData[idx + 1];
      const Offset_Nplus1 = nextSecInfo.offsetTop;
      const startScroll = Offset_Nplus1 - currentVh;
      const endScroll = Offset_Nplus1;

      if (scrollY < startScroll) {
        // 1. Natural scroll phase inside Section N
        if (scrollY >= Offset_N) {
          const scrollInside = scrollY - Offset_N;
          const translateY = -scrollInside;
          secInfo.el.style.transform = `translate3d(0, ${translateY}px, 0) scale(1)`;
        } else {
          // Before Section N reaches top of screen
          secInfo.el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
        secInfo.el.style.opacity = 1;
        secInfo.el.style.visibility = 'visible';
      } else if (scrollY >= startScroll && scrollY <= endScroll) {
        // 2. Transition phase: Section N+1 is sliding up over Section N
        const progress = (scrollY - startScroll) / currentVh; // 0 to 1
        const scale = 1 - progress * 0.05; // 1.0 to 0.95
        
        // Base translation when bottom is reached: -(H_N - 100vh)
        const baseTranslateY = -Math.max(0, H_N - currentVh);
        const translateY = baseTranslateY - progress * 50; // shift up by additional 50px
        
        let opacity = 1;
        const isLightSection = secInfo.el.id === 'markets' || secInfo.el.id === 'careers';
        if (idx === 0) {
          // The first section (Hero) fades out quickly to avoid clashing with Section 2
          opacity = Math.max(0, 1 - progress / 0.4);
        } else if (isLightSection) {
          // Light sections stay bright almost until the end and fade gradually
          opacity = progress < 0.3 ? 1.0 : Math.max(0, 1 - (progress - 0.3) / 0.7);
        } else {
          // Other dark sections fade out linearly to the end
          opacity = Math.max(0, 1 - progress);
        }

        secInfo.el.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        secInfo.el.style.opacity = opacity;
        secInfo.el.style.visibility = 'visible';
      } else {
        // 3. Fully covered phase
        const baseTranslateY = -Math.max(0, H_N - currentVh);
        secInfo.el.style.transform = `translate3d(0, ${baseTranslateY - 50}px, 0) scale(0.95)`;
        secInfo.el.style.opacity = 0;
        secInfo.el.style.visibility = 'hidden';
      }
    });
  };

  const updateActiveNav = () => {
    if (sectionData.length === 0) return;
    const scrollY = window.scrollY;
    const currentVh = window.innerHeight;
    
    let activeSectionId = 'hero-sec';
    for (let i = sectionData.length - 1; i >= 0; i--) {
      const sec = sectionData[i];
      if (scrollY >= sec.offsetTop - currentVh / 2) {
        activeSectionId = sec.el.id;
        break;
      }
    }
    
    const sectionToNav = {
      'hero-sec': 'home',
      'company': 'company',
      'cargo': 'company',
      'markets': 'company',
      'fleet': 'fleet',
      'compliance': 'company',
      'careers': 'careers',
      'contact': 'contact'
    };
    
    const activeNavKey = sectionToNav[activeSectionId] || 'home';
    const navKeys = ['home', 'company', 'fleet', 'careers', 'contact'];
    
    navKeys.forEach(key => {
      const headerLink = document.getElementById(`link-${key}`);
      if (headerLink) {
        if (key === activeNavKey) {
          headerLink.classList.add('text-gold');
        } else {
          headerLink.classList.remove('text-gold');
        }
      }
      
      const footerLink = document.getElementById(`footer-link-${key}`);
      if (footerLink) {
        if (key === activeNavKey) {
          footerLink.className = 'text-gold border-b border-gold pb-0.5';
        } else {
          footerLink.className = 'hover:text-gold transition-colors duration-200';
        }
      }

      const mobileLink = document.getElementById(`m-link-${key}`);
      if (mobileLink) {
        if (key === activeNavKey) {
          mobileLink.classList.add('text-gold');
        } else {
          mobileLink.classList.remove('text-gold');
        }
      }
    });
  };

  // 12. Mobile menu toggle and navigation logic
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
    
    // Close mobile menu and smooth-scroll on link click
    const mobileLinks = mobileMenuOverlay.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  const setupStackingScroll = () => {
    const sections = [
      document.getElementById('hero-sec'),
      document.getElementById('company'),
      document.getElementById('cargo'),
      document.getElementById('markets'),
      document.getElementById('fleet'),
      document.getElementById('compliance'),
      document.getElementById('careers'),
      document.getElementById('contact')
    ].filter(Boolean);

    // Ensure all sections have the stacking class so padding-top is active
    sections.forEach(sec => {
      sec.classList.add('stacking-section');
    });

    // Temporarily override sticky positioning and transformations to measure natural offsets correctly
    sections.forEach(sec => {
      sec.style.setProperty('position', 'relative', 'important');
      sec.style.zIndex = '';
      sec.style.transform = '';
      sec.style.opacity = '';
      sec.style.visibility = '';
    });

    // Measure natural coordinates (with no sticky positioning active, but padding-top active)
    sectionData = sections.map((sec) => {
      return {
        el: sec,
        offsetTop: sec.offsetTop,
        height: sec.offsetHeight
      };
    });
    console.log("Measured sections:", sectionData.map(s => `${s.el.id}: offset=${s.offsetTop}, height=${s.height}`).join(" | "));
    
     // Restore sticky layout and apply proper z-indices
    sections.forEach((sec, idx) => {
      sec.style.removeProperty('position');
      sec.style.zIndex = idx + 1;
    });

    handleStickyTransitions();

    // Always sync active navigation states on setup/load
    updateActiveNav();

    if (!isScrollListenerRegistered) {
      window.addEventListener('scroll', () => {
        requestAnimationFrame(handleStickyTransitions);
        requestAnimationFrame(updateActiveNav);
      }, { passive: true });
      isScrollListenerRegistered = true;
    }
  };

  // Run on initial load
  setupStackingScroll();

  // Run on resize to recalculate coordinates and toggle stacking
  window.addEventListener('resize', () => {
    setupStackingScroll();
  });
});

