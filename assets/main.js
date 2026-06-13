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

  function closeMobileNav() {
    mobileOpen = false;
    document.body.classList.remove('nav-mobile-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileOpen = !mobileOpen;
      document.body.classList.toggle('nav-mobile-open', mobileOpen);
      hamburger.setAttribute('aria-expanded', String(mobileOpen));
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
    document.querySelectorAll('.prod-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.prod-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const panel = document.getElementById('panel-' + panelId);
    if (panel) panel.classList.add('active');

    // Re-trigger the reveal animation for the now-visible panel
    document.querySelectorAll('#panel-' + panelId + ' .reveal').forEach(el => {
      el.classList.remove('in');
      setTimeout(() => el.classList.add('in'), 50);
    });
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

  function openLightbox(idx) {
    lbCurrent = idx;
    showLbSlide();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showLbSlide() {
    const item = galleryItems[lbCurrent];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.cap;
    if (lbCap) lbCap.textContent = item.cap;
  }
  function lbGo(dir) {
    lbCurrent = (lbCurrent + dir + galleryItems.length) % galleryItems.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      showLbSlide();
      lbImg.style.opacity = '1';
    }, 180);
  }

  if (lb && lbImg) {
    document.querySelectorAll('.g-item[data-lb-src]').forEach((item, i) => {
      galleryItems.push({
        src: item.dataset.lbSrc,
        cap: item.dataset.lbCap || ''
      });
      item.addEventListener('click', () => openLightbox(i));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', () => lbGo(-1));
    if (lbNext)  lbNext.addEventListener('click', () => lbGo(1));

    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')    closeLightbox();
      if (e.key === 'ArrowRight') lbGo(-1);
      if (e.key === 'ArrowLeft')  lbGo(1);
    });
  }

});
