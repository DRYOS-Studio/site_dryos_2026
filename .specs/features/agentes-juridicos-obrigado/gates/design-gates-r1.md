# Design — r1 (2026-09-25)

## design-gate: PASS
W1 CSS morto copiado (hero, agentes, como, form) → cortado; do bloco do form fica só o `.hp`; na r2, `.btn` volta e saem `.nav-links` e `.reveal` (incorporado)
W2 nav sem links → decisão: intencional; a obrigado é fim de funil, só o logo e o bloco "rotina" como saída

## fool-gate: FAIL → corrigido
B1 R3 (plano pago) e EAOAB 32 só na landing; a obrigado abre por link direto → `#guideReq` na obrigado, P5 + mutação `sem-requisito`
W1 bateria sem baseline → `mutate-page.js` roda o e2e no original e aborta (incorporado)
W2 reset do `pageshow` só com `persisted`; Firefox restaura `disabled` → reset incondicional (incorporado)
W3 `guia-diverge` fora do script → no fim do `mutate-page.js` (incorporado)
W4 evento síncrono antes do gtm.js; conversão por page_view anula o ADR-1 → checklist do Rafael
W5 vercel-config não checa a obrigado → assert de existência (incorporado)
W6 `--wa` órfão na landing → removido (incorporado)
Security-gate dispensado: `api/lead.js`, auth e dados não mudam.
