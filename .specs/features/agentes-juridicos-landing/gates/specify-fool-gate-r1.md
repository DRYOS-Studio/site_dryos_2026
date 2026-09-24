# Specify — fool-gate r1 (2026-09-24): PASS, 0 BLOCKER, 14 WARN

W1 D6 sem AC: mesmo CORE_WEBHOOK_TOKEN/automação das outras origens — se a automação inicia WhatsApp, contradiz D6.
W2 mutante sobrevive: regra qualificado sem checar whatsapp_quem.
W3 L4 só olha Core: cf_* cru e precedência {...q,...payload} sobrevivem; RD omite chave vs spec "null".
W4 formato de `areas` no fio não fixado (FormData manda string/último).
W5 retry só em 400; 422/silêncio não verificado; retry apaga todos cf_*.
W6 pior caso 26 s sequencial; maxDuration não verificado.
W7 guia atrás de ok:true num repo público — 502 custa o lead.
W8 regra diverge do ICP: 30_mais, 2_5 < 3 pessoas, cidade, áreas.
W9 nenhum AC para o passo "teste"; 6/8 agentes chamam Python via Bash (Windows).
W10 G3 rodou com source local; comando do guia (GitHub) e forma slash não provados.
W11 conteúdo jurídico sem revisão (bpc-loas "SM 2026 = R$ 1.412").
W12 privacidade: subdomínio, novos dados, finalidade (plugin + ligação SDR).
W13 idempotencyKey phone:email sem source — dedup do Core desconhecido.
W14 site inteiro acessível no subdomínio (SEO duplicado).
