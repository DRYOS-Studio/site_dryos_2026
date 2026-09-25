# Spec — Guia de instalação pelo VS Code

**Objetivo:** o advogado instala sem terminal (Rafael, 2026-09-25). No lugar de PowerShell/Terminal,
Git, `curl` e comandos `/plugin`, o guia fica: VS Code → extensão Claude Code → pasta → link que
instala o plugin → teste. O Python quem instala é o próprio Claude, quando precisar.

## Fatos verificados (base do desenho)

| # | Fato | Prova |
|---|---|---|
| V-a | A extensão traz o próprio CLI para o painel. | docs `vs-code.md`, Prerequisites: *"The extension bundles its own copy of the CLI"* |
| V-b | `vscode://anthropic.claude-code/install-plugin?plugin=<nome>&marketplace=<https-url>` abre o diálogo de instalação; se o marketplace não existir, o diálogo pede para adicionar. | docs `vs-code.md`, "Share a plugin install link" |
| V-c | Um marketplace do GitHub (`owner/repo`) exige git: sem git no PATH, `marketplace add` falha com `Failed to clone marketplace repository`. | execução, 2026-09-25 |
| V-d | Marketplace por URL + plugin `archive` (zip HTTPS + `sha256`) instala sem git: `Agents (8)`. | execução no preview `exp/marketplace-sem-git`, 2026-09-25 |
| V-e | `sha256` divergente é recusado: `Plugin archive integrity check failed … The archive was not installed`. | execução, 2026-09-25 |
| V-f | Adicionar um marketplace com o mesmo nome (`dryos`) substitui a fonte anterior (git → URL). | execução, 2026-09-25 |
| V-g | Sem Git for Windows, o Claude Code roda comandos pelo PowerShell. | docs `setup.md`, "Set up on Windows" (leitura; a extensão traz o mesmo CLI, V-a) |

## Decisões

| # | Decisão |
|---|---|
| G1 | O canal de instalação é `https://www.dryos.com.br/plugins/marketplace.json` (marketplace `dryos`), com o plugin em `https://www.dryos.com.br/plugins/agentes-juridicos-<versão>.zip` e `sha256` fixado (Rafael: hospedar no domínio). |
| G2 | O zip sai do repo do plugin (`scripts/build-zip.sh`) e é copiado para o site. Um teste do site confere o `sha256` e o conteúdo contra o repo do plugin. |
| G3 | Guia, na página de obrigado e no README: instalar o VS Code; instalar a extensão (link + busca "Claude Code"); criar e abrir uma pasta; abrir o painel pelo ícone da barra lateral e entrar; clicar em "Instalar os agentes" (deep link) e escolher **Install for you**; colar o prompt de teste. Plano B: `/plugins` → Marketplaces → colar o endereço. |
| G4 | Python: os 6 agentes de cálculo procuram `python3`, depois `python`, depois `py -3`. Se nenhum existir, fazem a conta no texto e terminam com "Conta feita no texto, sem conferência por código. Para conferir, peça: 'instale o Python'". Se a pessoa pedir, instalam com permissão (Windows: `winget … --source winget --accept-…`; Mac: `xcode-select --install`). O R3 mostrou que, como subagente, o pedido de permissão se perde no resumo do Claude principal (fool-gate B3). A conta roda de um arquivo `.py` na pasta, e não de `python -c` (PowerShell quebra aspas de várias linhas). Rafael: "Claude instala o Python". |
| G6 | Rollout em 3 fases (fool-gate r1 B2, r2 W1–W3). (0) Commit do plugin congelado em `feat/guia-vscode`; o zip sai desse commit. (1) PR do site com `plugins/`, os testes do canal, o `.vercelignore` e o `CLAUDE.md` → produção → S3 e M1. Se falhar, reverte o PR: nenhuma página aponta para o canal ainda. (2) PR da página de obrigado. (3) PR do plugin (README e agentes); até lá, o README antigo continua valendo sozinho. Zip publicado é imutável: se a revisão mudar um agente, a versão sobe (1.1.1) com um zip novo. |
| G5 | Sem Git for Windows, terminal nem `/plugin marketplace add owner/repo` no guia. O marketplace git do repo (`.claude-plugin/marketplace.json`) continua para desenvolvimento e `check-pack.sh`. |

