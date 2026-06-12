# Code Conventions

**Analyzed:** 2026-06-12

## Naming Conventions

**Files:**

- Root-level static pages use simple Portuguese route names: `index.html`, `projetos.html`.
- Config/docs use conventional names: `README.md`, `vercel.json`.
- Image assets use descriptive kebab-case names: `selo-rd-platinum-2026.jpg`, `villain-01-manualis.jpg`.

**CSS Classes:**

- Classes are kebab-case and grouped by section/component prefix.
- Examples: `nav-inner`, `hero-meta-text`, `villain-card`, `project-detail-grid`, `contact-form-submit`, `testimonial-dot`, `whatsapp-float`.
- Modifier/state classes use simple names such as `active`, `is-active`, and `is-visible`.

**JavaScript Functions:**

- Function names use camelCase.
- Examples: `captureTracking`, `go`, `startAutoplay`, `stopAutoplay`.

**Variables and Constants:**

- Local variables use camelCase: `carousel`, `slides`, `prevBtn`, `successBox`, `conversionUrlInput`.
- Constants use uppercase snake case when treated as configuration: `TRACKING_KEYS`, `AUTOPLAY_MS`, `RD_TOKEN`, `RD_IDENTIFICADOR`.

## Code Organization

**Import/Dependency Declaration:**

- No JavaScript imports or bundled dependencies.
- External dependencies are included directly in markup:
  - Google Tag Manager script in `<head>` plus `<noscript>` iframe in `<body>`;
  - Google Fonts links in `<head>`;
  - RD Station is called with `fetch` from inline JS.

**File Structure:**

Observed page order:

1. document metadata and external links;
2. large inline CSS block;
3. GTM noscript fallback;
4. navigation;
5. page sections;
6. footer and floating WhatsApp action;
7. inline JavaScript at the bottom.

**CSS Structure:**

- Design tokens are centralized at the top of each page in `:root`.
- Major sections are separated by comments such as `/* NAV */`, `/* HERO */`, `/* FOOTER */`, and `/* WHATSAPP FLOATING */`.
- Responsive behavior is colocated near the relevant component using `@media`.
- Visual language uses neutral/off-white backgrounds, black text, oak green accents, thin borders, grid layouts, and mono labels.

**HTML Structure:**

- Top-level sections use semantic `<section>` tags and descriptive classes.
- CTAs are anchors for navigation/contact, not buttons, except for form and carousel controls.
- SVG icons are inline.
- Images include `alt`, `loading="lazy"`, and dimensions where present.

## Type Safety/Documentation

**Approach:** no static type system. Documentation is mostly comments and semantic naming.

Examples:

- `README.md` documents deploy and maintenance.
- HTML comments identify large sections: `<!-- HERO -->`, `<!-- PROJECT 1: EVENTMETRICS -->`.
- JavaScript comments explain tracking, carousel, mobile swipe, and RD Station form submission.

## Error Handling

**Pattern:** limited client-side try/catch around browser APIs and network submit.

- Referrer parsing is wrapped in `try/catch` and ignores invalid referrer URLs.
- RD Station submission catches errors, restores the submit button, changes text to `Tentar novamente`, and appends `.contact-form-error`.
- Native browser validation handles missing/invalid required form fields with `form.checkValidity()` and `form.reportValidity()`.

## Comments/Documentation

**Style:** comments mark major page blocks and explain non-obvious interaction logic. They are concise and mostly Portuguese.

Observed examples:

- `// UTM / tracking capture`
- `// CARROSSEL DE DEPOIMENTOS`
- `// Suporte a swipe em mobile`
- `// FORMULARIO DE DIAGNOSTICO - envio pra RD Station`

## Notable Variations

- `README.md` still mentions placeholder checklist items for WhatsApp/email/RD Station, while `index.html` already contains a real WhatsApp number, `contato@dryos.com.br`, and RD Station submission code.
- The same base64 logo image is duplicated in both HTML files.
- CSS is duplicated between pages instead of extracted to a shared stylesheet.
