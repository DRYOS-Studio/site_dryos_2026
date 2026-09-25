# Design — Página de obrigado

```
agentes-juridicos.html ── submit ── POST /api/lead
   ├─ 400 → fica, mostra erro (sem mudança)
   ├─ ok:true → sessionStorage aj_lead=1 → location.assign(/agentes-juridicos-obrigado?r=ok)
   └─ 5xx | não-JSON | rede | 25 s → location.assign(/agentes-juridicos-obrigado?r=erro)
   pageshow → reseta o botão (sempre; ver fool-gate design W2)

agentes-juridicos-obrigado.html (noindex)
   ├─ r → aviso ok | erro | nenhum
   ├─ r=ok && aj_lead → removeItem + dataLayer generate_lead
   └─ guia: abas Mac/Windows, comandos data-cmd, prompt de teste, FAQ, bloco "rotina"
```

## Arquivos

| Arquivo | Mudança |
|---|---|
| `agentes-juridicos.html` | sai o `#guia`, o CSS dele, o JS de abas e copiar; `showGuide` vira `done(ok)` com navegação; entra o reset do botão no `pageshow` |
| `agentes-juridicos-obrigado.html` | novo. `<head>`, tokens e CSS de nav, seções, guia, rotina e footer copiados da landing (padrão "page-local design system" do `.specs/codebase/ARCHITECTURE.md`); `h1` no lugar do `h2` do guia; `#guideReq` (R3 + EAOAB 32) antes do passo 1; nav só com o logo |
| `tests/page.e2e.js` · `tests/mutate-page.js` · `tests/guide-sync.js` | servem e mutam as duas páginas; G4 aponta para a obrigado |

## AC → onde mora a prova

| AC | Prova |
|---|---|
| P2, P3, P5, P4′ | `tests/page.e2e.js`, casos com o id no nome; mutações em `tests/mutate-page.js` |
| P7 | `tests/page.e2e.js` → `p7()`, browser próprio (Chrome for Testing, sem `--disable-back-forward-cache`, sem rede externa) e falha se `pageshow.persisted` não for `true` |
| P6 | curl, execução no release |
| G4′ | `tests/guide-sync.js` contra a obrigado e contra uma cópia mutada |

Racional: `adr.md`.
