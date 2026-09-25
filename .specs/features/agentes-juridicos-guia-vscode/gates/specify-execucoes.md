# Esboço — execuções e baterias (2026-09-25)

## V-c / V-d (execução)
Sem git: `marketplace add DRYOS-Studio/agentes-juridicos` → `Failed to clone marketplace repository`. URL + archive (preview exp) → `Successfully installed plugin`, `Agents (8)`.

## S1/S2 — `node tests/mutate-dist.js`
```
killed   sha-errado ← S1
killed   url-fora ← S1 | S2
killed   fonte-git ← S1 | S2
killed   zip-velho ← S2
killed   zip-fundo ← S2
```

## R2 — mutações sobre `scripts/check-python-block.sh` (repo do plugin)
```
killed   bloco-diverge ← R2 FAIL: bpc-loas sem o bloco (ou divergente)
killed   bloco-falta ← R2 FAIL: bpc-loas sem o bloco (ou divergente)
killed   volta-escape ← R2 FAIL: bpc-loas tem \$ (resto de citação do shell)
killed   codigo-quebrado ← R2 FAIL: bpc-loas código não roda: ['SyntaxError: invalid syntax']
killed   python-c ← R2 FAIL: bpc-loas ainda usa python3 -c
```

## R3 — `claude -p` com PATH sem python3/python/py/xcode-select/git
O subagente `agentes-juridicos:bpc-loas` gravou `calculo.py`, tentou `python3` (127), `python`/`py -3` (127), não instalou, fez a conta no texto e escreveu "não foi conferida por código… autorize a instalação do Python (Mac: `xcode-select --install`)". O Claude principal, ao resumir, **omitiu o pedido de instalação**.

## R3 r2 (bloco novo) — resposta final do Claude principal
Subagente: python3/python → 127; handback começa com "**Conta feita no texto, sem conferência por código.**". Resposta final ao usuário: "Nota: cálculo foi feito de cabeça pelo agente — python não estava disponível no ambiente pra conferir aritmética". O aviso chegou, parafraseado; a dica "peça: instale o Python" não chegou. FAQ reescrito para não citar a frase literal.
