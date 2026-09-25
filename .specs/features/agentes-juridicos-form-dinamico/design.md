# Design — Formulário dinâmico

Só a landing muda: `agentes-juridicos.html`. O markup mantém os 9 `fieldset` do `#step1` e o `#step2` (contato). O JS mostra uma tela por vez (`showQ`), e o `next()` valida a tela atual.

| Peça | Onde |
|---|---|
| telas e progresso | `showQ(i)`: `hidden` nos fieldsets, texto do `#formProgress`, `#prevQ` escondido na 1 |
| avanço automático (F2/F3) | `change` de radio dentro de 1 s de um `pointerdown` numa `.opt` → `next()` depois de 250 ms, se ainda estiver na mesma tela |
| Continuar/validação (F-5) | `#toStep2` → `next()`: sem `input:checked`, mostra o aviso e foca o 1º input |
| Voltar (F4) | `#prevQ` → `showQ(cur-1)`; `#backStep1` → `showQ(8)` |
| trava anti-duplo-toque (F5/F-8) | `showQ(i, true)` define `lockUntil = agora + 400 ms` e `#step1[data-lock]`; um `click` capturado em `.opt` durante a trava sofre `preventDefault` |
| Enter (F6/F-9) | `submit` com `#step1` visível → `next()` |
| foco (F-2) | os fieldsets ganham `tabIndex = -1` e recebem o foco na troca (o leitor de tela anuncia a `legend`) |

AC → prova: F-1 a F-7 em `tests/page.e2e.js` (casos com o id no nome), mutações em `tests/mutate-page.js`. O `fill()` do e2e percorre as telas clicando, então todos os casos P2/P3 também exercitam o fluxo.
