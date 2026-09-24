# Design — gates r1 (2026-09-24): design-gate PASS · fool-gate PASS · security-gate PASS (0 BLOCKER)

## fool-gate
W1 rewrite de `/` nunca dispara (filesystem antes de rewrites) — CONFIRMADO na doc vercel-json l.1104 → incorporado: redirect por host (ADR-1).
W2 maxDuration/504 HTML sem JSON → incorporado: maxDuration 30 + front trata resposta não-JSON e timeout (P2).
W3 git ausente no guia → incorporado: Mac `xcode-select --install`; Windows Git for Windows.
W4 condição do Core é `webhook.source`, e webhookChannelId cria conversa → incorporado no checklist de lançamento (R5).
W5 citação L7 errada (7 dias vêm de automations.constants.ts:122) → corrigido.
W6 `.specs/` servido → incorporado em .vercelignore.
W7 Promise.all depende de ramos que não lançam → incorporado: allSettled.
W8 honeypot `company` + autofill → incorporado: input com nome não reconhecível pelo autofill.
## security-gate
W1 sem rate limit → ESCALADO ao Rafael.  W2 utm_* crus → incorporado (String+slice 120, todas as origens; L5 intacto).
W3 = fool W2/ADR-3.  W4 CSRF text/plain → aceito (curl faz o mesmo).  W5 tokens em URL → aceito (API do RD).
W6 = fool W6.  W7 Bash nos agentes + prompt injection → incorporado no FAQ (pasta dedicada, só aprovar python3); tirar Edit fica para depois.
W8 supply chain do repo público → checklist: 2FA na org + branch protection.  W9 sigilo → FAQ: anonimizar, dados vão ao provedor do modelo.
## design-gate
W1 ICP duplicado no doc comercial → aceito: o código é a fonte executável; comentário passa a dizer "derivado de".
W2 lead.js acumula lógica por landing → aceito (1 origem; extrair quando houver a 2ª).
W3 loading no submit → incorporado (padrão automacoes.html).  W4 responsivo sem prova → incorporado em P4 (375px sem scroll horizontal).
W5 CSS colado numa 4ª página → aceito (convenção do site).
