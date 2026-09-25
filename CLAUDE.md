# site_dryos_2026

Site estático na Vercel (`cleanUrls`). Captura de lead em `api/lead.js`. Mapa do código: `.specs/codebase/`.

## Landing agentes jurídicos

- A conversão é o evento `generate_lead` (`form_id: agentes-juridicos`), que `agentes-juridicos-obrigado.html` dispara uma vez por envio ok (token `aj_lead` em sessionStorage, gravado pela landing). **Nunca use o page_view de `/agentes-juridicos-obrigado` como conversão**, porque reload, link compartilhado e acesso direto contariam como lead (ADR-1 em `.specs/features/agentes-juridicos-obrigado/adr.md`).
- A regra de qualificação (ICP) é executável em `api/lead.js` (`ICP_*`, `qualify()`). Nova origem de formulário entra na allowlist `RD_IDENTIFIERS`.
- O guia da página de obrigado precisa ter os mesmos comandos do README do plugin `DRYOS-Studio/agentes-juridicos`: `node tests/guide-sync.js`.

## Testes (antes de PR que toque essas páginas ou o `api/lead.js`)

Comandos em `.specs/codebase/TESTING.md`. As baterias de mutação (`tests/mutate.js`, `tests/mutate-page.js`) têm de sair com exit 0. `tests/` e `.specs/` ficam fora do deploy (`.vercelignore`).
