# عبق الياسمين للعطور | ABAG Fragrances — Website

موقع تعريفي بمحلات عبق الياسمين للعطور (ود مدني، السودان) — موقع ثابت (Static)
مبني بالكامل بـ HTML, CSS وJavaScript بدون أي أدوات بناء أو إطارات عمل، وجاهز
للنشر مباشرة على **GitHub Pages**.

---

## 📁 Folder Structure

```
abag/
│
├── index.html                 ← الصفحة الرئيسية (one-page site)
│
├── pages/
│   ├── about.html             ← من نحن
│   ├── services.html          ← منتجاتنا وخدماتنا
│   ├── contact.html           ← اتصل بنا
│   ├── privacy.html           ← سياسة الخصوصية (جديد)
│   └── terms.html             ← الشروط والأحكام (جديد)
│
├── assets/
│   ├── css/
│   │   ├── style.css          ← المتغيرات، الشعار، التنقل، Hero، التذييل
│   │   ├── components.css     ← من نحن، المنتجات، المعرض، آراء العملاء، النموذج
│   │   └── responsive.css     ← نقاط التوقف (تابلت/جوال) وقائمة الجوال
│   │
│   ├── js/
│   │   ├── main.js            ← التنقل، تبويبات المنتجات، الصندوق المنبثق (Lightbox)
│   │   └── animations.js       ← حركة الظهور عند التمرير + عداد الإحصائيات
│   │
│   ├── images/
│   │   └── logo.svg           ← شعار بديل (انظر "ملاحظات هامة" أدناه)
│   │
│   └── icons/
│       └── whatsapp.svg       ← أيقونة واتساب
│
└── README.md
```

---

## 🚀 Deploying to GitHub Pages

1. Push the contents of the `abag/` folder to the root of your repository
   (or to a `docs/` folder, depending on your Pages configuration).
2. In your repo settings, enable **GitHub Pages** and point it to the branch
   / folder containing `index.html`.
3. All paths in the project are **relative**, so the site works whether it's
   served from the repository root or from a sub-path
   (e.g. `username.github.io/repo-name/`).

No build step, no `npm install`, no bundler — just static files.

---

## 🧩 What Was Done

### 1. Project restructuring
- The original single 84 KB `indexabag.html` file (with ~1,400 lines of
  inline `<style>` and `<script>`) was split into a clean, multi-file
  project following separation-of-concerns best practices.
- All CSS was extracted into three logical files (`style.css`,
  `components.css`, `responsive.css`).
- All JavaScript was extracted into two files (`main.js`, `animations.js`).
- Five additional pages were created under `pages/` (`about.html`,
  `services.html`, `contact.html`, `privacy.html`, `terms.html`) so the
  site can also be browsed as a traditional multi-page site, while
  `index.html` remains the full one-page experience.

### 2. Accessibility (a11y)
- Added a **skip-to-content** link for keyboard/screen-reader users.
- Added `aria-label`, `aria-labelledby`, `aria-controls`, `aria-selected`,
  `aria-expanded`, `aria-current`, and `role` attributes throughout
  (navigation, tabs, lightbox, dialog).
- All `<img>` tags now have descriptive `alt` text in Arabic.
- Product tabs now use proper `role="tablist"` / `role="tab"` /
  `role="tabpanel"` semantics, and the gallery items are keyboard
  operable (`tabindex`, `Enter`/`Space` to open the lightbox).
- The lightbox can be closed with `Escape` and navigated with arrow keys.
- Added a `.visually-hidden` utility class for screen-reader-only text
  (used for extra link context such as "اطلب الآن - عطور فرنسية").
- Respect for `prefers-reduced-motion`.

### 3. Semantic HTML
- Wrapped the page in `<header>`, `<main>`, and `<footer>` landmarks.
- Used `<nav>`, `<section>`, `<article>`, `<figure>/<figcaption>`, and
  `<blockquote>` where semantically appropriate (testimonials, about
  image, product cards).
- Headings now follow a logical hierarchy (`h1` → `h2` → `h3`) on every
  page instead of skipping levels or repeating `h1`.

### 4. SEO
- Added per-page `<title>` and `<meta name="description">`.
- Added `<meta name="keywords">`, `<meta name="author">`, canonical
  links, and Open Graph tags on the homepage.
- `privacy.html` and `terms.html` are marked `noindex, follow` since
  they are policy pages.

### 5. Performance
- Added `rel="preconnect"` for Google Fonts.
- All content images use `loading="lazy"` plus explicit `width`/`height`
  to reduce layout shift.
