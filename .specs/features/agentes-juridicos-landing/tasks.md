# Tasks — Landing `agentes-juridicos`

Decisões pós-design (Rafael, 2026-09-24): sem rate limit agora (sec W1 aceito, revisitar se houver
spam); correções D10 nos 8 e nos 57.

| T | Task | Depende | Verificação |
|---|---|---|---|
| T1 | `lead.js`: `allSettled` (ADR-3), `utm_*` com `String().slice(0,120)`, comentário ICP "derivado de" | — | `node --test tests/` + `node tests/mutate.js` exit 0; L5 intacto |
| T2 | `vercel.json`: redirect por host + `maxDuration`; `tests/vercel-config.test.js` | — | teste passa; mutações `redirect-sem-host` e `usa-rewrite` reprovam |
| T3 | D10: SM 2026 = R$ 1.621 (`bpc-loas`, e `36-falencia-pedido` nos 57, achado no conformance r1) e idade final H 2027 (`aposentadoria-tempo-contribuicao`), nos 8 e nos 57 | — | `grep -c '1.412\|1_412'` = 0 nos dois repos; `check-pack.sh` ok |
| T4 | README do plugin = guia canônico (passos, abas Mac/Windows, teste, FAQ) | T3 | `check-pack.sh` G1–G3 ok |
| T5 | `scripts/check-test-prompt.sh` (G5) | T4 | aciona `agentes-juridicos:divorcio-consensual`; mutação `prompt-generico` reprova |
| T6 | `agentes-juridicos.html` + `tests/page.e2e.js` | T1, T4 | P2/P3/P4 e2e; mutações de `tests/mutate-page.js` reprovam (`json-sem-try` removida: equivalente); validate-gate PASS |
| T7 | `tests/guide-sync.js` (G4) | T4, T6 | passa; mutação `guia-diverge` reprova |
| T8 | `privacidade.html` (D1: a, b, c), `.specs/codebase/*` (D2 + doc-sync). Sitemap fora: a canonical é outro host | T6 | leitura no conformance |
| T9 | Release: `/code-review` do diff inteiro + fool-gate conformance → PR do site + push do plugin (com OK do Rafael) → G3 com source GitHub → checklist de lançamento | todas | gates PASS |

## Checklist de lançamento (Rafael)

1. Criar no RD os 11 campos `cf_*` como **texto**: `cf_cargo cf_porte cf_areas cf_whatsapp_quem cf_fora_horario cf_cobranca cf_sistema cf_a_receber cf_dor_principal cf_cidade cf_qualificacao`.
2. Conferir o fluxo da automação do Core (R5): não mandar WhatsApp para `webhook.source = site-agentes-juridicos`, ver o `webhookChannelId` e, se quiser os campos no card, usar `set_contact_field`.
3. DNS `agentes-juridicos.dryos.com.br` → Vercel, com o domínio adicionado no projeto do site.
4. Org `DRYOS-Studio`: 2FA obrigatório + branch protection no `agentes-juridicos` (sec W8).
5. Um lead real de teste, conferido no RD (com `cf_*`) e no Core.
