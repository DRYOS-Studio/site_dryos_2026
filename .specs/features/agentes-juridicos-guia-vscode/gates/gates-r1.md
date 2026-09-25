# Specify+Design — r1 (2026-09-25)

## fool-gate: FAIL → corrigido
B1 `guia-diverge` com âncora inexistente (sobrevivia) → âncora = `code[data-cmd]` do marketplace, com ANCHOR-MISSING; baseline com README local (`GUIDE_README`)
B2 S3/M1 impossíveis no preview (URLs de produção) → rollout em 2 fases (G6): PR só com `plugins/`, S3 + M1 em produção, depois a página
B3 FAQ prometia o pedido de instalação que o R3 mostrou se perder → texto honesto ("avisa; peça 'instale o Python'"); R3 mede a resposta final (r2: o aviso chega parafraseado)
W1 PowerShell sem Git → citado (docs setup.md, V-g) · W2 winget com `--source winget --accept-*` e "não tente outro instalador" · W3 rótulos da UI → M1 em produção
W4 atualização sem prova → FAQ "Como atualizo?" removido; regra "zip publicado é imutável" no CLAUDE.md · W5 conflito de nome → testado (V-f: o add troca a fonte)
W6 R4 sem prova → check-pack R4 · W7 S2 compara working tree → aceito (ADR-1) · W8 ordem de merge → G6
W9 S5 case-sensitive / S4 sem encoding e botão → endurecidos · W10 copy da landing + "faça no computador" → corrigidos
W11 texto jurídico → conferido por execução, idêntico ao original fora do bloco · W12 Mac: esperar o xcode-select → no bloco

## security-gate: PASS, 0 BLOCKER
W1 sha no mesmo JSON (confiança = quem publica na Vercel/GitHub) → aceito; 2FA/branch protection já no checklist da landing (sec W8)
W2 recusa de sha errado não provada → provada por execução (V-e)
W3 zip sobrescrito → regra de imutabilidade · W4 conferir o endereço no diálogo → no guia e no README
W5 winget → flags · W6 Bash nos 2 agentes que não calculam → já existia; fora do escopo · W7 injeção via documento → aceito (prompt de permissão)
W8 `.claude/` servido → no `.vercelignore` · W9 sem CI → aceito

## validate-gate: PASS, 0 BLOCKER
W1 h1→h4 → h2 "Instalação" + passos/FAQ em h3 · W2 botões "Copiar" iguais → aria-label
W3 clipboard sem fallback → já existia, aceito · W4 URL com scroll em 375 px → o texto inline quebra linha (o P4 pegou) · W5 `.hp` → aceito
