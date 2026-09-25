# ADRs — Guia pelo VS Code

## ADR-1: canal de instalação por URL + archive, no domínio da DRYOS

**Decisão:** `https://www.dryos.com.br/plugins/marketplace.json` com o plugin em zip e `sha256` (Rafael escolheu o domínio).
**Razão:** um marketplace `owner/repo` do GitHub roda `git clone` (V-c, verificado por execução), e o público-alvo não tem git. Por URL, o Claude Code baixa só o JSON e o zip (V-d).
**Custo aceito:** o zip é copiado do repo do plugin para o site; o S2 (`PLUGIN_REPO`) pega divergência de conteúdo, mas só quando alguém roda o teste com o clone do plugin.
**Descartado:** GitHub Release, porque o download passa por um redirect que não testei.

## ADR-2: Python instalado pelo Claude, conta rodada de arquivo

**Decisão:** bloco comum "Como rodar a conta" nos 6 agentes de cálculo (G4).
**Razão:** Rafael escolheu que o Claude instale o Python. `python -c` com várias linhas quebra no PowerShell, que é o shell do Claude Code no Windows sem Git for Windows (V-g, docs `setup.md`). A quebra de aspas é leitura, sem Windows para testar.
**Risco observado (R3 r1):** rodando como subagente, o agente pediu a autorização, mas o Claude principal resumiu e deixou o pedido de fora. Por isso o texto não promete o pedido. O agente fecha com "Para conferir, peça: 'instale o Python'", e o R3 passa a medir a resposta final.
