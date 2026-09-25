# Specify+Design — r1 (2026-09-25)

## fool-gate: PASS, 0 BLOCKER
W1 duplo toque marca a pergunta seguinte (cargo→porte, que entra no ICP) → trava de 400 ms + F-8/`sem-trava` (incorporado)
W2 janela de 1 s aberta por pointerdown em qualquer ponto → só em `.opt` (incorporado)
W3 Voltar só provado da 2 para a 1 → F-6 da 3 para a 2 + `voltar-pra-1` (incorporado)
W4 foco sem asserção (load, contato) → `foca-no-load`, `contato-sem-foco` (incorporado)
W5 `progresso-fixo` mapeada no F-1 e morta pelo F-2 → coluna corrigida (incorporado)
W6 Enter numa opção disparava o envio implícito → Enter = Continuar, F-9/`enter-envia` (incorporado)
W7 clicar de novo na opção já marcada não avança → aceito: "Continuar" resolve
W8 doc-sync: design da landing e cabeçalhos dos testes → atualizados (incorporado)

## validate-gate: PASS, 0 BLOCKER
W1/W2 anúncio no foco do fieldset e ordem live×foco variam por AT → aceito: `#formProgress` com aria-live cobre; sem AT no arnês
W3 alvo de toque ~39 px → padding 0.8rem (~47 px) (incorporado)
W4 sem aria-invalid no erro de opção → aceito: mesmo padrão do form antes da mudança
W5 perguntas 2–9 sem `hidden` estático (flash antes do JS) → `hidden` no HTML (incorporado)

# Release — r1

## /code-review (medium): 4 achados → corrigidos
1 bateria paralela: lentidão/crash contava como kill → baseline roda ×MUT_JOBS sob carga; kill exige exit 1 + caso listado, senão ERROR
2 tocar de novo na opção já marcada não avançava → `retap` + F-10/`sem-retoque`
3 trava barrava Espaço do teclado → só `e.detail > 0` + F-11/`trava-teclado`
4 chunk UTF-8 partido na saída → `setEncoding('utf8')`

## fool-gate conformance: PASS, 0 BLOCKER
W1 bateria completa com exit 0 → rodada r3 abaixo
W2 STRUCTURE sem a pasta → incluída · W3 lista "etapa 1/2" no design da landing → reescrita
W4 F5 mais amplo que o código → redação corrigida · W5 toque bloqueado abria a janela do teclado → `pointerdown` ignora durante a trava
W6 F-8/F-9 só provados no Chromium → aceito: sem WebKit/Firefox no arnês
