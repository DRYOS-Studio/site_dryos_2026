# Bateria r4 (pós design r2 + validate) — 2026-09-25

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
killed   token-cedo ← P3 erro e depois ?r=ok na mesma aba: sem evento
killed   sem-pageshow ← P7 Voltar da obrigado (bfcache): botão habilitado
killed   duplo-envio ← P2 duplo envio: 1 requisição, botão "Enviando…" (page.waitForURL: net::ERR_ABORTED; maybe frame was detached?)
killed   sem-enviando ← P2 duplo envio: 1 requisição, botão "Enviando…"
killed   areas-string ← P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo
killed   sem-foco-pergunta ← P4 etapa 1 incompleta: não avança e foca a pergunta
killed   honeypot-company ← fool-W8 honeypot fora do autofill (nome/autocomplete)
killed   evento-no-erro ← P2+P3 502: vai para ?r=erro, aviso de erro, sem evento
killed   evento-sem-token ← P3 reload da obrigado não repete o evento | P3+P5 acesso direto com ?r=ok: sem evento | P3 erro e depois ?r=ok na mesma aba: sem evento
killed   evento-no-reload ← P3 reload da obrigado não repete o evento
killed   indexavel ← P5 obrigado: noindex; sem r, guia sem aviso; requisito (R3) (page.getAttribute: Timeout 30000ms exceeded.)
killed   sem-requisito ← P5 obrigado: noindex; sem r, guia sem aviso; requisito (R3)
killed   aviso-sem-status ← P5 obrigado: noindex; sem r, guia sem aviso; requisito (R3)
killed   guia-diverge ← guide-sync
exit=0
```
