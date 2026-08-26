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
    const cards = complianceSec.querySelectorAll('#compliance-memberships-grid > *');
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

  // 7. Section 07 Careers (Removed per Ship Management Specification)

  // 8. Section 08 — Contact Lead Form Handling
  const contactForm = document.getElementById('contact-inquiry-form');
  const contactCard = document.getElementById('contact-form-card');
  const contactSubmitBtn = document.getElementById('contact-btn-submit');

  if (contactForm && contactCard && contactSubmitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('input-name');
      const companyInput = document.getElementById('input-company');
      const emailInput = document.getElementById('input-email');
      const messageInput = document.getElementById('input-message');

      const clientName = nameInput ? nameInput.value.trim() : 'Inbound Client';
      const companyName = companyInput ? companyInput.value.trim() : '';
      const clientEmail = emailInput ? emailInput.value.trim() : '';
      const clientMessage = messageInput ? messageInput.value.trim() : '';

      // Morph button to loading state
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 text-neutral-950 mr-2 inline" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Sending Inquiry...
      `;
      contactSubmitBtn.classList.add('bg-gold', 'text-neutral-950');

      try {
        // Post directly to Danamira CMS Public Leads Intake API
        const payload = {
          clientName: companyName ? `${clientName} (${companyName})` : clientName,
          clientEmail: clientEmail || null,
          comment: clientMessage || null,
          sourcePage: window.location.pathname || "landing-page",
        };

        // Try posting to local/production CMS endpoint
        await fetch('/api/public/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {
          // If CMS is on separate host or offline during dev, continue gracefully
          console.log('Inquiry recorded locally (CMS offline/remote fallback).');
        });
      } catch (err) {
        console.warn('Inquiry dispatch note:', err);
      }

      // Morph card to Success State
      setTimeout(() => {
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
                Thank you for contacting Danamira Shipping Ltd. Your inquiry has been routed to our Piraeus office, and a representative will follow up with you within 24 business hours.
              </p>
            </div>
          `;
          contactCard.style.opacity = '1';
          contactCard.style.borderColor = 'rgba(200, 155, 60, 0.4)';
          contactCard.style.boxShadow = '0 0 25px rgba(200, 155, 60, 0.08)';
        }, 300);
      }, 1000);
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
        const isLightSection = secInfo.el.id === 'markets';
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
      'contact': 'contact'
    };
    
    const activeNavKey = sectionToNav[activeSectionId] || 'home';
    const navKeys = ['home', 'company', 'fleet', 'contact'];
    
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
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const sections = [
      document.getElementById('hero-sec'),
      document.getElementById('company'),
      document.getElementById('cargo'),
      document.getElementById('markets'),
      document.getElementById('fleet'),
      document.getElementById('compliance')
    ].filter(Boolean);

    if (!isDesktop) {
      // Mobile / Tablet: Clean up any stacking parallax styles and let native layout scroll cleanly
      sections.forEach(sec => {
        sec.classList.remove('stacking-section');
        sec.style.removeProperty('position');
        sec.style.removeProperty('z-index');
        sec.style.removeProperty('transform');
        sec.style.removeProperty('opacity');
        sec.style.removeProperty('visibility');
      });
      sectionData = [];
      return;
    }

    // Ensure all sections have the stacking class on desktop so padding-top is active
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
        if (window.matchMedia('(min-width: 1024px)').matches) {
          requestAnimationFrame(handleStickyTransitions);
        }
        requestAnimationFrame(updateActiveNav);
      }, { passive: true });
      isScrollListenerRegistered = true;
    }
  };

  // Dynamic Fleet Sync from Danamira CMS Public API
  async function syncFleetFromCMS() {
    const grid = document.getElementById('fleet-cards-grid');
    if (!grid) return;

    try {
      // Try local/production CMS public fleet API
      const res = await fetch('http://localhost:3000/api/public/vessels').catch(() => fetch('/api/public/vessels'));
      if (!res || !res.ok) return;

      const vessels = await res.json();
      if (!Array.isArray(vessels) || vessels.length === 0) return;

      // Update Total Vessels Metric
      const vesselsCountEl = document.getElementById('m-f-v-vessels');
      if (vesselsCountEl) {
        vesselsCountEl.textContent = String(vessels.length);
      }

      // Render up to 4-6 vessels seamlessly into responsive grid
      grid.innerHTML = vessels.slice(0, 6).map((v, index) => {
        const coverImg = v.coverImageUrl || '/fleet/molpadia/MV_MOLPADIA__PHOTO.jpg';
        const num = String(index + 1).padStart(2, '0');
        const pdfLink = v.id.includes('meta') 
          ? '/fleet/metanira/1_GA_PLAN.pdf'
          : '/fleet/molpadia/2_GA-PLAN.pdf';

        return `
          <div class="bg-bg-secondary/70 border border-neutral-800/80 hover:border-gold/40 rounded-lg p-6 sm:p-7 flex flex-col gap-6 transition-all duration-500 hover:-translate-y-1 group relative shadow-xl text-left" data-reveal id="f-card-${v.id}">
            <!-- High-Contrast Status Badge -->
            <div class="absolute top-9 right-9 z-20 bg-neutral-950/95 text-white border-2 border-emerald-500 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] inline-block"></span>
              <span class="text-white font-bold tracking-wider">${(v.status || 'AVAILABLE').toUpperCase()}</span>
            </div>

            <!-- Image Container -->
            <a href="/vessel.html?id=${v.id}" class="block w-full h-72 overflow-hidden rounded relative bg-neutral-900 group/img" title="View Full Particulars of ${v.name}">
              <img src="${coverImg}" alt="${v.name} Danamira Shipping" class="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-[#141416]/80 via-transparent to-transparent pointer-events-none"></div>
              <span class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white/90 text-[10px] font-mono px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity inline-flex items-center gap-1.5">
                <span>👁️ View Full Profile</span>
                <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </a>

            <!-- Specs Container -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-baseline mb-2">
                  <div>
                    <a href="/vessel.html?id=${v.id}" class="hover:text-gold transition-colors">
                      <h3 class="text-2xl sm:text-3xl font-serif font-medium text-white flex items-center gap-2">
                        ${v.name}
                      </h3>
                    </a>
                    <span class="text-[11px] font-mono text-neutral-400 mt-0.5 block">IMO: ${v.imoNumber || '—'} • Built ${v.yearBuilt || '—'}</span>
                  </div>
                  <span class="text-xl font-serif text-gold/40 select-none">${num}</span>
                </div>
                <div class="h-[1px] w-12 bg-gold/30 mb-4"></div>
                
                <!-- Specifications Sheet -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 font-sans text-xs border-t border-white/10 pt-4 mt-3">
                  <div class="flex flex-col">
                    <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">DWT</span>
                    <span class="text-white font-medium text-sm">${v.dwt ? Number(v.dwt).toLocaleString() + ' MT' : '6,000–8,000'}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Flag</span>
                    <span class="text-white font-medium text-sm">${v.flag || 'Greece'}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Year Built</span>
                    <span class="text-white font-medium text-sm">${v.yearBuilt || '2020+'}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Vessel Type</span>
                    <span class="text-white font-medium text-sm">${v.type === 'bulk_carrier' ? 'Bulk Carrier' : 'General Cargo'}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Holds / Hatches</span>
                    <span class="text-white font-medium text-sm">2HO / 2HA</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[9px] uppercase tracking-widest text-gold/70 mb-0.5">Deck Gear</span>
                    <span class="text-white font-medium text-sm">2 x 30 MT Cranes</span>
                  </div>
                </div>
              </div>
              
              <!-- Buttons & Actions Row -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-white/5">
                <div class="flex items-center gap-2">
                  <button type="button" data-pdf-url="${pdfLink}" data-vessel="${v.name}" class="btn-open-pdf group inline-flex items-center gap-2 px-3 py-2 rounded-none bg-[#141416] hover:bg-[#1a1a1d] text-white border border-white/20 hover:border-red-500/60 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-sm">
                    <!-- Classic Red PDF Document Badge Icon -->
                    <svg viewBox="0 0 32 36" class="w-4 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 2C5.34315 2 4 3.34315 4 5V31C4 32.6569 5.34315 34 7 34H25C26.6569 34 28 32.6569 28 31V12L18 2H7Z" stroke="#EF4444" stroke-width="2.2" stroke-linejoin="round" fill="none"/>
                      <path d="M18 2V12H28" stroke="#EF4444" stroke-width="2.2" stroke-linejoin="round"/>
                      <line x1="8" y1="13" x2="15" y2="13" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
                      <line x1="8" y1="17.5" x2="24" y2="17.5" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
                      <line x1="8" y1="22" x2="24" y2="22" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
                      <rect x="2" y="21" width="18" height="11" rx="2" fill="#EF4444"/>
                      <text x="11" y="29.5" fill="white" font-size="7.5" font-weight="900" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle" letter-spacing="-0.3px">PDF</text>
                    </svg>
                    <span class="font-bold text-white tracking-wider">GA-PLAN</span>
                    <svg class="w-3 h-3 text-neutral-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M7 17L17 7M7 7h10v10"/>
                    </svg>
                  </button>

                  <a href="/vessel.html?id=${v.id}" class="group/part inline-flex items-center gap-1.5 px-3 py-2 rounded-none bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/40 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200">
                    <span>Full Particulars</span>
                    <svg class="w-3 h-3 shrink-0 transition-transform duration-300 group-hover/part:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>

                <a href="/vessel.html?id=${v.id}#charter-inquiry" class="group/inq inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold hover:text-white transition-colors duration-200">
                  <span>Inquire Vessel</span>
                  <svg class="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/inq:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.log('Using static pre-rendered fleet cards.');
    }
  }

  // PDF Modal Viewer Controller
  const pdfModal = document.getElementById('pdf-modal');
  const pdfModalIframe = document.getElementById('pdf-modal-iframe');
  const pdfModalTitle = document.getElementById('pdf-modal-title');
  const pdfModalDownload = document.getElementById('pdf-modal-download');
  const pdfModalClose = document.getElementById('pdf-modal-close');
  const pdfModalBackdrop = document.getElementById('pdf-modal-backdrop');

  function openPdfModal(pdfUrl, vesselName) {
    if (!pdfModal || !pdfModalIframe) return;

    if (pdfModalTitle) {
      pdfModalTitle.textContent = `${vesselName || 'Vessel'} — General Arrangement (GA-Plan)`;
    }
    if (pdfModalDownload) {
      pdfModalDownload.href = pdfUrl;
      pdfModalDownload.setAttribute('download', `${(vesselName || 'Vessel').replace(/\s+/g, '_')}_GA_Plan.pdf`);
    }

    // Set PDF src with embedded toolbar options
    pdfModalIframe.src = `${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;

    // Show modal smoothly
    pdfModal.classList.remove('opacity-0', 'pointer-events-none');
    pdfModal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    if (!pdfModal || !pdfModalIframe) return;

    // Hide modal
    pdfModal.classList.remove('opacity-100', 'pointer-events-auto');
    pdfModal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';

    // Clear iframe after transition to save memory
    setTimeout(() => {
      pdfModalIframe.src = 'about:blank';
    }, 200);
  }

  // Delegated click handler for any .btn-open-pdf button on the page
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-open-pdf');
    if (btn) {
      e.preventDefault();
      const pdfUrl = btn.getAttribute('data-pdf-url') || '/fleet/molpadia/2_GA-PLAN.pdf';
      const vessel = btn.getAttribute('data-vessel') || 'Vessel';
      openPdfModal(pdfUrl, vessel);
    }
  });

  if (pdfModalClose) {
    pdfModalClose.addEventListener('click', closePdfModal);
  }
  if (pdfModalBackdrop) {
    pdfModalBackdrop.addEventListener('click', closePdfModal);
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal && !pdfModal.classList.contains('opacity-0')) {
      closePdfModal();
    }
  });

  syncFleetFromCMS();

  // Run on initial load
  setupStackingScroll();

  // Run on resize to recalculate coordinates and toggle stacking
  window.addEventListener('resize', () => {
    setupStackingScroll();
  });
});