## Critérios de aceite

`S` = site, `R` = repo do plugin.

| AC | Critério | Prova | Mutação que reprova |
|---|---|---|---|
| S1 | `plugins/marketplace.json` tem o marketplace `dryos` com 1 plugin `agentes-juridicos`, fonte `archive`, `url` em `https://www.dryos.com.br/plugins/` e `sha256` igual ao do zip publicado. | `tests/plugin-dist.test.js` | `sha-errado` · `url-fora` · `fonte-git` |
| S2 | O zip tem a raiz do plugin no topo ou 1 nível abaixo, e o conteúdo é idêntico a `plugins/agentes-juridicos/` do repo do plugin. | `tests/plugin-dist.test.js` com `PLUGIN_REPO` | `zip-velho` · `zip-fundo` |
| S3 | Sem git no PATH e com config vazia, `marketplace add <url>` + `install agentes-juridicos@dryos` instala, e `plugin details` lista os 8 agentes. | `scripts/check-nogit-install.sh` em produção, depois da fase 1 (G6) | — (execução; o V-e prova a recusa de sha errado) |
| S4 | A página de obrigado tem o link da extensão (`vscode:extension/anthropic.claude-code`), o deep link com `plugin=agentes-juridicos` e `marketplace=https://www.dryos.com.br/plugins/marketplace.json` (URL-encoded), o endereço do plano B visível e copiável, e o passo de abrir uma pasta. | Playwright | `link-plugin-errado` · `link-marketplace-git` · `sem-pasta` |
| S5 | A página não manda instalar Git, abrir Terminal/PowerShell, nem rodar `curl`, `irm`, `xcode-select` ou `/plugin marketplace add`. | Playwright (texto da página) | `volta-terminal` |
| S6 | O requisito de plano pago e a EAOAB 32 continuam antes do passo 1 (P5 da obrigado). | e2e existente | `sem-requisito` (já existe) |
| G4′ | Os comandos e o prompt de teste da página batem com o README do plugin. | `tests/guide-sync.js` | `guia-diverge` |
| R1 | O README do plugin é o guia G3. O deep link vai num bloco de código, porque o GitHub remove links `vscode://`. | leitura + `guide-sync` | — |
| R2 | Os 6 agentes de cálculo trazem o mesmo bloco "Como rodar a conta" (G4), a partir de um arquivo-fonte único; um script falha se alguma cópia divergir ou faltar. | `scripts/check-python-block.sh` | `bloco-diverge` · `bloco-falta` |
| R3 | Com `python3` fora do PATH, a **resposta que o usuário recebe** (a do Claude principal) diz que a conta não foi conferida por código. | `claude -p --plugin-dir` com PATH sem python3 (execução, Mac); confere o `result` final | — (execução; Windows fica como leitura) |
| R4 | `plugin.json` e o marketplace do repo têm a mesma versão, que é a do zip publicado. | `check-pack.sh` (R4) e S2 (versão do site = `plugin.json`) | — |
| M1 | O deep link, clicado no VS Code com a extensão, abre o diálogo do plugin, e os rótulos do guia (Sign in, Install for you, `/plugins`, Marketplaces) batem com a tela. | manual, pelo Rafael, em produção depois da fase 1 (G6) | — (sem VS Code no arnês) |

## Riscos

- **Windows não testado:** winget, `py -3` e PowerShell rodando o `.py` são leitura. Não há Windows no arnês.
- **Conflito de nome:** resolvido pelo V-f. Adicionar o `dryos` por URL troca a fonte git. Não verificado se isso atualiza um plugin já instalado.
- **Atualização:** não verificado se refazer o marketplace atualiza o plugin instalado; o FAQ "Como atualizo?" saiu até isso ser provado.
