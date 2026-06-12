# Integrations

**Analyzed:** 2026-06-12

## Hosting: Vercel

**Location:** `vercel.json`, `README.md`

**Purpose:** deploy the static site.

**Configuration:**

- `cleanUrls: true`
- `trailingSlash: false`
- global headers for every route:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`

**Operational notes:** `README.md` documents both drag-and-drop deploy and Git-based deploy. The repository is already connected to GitHub locally.

## Google Tag Manager

**Location:** `index.html`, `projetos.html`

**Container:** `GTM-KS9H2KN`

**Purpose:** analytics/tag management.

**Implementation:** standard GTM script in `<head>` and `<noscript>` iframe after the opening body content.

## Google Fonts

**Location:** `index.html`, `projetos.html`

**Purpose:** typography.

**Implementation:**

- preconnect to `https://fonts.googleapis.com`
- preconnect to `https://fonts.gstatic.com`
- stylesheet for `Funnel Display`, `Onest`, and `JetBrains Mono`

## RD Station

**Location:** `index.html`

**Purpose:** diagnostic form conversion capture.

**Endpoint:** `https://www.rdstation.com.br/api/1.3/conversions`

**Configuration in code:**

- `RD_TOKEN`
- `RD_IDENTIFICADOR = 'site-dryos-diagnostico'`

**Data sent:**

- form fields: name, email, phone, role, product interest, monthly revenue
- hidden attribution fields: UTM fields, `gclid`, `fbclid`, `referrer_origin`, `landing_page`, `conversion_url`
- RD Station token and identifier

**Failure behavior:** appends an inline error message and lets the user retry or use WhatsApp.

## WhatsApp

**Location:** `index.html`, `projetos.html`

**Purpose:** direct contact CTA.

**Implementation:** `https://wa.me/5521967287595?text=Oi%2C%20vim%20pelo%20site%20da%20DRYOS`

**Surfaces:**

- contact channel in `index.html`
- floating WhatsApp button in both pages

## Email

**Location:** `index.html`, `projetos.html`

**Purpose:** direct contact CTA.

**Implementation:** `mailto:contato@dryos.com.br`

## LinkedIn

**Location:** `index.html`

**Purpose:** social/company link.

**Implementation:** `https://linkedin.com/company/dryos`

## Local Assets

**Location:** `images/`, `favicon.svg`, inline base64 logo in HTML.

**Purpose:** visual identity, villain illustrations, RD Platinum seal, favicon.

**Observed usage:**

- villain illustrations in `index.html`;
- RD Platinum seal in both footers;
- favicon in both pages;
- duplicated base64 logo image in both navs.

## Attribution Storage

**Location:** inline scripts in `index.html` and `projetos.html`.

**Purpose:** preserve marketing attribution during the session.

**Storage:** `sessionStorage` keys prefixed with `dryos_`.

**Tracked fields:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `referrer_origin`, `landing_page`.

## Integration Risks

- RD Station token is embedded client-side. This may be acceptable for this legacy endpoint pattern, but it is publicly visible.
- The README checklist references older placeholders such as `hello@dryos.com.br` and a placeholder WhatsApp number, while the code has current contact values.
- GTM, RD Station, Google Fonts, WhatsApp, and LinkedIn all require network access; offline/local file testing will not fully exercise production behavior.
- Contact and tracking logic is duplicated across pages.
