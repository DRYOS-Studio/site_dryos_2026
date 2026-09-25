# Design — Landing `agentes-juridicos`

Spec: `spec.md`. Decisões e razões: `adr.md`. Aqui ficam só a forma e onde mora a prova de cada AC.

## Peças

```
dryos.com.br/agentes-juridicos  (agentes-juridicos.html, cleanUrls)
        │  submit JSON (areas = array)
        ▼
  /api/lead (api/lead.js)  ── source = site-agentes-juridicos
        ├─ qualify(body) → 10 campos + qualificacao          (servidor; o browser não decide)
        ├─ Core  POST /webhooks/automation/{token}  ┐  allSettled (ADR-3)
        └─ RD    POST /platform/conversions  (+cf_*) ┘  400 → 1 retry sem cf_*
        ▼
  navega para /agentes-juridicos-obrigado?r=ok|erro, que mostra o guia (no erro, com link de WhatsApp)
  (2026-09-25, ver ../agentes-juridicos-obrigado/spec.md)

github.com/DRYOS-Studio/agentes-juridicos (público)
  .claude-plugin/marketplace.json   name = dryos
  plugins/agentes-juridicos/        .claude-plugin/plugin.json + agents/*.md (8)
  README.md                         o guia, que é a 2ª cópia dos comandos (G4)
  scripts/check-pack.sh             G1–G3
```

## Arquivos

| Repo | Arquivo | Mudança |
|---|---|---|
| site | `agentes-juridicos.html` | novo. CSS da própria página, tokens copiados de `automacoes.html` (`:root`), seguindo o padrão "page-local design system" do `.specs/codebase/ARCHITECTURE.md` |
| site | `api/lead.js` | allowlist, `qualify`, cf_* + retry, `idempotencyKey` por origem, Core ∥ RD |
| site | `vercel.json` | `functions.api/lead.js.maxDuration: 30` |
| site | `privacidade.html` | os 3 pontos do D1 |
| site | `sitemap.xml` | a URL nova |
| site | `.specs/codebase/INTEGRATIONS.md` | o RD via `api/lead.js` (D2) |
| site | `.vercelignore` | `tests/` e `.specs/` (a regra de qualificação ensinaria a forjar lead) |
| site | `tests/` | `harness.js`, `legacy-*` (snapshot), `lead.test.js`, `mutate.js`, `vercel-config.test.js`, `page.e2e.js`, `mutate-page.js`, `guide-sync.js` |
| plugin | tudo | repo novo |

## Página: seções

1. Hero: 8 agentes jurídicos para o Claude, grátis, com o escritório testando hoje. Nota logo abaixo: requer plano pago do Claude (R3).
2. Os 8 agentes, 2 por área, com o que cada um entrega.
3. Formulário em 2 etapas, no mesmo `<form>`:
   - etapa 1, "Sobre o escritório": 9 perguntas em `fieldset`/`legend`, com rádio (checkbox em áreas);
   - etapa 2, "Para onde mandamos": nome, e-mail, WhatsApp e cidade.

   Honeypot enviado como `company`, mas o input tem id/name que o autofill não reconhece (`hp_ref`, `autocomplete="off"`). Aviso e link `/privacidade`. Submit: botão desabilitado + "Enviando…"; `fetch` com timeout de 25 s; resposta não-JSON = erro → guia + WhatsApp (D8).
4. Guia (desde 2026-09-25 em `agentes-juridicos-obrigado.html`, ver ../agentes-juridicos-obrigado/spec.md), com abas Mac/Windows e os passos: requisitos (plano pago) · ferramentas (Mac: `xcode-select --install`; Windows: Git for Windows + Python da Microsoft Store) · Claude Code · login · marketplace · install · teste com caso fictício. FAQ: python3 não encontrado · sigilo (anonimizar; os dados vão ao provedor do modelo) · rodar numa pasta dedicada e só aprovar comandos `python3` · revisão pelo advogado (EAOAB 32).
5. CTA secundário: a rotina do escritório (diagnóstico), para não abandonar o "agente é plus".

Os comandos ficam em `<code data-cmd>`. O G4 compara esse conjunto com o do README.

## Mapa AC → prova

| AC | Onde mora a prova | Forma |
|---|---|---|
| L1–L7 | `tests/lead.test.js` + `tests/mutate.js` | `node --test tests/*.test.js` · `node tests/mutate.js` (exit 0 = todas as mutações morreram) |
| P1 | `tests/vercel-config.test.js` (a página existe; nada mexe em `/`) + curl no preview | teste + curl |
| P2, P3 (e P5, P7 de ../agentes-juridicos-obrigado) | `tests/page.e2e.js` (Playwright, servidor estático local, `/api/lead` interceptado: ok, 502, 504 HTML, rede, timeout, 400, duplo envio; P7 em Chrome for Testing com bfcache) | e2e + `tests/mutate-page.js` |
| P4 | `validate-gate` + passo de teclado no e2e | auditoria |
| G1–G3 | `scripts/check-pack.sh` (plugin) | execução; G3 roda de novo com `DRYOS-Studio/agentes-juridicos` depois do push |
| G4 | `tests/guide-sync.js` (lê o README por caminho local ou pela raw URL do GitHub) | script + mutação `guia-diverge` |
| G5 | `scripts/check-test-prompt.sh` (plugin): `claude -p --plugin-dir … --output-format stream-json` + grep do tool_use | execução |
| D1, D2 | diff do release | leitura no fool-gate conformance |

## Modos de falha

| Falha | Efeito | Tratamento |
|---|---|---|
| Core fora | RD registra | 200 se o RD ok (comportamento atual) |
| RD recusa `cf_*` com 400 | conversão salva sem os campos | retry (L6) + `console.error` |
| RD recusa com 422, ou ignora em silêncio | campos ou conversão perdidos | R1: um lead real de teste antes do lançamento |
| Core e RD fora | lead perdido | D8: guia aparece mesmo assim, com WhatsApp |
| Os dois lentos | espera ≤ ~16 s (máximo entre 10 s e 8+8 s) | ADR-3 |
| Automação do Core manda WhatsApp, ou tem `webhookChannelId` (cria conversa) | contradiz D6 | R5: checklist de lançamento; ramo com condição em `webhook.source` (`conditions-evaluator.ts:162-168`) |
