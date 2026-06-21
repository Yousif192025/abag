/* =====================================================
   nav-fix.js — إصلاح قائمة الجوال
   أضف هذا السكريبت في آخر body في index.html:
   <script src="assets/js/nav-fix.js"></script>

   يعمل هذا الملف بشكل مستقل عن main.js ويصحح:
   ① روابط javascript:void(0) → anchor navigation حقيقي
   ② إغلاق القائمة عند الضغط على أي رابط داخلي
   ③ Smooth Scroll مع مراعاة ارتفاع الهيدر
   ④ إضافة overlay تلقائياً إذا لم يكن موجوداً في HTML
   ===================================================== */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════
     أ. الكشف التلقائي عن عناصر القائمة
     ══════════════════════════════════════════════════ */
  const SELECTORS = {
    toggle:    '[data-nav-toggle], .nav-toggle, .menu-toggle, .hamburger, #menu-btn, #nav-toggle',
    menu:      '[data-mobile-menu], .mobile-menu, .nav-links, .nav-menu, #mobile-menu, #nav-menu',
    overlay:   '[data-nav-overlay], .nav-overlay',
    header:    'header, .site-header, #header, .header-main',
    anchorLink: 'a[href^="#"]',
  };

  const toggle  = document.querySelector(SELECTORS.toggle);
  const menu    = document.querySelector(SELECTORS.menu);
  const header  = document.querySelector(SELECTORS.header);
  const body    = document.body;

  /* ── إنشاء overlay تلقائياً إذا لم يكن في HTML ──── */
  let overlay = document.querySelector(SELECTORS.overlay);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('data-nav-overlay', '');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }

  /* ══════════════════════════════════════════════════
     ب. دوال فتح/إغلاق القائمة
     ══════════════════════════════════════════════════ */
  function isOpen() {
    return body.classList.contains('nav-mobile-open')
        || (menu && (menu.classList.contains('open') || menu.classList.contains('active')));
  }

  function openNav() {
    body.classList.add('nav-mobile-open');
    if (menu) {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
    }
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    overlay.style.display = 'block';
    // منع تمرير الصفحة خلف القائمة
    body.style.overflow = 'hidden';
    // iOS Safari fix
    body.style.position = 'relative';
  }

  function closeNav() {
    body.classList.remove('nav-mobile-open');
    if (menu) {
      menu.classList.remove('open');
      menu.classList.remove('active');
      menu.setAttribute('aria-hidden', 'true');
    }
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    // إخفاء overlay بعد انتهاء الـ transition
    setTimeout(function () {
      overlay.style.display = '';
    }, 320);
    body.style.overflow = '';
    body.style.position = '';
  }

  function toggleNav() {
    if (isOpen()) closeNav(); else openNav();
  }

  /* ══════════════════════════════════════════════════
     ج. Event Listeners الأساسية
     ══════════════════════════════════════════════════ */
  if (toggle) {
    // إزالة أي listener قديم وإضافة الجديد
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    newToggle.addEventListener('click', toggleNav);
  }

  overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) closeNav();
  });

  /* ══════════════════════════════════════════════════
     د. إصلاح الروابط الداخلية (الجوهر الحقيقي للمشكلة)
     ══════════════════════════════════════════════════ */

  /**
   * حساب ارتفاع الهيدر الفعلي (يتغير على بعض المشاريع)
   */
  function getHeaderHeight() {
    const h = document.querySelector(SELECTORS.header);
    return h ? h.getBoundingClientRect().height : 70;
  }

  /**
   * التمرير السلس للقسم المستهدف
   */
  function scrollToSection(targetEl, immediate) {
    const delay = immediate ? 0 : 340; // انتظار إغلاق القائمة
    setTimeout(function () {
      const headerH  = getHeaderHeight();
      const extraGap = 12; // مسافة إضافية جمالية
      const rect      = targetEl.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - headerH - extraGap;

      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      } else {
        // polyfill لـ iOS 10 وأقدم
        animatedScroll(scrollTop, 550);
      }
    }, delay);
  }

  function animatedScroll(to, duration) {
    const from  = window.pageYOffset;
    const delta = to - from;
    let   start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      window.scrollTo(0, from + delta * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /**
   * المعالج الرئيسي لضغطة الرابط الداخلي
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * هذا هو جوهر الإصلاح:
   * السبب الحقيقي للمشكلة = عند الضغط على رابط #section:
   *  1. المتصفح يحاول التنقل الفوري
   *  2. القائمة لا تُغلق → تتداخل مع القسم
   *  3. الهيدر الثابت يغطي أعلى القسم (يحدث القفز)
   *  4. scroll-behavior:smooth يُلغى أحياناً بسبب overflow:hidden على body
   *
   * الحل: preventDefault → closeNav → انتظار → scrollToSection
   */
  function fixAnchorLink(anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');

      // تجاهل: روابط خارجية، أو فارغة، أو "#" وحدها
      if (!href || !href.startsWith('#') || href.length < 2) return;

      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);

      // إذا لم يُوجد القسم في الصفحة → اترك المتصفح يتصرف
      if (!targetEl) return;

      e.preventDefault();
      e.stopPropagation();

      const navWasOpen = isOpen();
      if (navWasOpen) closeNav();

      // الانتقال بعد إغلاق القائمة
      scrollToSection(targetEl, !navWasOpen);
    });
  }

  // تطبيق الإصلاح على جميع الروابط الداخلية الموجودة الآن
  document.querySelectorAll('a[href^="#"]').forEach(fixAnchorLink);

  // دعم الروابط التي تُضاف ديناميكياً لاحقاً (MutationObserver)
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        const links = node.matches && node.matches('a[href^="#"]')
          ? [node]
          : Array.from(node.querySelectorAll('a[href^="#"]'));
        links.forEach(fixAnchorLink);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });


  /* ══════════════════════════════════════════════════
     هـ. إصلاح روابط "javascript:void(0)" في القائمة
     ══════════════════════════════════════════════════

   بعض روابط القائمة كانت تحتوي على javascript:void(0)
   مع data attribute يحدد القسم المستهدف.

   الإصلاح: البحث عن هذه الروابط وربطها بالأقسام الصحيحة.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('a[href="javascript:void(0)"], a[href="javascript:;"], a[href="javascript:void(0);"]')
    .forEach(function (voidLink) {
      // محاولة استخلاص القسم المستهدف من data attributes
      const target = voidLink.getAttribute('data-target')
                  || voidLink.getAttribute('data-section')
                  || voidLink.getAttribute('data-scroll-to')
                  || voidLink.getAttribute('data-href');

      // محاولة استخلاصه من نص الرابط (قصتنا→about, منتجاتنا→products ...)
      const textMap = {
        'قصتنا':      'about',
        'منتجاتنا':   'products',
        'لماذا نحن':  'why-us',
        'المعرض':     'gallery',
        'اتصل بنا':   'contact',
        'الرئيسية':   'hero',
        'home':       'hero',
        'about':      'about',
        'products':   'products',
        'gallery':    'gallery',
        'contact':    'contact',
      };

      const linkText  = voidLink.textContent.trim();
      const sectionId = target
                     || textMap[linkText]
                     || textMap[linkText.toLowerCase()];

      if (!sectionId) return;

      const targetEl = document.getElementById(sectionId);
      if (!targetEl) return;

      // تحويل الرابط لـ anchor حقيقي
      voidLink.setAttribute('href', '#' + sectionId);
      voidLink.removeAttribute('onclick');

      fixAnchorLink(voidLink);
    });


  /* ══════════════════════════════════════════════════
     و. إصلاح الروابط التي تذهب لصفحات مستقلة
        بدلاً من الأقسام في نفس الصفحة
     ══════════════════════════════════════════════════

   مثال: href="pages/about.html" بينما القسم موجود
   في نفس الصفحة بـ id="about"

   ملاحظة: هذا الإصلاح آمن لأنه يتحقق أولاً من وجود
   القسم في الصفحة الحالية.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const pageRedirectMap = {
    'pages/about.html':    'about',
    'pages/products.html': 'products',
    'pages/gallery.html':  'gallery',
    'pages/contact.html':  'contact',
    '#about':              'about',
    '#products':           'products',
    '#why-us':             'why-us',
    '#gallery':            'gallery',
    '#contact':            'contact',
  };

  document.querySelectorAll('a[href]').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;

    // فقط الروابط التي تشير لصفحات داخل المشروع
    const matchedId = pageRedirectMap[href] || pageRedirectMap[href.replace('./', '')];
    if (!matchedId) return;

    const targetEl = document.getElementById(matchedId);
    if (!targetEl) return; // القسم غير موجود → لا تُعدّل

    // القسم موجود في نفس الصفحة → حوّل الرابط لـ anchor
    link.setAttribute('href', '#' + matchedId);
    fixAnchorLink(link);
  });


  /* ══════════════════════════════════════════════════
     ز. إغلاق القائمة عند الضغط خارجها (swipe)
     ══════════════════════════════════════════════════ */
  let touchStartX = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (!isOpen()) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff       = touchStartX - touchEndX;

    // swipe يسار (RTL) أو يمين (LTR) لإغلاق القائمة
    const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
    if ((isRTL && diff < -60) || (!isRTL && diff > 60)) {
      closeNav();
    }
  }, { passive: true });


  /* ══════════════════════════════════════════════════
     ح. تحديث scroll-margin-top ديناميكياً
        (يضمن عدم تغطية الهيدر للأقسام)
     ══════════════════════════════════════════════════ */
  function updateScrollMargins() {
    const headerH = getHeaderHeight();
    document.querySelectorAll('section[id], div[id]').forEach(function (el) {
      el.style.scrollMarginTop = (headerH + 8) + 'px';
    });
    document.documentElement.style.scrollPaddingTop = (headerH + 8) + 'px';
  }

  updateScrollMargins();
  window.addEventListener('resize', updateScrollMargins, { passive: true });


  console.info('✅ [nav-fix.js] تم تفعيل إصلاح قائمة الجوال بنجاح');

})();
