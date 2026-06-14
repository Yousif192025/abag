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
    }, { threshold: 0.08 });

    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ───────────────────────────────
     2. ANIMATED STAT COUNTERS
     Counts up from 0 to the target value once
     the stats strip scrolls into view.
     ─────────────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function update(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = isFloat ? (eased * target).toFixed(1) : Math.floor(eased * target);

      el.textContent =
        (suffix === '+' ? '+' : '') +
        value +
        (suffix === '%' ? '%' : '');

      if (elapsed < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = el.dataset.display;
      }
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    statNums.forEach(el => {
      el.dataset.display = el.textContent;
    });

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const text = el.dataset.display;

        if (text === '100%')       animateCounter(el, 100, '%', 1600);
        else if (text === '+3')    animateCounter(el, 3, '+', 1200);
        else if (text === '2020')  animateCounter(el, 2020, '', 1800);

        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObs.observe(el));
  }

});
