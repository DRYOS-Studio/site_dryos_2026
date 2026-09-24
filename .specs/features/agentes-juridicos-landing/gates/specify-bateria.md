# Bateria de falsificação — pré-gate Specify (2026-09-24)

## L (api/lead.js) — `node tests/mutate.js`
```
killed   L1 sem-allowlist  ← L1: conversion_identifier agents_escritorio_adv | L6: RD 400 with cf_* → one retry without cf_*
killed   L2 sem-campo  ← L2: the 10 fields reach Core and RD | L4: out-of-enum → null, areas filtered, text capped at 80
killed   L3 confia-cliente  ← L3: qualificação computed server-side
killed   L3 sem-solo  ← L3: qualificação computed server-side
killed   L4 passa-cru  ← L4: out-of-enum → null, areas filtered, text capped at 80
killed   L4 areas-cru  ← L4: out-of-enum → null, areas filtered, text capped at 80
killed   L4 sem-limite  ← L4: out-of-enum → null, areas filtered, text capped at 80
killed   L5 cf-para-todos  ← L5: legacy sources send exactly the pre-change bodies | L6: legacy RD 400 is not retried
killed   L6 sem-retry  ← L6: RD 400 with cf_* → one retry without cf_*
```

## G (plugin) — `scripts/check-pack.sh` no repo agentes-juridicos
```
G1 ok: validate --strict
G2 ok: 8 agentes
G3 ok: agentes-juridicos@dryos instalado, 8 agentes
mutações: G1 manifesto-quebrado → morre em validate --strict · G2 vaza-57 → "G2 FAIL: 01-peticao-inicial-civel" · G2 name-diverge → "G2 FAIL: 50-bpc-loas.md tem name=bpc-loas" · G3 nome-errado → install "Plugin agentes-juridicos not found in marketplace dryos-studio" · G3 sem-comandos → "G3 FAIL: README sem comandos"
```

## P (página) — NÃO rodada: página ainda não existe. Mutações nomeadas no spec (rewrite-sem-host, mostra-antes, evento-no-erro) rodam no Implement.
## G4 — NÃO rodada: depende da página.
