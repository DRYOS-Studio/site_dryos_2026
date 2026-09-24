# ADRs — Landing `agentes-juridicos` (2026-09-24)

## ADR-1: página estática no `site_dryos_2026`, servida por host

**Decisão:** `agentes-juridicos.html` no repo do site; o subdomínio aponta para o mesmo projeto
Vercel, com **redirect** de `/` condicionado ao host para `/agentes-juridicos`. Rewrite não serve:
o filesystem tem precedência sobre rewrites (doc `vercel-json`: "precedence is given to the
filesystem prior to rewrites being applied"), e `/` casa com `index.html`.
**Razão:** o `api/lead.js` já integra RD e Core, com honeypot e allowlist, e o `RD_TOKEN` já está no
projeto. Um projeto Next.js separado duplicaria a integração e o segredo.
**Custo aceito:** a URL mostra `/agentes-juridicos`; o deploy fica acoplado ao site principal; o resto
do site também responde no subdomínio (baixo impacto; a landing declara `canonical`).
**Alternativa descartada:** Next.js separado.

## ADR-2: qualificação calculada no servidor

**Decisão:** `qualify()` no `api/lead.js` valida os enums e calcula `qualificacao` (L3). O browser só
manda respostas.
**Razão:** a SDR decide para quem liga por esse campo, e um valor vindo do cliente pode ser forjado.
**Consequência:** a regra (D7) vive em um lugar só. Mudar o ICP = mudar `ICP_*` + os casos do L3.

## ADR-3: Core e RD em paralelo

**Decisão:** `Promise.allSettled` nos dois destinos, para todas as origens, com `maxDuration: 30`.
**Razão:** em sequência, o pior caso é 10 + 8 + 8 s. Em paralelo, é o máximo entre 10 s e 16 s. O L5
prova que o corpo enviado a cada destino não muda; só a ordem das chamadas muda.
**Risco:** nenhum destino depende do outro (`lead.js`: "RD is an independent destination"); `allSettled` não depende de os ramos nunca lançarem.

## ADR-4: plugin em marketplace público, com guia pelo terminal

**Decisão:** `DRYOS-Studio/agentes-juridicos`, com marketplace `dryos` e plugin `agentes-juridicos`.
O guia usa `/plugin marketplace add` + `/plugin install` no terminal.
**Razão:** o caminho pelo terminal é o único provado (G3). A doc do app desktop não mostra como
adicionar um marketplace próprio pela interface (R2).
**Custo aceito:** o formulário é filtro *soft* (D2), e o terminal assusta parte do público.
**Revisitar quando:** alguém confirmar no app desktop o caminho pela tela. Aí o guia ganha uma aba
"sem terminal".
