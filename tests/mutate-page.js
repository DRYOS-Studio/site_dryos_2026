// Mutações P2/P3: cada uma, aplicada numa cópia da página, tem de reprovar o e2e.
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { spawnSync } = require('node:child_process');
const orig = fs.readFileSync(path.join(__dirname, '..', 'agentes-juridicos.html'), 'utf8');
const M = {
  'mostra-antes': ['id="guia" hidden>', 'id="guia">'],
  'erro-sem-guia': ['          } else {\n            showGuide(false);', "          } else {\n            setStatus('Erro', true); sending = false; btn.disabled = false;"],
  // json-sem-try saiu: mutante equivalente (a rejeição do r.json() cai no .catch → guia).
  'rede-sem-guia': [".catch(function () { clearTimeout(timer); showGuide(false); });", ".catch(function () { clearTimeout(timer); });"],
  'duplo-envio': ['      if (sending) return;\n', ''],
  'sem-enviando': ["btn.textContent = 'Enviando…';", ''],
  'evento-no-erro': ['            showGuide(false);\n          }', "            (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', form_id: 'agentes-juridicos' });\n            showGuide(false);\n          }"],
  'areas-string': ['areas: areas(),', "areas: areas().join(','),"],
  'sem-foco-pergunta': ['        if (first) first.focus();\n', ''],
  'honeypot-company': ['id="hp_ref" name="hp_ref"', 'id="company" name="company" autocomplete="organization"'],
};
let survived = 0;
for (const [name, [a, b]] of Object.entries(M)) {
  if (orig.split(a).length !== 2) { console.log('ANCHOR-MISSING', name); survived++; continue; }
  const f = path.join(os.tmpdir(), `aj-${name}.html`);
  fs.writeFileSync(f, orig.replace(a, b));
  const r = spawnSync(process.execPath, [path.join(__dirname, 'page.e2e.js'), f], { encoding: 'utf8', env: process.env });
  const fails = (r.stdout.match(/^✖ .+$/gm) || []).map(s => s.slice(2)).join(' | ');
  if (r.status === 0) { console.log('SURVIVED', name); survived++; } else console.log(`killed   ${name} ← ${fails}`);
  fs.unlinkSync(f);
}
process.exit(survived ? 1 : 0);
