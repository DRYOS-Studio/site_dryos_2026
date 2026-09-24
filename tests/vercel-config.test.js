// P1 (pré-deploy). Rewrite de `/` não dispara: o filesystem (index.html) tem precedência
// (doc vercel-json). Por isso o subdomínio usa redirect condicionado ao host.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
const HOST = 'agentes-juridicos.dryos.com.br';

test('P1: subdomain root redirects to the landing, only on its host', () => {
  const r = (cfg.redirects || []).filter(x => x.source === '/');
  assert.equal(r.length, 1);
  assert.deepEqual(r[0].has, [{ type: 'host', value: HOST }]);
  assert.equal(r[0].destination, '/agentes-juridicos');
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'agentes-juridicos.html')));
});

test('P1: no rewrite of / (it would never fire, or would hijack the home)', () => {
  assert.equal((cfg.rewrites || []).filter(x => x.source === '/').length, 0);
});

test('ADR-3: lead function allows the parallel worst case', () => {
  assert.ok(cfg.functions['api/lead.js'].maxDuration >= 20);
});
