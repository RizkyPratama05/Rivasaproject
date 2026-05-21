import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

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
  const portfolioItems = document.querySelectorAll('.portfolio-item');

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
          item.style.display = 'block';
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
     Interactive Contact Form Setup
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

      // Add a CSS animation for rotating if not already defined in style.css
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

      // Simulate API post response time
      setTimeout(() => {
        // Reset button states
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
        if (submitIcon) {
          submitIcon.style.animation = 'none';
        }

        // Show premium success popup layout
        successOverlay.classList.add('active');
        
        // Reset form inputs
        contactForm.reset();
        
        // Remove label floating state manually for select option
        const selectElement = document.getElementById('form-service');
        if (selectElement) {
          selectElement.blur();
        }
      }, 1500);
    });
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }

  // Double check custom styles for body lock when drawer is active
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
});
