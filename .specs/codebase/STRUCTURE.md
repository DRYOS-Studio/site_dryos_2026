# Project Structure

**Root:** `/Users/rafael/Documents/GitHub/site_dryos_2026`

## Directory Tree

```text
.
├── .claude/
│   └── worktrees/
├── .git/
├── .specs/
│   └── codebase/
├── images/
│   ├── selo-rd-platinum-2026.jpg
│   └── villains/
│       ├── villain-01-manualis.jpg
│       ├── villain-02-silos.jpg
│       ├── villain-03-retrabalho.jpg
│       ├── villain-04-lento.jpg
│       ├── villain-05-achismo.jpg
│       ├── villain-06-drenador.jpg
│       └── villain-07-enganador.jpg
├── README.md
├── dryos-deploy.zip
├── favicon.svg
├── index.html
├── projetos.html
└── vercel.json
```

## Module Organization

### Home Page

**Purpose:** main institutional landing page and conversion flow.

**Location:** `index.html`

**Key areas:**

- Navigation and hero.
- Manifesto and operational villain framing.
- Product paths: Core, Spark, Studio.
- Project cards and client proof.
- Diagnostic form with RD Station conversion.
- Footer and floating WhatsApp CTA.

### Portfolio Page

**Purpose:** detailed list of systems/projects in production.

**Location:** `projetos.html`

**Key areas:**

- Page header.
- Repeated `project-detail` sections for five projects.
- Final CTA back to the home diagnostic anchor.
- Footer and floating WhatsApp CTA.

### Assets

**Purpose:** local imagery used by the static pages.

**Location:** `images/`

**Key files:**

- `images/selo-rd-platinum-2026.jpg`
- `images/villains/*.jpg`
- `favicon.svg` at root.

### Deployment Configuration

**Purpose:** Vercel static hosting behavior and security headers.

**Location:** `vercel.json`

**Key settings:**

- `cleanUrls: true`
- `trailingSlash: false`
- headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.

### Documentation and Artifacts

**Purpose:** human maintenance/deploy notes and packaged deploy artifact.

**Location:** root.

**Key files:**

- `README.md`
- `dryos-deploy.zip`
- `.specs/codebase/*.md`

## Where Things Live

**Marketing copy and layout:**

- UI/Interface: `index.html`, `projetos.html`
- Business/content logic: static HTML sections in each page
- Configuration: CSS tokens inside page-local `<style>` blocks

**Lead capture:**

- UI/Interface: `index.html`, `#diagnostico`
- Business Logic: inline script at the end of `index.html`
- Data Access: RD Station conversion endpoint via `fetch`
- Configuration: `RD_TOKEN`, `RD_IDENTIFICADOR`, hidden form fields

**Tracking:**

- UI/Interface: none
- Business Logic: `captureTracking()` IIFE in both pages
- Data Access: `window.location`, `document.referrer`, `sessionStorage`
- Configuration: `TRACKING_KEYS`

**Portfolio content:**

- UI/Interface: home project cards in `index.html`, detail sections in `projetos.html`
- Business Logic: static links and anchors
- Data Access: none
- Configuration: project copy hardcoded in HTML

## Special Directories

**`.claude/`:**

Agent/tooling worktree metadata. It is untracked in the current git status.

**`.specs/`:**

Spec-driven documentation generated for project analysis and future planning.
