# Spec — Página de obrigado `/agentes-juridicos-obrigado`

**Objetivo:** depois do envio, o lead vai para outra página (pedido do Rafael, 2026-09-25), em vez
de o guia aparecer na mesma. Substitui os AC P2 e P3 de `../agentes-juridicos-landing/spec.md`;
o resto daquele spec segue valendo.

## Decisões (TLC, 2-way door)

| # | Decisão |
|---|---|
| O1 | O guia (passos, teste, FAQ) sai da landing e mora só em `agentes-juridicos-obrigado.html`, na URL plana `/agentes-juridicos-obrigado` (Rafael, 2026-09-25). |
| O2 | O aviso vem da URL: `?r=ok` mostra "recebemos", `?r=erro` mostra o aviso do D8 com WhatsApp. Sem `r` válido, o guia aparece sem aviso. |
| O3 | Acesso direto à página de obrigado mostra o guia. O filtro já era *soft* (D2: repo público). A página leva `noindex` e não entra no sitemap. |
| O4 | O `generate_lead` dispara na página de obrigado, e só uma vez por envio: a landing grava um token em `sessionStorage` só com `ok:true`, antes de navegar; a página de obrigado dispara se `r=ok` e o token existe, e apaga o token. Sem `sessionStorage`, o evento se perde (o lead não). |

## Critérios de aceite

`P` = página. Mutações ficam em `tests/mutate-page.js`, que antes roda o e2e no original e aborta se ele não passar.

| AC | Critério | Prova | Mutação que reprova |
|---|---|---|---|
| P2 | A landing não tem o guia. Com `ok:true`, navega para `/agentes-juridicos-obrigado?r=ok`. Em erro (5xx, resposta não-JSON, rede, timeout de 25 s), navega para `?r=erro`. Um 400 fica na landing com o erro e o botão reativado. Durante o envio, o botão fica desabilitado com "Enviando…" e sai 1 requisição só. | Playwright, rota mockada ok, 502, HTML 504, abort, 400, sem resposta (`page.clock`) | `guia-na-landing` · `erro-fica` · `rede-fica` · `erro-como-ok` · `sem-timeout` · `400-vira-erro` · `400-botao-preso` · `duplo-envio` · `sem-enviando` |
| P3 | `generate_lead` com `form_id: 'agentes-juridicos'` dispara 1 vez na obrigado depois de um envio ok. Não dispara em `?r=erro`, em acesso direto com `?r=ok` sem envio, depois de um envio com erro na mesma aba (mesmo com token órfão de um ok anterior), nem no reload. | Playwright | `evento-no-erro` · `evento-sem-token` · `evento-no-reload` · `token-cedo` · `erro-nao-limpa` |
| P5 | A obrigado tem `<meta name="robots" content="noindex">` e, antes do passo 1, o requisito de plano pago (R3 da landing) e o aviso de revisão pelo advogado (EAOAB 32), porque ela é aberta por link direto (O3). `?r=ok` mostra só o aviso ok; `?r=erro` só o de erro com link `wa.me`; sem `r`, nenhum aviso e o guia inteiro. | Playwright | `indexavel` · `aviso-sem-status` · `sem-requisito` |
| P7 | Voltar da obrigado para a landing (bfcache ou restauração de form) deixa o botão habilitado com "Receber os agentes". | Playwright (`goBack`), só o ramo bfcache. O ramo de restauração de form (Firefox, `|| !sending`) é leitura: não há Firefox no arnês | `sem-pageshow` |
| P6 | `GET /agentes-juridicos` e `GET /agentes-juridicos-obrigado` respondem 200 no preview da Vercel, cada um com o seu conteúdo. | curl no preview (com bypass da Deployment Protection) ou em produção | — (execução) |
| P4′ | O P4 vale para a obrigado: abas por teclado e 375 px sem scroll horizontal. | Playwright + validate-gate | — (auditoria) |
| G4′ | O `tests/guide-sync.js` compara o README com a obrigado. | script; a mutação roda no fim do `tests/mutate-page.js` | `guia-diverge` |
