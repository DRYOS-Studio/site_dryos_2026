# Bateria de falsificação contra o esboço — `node tests/mutate-page.js` (2026-09-25)

```
killed   guia-na-landing ← P2 landing sem guia
killed   erro-fica ← P2+P3 502: vai para ?r=erro, aviso de erro, sem evento (page.waitForURL: Timeout 3000ms exceeded.) | P2 504 com HTML: vai para ?r=erro (page.waitForURL: Timeout 3000ms exceeded.)
killed   rede-fica ← P2 falha de rede: vai para ?r=erro (page.waitForURL: Timeout 3000ms exceeded.)
killed   erro-como-ok ← P2+P3 502: vai para ?r=erro, aviso de erro, sem evento | P2 504 com HTML: vai para ?r=erro | P2 falha de rede: vai para ?r=erro
killed   duplo-envio ← P2 duplo envio: 1 requisição, botão "Enviando…"
killed   sem-enviando ← P2 duplo envio: 1 requisição, botão "Enviando…"
killed   areas-string ← P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo
killed   sem-foco-pergunta ← P4 etapa 1 incompleta: não avança e foca a pergunta
killed   honeypot-company ← fool-W8 honeypot fora do autofill (nome/autocomplete)
killed   evento-no-erro ← P2+P3 502: vai para ?r=erro, aviso de erro, sem evento
killed   evento-sem-token ← P3 reload da obrigado não repete o evento | P3+P5 acesso direto com ?r=ok: sem evento
killed   evento-no-reload ← P3 reload da obrigado não repete o evento
killed   indexavel ← P5 obrigado: noindex; sem r, guia sem aviso (page.getAttribute: Timeout 30000ms exceeded.)
killed   aviso-sem-status ← P5 obrigado: noindex; sem r, guia sem aviso
exit=0
```
