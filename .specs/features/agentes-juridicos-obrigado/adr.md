# ADRs — Página de obrigado

## ADR-1: o estado vai na URL; o evento, num token de sessionStorage

**Decisão:** o aviso vem de `?r=ok|erro` (O2). O `generate_lead` depende de um token de uso único (O4).
**Razão:** a URL sozinha deixaria qualquer visita a `?r=ok` (link compartilhado, reload, favorito)
contar como conversão. O token só nasce com `ok:true` e morre na primeira leitura.
**Custo aceito:** sem `sessionStorage` (bloqueado ou lançando exceção), o evento se perde. O lead
não se perde, porque já foi gravado pelo `/api/lead`.
**Alternativa descartada:** disparar na landing com `eventCallback` do GTM antes de navegar. A
navegação teria de esperar o callback ou um timeout em todo envio.

## ADR-2: URL plana `/agentes-juridicos-obrigado`

**Decisão:** do Rafael, 2026-09-25. Evita a pasta `agentes-juridicos/` ao lado do
`agentes-juridicos.html` com `cleanUrls`, cujo comportamento na Vercel não foi verificado.

## ADR-3: o guia fica aberto por URL

**Decisão:** o acesso direto mostra o guia (O3). O filtro já era *soft* (D2 do spec da landing):
o repo do plugin é público. A defesa contra a indexação é o `noindex`.
