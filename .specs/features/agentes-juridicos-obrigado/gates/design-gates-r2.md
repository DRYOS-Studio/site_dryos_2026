# Design — r2 (2026-09-25)

## fool-gate r2: PASS, 0 BLOCKER
W1 corte levou a `.btn` (CTA "Conhecer a DRYOS" quebrada); `.nav-links`/`.reveal` mortos → `.btn`/`.btn-primary` de volta, os mortos saem (incorporado)
W2 checklist GTM só em arquivo de gate → `tasks.md` da feature (incorporado)
W3 reset incondicional no `pageshow` do 1º load pode reabilitar o botão no meio de um envio iniciado antes do `load` → `if (e.persisted || !sending)` (incorporado)
W4 noindex + canonical → canonical removido (incorporado)

## validate-gate (Fase 4, UI): PASS, 0 BLOCKER
W1 h1 → h3 sem h2 → `.guide-sub` vira h2 (incorporado)
W2 sniff de `navigator.platform` · W3 copiar sem fallback · W4 botões "Copiar" com o mesmo nome · W5 avisos sem live region · W6 sem `aria-invalid` → já existiam no guia/form antes da mudança; fora do escopo, aceitos
W7 sem meta description → aceito: `noindex`
W8 CSS duplicado entre as páginas → aceito: padrão "page-local design system" do site
