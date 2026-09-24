// P2, P3, P4 (spec). Uso: PW=<dir com node_modules/playwright> node tests/page.e2e.js [arquivo.html]
// Serve o repo localmente e intercepta /api/lead. Sai com 1 se algum caso falhar.
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs');
const { chromium } = require(path.join(process.env.PW || path.join(process.env.HOME, '.claude/skills/playwright-skill'), 'node_modules/playwright'));

const ROOT = path.join(__dirname, '..');
const PAGE = process.argv[2] || path.join(ROOT, 'agentes-juridicos.html');

const server = http.createServer((req, res) => {
  const p = req.url.split('?')[0];
  if (p === '/agentes-juridicos') { res.setHeader('content-type', 'text/html; charset=utf-8'); return res.end(fs.readFileSync(PAGE)); }
  const f = path.join(ROOT, p);
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return res.end(fs.readFileSync(f));
  res.statusCode = 404; res.end();
});

const RADIOS = { cargo: 'socio', porte: '3_10', whatsapp_quem: 'equipe', fora_horario: 'dia_seguinte', cobranca: 'socio', sistema: 'planilha', a_receber: 'nao_sei', dor_principal: 'cobranca' };

async function fill(page) {
  for (const [n, v] of Object.entries(RADIOS)) await page.check(`input[name="${n}"][value="${v}"]`, { force: true });
  await page.check('input[name="areas"][value="trabalhista"]', { force: true });
  await page.check('input[name="areas"][value="familia"]', { force: true });
  await page.click('#toStep2');
  await page.fill('#lf-name', 'Ana Lima');
  await page.fill('#lf-email', 'ana@ex.com');
  await page.fill('#lf-phone', '21999990000');
  await page.fill('#lf-cidade', 'Niterói');
}

// route: function(route) that answers /api/lead
async function scenario(browser, url, route, fn, opts = {}) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const reqs = [];
  await page.route('**/api/lead', r => { reqs.push(r.request().postDataJSON()); return route(r); });
  await page.route(/googletagmanager|fonts\.g/, r => r.abort());
  await page.goto(url);
  try { return await fn(page, reqs); } finally { await ctx.close(); }
}

const json = (status, body) => r => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
const visible = (page, sel) => page.isVisible(sel);
const leadEvents = page => page.evaluate(() => (window.dataLayer || []).filter(e => e.event === 'generate_lead'));