- Removed duplicated CSS rules and consolidated repeated inline styles
  into reusable classes (`.text-on-dark`, `.subtitle-muted`,
  `.visually-hidden`, etc.).
- Scripts are loaded with `defer` so they don't block rendering.

### 6. Bug fixes
- **Broken logo path**: the original file referenced a local file path
  (`/mnt/user-data/uploads/Abag.jpeg`), which does not exist on the web
  and would 404 on GitHub Pages. It has been replaced with
  `assets/images/logo.svg` — a placeholder brand-styled SVG logo using
  the site's existing gold/leather color palette. **Replace this file
  with your real logo** (see "Important Notes" below).
- **Duplicate `id` attributes**: the original markup re-used the same
  `id`s for repeated elements (e.g. multiple elements sharing one id
  across tab panels). All ids are now unique; repeated components use
  classes instead.
- **Inline `onclick` handlers** (e.g. `onclick="switchTab(...)"`,
  `onclick="closeMobileNav()"`) were removed and replaced with
  `data-*` attributes and proper event listeners in `main.js`, removing
  console warnings about undefined inline handlers on page-load.
- **Invalid/incomplete HTML** (unclosed tags, stray attributes) found in
  the original were corrected.
- Removed unused/duplicated CSS selectors that were defined more than
  once with conflicting values.

### 7. Responsive layout
- `responsive.css` defines two breakpoints: `1024px` (tablet) and
  `640px` (mobile), plus a dedicated full-screen mobile navigation state
  (`body.nav-mobile-open`) toggled by the hamburger button.
- The visual identity (colors, fonts, spacing rhythm, gold/leather
  palette) is preserved exactly across all breakpoints.

---

## ⚠️ Important Notes / Issues Found in the Original File

1. **Logo image**: The original `<img>` for the logo pointed to a local
   filesystem path (`/mnt/user-data/uploads/Abag.jpeg`), which is **not
   a valid web path** and would be broken on any deployed site. A
   placeholder SVG logo (`assets/images/logo.svg`) using the same gold
   and leather-brown brand colors has been created so the site renders
   correctly. **Please replace `assets/images/logo.svg` with your actual
   logo file** (SVG, PNG, or JPEG — just update the `src` attributes in
   `index.html` and all files in `pages/` accordingly).
2. **External Unsplash images**: Product, gallery, and about-section
   images are loaded from `images.unsplash.com`. These remain unchanged
   from the original as placeholder/stock imagery. For production, it's
   recommended to download these images and serve them from
   `assets/images/` for better performance, reliability, and to avoid
   third-party hotlinking issues.
3. **Privacy & Terms pages**: `privacy.html` and `terms.html` did not
   exist in the original project. Generic, editable starter content has
   been written in Arabic — please review and adjust the wording with
   legal guidance specific to your business.
4. **Multi-page vs one-page**: The original was a single-page site with
   anchor navigation. To satisfy the requested folder structure,
   `pages/about.html`, `services.html`, and `contact.html` were created
   as standalone pages that reuse the same sections/content. The
   homepage (`index.html`) remains a complete one-page experience with
   anchor links (`#about`, `#products`, etc.) — both navigation styles
   work together via relative links (e.g. `../index.html#gallery`).
5. **Contact form**: The form submits via `GET` to a `wa.me` WhatsApp
   link (as in the original). This works as a static "mailto"-style
   alternative with no backend required, but note that pre-filled text
   via a `<select>`/`<textarea>` combo on a `wa.me` GET request has
   limited browser support — test this on your target devices, or
   consider a form service (e.g. Formspree) if reliable submissions are
   required.

---

## 🎨 Brand Colors (unchanged from the original)

| Variable        | Hex       | Usage                         |
|------------------|-----------|-------------------------------|
| `--leather-dk`  | `#3D1A08` | Nav background, dark accents  |
| `--leather-md`  | `#5C2A0E` | Footer gradient                |
| `--gold`        | `#C9961A` | Primary accent / buttons       |
| `--gold-lt`     | `#E8BE45` | Highlights, hover states       |
| `--champagne`   | `#F2D878` | Light text on dark backgrounds |
| `--ivory`       | `#FAF7F2` | Light section backgrounds      |
| `--ink`         | `#0C0C0C` | Dark section backgrounds       |

---

## 🛠️ Local Preview

No build tools are required. Simply open `index.html` in a browser, or
serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`.
