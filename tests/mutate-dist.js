// Mutações S1/S2: cada uma, aplicada numa cópia de plugins/, tem de reprovar tests/plugin-dist.test.js.
// Uso: PLUGIN_REPO=<clone do plugin> node tests/mutate-dist.js
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const crypto = require('node:crypto'); const { spawnSync, execFileSync } = require('node:child_process');
if (!process.env.PLUGIN_REPO) { console.log('PLUGIN_REPO ausente'); process.exit(1); }
const SRC = path.join(__dirname, '..', 'plugins');
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const edit = (d, fn) => { const p = path.join(d, 'marketplace.json'); const m = JSON.parse(fs.readFileSync(p)); fn(m); fs.writeFileSync(p, JSON.stringify(m, null, 2)); };
const zipOf = d => { const m = JSON.parse(fs.readFileSync(path.join(d, 'marketplace.json'))); return path.join(d, m.plugins[0].source.url.split('/').pop()); };
// Rezipa o conteúdo do zip publicado com uma mudança e reaponta o sha (só S2 pode pegar).
const rezip = (d, change) => {
  const z = zipOf(d); const t = fs.mkdtempSync(path.join(os.tmpdir(), 'aj-rz-'));
  execFileSync('unzip', ['-q', z, '-d', t]); change(t); fs.unlinkSync(z);
  execFileSync('zip', ['-qr', z, '.'], { cwd: t }); edit(d, m => { m.plugins[0].source.sha256 = sha(z); });
};
const M = {
  'sha-errado': d => edit(d, m => { m.plugins[0].source.sha256 = '0'.repeat(64); }),
  'url-fora': d => edit(d, m => { m.plugins[0].source.url = m.plugins[0].source.url.replace('www.dryos.com.br', 'raw.githubusercontent.com'); }),
  'fonte-git': d => edit(d, m => { m.plugins[0].source = { source: 'github', repo: 'DRYOS-Studio/agentes-juridicos' }; }),
  'zip-velho': d => rezip(d, t => { const f = path.join(t, 'agentes-juridicos', 'agents', 'bpc-loas.md'); fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('Como rodar a conta', 'Cálculo')); }),
  'zip-fundo': d => rezip(d, t => { fs.mkdirSync(path.join(t, 'a', 'b'), { recursive: true }); fs.renameSync(path.join(t, 'agentes-juridicos'), path.join(t, 'a', 'b', 'agentes-juridicos')); }),
};
const run = d => spawnSync(process.execPath, ['--test', path.join(__dirname, 'plugin-dist.test.js')], { encoding: 'utf8', env: { ...process.env, PLUGINS_DIR: d } });
const base = run(SRC);
if (base.status !== 0) { console.log('BASELINE FAIL\n' + base.stdout); process.exit(1); }
let survived = 0;
for (const [name, fn] of Object.entries(M)) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'aj-dist-'));
  fs.cpSync(SRC, d, { recursive: true }); fn(d);
  const r = run(d);
  const fails = [...new Set((r.stdout.match(/^✖ (S\d)\b/gm) || []).map(s => s.slice(2)))].join(' | ');
  if (r.status === 0) { console.log('SURVIVED', name); survived++; } else console.log(`killed   ${name} ← ${fails}`);
}
process.exit(survived ? 1 : 0);