const cases = {
  'P2 guia escondido no carregamento': (b, u) => scenario(b, u, json(200, { ok: true }), async page => !(await visible(page, '#guia'))),

  'P2+P3 ok: guia + aviso ok + evento + corpo certo': (b, u) => scenario(b, u, json(200, { ok: true }), async (page, reqs) => {
    await fill(page); await page.click('#lf-submit');
    await page.waitForSelector('#guia', { state: 'visible', timeout: 3000 });
    const ev = await leadEvents(page); const body = reqs[0];
    return await visible(page, '#guideOk') && !(await visible(page, '#guideErr'))
      && ev.length === 1 && ev[0].form_id === 'agentes-juridicos'
      && body.source === 'site-agentes-juridicos' && Array.isArray(body.areas) && body.areas.join() === 'trabalhista,familia'
      && Object.entries(RADIOS).every(([k, v]) => body[k] === v) && body.cidade === 'Niterói' && body.company === '';
  }),

  'P2+P3 502: guia + aviso de erro, sem evento': (b, u) => scenario(b, u, json(502, { ok: false }), async page => {
    await fill(page); await page.click('#lf-submit');
    await page.waitForSelector('#guia', { state: 'visible', timeout: 3000 });
    return await visible(page, '#guideErr') && !(await visible(page, '#guideOk')) && (await leadEvents(page)).length === 0;
  }),

  'P2 504 com HTML: guia aparece': (b, u) => scenario(b, u, r => r.fulfill({ status: 504, contentType: 'text/html', body: '<html>timeout</html>' }), async page => {
    await fill(page); await page.click('#lf-submit');
    await page.waitForSelector('#guia', { state: 'visible', timeout: 3000 }).catch(() => {});
    return await visible(page, '#guideErr');
  }),

  'P2 falha de rede: guia aparece': (b, u) => scenario(b, u, r => r.abort(), async page => {
    await fill(page); await page.click('#lf-submit');
    await page.waitForSelector('#guia', { state: 'visible', timeout: 3000 }).catch(() => {});
    return await visible(page, '#guideErr');
  }),

  'P2 400: pede correção, sem guia': (b, u) => scenario(b, u, json(400, { ok: false, error: 'E-mail inválido.' }), async page => {
    await fill(page); await page.click('#lf-submit');
    await page.waitForFunction(() => document.getElementById('lf-status').textContent.length > 0, null, { timeout: 3000 });
    return !(await visible(page, '#guia')) && (await page.textContent('#lf-status')).includes('E-mail inválido') && await page.isEnabled('#lf-submit');
  }),

  'P2 duplo envio: 1 requisição, botão "Enviando…"': (b, u) => scenario(b, u, async r => { await new Promise(s => setTimeout(s, 800)); return json(200, { ok: true })(r); }, async (page, reqs) => {
    await fill(page);
    await page.evaluate(() => { const f = document.getElementById('leadForm'); f.requestSubmit(); f.requestSubmit(); });
    const label = await page.textContent('#lf-submit');
    const disabled = await page.isDisabled('#lf-submit');
    await page.waitForSelector('#guia', { state: 'visible', timeout: 3000 });
    return reqs.length === 1 && label.includes('Enviando') && disabled;
  }),

  'P4 etapa 1 incompleta: não avança e foca a pergunta': (b, u) => scenario(b, u, json(200, { ok: true }), async page => {
    await page.click('#toStep2');
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.name);
    return !(await visible(page, '#step2')) && focused === 'cargo' && (await page.textContent('#lf-status')).length > 0;
  }),

  'P4 teclado: seleciona rádio com setas e avança com Enter': (b, u) => scenario(b, u, json(200, { ok: true }), async page => {
    await page.focus('input[name="cargo"][value="socio"]');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    const v = await page.evaluate(() => document.querySelector('input[name="cargo"]:checked').value);
    return v === 'advogado';
  }),

  'P4 labels: todo input visível tem label': (b, u) => scenario(b, u, json(200, { ok: true }), async page => page.evaluate(() =>
    [...document.querySelectorAll('input:not(.hp)')].every(i => i.closest('label') || document.querySelector(`label[for="${i.id}"]`))
    && document.querySelectorAll('#step1 fieldset').length === 9 && [...document.querySelectorAll('#step1 fieldset')].every(f => f.querySelector('legend'))
    && !!document.querySelector('.privacy a[href="/privacidade"]'))),

  'fool-W8 honeypot fora do autofill (nome/autocomplete)': (b, u) => scenario(b, u, json(200, { ok: true }), async page => page.evaluate(() => {
    const h = document.querySelector('.hp');
    return !!h && h.getAttribute('autocomplete') === 'off' && !/company|organi[sz]ation|empresa/i.test(h.name + h.id);
  })),

  'P4 375px: sem scroll horizontal (form e guia)': (b, u) => scenario(b, u, json(200, { ok: true }), async page => {
    const w1 = await page.evaluate(() => document.documentElement.scrollWidth);
    await fill(page); await page.click('#lf-submit');
    await page.waitForSelector('#guia', { state: 'visible', timeout: 3000 });
    const w2 = await page.evaluate(() => document.documentElement.scrollWidth);
    return w1 <= 375 && w2 <= 375;
  }, { viewport: { width: 375, height: 800 } }),
};

(async () => {
  await new Promise(r => server.listen(0, r));
  const url = `http://127.0.0.1:${server.address().port}/agentes-juridicos`;
  // PW_CHROME: executável do Chromium, quando o cache tem outro build que o do pacote.
  const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
  let failed = 0;
  for (const [name, fn] of Object.entries(cases)) {
    let ok = false;
    let why = '';
    try { ok = await fn(browser, url); } catch (e) { ok = false; why = ` (${e.message.split('\n')[0]})`; }
    if (!ok) failed++;
    console.log(`${ok ? '✔' : '✖'} ${name}${why}`);
  }
  await browser.close(); server.close();
  process.exit(failed ? 1 : 0);
})();
