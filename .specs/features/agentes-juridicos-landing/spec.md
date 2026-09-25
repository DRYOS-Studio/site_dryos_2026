# Spec — Landing `dryos.com.br/agentes-juridicos`

**Objetivo:** trocar a abordagem fria da SDR por lead que chega sozinho. O advogado responde um
formulário sobre a rotina do escritório e, em troca, recebe um plugin do Claude Code com 8 agentes
jurídicos e um passo a passo de instalação e teste. O lead vai para o RD Station (conversão
`agents_escritorio_adv`) e para o Core, já com qualificação calculada.

## Decisões do Rafael (2026-09-24)

| # | Decisão |
|---|---|
| D1 | Pacote = amostra ICP: 8 agentes, 2 por área (trabalhista, previdenciário, família, consumidor). Os outros 49 não saem. |
| D2 | Distribuição: plugin em repo **público** `DRYOS-Studio/agentes-juridicos`. O formulário é filtro *soft*: quem tiver o link instala sem preencher. Aceito. |
| D3 | Destino: RD Station (evento `agents_escritorio_adv`) **e** Core, com as respostas de qualificação nos dois. |
| D4 | URL `dryos.com.br/agentes-juridicos`, dentro do site. O subdomínio foi descartado pelo Rafael em 2026-09-24, depois do PR #18. |
| D5 | A página mora no `site_dryos_2026` e reusa o `api/lead.js`. |
| D6 | O lead **não** dispara a Marina automaticamente. A SDR liga. |
| D7 | Qualificação = ICP completo (3–30 pessoas, Niterói, área de volume) + critérios da Marina. |
| D8 | Se o registro falhar, a página mostra o guia do mesmo jeito, com link de WhatsApp para confirmar o contato. |
| D9 | O guia inclui a instalação do Python (6 dos 8 agentes calculam via Python). |
| D10 | Antes de publicar, o TLC varre os 8 agentes atrás de valores, índices e anos desatualizados e traz a lista ao Rafael. Tese jurídica não é mexida. |

## Pacote (D1)

`11-reclamacao-trabalhista-inicial`, `13-calculo-verbas-rescisorias`,
`48-aposentadoria-tempo-contribuicao`, `50-bpc-loas`, `17-divorcio-consensual`,
`19-acao-alimentos`, `41-acao-cdc-pratica-abusiva`, `42-acao-vicio-produto-servico`.

## Formulário

Todos os campos são obrigatórios. `areas` vai no fio como array JSON; o servidor também aceita string separada por vírgula.
Os valores entre crases são o enum aceito pelo servidor.

| Campo | Pergunta | Valores |
|---|---|---|
| `cargo` | Você é… | `socio` `advogado` `secretaria` `estagiario` `juridico_empresa` `estudante` |
| `porte` | Quantas pessoas trabalham no escritório? | `solo` `2` `3_10` `11_30` `30_mais` |
| `areas` (multi) | Áreas de atuação | `trabalhista` `previdenciario` `familia` `consumidor` `civel` `criminal` `tributario` `empresarial` `imobiliario` |
| `whatsapp_quem` | Quem responde o WhatsApp dos clientes? | `socio` `equipe` `sem_responsavel` `nao_atende` |
| `fora_horario` | Mensagem à noite ou no fim de semana… | `na_hora` `dia_seguinte` `demora_dias` |
| `cobranca` | Quem cobra honorário atrasado? | `socio` `equipe` `sistema` `ninguem` |
| `sistema` | Onde ficam processos e agenda? | `software_juridico` `planilha` `agenda_papel` `nenhum` |
| `a_receber` | Você sabe quanto tem de honorário a receber? | `sei` `mais_ou_menos` `nao_sei` |
| `dor_principal` | O que mais pesa hoje? | `whatsapp` `cliente_esfria` `cobranca` `sistemas` `numeros` `pecas` |
| `cidade` | Cidade (texto) | até 80 caracteres |

