// Mutation battery (spec: "cada AC nasce com a mutação que ele mata").
// Applies each mutation to a temp copy of api/lead.js (LEAD_FILE) and runs the suite against it.
// Every mutation must FAIL the suite. The real file is never written.
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const file = path.join(__dirname, '..', 'api', 'lead.js');
const orig = fs.readFileSync(file, 'utf8');
const tmp = path.join(require('node:os').tmpdir(), 'lead.mutant.js');

const M = {
  'L1 sem-allowlist': [`  'site-agentes-juridicos': 'agents_escritorio_adv',\n`, ''],
  'L2 sem-campo': [`  f.cidade = String`, `  f.cidadeX = String`],
  'L3 confia-cliente': [`  return f;\n}`, `  if (body.qualificacao) f.qualificacao = body.qualificacao;\n  return f;\n}`],
  'L3 porte-marina': [`ICP_PORTES.includes(f.porte)`, `(f.porte && f.porte !== 'solo')`],
  'L3 sem-whatsapp': [`ICP_PORTES.includes(f.porte) && f.whatsapp_quem`, `ICP_PORTES.includes(f.porte)`],
  'L3 sem-area': [`&& areas.some(a => ICP_AREAS.includes(a))`, ``],
  'L3 sem-cidade': [`&& isIcpCity(f.cidade)`, ``],
  'L3 cidade-prefixo': ["/\\bniteroi\\b/", "/^niteroi/"],
  'L3 cidade-substring': ["/\\bniteroi\\b/", "/niteroi/"],
  'L7 chave-legada': ["payload.idempotencyKey = `${phone}:${email}:${QUALIFY_SOURCE}`;", ""],
  'L4 cf-cru': ["cf = Object.fromEntries(Object.entries(q)", "cf = Object.fromEntries(Object.entries({ ...q, ...body })"],
  'L4 precedencia': [`Object.assign(payload, q);`, `Object.assign(payload, q, { cargo: payload.cargo });`],
  'L4 passa-cru': [`f[k] = allowed.includes(body[k]) ? body[k] : null;`, `f[k] = body[k] ?? null;`],
  'L4 areas-cru': [`.filter(a => QUALIFY_AREAS.includes(a))`, ``],
  'L4 so-array': ["String(body.areas || '').split(',')", "[]"],
  'L4 sem-limite': [`.trim().slice(0, 80)`, `.trim()`],
  'L5 cf-para-todos': [`if (payload.source === QUALIFY_SOURCE) {`, `if (true) {`],
  'ADR-3 sequencial': [`const [core, rd] = await Promise.allSettled([
    sendToCore(base, token, payload),
    sendToRD({ name, email, phone, body, cf }),
  ]);`, `const core = { status: 'fulfilled', value: await sendToCore(base, token, payload) };
  const rd = { status: 'fulfilled', value: await sendToRD({ name, email, phone, body, cf }) };`],
  'ADR-3 ou-em-vez-de-e': [`if (!coreOk && !rdOk) {`, `if (!coreOk || !rdOk) {`],
  'sec-W2 utm-cru': [`if (body[k] != null) body[k] = String(body[k]).slice(0, 120);`, ``],
  'L6 sem-retry': [`if (ok === 400 && cf) return`, `if (false) return`],
};

let survived = 0;
{
  for (const [name, [from, to]] of Object.entries(M)) {
    if (orig.split(from).length !== 2) { console.log(`ANCHOR-MISSING ${name}`); survived++; continue; }
    fs.writeFileSync(tmp, orig.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', path.join(__dirname, 'lead.test.js')], { encoding: 'utf8', env: { ...process.env, LEAD_FILE: tmp } });
    const failed = (r.stdout.match(/^✖ (.+?) \(/gm) || []).map(s => s.slice(2, -2));
    if (r.status === 0) { console.log(`SURVIVED ${name}`); survived++; }
    else console.log(`killed   ${name}  ← ${[...new Set(failed)].join(' | ')}`);
  }
  fs.rmSync(tmp, { force: true });
}
process.exit(survived ? 1 : 0);
