/* ════════════════════════════════════════════════════════════════
   MAIN.JS
   عبق الياسمين للعطور — السكربت الرئيسي
   يحتوي على: شريط التنقل (تأثير التمرير + قائمة الجوال)،
   تبويبات المنتجات، والصندوق المنبثق لمعرض الصور (Lightbox)
   ════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ───────────────────────────────
     1. NAV — scroll style + mobile menu
     ─────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  const hamburger = document.getElementById('hamburger');
  let mobileOpen = false;

  function openMobileNav() {
    mobileOpen = true;
    document.body.classList.add('nav-mobile-open');
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    mobileOpen = false;
    document.body.classList.remove('nav-mobile-open');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (mobileOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close the mobile menu whenever a nav link is activated
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ───────────────────────────────
     2. PRODUCT TABS — switch between
        "western" and "heritage" panels
     ─────────────────────────────── */
  function switchTab(btn, panelId) {
    // Update tabs
    document.querySelectorAll('.prod-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Update panels
    document.querySelectorAll('.prod-panel').forEach(p => {
      p.classList.remove('active');
    });
    const panel = document.getElementById('panel-' + panelId);
    if (panel) {
      panel.classList.add('active');
    }

    // Re-trigger the reveal animation for the now-visible panel
    // using requestAnimationFrame for better performance
    const visiblePanel = document.getElementById('panel-' + panelId);
    if (visiblePanel) {
      requestAnimationFrame(() => {
        visiblePanel.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('in');
          // Force reflow to restart animation
          void el.offsetHeight;
          el.classList.add('in');
        });
      });
    }
  }

  document.querySelectorAll('.prod-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab, tab.dataset.panel);
    });
  });

  /* ───────────────────────────────
     3. LIGHTBOX — gallery image viewer
     ─────────────────────────────── */
  const galleryItems = [];
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbCap   = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev  = document.getElementById('lb-prev');
  const lbNext  = document.getElementById('lb-next');
  let lbCurrent = 0;
  let isLightboxOpen = false;

  function openLightbox(idx) {
    if (!lb || !lbImg) return;
    lbCurrent = idx;
    showLbSlide();
    lb.classList.add('open');
    isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
    
    // Prevent background scrolling on touch devices
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
  }
  
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('open');
    isLightboxOpen = false;
    document.body.style.overflow = '';
    
    // Re-enable background scrolling
    document.body.removeEventListener('touchmove', preventScroll);
  }
  
  function preventScroll(e) {
    if (isLightboxOpen) {
      e.preventDefault();
    }
  }
  
  function showLbSlide() {
    const item = galleryItems[lbCurrent];
    if (!item || !lbImg) return;
    
    // Set image source
    lbImg.src = item.src;
    lbImg.alt = item.cap || 'صورة معرض عبق الياسمين';
    if (lbCap) lbCap.textContent = item.cap || '';
    
    // Reset opacity after image loads
    lbImg.style.opacity = '0';
    lbImg.onload = () => {
      lbImg.style.opacity = '1';
      lbImg.onload = null;
    };
    // Fallback in case image is already cached
    if (lbImg.complete) {
      lbImg.style.opacity = '1';
    }
  }
  
  function lbGo(dir) {
    if (galleryItems.length === 0) return;
    lbCurrent = (lbCurrent + dir + galleryItems.length) % galleryItems.length;
    showLbSlide();
  }

  // Initialize lightbox if element exists
  if (lb && lbImg) {
    // Collect all gallery items
    document.querySelectorAll('.g-item[data-lb-src]').forEach((item, i) => {
      galleryItems.push({
        src: item.dataset.lbSrc,
        cap: item.dataset.lbCap || ''
      });
      
      // Add click handler
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(i);
      });
      
      // Add keyboard accessibility
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'فتح الصورة في المعرض');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    // Lightbox controls
    if (lbClose) {
      lbClose.addEventListener('click', closeLightbox);
    }
    if (lbPrev) {
      lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lbGo(-1);
      });
    }
    if (lbNext) {
      lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lbGo(1);
      });
    }

    // Close lightbox when clicking outside the image
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lightbox-img-wrap')) {
        closeLightbox();
      }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
      if (!isLightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          lbGo(1);
          break;
        case 'ArrowRight':
          lbGo(-1);
          break;
      }
    });
  }
/*
  /* ───────────────────────────────
     4. SMOOTH SCROLL for anchor links
        (with offset for fixed header)
        ✅ تم التعديل: إضافة requestAnimationFrame
        لحل مشكلة انزلاق القائمة
     ─────────────────────────────── */
  const headerHeight = () => {
    const navBar = document.querySelector('.nav');
    return navBar ? navBar.offsetHeight : 80;
  };

  // استخدام requestAnimationFrame لتجنب التعارض مع CSS scroll-margin
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // إغلاق القائمة المتنقلة فورًا (قبل التمرير)
        if (mobileOpen) {
          closeMobileNav();
        }
        
        // استخدام requestAnimationFrame لضمان تنفيذ التمرير بعد إغلاق القائمة
        requestAnimationFrame(() => {
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerHeight();
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        });
      }
    });
  });
*/
  /* ───────────────────────────────
     5. ACTIVE NAVIGATION HIGHLIGHT
        (based on scroll position)
     ─────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNavLink() {
    if (sections.length === 0) return;
    
    let currentSection = '';
    const scrollPos = window.scrollY + headerHeight() + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Throttle scroll event for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Call once on load
  updateActiveNavLink();

  /* ───────────────────────────────
     6. FIX iOS 100vh ISSUE
        (for hero section on mobile)
     ─────────────────────────────── */
  const setHeroHeight = () => {
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth <= 768) {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      hero.style.minHeight = 'calc(100 * var(--vh))';
    }
  };
  
  window.addEventListener('resize', setHeroHeight);
  setHeroHeight();

  /* ───────────────────────────────
     7. ADD LOADING CLASS to images
        (prevents layout shift)
     ─────────────────────────────── */
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) {
      img.style.opacity = '0';
      img.onload = () => {
        img.style.opacity = '1';
      };
    } else {
      img.style.opacity = '1';
    }
  });

  /* ───────────────────────────────
     8. FIX: Prevent body scroll when
        mobile menu is open
     ─────────────────────────────── */
  // Already handled in openMobileNav / closeMobileNav functions
  
  /* ───────────────────────────────
     9. ADD TOUCH SWIPE for lightbox
        (optional enhancement)
     ─────────────────────────────── */
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleTouchStart(e) {
    if (!isLightboxOpen) return;
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    if (!isLightboxOpen) return;
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      lbGo(-1); // swipe left -> next image
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      lbGo(1); // swipe right -> previous image
    }
  }
  
  if (lb) {
    lb.addEventListener('touchstart', handleTouchStart, { passive: true });
    lb.addEventListener('touchend', handleTouchEnd);
  }

}); // end DOMContentLoaded
