// Runs api/lead.js with fetch mocked; returns the recorded outbound calls.
const path = require('node:path');

async function runLead(body, { rdStatus = [200], coreStatus = 200, delayMs = 0 } = {}) {
  process.env.CORE_API_BASE = 'https://core.test';
  process.env.CORE_WEBHOOK_TOKEN = 'tok';
  process.env.RD_TOKEN = 'rdtok';
  const calls = [];
  let rdN = 0;
  global.fetch = async (url, opts) => {
    const isRd = String(url).startsWith('https://api.rd.services');
    const status = isRd ? rdStatus[Math.min(rdN++, rdStatus.length - 1)] : coreStatus;
    calls.push({ to: isRd ? 'rd' : 'core', body: JSON.parse(opts.body) });
    if (delayMs) await new Promise(r => setTimeout(r, delayMs));
    return { ok: status < 400, status };
  };
  const file = process.env.LEAD_FILE || path.join(__dirname, '..', 'api', 'lead.js');
  delete require.cache[require.resolve(file)];
  const handler = require(file);
  const out = {};
  const res = {
    setHeader() {},
    status(c) { out.status = c; return this; },
    json(j) { out.json = j; return this; },
  };
  const origErr = console.error; console.error = () => {};
  try { await handler({ method: 'POST', body }, res); } finally { console.error = origErr; }
  return { res: out, rd: calls.filter(c => c.to === 'rd'), core: calls.filter(c => c.to === 'core') };
}

module.exports = { runLead };
