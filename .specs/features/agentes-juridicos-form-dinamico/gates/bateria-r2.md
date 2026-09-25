# Bateria r2 (pós gates r1), paralela — 2026-09-25

`sem-foco` perdeu a âncora na r2 (showQ mudou). Âncora corrigida e rodada à parte: `✖ F-2 clique numa opção avança e foca a próxima` → killed.

```
Fri Sep 25 12:59:50 -03 2026
killed   guia-na-landing ← P2 landing sem guia
killed   erro-fica ← P2+P3 502: vai para ?r=erro, aviso de erro, sem evento (page.waitForURL: Timeout 3000ms exceeded.) | P2 504 com HTML: vai para ?r=erro (page.waitForURL: Timeout 3000ms exceeded.) | P3 erro e depois ?r=ok na mesma aba: sem evento (page.waitForURL: Timeout 3000ms exceeded.) | P7 Voltar da obrigado (bfcache): botão habilitado (page.waitForURL: Timeout 3000ms exceeded.)
killed   rede-fica ← P2 falha de rede: vai para ?r=erro (page.waitForURL: Timeout 3000ms exceeded.) | P2 sem resposta: timeout de 25 s vai para ?r=erro (page.waitForURL: Timeout 3000ms exceeded.)
killed   erro-como-ok ← P2+P3 502: vai para ?r=erro, aviso de erro, sem evento | P2 504 com HTML: vai para ?r=erro | P2 falha de rede: vai para ?r=erro | P2 sem resposta: timeout de 25 s vai para ?r=erro | P3 erro e depois ?r=ok na mesma aba: sem evento | P7 Voltar da obrigado (bfcache): botão habilitado
killed   sem-timeout ← P2 sem resposta: timeout de 25 s vai para ?r=erro (page.waitForURL: Timeout 3000ms exceeded.)
killed   400-vira-erro ← P2 400: pede correção, fica na landing (page.waitForFunction: TypeError: Cannot read properties of null (reading 'textContent'))
killed   400-botao-preso ← P2 400: pede correção, fica na landing
killed   token-cedo ← P2 400: pede correção, fica na landing
killed   erro-nao-limpa ← P3 erro e depois ?r=ok na mesma aba: sem evento
killed   sem-pageshow ← P7 Voltar da obrigado (bfcache): botão habilitado
killed   tudo-de-uma-vez ← P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo (page.waitForSelector: Timeout 3000ms exceeded.) | P3 reload da obrigado não repete o evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2+P3 502: vai para ?r=erro, aviso de erro, sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 504 com HTML: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 falha de rede: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 sem resposta: timeout de 25 s vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P3 erro e depois ?r=ok na mesma aba: sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 400: pede correção, fica na landing (page.waitForSelector: Timeout 3000ms exceeded.) | P2 duplo envio: 1 requisição, botão "Enviando…" (page.waitForSelector: Timeout 3000ms exceeded.) | F-5 Continuar sem resposta: não avança e foca a pergunta | F-1 no load: só a pergunta 1, "Pergunta 1 de 10", sem Voltar | F-2 clique numa opção avança e foca a próxima | F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9 (page.click: Timeout 30000ms exceeded.) | F-8 duplo toque: o 2º toque não marca a pergunta seguinte | P4 375px: sem scroll horizontal (landing e obrigado) (page.waitForSelector: Timeout 3000ms exceeded.) | P7 Voltar da obrigado (bfcache): botão habilitado (page.waitForSelector: Timeout 3000ms exceeded.)
killed   progresso-fixo ← F-2 clique numa opção avança e foca a próxima | F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9
killed   voltar-na-1 ← F-1 no load: só a pergunta 1, "Pergunta 1 de 10", sem Voltar | F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9
killed   sem-auto-avanco ← P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo (page.waitForSelector: Timeout 3000ms exceeded.) | P3 reload da obrigado não repete o evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2+P3 502: vai para ?r=erro, aviso de erro, sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 504 com HTML: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 falha de rede: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 sem resposta: timeout de 25 s vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P3 erro e depois ?r=ok na mesma aba: sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 400: pede correção, fica na landing (page.waitForSelector: Timeout 3000ms exceeded.) | P2 duplo envio: 1 requisição, botão "Enviando…" (page.waitForSelector: Timeout 3000ms exceeded.) | F-2 clique numa opção avança e foca a próxima (page.waitForSelector: Timeout 3000ms exceeded.) | F-4 áreas: marcar não avança; Continuar avança (page.waitForSelector: Timeout 3000ms exceeded.) | F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9 (page.waitForSelector: Timeout 3000ms exceeded.) | F-8 duplo toque: o 2º toque não marca a pergunta seguinte (page.waitForSelector: Timeout 3000ms exceeded.) | P4 375px: sem scroll horizontal (landing e obrigado) (page.waitForSelector: Timeout 3000ms exceeded.) | P7 Voltar da obrigado (bfcache): botão habilitado (page.waitForSelector: Timeout 3000ms exceeded.)
ANCHOR-MISSING sem-foco
killed   avanca-no-teclado ← F-3 teclado: setas trocam a opção sem sair da pergunta
killed   checkbox-avanca ← F-4 áreas: marcar não avança; Continuar avança
killed   pula-sem-resposta ← F-5 Continuar sem resposta: não avança e foca a pergunta
killed   voltar-errado ← F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9 (page.waitForSelector: Timeout 3000ms exceeded.)
killed   voltar-pra-1 ← F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9 (page.waitForSelector: Timeout 3000ms exceeded.)
killed   foca-no-load ← F-1 no load: só a pergunta 1, "Pergunta 1 de 10", sem Voltar | F-3 teclado: setas trocam a opção sem sair da pergunta (page.evaluate: TypeError: Cannot read properties of null (reading 'value')) | F-9 Enter numa opção marcada vale como Continuar (page.waitForSelector: Timeout 3000ms exceeded.)
killed   contato-sem-foco ← F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9
killed   sem-trava ← F-8 duplo toque: o 2º toque não marca a pergunta seguinte
killed   enter-envia ← F-9 Enter numa opção marcada vale como Continuar (page.waitForSelector: Timeout 3000ms exceeded.)
killed   duplo-envio ← P2 duplo envio: 1 requisição, botão "Enviando…"
killed   sem-enviando ← P2 duplo envio: 1 requisição, botão "Enviando…"
killed   areas-string ← P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo
killed   sem-foco-pergunta ← F-5 Continuar sem resposta: não avança e foca a pergunta
killed   honeypot-company ← fool-W8 honeypot fora do autofill (nome/autocomplete)
killed   evento-no-erro ← P2+P3 502: vai para ?r=erro, aviso de erro, sem evento
killed   evento-sem-token ← P3 reload da obrigado não repete o evento | P3+P5 acesso direto com ?r=ok: sem evento | P3 erro e depois ?r=ok na mesma aba: sem evento | P2 400: pede correção, fica na landing
killed   evento-no-reload ← P3 reload da obrigado não repete o evento
killed   indexavel ← P5 obrigado: noindex; sem r, guia sem aviso; requisito (R3) (page.getAttribute: Timeout 30000ms exceeded.)
killed   sem-requisito ← P5 obrigado: noindex; sem r, guia sem aviso; requisito (R3)
killed   aviso-sem-status ← P5 obrigado: noindex; sem r, guia sem aviso; requisito (R3)
killed   guia-diverge ← guide-sync
exit=1
Fri Sep 25 13:14:25 -03 2026
```
