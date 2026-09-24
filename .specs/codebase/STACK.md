# Tech Stack

**Analyzed:** 2026-06-12

## Core

- Framework: none. Static HTML served directly.
- Language: HTML5, CSS3, vanilla JavaScript.
- Runtime: browser + one Vercel Node function (`api/lead.js`).
- Package manager: none detected. There is no `package.json`, lockfile, or build manifest.
- Build step: none. `README.md` states the site is static HTML with no dependencies.

## Frontend

- UI Framework: none.
- Styling: inline `<style>` blocks in each page, using CSS custom properties, responsive media queries, CSS grid/flex, keyframe animations, and scroll reveal classes.
- State Management: browser DOM state only. Examples include testimonial carousel active index and form submit state in `index.html`.
- Form Handling: native HTML form validation plus vanilla JS submit handler that posts to `/api/lead`.
- Assets: local JPG assets under `images/`, inline SVG icons, inline base64 logo image, and `favicon.svg`.
- Fonts: Google Fonts via CDN: Funnel Display, Onest, JetBrains Mono.

## Backend

- API Style: one JSON endpoint, `POST /api/lead` (Vercel function).
- Database: none.
- Authentication: none.
- Server configuration: `vercel.json` has security headers and `maxDuration` for `api/lead.js`.

## Testing

- Unit/Integration: `node --test tests/*.test.js` (Node puro, sem package.json).
- E2E: `tests/page.e2e.js` (Playwright da skill local). Ver TESTING.md.
- Manual checks: implied by static-site workflow in `README.md`.

## External Services

- Hosting: Vercel, configured by `vercel.json`.
- Analytics/Tags: Google Tag Manager container `GTM-KS9H2KN`.
- Lead capture/CRM: `api/lead.js` → RD Station + DRYOS Core (server-side; see INTEGRATIONS.md).
- Contact: WhatsApp `wa.me`, `mailto:contato@dryos.com.br`, LinkedIn company link.
- Fonts: Google Fonts and `fonts.gstatic.com`.

## Development Tools

- Git repository: `https://github.com/DRYOS-Studio/site_dryos_2026.git`.
- Deployment artifact: `dryos-deploy.zip` exists at the repository root.
- Local project docs: `README.md`.
- Agent/worktree metadata: `.claude/` exists and is currently untracked.
