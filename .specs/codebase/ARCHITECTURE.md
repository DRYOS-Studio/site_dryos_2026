# Architecture

**Analyzed:** 2026-06-12

**Pattern:** static marketing site with page-local CSS and vanilla JavaScript.

## High-Level Structure

```text
Browser
  |
  +-- /              -> index.html
  |     +-- inline CSS design system
  |     +-- static sections and local images
  |     +-- vanilla JS: tracking, reveal, carousel, RD Station form submit
  |
  +-- /projetos      -> projetos.html
        +-- inline CSS page system
        +-- static portfolio sections
        +-- vanilla JS: tracking capture

Vercel serves static files and applies security headers from vercel.json.
```

## Identified Patterns

### Page-Local Design System

**Location:** `index.html` and `projetos.html` inside the opening `<style>` blocks.

**Purpose:** keep each static page self-contained, with no shared CSS file or build step.

**Implementation:** both pages define the same core tokens in `:root`: `--bg`, `--ink`, `--oak`, `--mute`, `--surface`, `--font-display`, `--font-body`, `--font-mono`, `--max-width`, and `--gutter`. Layout components are class-based, for example `.container`, `.nav-inner`, `.section-header`, `.btn-primary`, `.footer-grid`, and `.whatsapp-float`.

**Example:** navigation and footer styles are duplicated across both pages; `index.html` adds home-specific systems such as `.hero`, `.villains-grid`, `.spark-grid`, `.contact-grid`, and `.testimonials-carousel`.

### Static Section Composition

**Location:** page body markup.

**Purpose:** build the site from editorial sections without client-side routing.

**Implementation:** each major block is a top-level semantic section with a stable class and often an anchor `id`.

**Examples:**

- `index.html`: `hero`, `manifesto`, `villains-section`, `three-paths`, `spotlight-core`, `spark-section`, `studio-section`, `projects-section`, `proof-section`, `cta-section`, `about-footer`.
- `projetos.html`: `page-header`, five repeated `project-detail` sections, `page-cta`, `footer`.

### Progressive Enhancement JavaScript

**Location:** bottom scripts in `index.html` and `projetos.html`.

**Purpose:** add tracking capture and small interactions while leaving most content renderable as static HTML.

**Implementation:** JavaScript runs after or around page load:

- immediate IIFE captures UTM, `gclid`, `fbclid`, referrer origin, and landing page into `sessionStorage`;
- `DOMContentLoaded` in `index.html` animates hero words, initializes `IntersectionObserver`, manages carousel state, and submits the diagnostic form;
- `projetos.html` only includes the tracking capture IIFE.

### Conversion Form Integration

**Location:** `index.html`, section `#diagnostico`.

**Purpose:** convert traffic into diagnostic requests and preserve attribution data.

**Implementation:** the form `#dryos-diagnostico-form` uses native required fields and hidden inputs for UTM/referrer fields. On submit, JavaScript builds `URLSearchParams`, appends `token_rdstation` and `identificador`, posts to `https://www.rdstation.com.br/api/1.3/conversions`, then hides the form and shows `#dryos-diagnostico-success`.

### Static Portfolio Linking

**Location:** `index.html` projects section and `projetos.html`.

**Purpose:** keep the home page lightweight while linking to detailed project entries.

**Implementation:** home project cards link to `/projetos#eventmetrics`, `/projetos#cortex`, `/projetos#demarchi`, or `/projetos`. The portfolio page owns detailed content for Eventmetrics, Oikos, Cortex, DeMarchi Automotive, and Kratos Social Content.

## Data Flow

### Tracking and Attribution

```text
User lands with query params
  -> captureTracking reads URLSearchParams
  -> values saved as dryos_* in sessionStorage
  -> diagnostic form loads hidden inputs from sessionStorage
  -> submit payload includes attribution fields
```

The same capture logic exists in both pages, which preserves attribution across navigation between `/` and `/projetos`.

### Diagnostic Conversion

```text
User fills #dryos-diagnostico-form
  -> browser validates required fields
  -> submit button disabled and text changes
  -> payload sent to RD Station conversion API
  -> success: form hidden, success message shown
  -> failure: inline .contact-form-error appended, button re-enabled
```

### Testimonial Carousel

```text
DOMContentLoaded
  -> collect slides, dots, nav buttons
  -> go(index) toggles .is-active and aria-hidden/aria-selected
  -> controls, dots, hover/focus, and swipe update active index
  -> autoplay advances every 8000ms
```

## Code Organization

**Approach:** page-oriented static organization.

**Structure:**

- root files contain deployable pages/config/docs;
- `images/` contains local imagery;
- `images/villains/` contains seven editorial villain illustrations;
- `.specs/codebase/` contains this brownfield mapping.

**Module boundaries:** there are no runtime modules. Boundaries are informal and live in HTML sections and CSS class prefixes.
