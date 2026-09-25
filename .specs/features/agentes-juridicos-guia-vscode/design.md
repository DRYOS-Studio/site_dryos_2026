# Design — Guia pelo VS Code

```
repo do plugin (DRYOS-Studio/agentes-juridicos)
  plugins/agentes-juridicos/  ── scripts/build-zip.sh ──▶ agentes-juridicos-<v>.zip (+ sha256)
  scripts/python-block.md ── scripts/check-python-block.sh [--write] ──▶ 6 agentes de cálculo
  README.md (guia canônico)
                    │ cópia manual do zip + sha
                    ▼
site (dryos.com.br)
  plugins/marketplace.json  (marketplace `dryos`, fonte archive + sha256)
  plugins/agentes-juridicos-<v>.zip
  agentes-juridicos-obrigado.html  (guia: VS Code → extensão → pasta → login → deep link)
```

| AC | Onde mora a prova |
|---|---|
| S1, S2 | `tests/plugin-dist.test.js` (S2 com `PLUGIN_REPO`); mutações em `tests/mutate-dist.js` |
| S3 | `scripts/check-nogit-install.sh <base>` (PATH só com o `claude`, config vazia) |
| S4, S5, S6 | `tests/page.e2e.js`; mutações em `tests/mutate-page.js` |
| G4′ | `tests/guide-sync.js`: blocos de código do README = `code[data-cmd]` + `a[data-install]` da página |
| R1, R4 | `scripts/check-pack.sh` (G3 lê o `plugin=` do deep link do README) |
| R2 | `scripts/check-python-block.sh`: bloco idêntico, sem `python3 -c`, sem `\$`, e cada bloco `python` roda como `.py` |
| R3 | `claude -p --plugin-dir` com PATH sem python (registro em `gates/`) |

Soltar versão nova do plugin: subir `version` no `plugin.json` e no marketplace do repo → `scripts/build-zip.sh <site>/plugins` → atualizar `url`/`version`/`sha256` em `plugins/marketplace.json` → `PLUGIN_REPO=… node --test tests/plugin-dist.test.js`.
