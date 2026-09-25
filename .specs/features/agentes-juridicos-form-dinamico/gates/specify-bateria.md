# Bateria contra o esboço — `node tests/mutate-page.js` (2026-09-25)

```
ℹ pass 15
ℹ fail 0
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
killed   tudo-de-uma-vez ← P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo (page.waitForSelector: Timeout 3000ms exceeded.) | P3 reload da obrigado não repete o evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2+P3 502: vai para ?r=erro, aviso de erro, sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 504 com HTML: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 falha de rede: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 sem resposta: timeout de 25 s vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P3 erro e depois ?r=ok na mesma aba: sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 400: pede correção, fica na landing (page.waitForSelector: Timeout 3000ms exceeded.) | P2 duplo envio: 1 requisição, botão "Enviando…" (page.waitForSelector: Timeout 3000ms exceeded.) | F-5 Continuar sem resposta: não avança e foca a pergunta | F-1 no load: só a pergunta 1, "Pergunta 1 de 10", sem Voltar | F-2 clique numa opção avança e foca a próxima | P4 375px: sem scroll horizontal (landing e obrigado) (page.waitForSelector: Timeout 3000ms exceeded.) | P7 Voltar da obrigado (bfcache): botão habilitado (page.waitForSelector: Timeout 3000ms exceeded.)
killed   progresso-fixo ← F-2 clique numa opção avança e foca a próxima | F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9
killed   voltar-na-1 ← F-1 no load: só a pergunta 1, "Pergunta 1 de 10", sem Voltar | F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9
killed   sem-auto-avanco ← P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo (page.waitForSelector: Timeout 3000ms exceeded.) | P3 reload da obrigado não repete o evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2+P3 502: vai para ?r=erro, aviso de erro, sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 504 com HTML: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 falha de rede: vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P2 sem resposta: timeout de 25 s vai para ?r=erro (page.waitForSelector: Timeout 3000ms exceeded.) | P3 erro e depois ?r=ok na mesma aba: sem evento (page.waitForSelector: Timeout 3000ms exceeded.) | P2 400: pede correção, fica na landing (page.waitForSelector: Timeout 3000ms exceeded.) | P2 duplo envio: 1 requisição, botão "Enviando…" (page.waitForSelector: Timeout 3000ms exceeded.) | F-2 clique numa opção avança e foca a próxima (page.waitForSelector: Timeout 3000ms exceeded.) | F-4 áreas: marcar não avança; Continuar avança (page.waitForSelector: Timeout 3000ms exceeded.) | F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9 (page.waitForSelector: Timeout 3000ms exceeded.) | P4 375px: sem scroll horizontal (landing e obrigado) (page.waitForSelector: Timeout 3000ms exceeded.) | P7 Voltar da obrigado (bfcache): botão habilitado (page.waitForSelector: Timeout 3000ms exceeded.)
killed   sem-foco ← F-2 clique numa opção avança e foca a próxima
killed   avanca-no-teclado ← F-3 teclado: setas trocam a opção sem sair da pergunta
killed   checkbox-avanca ← F-4 áreas: marcar não avança; Continuar avança
killed   pula-sem-resposta ← F-5 Continuar sem resposta: não avança e foca a pergunta
killed   voltar-errado ← F-6 Voltar: pergunta anterior com a resposta; do contato volta à 9 (page.waitForSelector: Timeout 3000ms exceeded.)
killed   duplo-envio ← P2 duplo envio: 1 requisição, botão "Enviando…" (page.waitForURL: net::ERR_ABORTED; maybe frame was detached?)
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
exit=0
```
