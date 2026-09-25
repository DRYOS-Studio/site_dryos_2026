# Release — r1 (2026-09-25)

## /code-review (medium): 1 achado → corrigido
`guia-diverge` sem `GUIDE_README` passava o HTML na posição do README → morte falsa. `gs()` passa sempre o README (env ou raw do GitHub) no 1º argumento.

## fool-gate conformance: PASS, 0 BLOCKER
W1 P6 sem prova → curl no preview/produção antes do merge (pendente, T4)
W2 ramo `|| !sending` (Firefox) sem prova → P7 declara que é leitura
W3 token órfão + erro + `?r=ok` → `done(false)` limpa o token; mutação `erro-nao-limpa`. Com isso `token-cedo` só sobrevivia pelo 400 → caso do 400 abre `?r=ok` e exige 0 eventos
W4 STRUCTURE/INTEGRATIONS sem a pasta nova → incluída
W5 INTEGRATIONS: GTM Location velho, sem o `generate_lead` → atualizado
W6 repo sem CLAUDE.md/AGENTS.md → regra "conversão = evento, nunca page_view" fica em INTEGRATIONS + ADR-1; criar CLAUDE.md fica a critério do Rafael
W7 sitemap lastmod → 2026-09-25
W8 memória cita "a página" no guide-sync → atualizada
