# Testing Infrastructure

**Analyzed:** 2026-06-12

## Test Frameworks

**Unit/Integration:** none detected.

**E2E:** none detected.

**Coverage:** none detected.

No `package.json`, `jest`, `vitest`, `playwright`, `cypress`, or test files were found within the sampled repository structure.

## Test Organization

**Location:** no test directory or test files detected.

**Naming:** no repository-specific test naming convention detected.

**Structure:** not applicable.

## Testing Patterns

### Unit Tests

No unit tests currently exist. Client logic is inline in `index.html`, which makes isolated automated unit testing awkward without extracting JavaScript into separate files or using browser-based tests.

### Integration Tests

No integration tests currently exist. The closest integration surface is the diagnostic form posting to RD Station, but there is no mocked or automated verification for this flow.

### E2E Tests

No E2E tests currently exist. Because this is a static site, the most valuable E2E checks would be browser smoke tests for:

- `/` loads without console errors;
- `/projetos` loads without console errors;
- navigation anchors resolve;
- testimonial carousel controls update active slide and ARIA state;
- diagnostic form validates required fields;
- diagnostic form failure path shows `.contact-form-error` when the network/API call fails;
- WhatsApp, email, and LinkedIn CTAs have expected hrefs;
- responsive layouts do not overflow at common mobile widths.

## Manual Verification Surface

Current project workflow in `README.md` implies manual verification after editing and before deploy.

Recommended manual smoke checklist for the current codebase:

1. Open `index.html`.
2. Check hero, navigation, villain cards, Core/Spark/Studio sections, testimonials, form, footer, and floating WhatsApp CTA.
3. Open `projetos.html`.
4. Check each project section and anchors from home cards.
5. Test at desktop and mobile widths.
6. Submit the form with invalid fields and verify browser validation.
7. Submit the form in a safe/staging context before production deploy, because it posts to RD Station.

## Risk Areas Without Automated Tests

- Inline JavaScript can break silently with markup/class changes.
- The same tracking code is duplicated in both pages, so future changes can drift.
- RD Station token and endpoint are embedded in client code and not validated by tests.
- Large inline CSS makes regressions hard to isolate.
- No automated accessibility or link checks are present.

## Suggested Future Testing Setup

For this stack, keep it light:

- Add a static dev server command if a package manager is introduced, or use a simple local server for tests.
- Add Playwright only for smoke/regression tests across `/` and `/projetos`.
- Avoid heavy unit-test infrastructure until JavaScript is extracted from inline scripts.