**Qualificação (calculada no servidor, a partir dos critérios da Marina):**
- `descartado`: `cargo ∈ {juridico_empresa, estudante}` **ou** `whatsapp_quem = nao_atende`.
- `qualificado`: não descartado **e** `porte ∈ {3_10, 11_30}` **e** `whatsapp_quem ∈ {socio, equipe, sem_responsavel}` **e** alguma área ∈ {trabalhista, previdenciario, familia, consumidor} **e** cidade normalizada (sem acento, minúscula) contém a palavra `niteroi`.
- `nao_qualificado`: todo o resto, inclusive resposta ausente ou fora do enum.

## Critérios de aceite

`L` = `api/lead.js` · `P` = página · `G` = plugin · `D` = doc.
Coluna **Mutação**: a implementação errada que o AC tem de reprovar.

| AC | Critério | Prova | Mutação que reprova |
|---|---|---|---|
| L1 | `source = site-agentes-juridicos` gera conversão RD com `conversion_identifier = agents_escritorio_adv`. | teste | `sem-allowlist`: tirar a entrada da allowlist (cai no default `apresentacao-core`) |
| L2 | Os 10 campos do formulário chegam ao Core e ao RD (`cf_*`), com os valores normalizados. | teste | `sem-campo`: remover 1 campo de cada destino |
| L3 | `qualificacao` sai da regra acima, calculada no servidor. O valor enviado pelo browser é ignorado. | teste com 19 casos + `qualificacao` forjada | `confia-cliente` · `porte-marina` · `sem-whatsapp` · `sem-area` · `sem-cidade` · `cidade-prefixo` · `cidade-substring` |
| L4 | Fora do enum: `null` no Core, chave omitida no RD; em `areas`, o item sai. Texto limitado a 80 caracteres nos dois destinos. | teste | `passa-cru` · `cf-cru` · `precedencia` · `areas-cru` · `so-array` · `sem-limite` |
| L5 | As outras 3 origens (`site-dryos-diagnostico`, `site-apresentacao-core`, `site-automacoes`) mandam ao RD e ao Core o mesmo corpo de antes, sem `cf_*`. Única diferença para todas as origens: `utm_*` viram string de até 120 caracteres (security-gate W2). | teste de snapshot contra o corpo atual | `cf-para-todos`: anexar `cf_*` para qualquer origem |
| L6 | Se o RD responder 400 à conversão com `cf_*`, a função reenvia uma vez sem `cf_*`. A conversão não se perde se um campo não existir no RD. | teste com fetch mock | `sem-retry`: não reenviar |
| L7 | Nesta origem, `idempotencyKey = phone:email:site-agentes-juridicos`. O Core descarta chave repetida enquanto o evento existir (`outbox.service.ts:89-109`, `ON CONFLICT DO NOTHING`; eventos PROCESSED são podados em 7 dias, `automations.constants.ts:122`), e quem converteu em outra página perderia esta. | teste | `chave-legada` |
| P1 | `GET /agentes-juridicos` serve a landing; `GET /` continua servindo a home (nada redireciona nem reescreve `/`). | `tests/vercel-config.test.js` + curl no preview e em produção | `redirect-home`: um redirect/rewrite de `/` |
| P2 | **Substituído em 2026-09-25 por `../agentes-juridicos-obrigado/spec.md`** (o guia saiu para a página de obrigado). Texto original: O guia aparece só depois do envio: com `ok:true`, ou, em erro (D8: 5xx, resposta não-JSON, rede, timeout de 25 s), junto com um link de WhatsApp. Um 400 (nome, e-mail ou WhatsApp inválido) não libera o guia: mostra o erro para correção, porque o lead ainda é salvável. Durante o envio, o botão fica desabilitado com "Enviando…". | Playwright com a rota mockada ok, 502, HTML 504, abort | `mostra-antes` · `erro-sem-guia` · `rede-sem-guia` · `duplo-envio` · `sem-enviando` · `evento-no-erro` (`json-sem-try` é equivalente: a rejeição cai no `.catch`) |
| P3 | **Substituído em 2026-09-25 por `../agentes-juridicos-obrigado/spec.md`** (o evento dispara na página de obrigado). Texto original: Sucesso dispara `dataLayer` `generate_lead` com `form_id: 'agentes-juridicos'`. Em erro, não dispara. | Playwright | `evento-no-erro`: disparar no erro |
| P4 | Cada campo tem label; grupos de opção usam `fieldset`/`legend`; o form é navegável só por teclado; o aviso de privacidade linka `/privacidade`; em 375 px, sem scroll horizontal. | validate-gate + Playwright com teclado e viewport 375 | — (auditoria) |
| G1 | `claude plugin validate --strict` passa no marketplace e no plugin. | comando | `manifesto-quebrado`: `name` ausente |
| G2 | O plugin tem exatamente os 8 agentes de D1, com nome de arquivo igual ao `name` do frontmatter (o inventário do plugin mostra o arquivo). | script de contagem | `vaza-57`: copiar a pasta inteira · `name-diverge`: manter o prefixo numérico |
| G3 | Com `CLAUDE_CONFIG_DIR` vazio, `marketplace add` + `install` pelo comando do guia instala e `claude plugin details` lista os 8 agentes. Roda de novo com `DRYOS-Studio/agentes-juridicos` depois do push; antes disso, fica provisório. | execução | `nome-errado`: o guia usar um `plugin@marketplace` diferente do manifesto |
| G5 | O prompt de teste do guia (caso fictício, colado como está), rodado com `claude -p --plugin-dir`, aciona o subagente `agentes-juridicos:divorcio-consensual` (tool_use no stream-json). | execução | `prompt-generico`: um prompt que não cita o caso nem o agente não delega |
| G4 | Os comandos da página e do README do plugin saem do mesmo lugar: um script compara as duas cópias e falha se divergirem. | script | `guia-diverge`: editar só uma cópia |
| D1 | `privacidade.html` cobre (a) o subdomínio, (b) os dados novos (porte, áreas, cidade, respostas sobre a rotina) e (c) a finalidade: liberar o pacote de agentes e o contato comercial da equipe. | leitura | — |
| D2 | `.specs/codebase/INTEGRATIONS.md` deixa de descrever o endpoint RD 1.3 no browser e descreve `api/lead.js` + allowlist. | `grep api/lead` | — |

