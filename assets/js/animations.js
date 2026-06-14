/* ════════════════════════════════════════════════════════════════
   ANIMATIONS.JS
   عبق الياسمين للعطور — حركات الظهور والعدادات
   يحتوي على: حركة الظهور عند التمرير (Scroll Reveal)،
   وعداد الأرقام المتحركة في شريط الإحصائيات
   ════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  /* ───────────────────────────────
     1. SCROLL REVEAL
     Adds the ".in" class to any element with
     class ".reveal" once it enters the viewport.
     ─────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ───────────────────────────────
     2. ANIMATED STAT COUNTERS
     Counts up from 0 to the target value once
     the stats strip scrolls into view.
     Supports: numbers, percentages, plus sign, and infinity symbol
     ─────────────────────────────── */
  
  /**
   * Animate a counter from 0 to target value
   * @param {HTMLElement} el - The DOM element to update
   * @param {number} target - The target number to count to
   * @param {string} prefix - Text to show before the number (e.g., '+')
   * @param {string} suffix - Text to show after the number (e.g., '%')
   * @param {number} duration - Animation duration in milliseconds
   */
  function animateCounter(el, target, prefix, suffix, duration) {
    // Guard against invalid target
    if (isNaN(target) || target === undefined) return;
    
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    let hasAnimated = false;
    
    // Store to prevent duplicate animations
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';
    
    function update(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      // Easing function: cubic ease-out
      const eased = 1 - Math.pow(1 - elapsed, 3);
      
      let value;
      if (isFloat) {
        value = (eased * target).toFixed(1);
      } else {
        value = Math.floor(eased * target);
      }
      
      // Build the final text
      let displayText = '';
      if (prefix) displayText += prefix;
      displayText += value;
      if (suffix) displayText += suffix;
      
      el.textContent = displayText;
      
      if (elapsed < 1) {
        requestAnimationFrame(update);
      } else {
        // Final value - ensure exact match
        let finalText = '';
        if (prefix) finalText += prefix;
        finalText += isFloat ? target.toFixed(1) : target;
        if (suffix) finalText += suffix;
        el.textContent = finalText;
      }
    }
    
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    // Store original display values
    statNums.forEach(el => {
      el.dataset.display = el.textContent;
    });

    // Counter observer with improved threshold
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        const el = entry.target;
        const text = el.dataset.display;
        
        // Skip if already animated
        if (el.dataset.animated === 'true') return;
        
        // Handle different counter types
        if (text === '100%') {
          animateCounter(el, 100, '', '%', 1600);
        } 
        else if (text === '+3') {
          animateCounter(el, 3, '+', '', 1200);
        }
        else if (text === '2020') {
          animateCounter(el, 2020, '', '', 1800);
        }
        else if (text === '∞') {
          // Infinity symbol - no animation needed
          el.dataset.animated = 'true';
          return;
        }
        else if (text.includes('%')) {
          // Handle any percentage value (e.g., "75%")
          const value = parseInt(text, 10);
          if (!isNaN(value)) {
            animateCounter(el, value, '', '%', 1500);
          }
        }
        else if (text.includes('+')) {
          // Handle any plus value (e.g., "+5")
          const value = parseInt(text, 10);
          if (!isNaN(value)) {
            animateCounter(el, value, '+', '', 1200);
          }
        }
        else {
          // Handle plain numbers
          const value = parseInt(text, 10);
          if (!isNaN(value)) {
            // Adjust duration based on value size
            const duration = Math.min(2000, Math.max(800, value * 10));
            animateCounter(el, value, '', '', duration);
          }
        }
        
        // Unobserve after animation starts
        counterObs.unobserve(el);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }); // Lower threshold for better mobile experience

    statNums.forEach(el => counterObs.observe(el));
  }

  /* ───────────────────────────────
     3. ADDITIONAL: Fade-in animation for stats strip
        (smooth appearance)
     ─────────────────────────────── */
  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const fadeObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsStrip.style.opacity = '1';
          statsStrip.style.transform = 'translateY(0)';
          fadeObs.unobserve(statsStrip);
        }
      });
    }, { threshold: 0.1 });
    
    // Set initial styles if not already set
    if (!statsStrip.style.opacity) {
      statsStrip.style.opacity = '0';
      statsStrip.style.transform = 'translateY(15px)';
      statsStrip.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    
    fadeObs.observe(statsStrip);
  }

  /* ───────────────────────────────
     4. ADDITIONAL: Parallax effect on hero (optional)
        Subtle movement on scroll
     ─────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.35;
      heroBg.style.transform = `scale(1.05) translateY(${rate * 0.05}px)`;
    });
  }

  /* ───────────────────────────────
     5. FIX: Re-run reveal on window resize
        (ensures elements are revealed after orientation change)
     ─────────────────────────────── */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-check reveal elements that might have changed position
      const allReveal = document.querySelectorAll('.reveal:not(.in)');
      if (allReveal.length) {
        const tempObs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              tempObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08 });
        allReveal.forEach(el => tempObs.observe(el));
      }
    }, 200);
  });

}); // end DOMContentLoaded
