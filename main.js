import { createIcons, icons } from 'lucide';

// Robust Lucide Initializer (resolves deferred module timing issues)
const initLucide = () => {
  createIcons({ icons });
};

// Run immediately as deferred modules execute when DOM is parsed
initLucide();

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  initLucide();
  
  // Extra fallback for slower network loads
  window.addEventListener('load', initLucide);

  /* ==========================================================================
     Navbar Scroll Effect
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     Mobile Navigation Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  const closeMenu = () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ==========================================================================
     Active Navigation Spy (Scroll Spy)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', scrollActive);

  /* ==========================================================================
     Portfolio Filter Logic
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-showcase-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        // Reset transitions and scales
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     Interactive Contact Form & Direct Email Submission (Web3Forms API)
     No Node.js/Backend Server Required!
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('success-overlay');
  const successCloseBtn = document.getElementById('success-close-btn');
  const submitBtn = document.getElementById('form-submit-btn');
  const submitBtnText = submitBtn.querySelector('span');
  const submitIcon = document.getElementById('submit-icon');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger button loading state
      submitBtn.disabled = true;
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = 'Mengirim...';
      
      if (submitIcon) {
        submitIcon.style.animation = 'spin 1s linear infinite';
      }

      // Add rotation animation dynamically
      if (!document.getElementById('spin-keyframes-style')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'spin-keyframes-style';
        styleSheet.innerText = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(styleSheet);
      }

      // Get Form Data
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const service = document.getElementById('form-service').value;
      const message = document.getElementById('form-message').value;

      // Access key for Web3Forms (Will send to rivasaproject@gmail.com)
      // They can generate their key instantly and paste it here
      const web3FormsAccessKey = "1beef323-64e1-48f9-8ce7-8d4d590cebbe"; 

      // Fallback/Simulated Action if key is not pasted yet
      if (web3FormsAccessKey === "YOUR_ACCESS_KEY_HERE") {
        console.log("Web3Forms simulated submission:", { name, email, service, message });
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtnText.textContent = originalText;
          if (submitIcon) { submitIcon.style.animation = 'none'; }
          
          // Show successful card popup
          successOverlay.classList.add('active');
          contactForm.reset();
        }, 1200);
        return;
      }

      // Send to Web3Forms API - purely client side!
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          name: name,
          email: email,
          service: service,
          message: message,
          subject: `RIVASA PROJECT Web Inquiry from ${name}`
        })
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          successOverlay.classList.add('active');
          contactForm.reset();
        } else {
          console.log(response);
          alert(json.message);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Terjadi kesalahan sistem, silakan coba lagi.");
      })
      .finally(() => {
        // Reset loading states
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
        if (submitIcon) {
          submitIcon.style.animation = 'none';
        }
      });
    });
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }

  // Ensure body lock style is configured
  if (!document.getElementById('body-lock-style')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'body-lock-style';
    styleSheet.innerText = `
      body.no-scroll {
        overflow: hidden;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  /* ==========================================================================
     Interactive Canvas Particle Background
     ========================================================================== */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let width, height;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      width = parent.clientWidth || parent.offsetWidth || window.innerWidth;
      height = parent.clientHeight || parent.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.5 + 1;
        const colors = [
          'rgba(0, 242, 254, 0.45)', // Electric Cyan
          'rgba(168, 85, 247, 0.45)', // Cyber Violet
          'rgba(255, 0, 127, 0.45)'   // Neon Pink/Coral
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce/Wrap borders
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse attraction/push interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);
          if (distance < mouse.radius) {
            // Soft push away from mouse
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 0.8;
            this.y -= (dy / distance) * force * 0.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // Make particles have a glowing shadow
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      const density = Math.floor((width * height) / 15000);
      const count = Math.min(Math.max(density, 40), 90);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener('resize', initParticles);

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines between particles that are close
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 100) {
            const alpha = ((100 - dist) / 100) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Cyan neon connection stroke
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const alpha = ((mouse.radius - dist) / mouse.radius) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            // Violet neon connection stroke
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }

  /* ==========================================================================
     Scroll-Reveal Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }

  /* ==========================================================================
     FAQ Accordion Toggling
     ========================================================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items for a clean accordion experience
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = '0';
      });

      if (!isActive) {
        faqItem.classList.add('active');
        if (faqBody) faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     Interactive Project Cost Calculator
     ========================================================================== */
  const calcServiceBtns = document.querySelectorAll('#calc-service-type .calc-option-btn');
  const calcScopeBtns = document.querySelectorAll('#calc-scope .calc-option-btn');
  const calcCheckboxItems = document.querySelectorAll('.calc-checkbox-item');
  const calcPriceDisplay = document.getElementById('calc-price-display');
  const calcApplyBtn = document.getElementById('calc-apply-btn');

  let selectedServiceCost = 1000000; // Default: Website
  let selectedServiceValue = 'web';
  let selectedServiceTitle = 'Website';
  let selectedScopeMultiplier = 1.0; // Default: Standar
  let selectedScopeTitle = 'Simple';
  let additionalCosts = 0;
  let selectedFeatures = [];

  const updateCalculator = () => {
    const baseCost = selectedServiceCost * selectedScopeMultiplier;
    const minPrice = baseCost + additionalCosts;
    const maxPrice = baseCost * 1.4 + additionalCosts;

    // Currency Formatter
    const formatRupiah = (num) => {
      return 'Rp ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (calcPriceDisplay) {
      calcPriceDisplay.textContent = `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`;
    }
  };

  // Service Selection
  calcServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcServiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedServiceCost = parseFloat(btn.getAttribute('data-cost')) || 5000000;
      selectedServiceValue = btn.getAttribute('data-value') || 'web';
      selectedServiceTitle = btn.querySelector('.opt-title').textContent;
      updateCalculator();
    });
  });

  // Scope Selection
  calcScopeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcScopeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedScopeMultiplier = parseFloat(btn.getAttribute('data-multiplier')) || 1.0;
      selectedScopeTitle = btn.querySelector('.opt-title').textContent;
      updateCalculator();
    });
  });

  // Checkbox (Additional Features) Selection
  calcCheckboxItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
      const cost = parseFloat(item.getAttribute('data-cost')) || 0;
      const title = item.querySelector('.chk-title').textContent;

      if (item.classList.contains('active')) {
        additionalCosts += cost;
        selectedFeatures.push(title);
      } else {
        additionalCosts -= cost;
        selectedFeatures = selectedFeatures.filter(f => f !== title);
      }
      updateCalculator();
    });
  });

  // Pre-fill Form Integration
  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      const formServiceSelect = document.getElementById('form-service');
      const formMessageTextArea = document.getElementById('form-message');

      if (formServiceSelect) {
        formServiceSelect.value = selectedServiceValue;
        // Dispatch change event to update potential styling overlays
        formServiceSelect.dispatchEvent(new Event('change'));
      }

      if (formMessageTextArea && calcPriceDisplay) {
        const featuresText = selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'Tidak ada';
        const priceRange = calcPriceDisplay.textContent;

        formMessageTextArea.value = `Halo Rizky & Revano,\n\nSaya pengen ngobrolin tentang rencana proyek digital dengan spesifikasi berikut:\n- Layanan: ${selectedServiceTitle}\n- Skala/Kompleksitas: ${selectedScopeTitle}\n- Fitur Tambahan: ${featuresText}\n- Estimasi Kisaran Biaya: ${priceRange}\n\nYuk hubungi saya buat ngobrol santai lebih lanjut!`;
        
        // Shift focus to textarea and adjust scroll
        formMessageTextArea.focus();
      }

      // Smooth scroll to the contact form section
      const contactFormPanel = document.querySelector('.contact-form-panel');
      if (contactFormPanel) {
        contactFormPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ==========================================================================
     Dual-Founder Floating WhatsApp Widget Drawer
     ========================================================================== */
  const waWidget = document.getElementById('wa-widget');
  const waToggle = document.getElementById('wa-toggle');
  const waDrawer = document.getElementById('wa-drawer');

  if (waToggle && waWidget) {
    waToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      waWidget.classList.toggle('active');
      // Re-trigger Lucide icons to ensure any dynamically injected icon formats load perfectly
      initLucide();
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (waWidget.classList.contains('active') && !waWidget.contains(e.target)) {
        waWidget.classList.remove('active');
      }
    });

    // Stop propagation inside drawer
    if (waDrawer) {
      waDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  /* ==========================================================================
     Interactive Project Details Modal Controller
     ========================================================================== */
  const projectCards = document.querySelectorAll('.portfolio-showcase-item');
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-project-img');
  const modalCategory = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalTagsContainer = document.getElementById('modal-project-tags');
  const modalArch = document.getElementById('modal-project-arch');
  const modalCtaBtn = document.getElementById('modal-cta-btn');

  const openProjectModal = (card) => {
    // Read attributes
    const title = card.getAttribute('data-title') || '';
    const category = card.querySelector('.project-category') ? card.querySelector('.project-category').textContent : '';
    const image = card.getAttribute('data-image') || '';
    const desc = card.getAttribute('data-desc') || '';
    const tagsString = card.getAttribute('data-tags') || '';
    const arch = card.getAttribute('data-arch') || '';

    // Populate modal fields
    const visualPane = document.querySelector('.project-modal-visual-pane');
    if (visualPane) {
      visualPane.innerHTML = ''; // clear previous images
      if (image) {
        const isMobile = card.getAttribute('data-category') === 'mobile';
        image.split(',').forEach(imgSrc => {
          const cleanSrc = imgSrc.trim();
          if (cleanSrc) {
            const img = document.createElement('img');
            img.src = cleanSrc;
            img.alt = 'Project Screenshot';
            img.className = 'modal-screenshot-img';
            img.style.marginBottom = '20px';
            img.style.width = '100%';
            if (isMobile) {
              img.style.maxWidth = '340px';
            } else {
              img.style.maxWidth = '100%';
            }
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
            visualPane.appendChild(img);
          }
        });
        if (visualPane.lastChild) visualPane.lastChild.style.marginBottom = '0';
      }
    }
    if (modalCategory) modalCategory.textContent = category;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalArch) modalArch.textContent = arch;

    // Reset and build tag badges
    if (modalTagsContainer) {
      modalTagsContainer.innerHTML = '';
      if (tagsString) {
        tagsString.split(',').forEach(tag => {
          const cleanTag = tag.trim();
          if (cleanTag) {
            const span = document.createElement('span');
            span.className = 'tag-item';
            span.textContent = cleanTag;
            modalTagsContainer.appendChild(span);
          }
        });
      }
    }

    // Configure CTA button behavior
    if (modalCtaBtn) {
      modalCtaBtn.onclick = () => {
        closeProjectModal();
        
        // Auto-select option in contact form
        const formServiceSelect = document.getElementById('form-service');
        const formMessageTextArea = document.getElementById('form-message');
        
        if (formServiceSelect) {
          const cardCat = card.getAttribute('data-category');
          if (cardCat === 'web') {
            formServiceSelect.value = 'web';
          } else if (cardCat === 'mobile') {
            formServiceSelect.value = 'mobile';
          } else {
            formServiceSelect.value = 'saas';
          }
          formServiceSelect.dispatchEvent(new Event('change'));
        }

        if (formMessageTextArea) {
          formMessageTextArea.value = `Halo Rizky & Revano,\n\nSaya tertarik nih buat nanya-nanya atau bikin proyek seperti "${title}" yang pakai ${arch}.\n\nBisa tolong hubungi saya buat ngobrol santai lebih lanjut? Terima kasih banyak!`;
          formMessageTextArea.focus();
        }

        // Smooth scroll to the contact form section
        const contactFormPanel = document.querySelector('.contact-form-panel');
        if (contactFormPanel) {
          contactFormPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    }

    // Launch modal
    if (projectModal) {
      projectModal.classList.add('active');
      document.body.classList.add('no-scroll');
      
      // Reset scroll positions of visual and text panes
      const visualPane = document.querySelector('.project-modal-visual-pane');
      const infoPane = document.querySelector('.project-modal-info-pane');
      if (visualPane) visualPane.scrollTop = 0;
      if (infoPane) infoPane.scrollTop = 0;
    }
  };

  const closeProjectModal = () => {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  };

  // Add click listeners to all project cards
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      openProjectModal(card);
    });
  });

  // Close modal button trigger
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeProjectModal();
    });
  }

  // Close modal by clicking backdrop
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Keyboard accessibility: Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });
});