## Riscos e premissas a verificar no Design

- **R1:** premissa de que o RD aceita `cf_*` cujo campo não existe. Não verificado. O L6 só cobre o 400 (o 422 não). Os 11 campos precisam ser criados no RD como **texto** (Rafael), e um lead real de teste tem de aparecer com os `cf_*` antes do lançamento.
- **R7:** o `marketplace add` clona com git. Mac: `xcode-select --install` (dá git e python3). Windows: Git for Windows. Não há Windows para testar.
- **R5:** o fluxo da automação do Core ligada ao `CORE_WEBHOOK_TOKEN` define se sai WhatsApp e se os campos vão para o card (`set_contact_field`). O D6 depende de o Rafael conferir esse fluxo.
- **R2:** premissa de que o app desktop deixa adicionar marketplace próprio pela tela. Não verificado; os docs só dizem "+ → Plugins". Se não der para confirmar, o guia usa o terminal, que é o caminho que o G3 prova.
- **R3:** exige plano pago do Claude (Pro ou superior; o gratuito não inclui Claude Code). O guia diz isso antes do passo 1.
- **R4:** sem objeto desde a troca do D4 (não há mais regra por host).
- **R6:** no Windows, os agentes chamam `python3`. O instalador do python.org não cria esse comando. Na minha leitura, o Python da Microsoft Store cria o alias, mas não está verificado e não há Windows para testar. O guia manda instalar pela Store e o FAQ cobre o "python3 não encontrado".

## Fora de escopo

Fluxo inbound da Marina; os outros 49 agentes; o dashboard de leads; o teste A/B.
