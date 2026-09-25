// S1, S2 (spec agentes-juridicos-guia-vscode): o canal de instalação sem git em dryos.com.br/plugins/.
// PLUGIN_REPO=<clone de DRYOS-Studio/agentes-juridicos> liga a comparação de conteúdo (S2).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path'); const os = require('node:os');
const crypto = require('node:crypto'); const { execFileSync } = require('node:child_process');
const DIR = process.env.PLUGINS_DIR || path.join(__dirname, '..', 'plugins');
const mkt = JSON.parse(fs.readFileSync(path.join(DIR, 'marketplace.json'), 'utf8'));
const entry = mkt.plugins.find(p => p.name === 'agentes-juridicos');
const PREFIX = 'https://www.dryos.com.br/plugins/';

test('S1: marketplace dryos, 1 plugin archive servido de dryos.com.br/plugins/ com sha256 do zip', () => {
  assert.equal(mkt.name, 'dryos');
  assert.equal(mkt.plugins.length, 1);
  assert.equal(entry.source.source, 'archive');
  assert.ok(entry.source.url.startsWith(PREFIX), entry.source.url);
  const zip = path.join(DIR, entry.source.url.slice(PREFIX.length));
  assert.ok(fs.existsSync(zip), 'zip publicado: ' + zip);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex'), entry.source.sha256);
  assert.ok(zip.endsWith(`-${entry.version}.zip`), 'nome do zip carrega a versão');
});

test('S2: o zip tem o plugin 1 nível abaixo e é idêntico ao repo do plugin', { skip: !process.env.PLUGIN_REPO && 'PLUGIN_REPO ausente' }, () => {
  const zip = path.join(DIR, entry.source.url.slice(PREFIX.length));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aj-zip-'));
  execFileSync('unzip', ['-q', zip, '-d', tmp]);
  const root = path.join(tmp, 'agentes-juridicos');
  assert.ok(fs.existsSync(path.join(root, '.claude-plugin', 'plugin.json')), 'raiz do plugin 1 nível abaixo');
  const src = path.join(process.env.PLUGIN_REPO, 'plugins', 'agentes-juridicos');
  const list = d => execFileSync('find', ['.', '-type', 'f', '!', '-name', '.DS_Store'], { cwd: d, encoding: 'utf8' }).trim().split('\n').sort();
  assert.deepEqual(list(root), list(src));
  for (const f of list(src)) assert.ok(fs.readFileSync(path.join(root, f)).equals(fs.readFileSync(path.join(src, f))), 'difere: ' + f);
  assert.equal(JSON.parse(fs.readFileSync(path.join(src, '.claude-plugin', 'plugin.json'))).version, entry.version);
});
