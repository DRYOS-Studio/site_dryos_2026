// node --test tests/  — ACs L1–L6 of .specs/features/agentes-juridicos-landing/spec.md
const test = require('node:test');
const assert = require('node:assert/strict');
const { runLead } = require('./harness');
const legacyInputs = require('./legacy-inputs');
const legacySnapshot = require('./legacy-snapshot.json');

const lead = (over = {}) => ({
  name: 'Ana Lima', email: 'ana@ex.com', phone: '21999990000',
  source: 'site-agentes-juridicos',
  cargo: 'socio', porte: '3_10', areas: ['trabalhista', 'familia'],
  whatsapp_quem: 'equipe', fora_horario: 'dia_seguinte', cobranca: 'socio',
  sistema: 'planilha', a_receber: 'nao_sei', dor_principal: 'cobranca', cidade: 'Niterói',
  ...over,
});

const FIELDS = {
  cargo: 'socio', porte: '3_10', areas: 'trabalhista,familia', whatsapp_quem: 'equipe',
  fora_horario: 'dia_seguinte', cobranca: 'socio', sistema: 'planilha', a_receber: 'nao_sei',
  dor_principal: 'cobranca', cidade: 'Niterói',
};

test('L1: conversion_identifier agents_escritorio_adv', async () => {
  const { rd } = await runLead(lead());
  assert.equal(rd[0].body.payload.conversion_identifier, 'agents_escritorio_adv');
});

test('L2: the 10 fields reach Core and RD (cf_*)', async () => {
  const { rd, core } = await runLead(lead());
  for (const [k, v] of Object.entries(FIELDS)) {
    assert.equal(core[0].body[k], v, `core.${k}`);
    assert.equal(rd[0].body.payload[`cf_${k}`], v, `rd.cf_${k}`);
  }
  assert.equal(core[0].body.qualificacao, 'qualificado');
  assert.equal(rd[0].body.payload.cf_qualificacao, 'qualificado');
});

test('L3: qualificação computed server-side', async () => {
  const cases = [
    [{}, 'qualificado'],
    [{ porte: 'solo' }, 'nao_qualificado'],
    [{ cargo: 'estudante' }, 'descartado'],
    [{ cargo: 'juridico_empresa' }, 'descartado'],
    [{ whatsapp_quem: 'nao_atende' }, 'descartado'],
    [{ porte: undefined }, 'nao_qualificado'],
    [{ porte: '2' }, 'nao_qualificado'],
    [{ porte: '30_mais' }, 'nao_qualificado'],
    [{ porte: '11_30' }, 'qualificado'],
    [{ cidade: 'niteroi - RJ' }, 'qualificado'],
    [{ cidade: 'Niterói RJ' }, 'qualificado'],
    [{ cidade: 'Icaraí, Niterói' }, 'qualificado'],
    [{ cidade: 'Niteroiense' }, 'nao_qualificado'],
    [{ cidade: 'Rio de Janeiro' }, 'nao_qualificado'],
    [{ cidade: undefined }, 'nao_qualificado'],
    [{ areas: ['criminal', 'tributario'] }, 'nao_qualificado'],
    [{ areas: ['criminal', 'previdenciario'] }, 'qualificado'],
    [{ whatsapp_quem: undefined }, 'nao_qualificado'],
    [{ whatsapp_quem: 'xyz' }, 'nao_qualificado'],
    // forged by the browser: must be ignored
    [{ cargo: 'estudante', qualificacao: 'qualificado' }, 'descartado'],
  ];
  for (const [over, want] of cases) {
    const { core } = await runLead(lead(over));
    assert.equal(core[0].body.qualificacao, want, JSON.stringify(over));
  }
});

test('L4: out-of-enum → null (Core) / omitted (RD), areas filtered, text capped at 80', async () => {
  const { core, rd } = await runLead(lead({
    cargo: 'x'.repeat(100), porte: 'gigante', areas: ['trabalhista', 'hackeado', 'consumidor'],
    cidade: 'x'.repeat(200),
  }));
  const p = rd[0].body.payload;
  assert.equal(core[0].body.cargo, null);
  assert.equal(core[0].body.porte, null);
  assert.ok(!('cf_cargo' in p) && !('cf_porte' in p));
  assert.equal(core[0].body.areas, 'trabalhista,consumidor');
  assert.equal(p.cf_areas, 'trabalhista,consumidor');
  assert.equal(core[0].body.cidade.length, 80);
  assert.equal(p.cf_cidade.length, 80);
});

test('L4: areas accepted as array or comma string', async () => {
  const { core } = await runLead(lead({ areas: 'familia, consumidor,xyz' }));
  assert.equal(core[0].body.areas, 'familia,consumidor');
});

test('L7: idempotencyKey carries the source (Core dedup is per key for 7 days)', async () => {
  const { core } = await runLead(lead());
  assert.equal(core[0].body.idempotencyKey, '5521999990000:ana@ex.com:site-agentes-juridicos');
});

test('ADR-3: Core and RD are sent in parallel', async () => {
  const t0 = Date.now();
  await runLead(lead(), { delayMs: 300 });
  assert.ok(Date.now() - t0 < 500, `took ${Date.now() - t0}ms`);
});

test('ADR-3: both destinations down → 502', async () => {
  const { res } = await runLead(lead(), { rdStatus: [500], coreStatus: 500 });
  assert.equal(res.status, 502);
});

test('sec-W2: utm_* coerced to strings of at most 120 chars', async () => {
  const { core, rd } = await runLead(lead({ utm_source: { a: 1 }, utm_campaign: 'c'.repeat(500) }));
  assert.equal(core[0].body.utm_source, '[object Object]');
  assert.equal(core[0].body.utm_campaign.length, 120);
  assert.equal(rd[0].body.payload.traffic_campaign.length, 120);
});

test('L5: legacy sources send exactly the pre-change bodies', async () => {
  for (let i = 0; i < legacyInputs.length; i++) {
    const r = await runLead(legacyInputs[i]);
    assert.deepEqual(
      { rd: r.rd.map(c => c.body), core: r.core.map(c => c.body) },
      legacySnapshot[i],
      legacyInputs[i].source,
    );
  }
});

test('L6: RD 400 with cf_* → one retry without cf_*', async () => {
  const { rd, res } = await runLead(lead(), { rdStatus: [400, 200], coreStatus: 500 });
  assert.equal(rd.length, 2);
  assert.ok(Object.keys(rd[0].body.payload).some(k => k.startsWith('cf_')));
  assert.ok(!Object.keys(rd[1].body.payload).some(k => k.startsWith('cf_')));
  assert.equal(rd[1].body.payload.conversion_identifier, 'agents_escritorio_adv');
  assert.equal(res.status, 200); // RD retry succeeded, so the lead is registered
});

test('L6: legacy RD 400 is not retried', async () => {
  const { rd } = await runLead(legacyInputs[0], { rdStatus: [400, 200] });
  assert.equal(rd.length, 1);
});
