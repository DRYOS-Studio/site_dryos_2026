// Mutações P2/P3/P5: cada uma, aplicada numa cópia da página, tem de reprovar o e2e.
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ROOT = path.join(__dirname, '..');
const FILES = { L: path.join(ROOT, 'agentes-juridicos.html'), O: path.join(ROOT, 'agentes-juridicos-obrigado.html') };
const orig = { L: fs.readFileSync(FILES.L, 'utf8'), O: fs.readFileSync(FILES.O, 'utf8') };
const guide = orig.O.slice(orig.O.indexOf('<section class="sec-pad guide"'), orig.O.indexOf('</section>', orig.O.indexOf('<section class="sec-pad guide"')) + 10);
const M = {
  'guia-na-landing': ['L', '<section class="sec-pad rotina">', guide.replace('id="guia">', 'id="guia" hidden>') + '\n<section class="sec-pad rotina">'],
  'erro-fica': ['L', '          } else {\n            done(false);', "          } else {\n            setStatus('Erro', true); sending = false; btn.disabled = false;"],
  'rede-fica': ['L', '.catch(function () { clearTimeout(timer); done(false); });', '.catch(function () { clearTimeout(timer); });'],
  'erro-como-ok': ['L', "(ok ? 'ok' : 'erro')", "'ok'"],
  'sem-timeout': ['L', "var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);", 'var timer = 0;'],
  '400-vira-erro': ['L', '          if (res.status === 400) {', '          if (false) {'],
  '400-botao-preso': ['L', "sending = false; btn.disabled = false; btn.textContent = 'Receber os agentes';\n            setStatus(", "sending = false;\n            setStatus("],
  'token-cedo': ['L', '      sending = true;\n', "      sending = true; try { sessionStorage.setItem('aj_lead', '1'); } catch (e) {}\n"],
  'erro-nao-limpa': ['L', "      if (!ok) { try { sessionStorage.removeItem('aj_lead'); } catch (e) {} }\n", ''],
  'sem-pageshow': ['L', "window.addEventListener('pageshow',", "window.addEventListener('pageshow-off',"],
  'duplo-envio': ['L', '      if (sending) return;\n', ''],
  'sem-enviando': ['L', "btn.textContent = 'Enviando…';", ''],
  'areas-string': ['L', 'areas: areas(),', "areas: areas().join(','),"],
  'sem-foco-pergunta': ['L', '        if (first) first.focus();\n', ''],
  'honeypot-company': ['L', 'id="hp_ref" name="hp_ref"', 'id="company" name="company" autocomplete="organization"'],
  'evento-no-erro': ['O', "if (r === 'ok' && sessionStorage.getItem('aj_lead'))", "if (sessionStorage.getItem('aj_lead') || r === 'erro')"],
  'evento-sem-token': ['O', "if (r === 'ok' && sessionStorage.getItem('aj_lead'))", "if (r === 'ok')"],
  'evento-no-reload': ['O', "        sessionStorage.removeItem('aj_lead');\n", ''],
  'indexavel': ['O', '<meta name="robots" content="noindex">\n', ''],
  'sem-requisito': ['O', '<p class="sec-intro" id="guideReq">', '<p class="sec-intro" id="guideReq" hidden>'],
  'aviso-sem-status': ['O', "if (r === 'ok' || r === 'erro') document", "document"],
};
const e2e = (...args) => spawnSync(process.execPath, [path.join(__dirname, 'page.e2e.js'), ...args], { encoding: 'utf8', env: process.env });
// Fail-closed: sem o e2e verde no original, "killed" não quer dizer nada (ex.: PW_CHROME_FULL ausente).
const base = e2e(FILES.L, FILES.O);
if (base.status !== 0) { console.log('BASELINE FAIL\n' + base.stdout + base.stderr); process.exit(1); }
let survived = 0;
for (const [name, [k, a, b]] of Object.entries(M)) {
  if (orig[k].split(a).length !== 2) { console.log('ANCHOR-MISSING', name); survived++; continue; }
  const f = path.join(os.tmpdir(), `aj-${name}.html`);
  fs.writeFileSync(f, orig[k].replace(a, b));
  const args = k === 'L' ? [f, FILES.O] : [FILES.L, f];
  const r = e2e(...args);
  const fails = (r.stdout.match(/^✖ .+$/gm) || []).map(s => s.slice(2)).join(' | ');
  if (r.status === 0) { console.log('SURVIVED', name); survived++; } else console.log(`killed   ${name} ← ${fails}`);
  fs.unlinkSync(f);
}
// G4′ guia-diverge: o guide-sync (README em GUIDE_README ou raw do GitHub) passa no original e reprova a cópia.
// O 1º argumento do guide-sync é sempre o README; a página vai no 2º.
const README = process.env.GUIDE_README || 'https://raw.githubusercontent.com/DRYOS-Studio/agentes-juridicos/main/README.md';
const gs = f => spawnSync(process.execPath, [path.join(__dirname, 'guide-sync.js'), README, ...(f ? [f] : [])], { encoding: 'utf8' }).status;
const gf = path.join(os.tmpdir(), 'aj-guia-diverge.html');
fs.writeFileSync(gf, orig.O.replace('<code data-cmd>claude</code>', '<code data-cmd>claude --x</code>'));
const g0 = gs(), g1 = gs(gf); fs.unlinkSync(gf);
if (g0 !== 0) { console.log('BASELINE FAIL guide-sync'); survived++; }
else if (g1 === 0) { console.log('SURVIVED guia-diverge'); survived++; } else console.log('killed   guia-diverge ← guide-sync');
process.exit(survived ? 1 : 0);
