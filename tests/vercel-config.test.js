// P1 (pré-deploy): a landing mora em /agentes-juridicos no próprio site (decisão do Rafael,
// 2026-09-24: sem subdomínio). Nada pode redirecionar ou reescrever `/`, que é a home.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));

test('P1: landing exists as a clean URL of the site', () => {
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'agentes-juridicos.html')));
  assert.equal(cfg.cleanUrls, true);
});

test('P1: nothing redirects or rewrites the home', () => {
  for (const k of ['redirects', 'rewrites']) {
    assert.equal((cfg[k] || []).filter(x => x.source === '/').length, 0, k);
  }
});

test('ADR-3: lead function allows the parallel worst case', () => {
  assert.ok(cfg.functions['api/lead.js'].maxDuration >= 20);
});
