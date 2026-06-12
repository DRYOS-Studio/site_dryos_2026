# Tech Stack

**Analyzed:** 2026-06-12

## Core

- Framework: none. Static HTML served directly.
- Language: HTML5, CSS3, vanilla JavaScript.
- Runtime: browser only.
- Package manager: none detected. There is no `package.json`, lockfile, or build manifest.
- Build step: none. `README.md` states the site is static HTML with no dependencies.

## Frontend

- UI Framework: none.
- Styling: inline `<style>` blocks in each page, using CSS custom properties, responsive media queries, CSS grid/flex, keyframe animations, and scroll reveal classes.
- State Management: browser DOM state only. Examples include testimonial carousel active index and form submit state in `index.html`.
- Form Handling: native HTML form validation plus vanilla JS submit handler for RD Station conversion API.
- Assets: local JPG assets under `images/`, inline SVG icons, inline base64 logo image, and `favicon.svg`.
- Fonts: Google Fonts via CDN: Funnel Display, Onest, JetBrains Mono.

## Backend

- API Style: none inside this repository.
- Database: none.
- Authentication: none.
- Server configuration: `vercel.json` contains static Vercel headers only.

## Testing

- Unit: none detected.
- Integration: none detected.
- E2E: none detected.
- Manual checks: implied by static-site workflow in `README.md`.

## External Services

- Hosting: Vercel, configured by `vercel.json`.
- Analytics/Tags: Google Tag Manager container `GTM-KS9H2KN`.
- Lead capture/CRM: RD Station conversion endpoint, called from `index.html`.
- Contact: WhatsApp `wa.me`, `mailto:contato@dryos.com.br`, LinkedIn company link.
- Fonts: Google Fonts and `fonts.gstatic.com`.

## Development Tools

- Git repository: `https://github.com/DRYOS-Studio/site_dryos_2026.git`.
- Deployment artifact: `dryos-deploy.zip` exists at the repository root.
- Local project docs: `README.md`.
- Agent/worktree metadata: `.claude/` exists and is currently untracked.
