// P2, P3, P4, P5 (specs agentes-juridicos-landing e -obrigado).
// Uso: PW=<dir com node_modules/playwright> node tests/page.e2e.js [landing.html] [obrigado.html]
// Serve o repo localmente e intercepta /api/lead. Sai com 1 se algum caso falhar.
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs');
const { chromium } = require(path.join(process.env.PW || path.join(process.env.HOME, '.claude/skills/playwright-skill'), 'node_modules/playwright'));

const ROOT = path.join(__dirname, '..');
const PAGE = process.argv[2] || path.join(ROOT, 'agentes-juridicos.html');
const THANKS = process.argv[3] || path.join(ROOT, 'agentes-juridicos-obrigado.html');

const server = http.createServer((req, res) => {
  const p = req.url.split('?')[0];
  const page = { '/agentes-juridicos': PAGE, '/agentes-juridicos-obrigado': THANKS }[p];
  if (page) { res.setHeader('content-type', 'text/html; charset=utf-8'); return res.end(fs.readFileSync(page)); }
  // P7: sem page.route (que tira a página do bfcache), o servidor responde o lead com 502.
  if (p === '/api/lead') { res.statusCode = 502; res.setHeader('content-type', 'application/json'); return res.end('{"ok":false}'); }
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

const THANKS_RE = /\/agentes-juridicos-obrigado\?r=(ok|erro)$/;
const submitTo = async (page, r) => { await page.click('#lf-submit'); await page.waitForURL(THANKS_RE, { timeout: 3000 }); return new URL(page.url()).searchParams.get('r') === r; };
const notices = async page => [await visible(page, '#guideOk'), await visible(page, '#guideErr')].join();

const cases = {
  'P2 landing sem guia': (b, u) => scenario(b, u, json(200, { ok: true }), async page => (await page.$('#guia')) === null && (await page.$('[data-cmd]')) === null),

  'P2+P3 ok: vai para ?r=ok, aviso ok, 1 evento, corpo certo': (b, u) => scenario(b, u, json(200, { ok: true }), async (page, reqs) => {
    await fill(page);
    if (!(await submitTo(page, 'ok'))) return false;
    const ev = await leadEvents(page); const body = reqs[0];
    return await notices(page) === 'true,false'
      && ev.length === 1 && ev[0].form_id === 'agentes-juridicos'
      && body.source === 'site-agentes-juridicos' && Array.isArray(body.areas) && body.areas.join() === 'trabalhista,familia'
      && Object.entries(RADIOS).every(([k, v]) => body[k] === v) && body.cidade === 'Niterói' && body.company === '';
  }),

  'P3 reload da obrigado não repete o evento': (b, u) => scenario(b, u, json(200, { ok: true }), async page => {
    await fill(page);
    if (!(await submitTo(page, 'ok'))) return false;
    await page.reload();
    return (await leadEvents(page)).length === 0;
  }),

  'P3+P5 acesso direto com ?r=ok: sem evento': (b, u) => scenario(b, u.replace(/$/, '-obrigado?r=ok'), json(200, { ok: true }), async page =>
    (await leadEvents(page)).length === 0),

  'P2+P3 502: vai para ?r=erro, aviso de erro, sem evento': (b, u) => scenario(b, u, json(502, { ok: false }), async page => {
    await fill(page);
    if (!(await submitTo(page, 'erro'))) return false;
    return await notices(page) === 'false,true' && (await leadEvents(page)).length === 0
      && !!(await page.$('#guideErr a[href^="https://wa.me/"]'));
  }),

  'P2 504 com HTML: vai para ?r=erro': (b, u) => scenario(b, u, r => r.fulfill({ status: 504, contentType: 'text/html', body: '<html>timeout</html>' }), async page => {
    await fill(page); return submitTo(page, 'erro');
  }),

  'P2 falha de rede: vai para ?r=erro': (b, u) => scenario(b, u, r => r.abort(), async page => {
    await fill(page); return submitTo(page, 'erro');
  }),

  'P2 sem resposta: timeout de 25 s vai para ?r=erro': (b, u) => scenario(b, u, () => new Promise(() => {}), async page => {
    await page.clock.install();
    await page.reload();
    await fill(page); await page.click('#lf-submit');
    await page.clock.runFor(25000);
    await page.waitForURL(THANKS_RE, { timeout: 3000 });
    return new URL(page.url()).searchParams.get('r') === 'erro';
  }),

  'P3 erro e depois ?r=ok na mesma aba: sem evento': (b, u) => scenario(b, u, json(502, { ok: false }), async page => {
    // Token órfão de um envio ok anterior cuja obrigado não carregou.
    await page.evaluate(() => sessionStorage.setItem('aj_lead', '1'));
    await fill(page);
    if (!(await submitTo(page, 'erro'))) return false;
    await page.goto(u + '-obrigado?r=ok');
    return (await leadEvents(page)).length === 0;
  }),

  'P2 400: pede correção, fica na landing': (b, u) => scenario(b, u, json(400, { ok: false, error: 'E-mail inválido.' }), async page => {
    await fill(page); await page.click('#lf-submit');
    await page.waitForFunction(() => document.getElementById('lf-status').textContent.length > 0, null, { timeout: 3000 });
    const stayed = new URL(page.url()).pathname === '/agentes-juridicos' && (await page.textContent('#lf-status')).includes('E-mail inválido') && await page.isEnabled('#lf-submit');
    // O 400 não pode deixar token: senão um ?r=ok aberto depois vira conversão.
    await page.goto(u + '-obrigado?r=ok');
    return stayed && (await leadEvents(page)).length === 0;
  }),

  'P2 duplo envio: 1 requisição, botão "Enviando…"': (b, u) => scenario(b, u, async r => { await new Promise(s => setTimeout(s, 800)); return json(200, { ok: true })(r); }, async (page, reqs) => {
    await fill(page);
    await page.evaluate(() => { const f = document.getElementById('leadForm'); f.requestSubmit(); f.requestSubmit(); });
    const label = await page.textContent('#lf-submit');
    const disabled = await page.isDisabled('#lf-submit');
    await page.waitForURL(THANKS_RE, { timeout: 3000 });
    return reqs.length === 1 && label.includes('Enviando') && disabled;
  }),

  'P5 obrigado: noindex; sem r, guia sem aviso; requisito (R3)': (b, u) => scenario(b, u.replace(/$/, '-obrigado'), json(200, { ok: true }), async page =>
    await page.getAttribute('meta[name="robots"]', 'content') === 'noindex'
    && await notices(page) === 'false,false' && await visible(page, '#guia') && (await page.$$('[data-cmd]')).length >= 8
    && await visible(page, '#guideReq') && /plano pago/.test(await page.textContent('#guideReq')) && /EAOAB/.test(await page.textContent('#guideReq'))),

  'P4 obrigado: abas por teclado': (b, u) => scenario(b, u.replace(/$/, '-obrigado'), json(200, { ok: true }), async page => {
    await page.focus('#tab-mac'); await page.keyboard.press('ArrowRight');
    return await visible(page, '#panel-win') && !(await visible(page, '#panel-mac'))
      && await page.evaluate(() => document.activeElement.id === 'tab-win');
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

  'P4 375px: sem scroll horizontal (landing e obrigado)': (b, u) => scenario(b, u, json(200, { ok: true }), async page => {
    const w1 = await page.evaluate(() => document.documentElement.scrollWidth);
    await fill(page);
    if (!(await submitTo(page, 'ok'))) return false;
    const w2 = await page.evaluate(() => document.documentElement.scrollWidth);
    return w1 <= 375 && w2 <= 375;
  }, { viewport: { width: 375, height: 800 } }),
};

// P7 roda num browser próprio: o Playwright desliga o bfcache por padrão (--disable-back-forward-cache),
// e o chrome-headless-shell não tem bfcache. PW_CHROME_FULL: executável do Chrome for Testing.
async function p7(url) {
  if (!process.env.PW_CHROME_FULL) throw new Error('PW_CHROME_FULL ausente');
  const b = await chromium.launch({ executablePath: process.env.PW_CHROME_FULL, ignoreDefaultArgs: ['--disable-back-forward-cache'],
    // Sem rede externa: o iframe do Pinterest que o GTM injeta tira a página do bfcache.
    args: ['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
  try {
    const page = await (await b.newContext()).newPage();
    await page.addInitScript(() => addEventListener('pageshow', e => { window.__persisted = e.persisted; }));
    await page.goto(url);
    await fill(page);
    if (!(await submitTo(page, 'erro'))) return false;
    // Restauração do bfcache não dispara load: espera só o commit.
    await page.goBack({ waitUntil: 'commit' });
    await page.waitForFunction(() => window.__persisted === true, null, { timeout: 5000 }).catch(() => {});
    // Sem bfcache o teste não prova nada: falha em vez de passar.
    if (!(await page.evaluate(() => window.__persisted))) throw new Error('bfcache não restaurou a página');
    return await page.isEnabled('#lf-submit') && (await page.textContent('#lf-submit')).includes('Receber os agentes');
  } finally { await b.close(); }
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const url = `http://127.0.0.1:${server.address().port}/agentes-juridicos`;
  // PW_CHROME: executável do Chromium, quando o cache tem outro build que o do pacote.
  const launch = process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {};
  const browser = await chromium.launch(launch);
  cases['P7 Voltar da obrigado (bfcache): botão habilitado'] = () => p7(url);
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
