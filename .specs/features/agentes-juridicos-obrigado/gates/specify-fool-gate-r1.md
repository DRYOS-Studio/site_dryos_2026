# Specify — fool-gate r1 (2026-09-25): PASS, 0 BLOCKER

W1 token gravado cedo passa → O4 "só com ok:true" + mutação `token-cedo` (incorporado)
W2 timeout 25 s sem prova → caso com rota que não responde + `page.clock` (incorporado)
W3 400 sem mutação → `400-vira-erro`, `400-botao-preso` (incorporado)
W4 bfcache: Voltar restaura botão preso → AC P7 + reset no `pageshow` (incorporado)
W5 trigger GTM pode filtrar Page Path → checklist do Rafael (GTM Preview)
W6 preview com Deployment Protection → P6 roda com bypass ou em produção
W7 doc-sync landing spec/design → no implement (incorporado)
W8 `guia-diverge` não rodada contra obrigado → roda na bateria (incorporado)
W9 sitemap sem AC → aceito: noindex (P5) é a defesa
