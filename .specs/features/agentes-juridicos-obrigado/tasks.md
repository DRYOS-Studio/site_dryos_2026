# Tasks — Página de obrigado

| T | Task | Verificação |
|---|---|---|
| T1 | `agentes-juridicos-obrigado.html` + landing navega (`done`) + `pageshow` | e2e verde; `tests/mutate-page.js` exit 0 |
| T2 | testes: e2e das duas páginas, bateria fail-closed, `guide-sync` → obrigado, `vercel-config` | `node --test tests/` + bateria exit 0 |
| T3 | doc-sync: spec/design da landing, `.specs/codebase/{TESTING,STRUCTURE}.md` | conformance |
| T4 | release: `/code-review` do diff + fool-gate conformance → PR → P6 no preview/produção | gates PASS; curl 200 nas duas URLs |

## Checklist de lançamento (Rafael)

1. **GTM Preview com o fluxo real** (preencher → obrigado), não com acesso direto. O `generate_lead` agora sai na `/agentes-juridicos-obrigado`, empurrado antes do gtm.js carregar. O trigger não pode ter filtro de Page Path `/agentes-juridicos` nem depender de DOM Ready/Window Loaded.
2. **Não criar conversão por page_view da `/agentes-juridicos-obrigado`**: reload, link compartilhado e favorito contariam como lead. A conversão é o evento `generate_lead` (ADR-1).
