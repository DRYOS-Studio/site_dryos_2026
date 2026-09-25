// Mutações P2–P7 e F-* (form dinâmico): cada uma, aplicada numa cópia da página, tem de reprovar o e2e.
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ROOT = path.join(__dirname, '..');
const FILES = { L: path.join(ROOT, 'agentes-juridicos.html'), O: path.join(ROOT, 'agentes-juridicos-obrigado.html') };
const orig = { L: fs.readFileSync(FILES.L, 'utf8'), O: fs.readFileSync(FILES.O, 'utf8') };
const guide = orig.O.slice(orig.O.indexOf('<section class="sec-pad guide"'), orig.O.indexOf('</section>', orig.O.indexOf('<section class="sec-pad guide"')) + 10);
const pasta = orig.O.split('\n').find(l => l.includes('id="passo-pasta"')) + '\n';
const M = {
  'link-plugin-errado': ['O', 'install-plugin?plugin=agentes-juridicos&amp;', 'install-plugin?plugin=agentes&amp;'],
  'link-marketplace-git': ['O', 'marketplace=https%3A%2F%2Fwww.dryos.com.br%2Fplugins%2Fmarketplace.json', 'marketplace=DRYOS-Studio%2Fagentes-juridicos'],
  'sem-pasta': ['O', pasta, ''],
  'volta-terminal': ['O', '<ol class="gsteps">', '<ol class="gsteps"><li><h4>Abra o PowerShell</h4><p>Rode <code>irm https://claude.ai/install.ps1 | iex</code></p></li>'],
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
  'tudo-de-uma-vez': ['L', 'q.hidden = j !== i;', 'q.hidden = false;'],
  'progresso-fixo': ['L', "'Pergunta ' + (i + 1) + ' de '", "'Pergunta 1 de '"],
  'voltar-na-1': ['L', 'prev.hidden = i === 0;', 'prev.hidden = false;'],
  'sem-auto-avanco': ['L', 'if (cur === at && !step1.hidden) next();', ''],
  'sem-foco': ['L', '        qs[i].focus();\n', ''],
  'avanca-no-teclado': ['L', "if (e.target.type !== 'radio' || Date.now() - pointerAt > 1000) return;", "if (e.target.type !== 'radio') return;"],
  'checkbox-avanca': ['L', "if (e.target.type !== 'radio' || Date.now() - pointerAt > 1000) return;", 'if (Date.now() - pointerAt > 1000) return;'],
  'pula-sem-resposta': ['L', 'if (!answered(qs[cur])) {', 'if (false) {'],
  'voltar-errado': ['L', 'showQ(qs.length - 1, true); });', 'showQ(0, true); });'],
  'voltar-pra-1': ['L', "prev.addEventListener('click', function () { setStatus(''); showQ(cur - 1, true); });", "prev.addEventListener('click', function () { setStatus(''); showQ(0, true); });"],
  'foca-no-load': ['L', 'showQ(0, false);', 'showQ(0, true);'],
  'contato-sem-foco': ['L', "      document.getElementById('step2Title').focus();\n", ''],
  'sem-trava': ['L', "if (Date.now() < lockUntil && e.detail > 0 && e.target.closest('.opt')) e.preventDefault();", ''],
  'enter-envia': ['L', '      if (!step1.hidden) { next(); return; }\n', ''],
  'sem-retoque': ['L', "if (retap && e.target === retap && Date.now() - pointerAt < 1000) { retap = null; autoNext(); }", ''],
  'trava-teclado': ['L', 'Date.now() < lockUntil && e.detail > 0 &&', 'Date.now() < lockUntil &&'],
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
// Fail-closed: o baseline roda abaixo, sob a mesma carga paralela das mutações.
let survived = 0;
// Em paralelo: cada e2e sobe o próprio servidor e browser. MUT_JOBS ajusta (default 6).
const { spawn } = require('node:child_process');
const run = (...args) => new Promise(res => {
  const c = spawn(process.execPath, [path.join(__dirname, 'page.e2e.js'), ...args], { env: process.env });
  let out = ''; c.stdout.setEncoding('utf8'); c.stdout.on('data', d => { out += d; }); c.stderr.on('data', () => {});
  c.on('close', status => res({ status, stdout: out }));
});
const jobs = Object.entries(M);
const JOBS = Number(process.env.MUT_JOBS) || 6;
(async () => {
  // Sem o e2e verde no original sob a mesma carga, "killed" não quer dizer nada (ex.: PW_CHROME_FULL ausente, timing).
  const bases = await Promise.all(Array.from({ length: JOBS }, () => run(FILES.L, FILES.O)));
  const bad = bases.find(r => r.status !== 0);
  if (bad) { console.log('BASELINE FAIL (sob carga)\n' + bad.stdout); process.exit(1); }
  const results = {};
  let next = 0;
  await Promise.all(Array.from({ length: JOBS }, async () => {
    while (next < jobs.length) {
      const [name, [k, a, b]] = jobs[next++];
      if (orig[k].split(a).length !== 2) { results[name] = 'ANCHOR-MISSING ' + name; continue; }
      const f = path.join(os.tmpdir(), `aj-${name}.html`);
      fs.writeFileSync(f, orig[k].replace(a, b));
      const r = await run(...(k === 'L' ? [f, FILES.O] : [FILES.L, f]));
      fs.unlinkSync(f);
      const fails = (r.stdout.match(/^✖ .+$/gm) || []).map(s => s.slice(2)).join(' | ');
      // Só conta como morta se o e2e terminou (exit 1) apontando caso reprovado; crash ou lentidão = ERROR.
      results[name] = r.status === 0 ? 'SURVIVED ' + name : r.status === 1 && fails ? `killed   ${name} ← ${fails}` : `ERROR    ${name} (status ${r.status})`;
    }
  }));
  for (const [name] of jobs) { console.log(results[name]); if (!results[name].startsWith('killed')) survived++; }
// G4′ guia-diverge: o guide-sync (README em GUIDE_README ou raw do GitHub) passa no original e reprova a cópia.
// O 1º argumento do guide-sync é sempre o README; a página vai no 2º.
const README = process.env.GUIDE_README || 'https://raw.githubusercontent.com/DRYOS-Studio/agentes-juridicos/main/README.md';
const gs = f => spawnSync(process.execPath, [path.join(__dirname, 'guide-sync.js'), README, ...(f ? [f] : [])], { encoding: 'utf8' }).status;
const gf = path.join(os.tmpdir(), 'aj-guia-diverge.html');
const GA = '<code data-cmd>https://www.dryos.com.br/plugins/marketplace.json</code>';
if (orig.O.split(GA).length !== 2) { console.log('ANCHOR-MISSING guia-diverge'); process.exit(1); }
fs.writeFileSync(gf, orig.O.replace(GA, '<code data-cmd>https://www.dryos.com.br/plugins/outro.json</code>'));
const g0 = gs(), g1 = gs(gf); fs.unlinkSync(gf);
if (g0 !== 0) { console.log('BASELINE FAIL guide-sync'); survived++; }
else if (g1 === 0) { console.log('SURVIVED guia-diverge'); survived++; } else console.log('killed   guia-diverge ← guide-sync');
process.exit(survived ? 1 : 0);
})();
