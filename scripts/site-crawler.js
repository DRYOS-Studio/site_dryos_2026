#!/usr/bin/env node
/** Valida chrome e links internos lendo HTML do disco (cleanUrls como na Vercel). */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const ROUTES = [
  ['/', 'index.html'],
  ['/sobre', 'sobre.html'],
  ['/dryos-os', 'dryos-os.html'],
  ['/estruturacao-de-processos', 'estruturacao-de-processos.html'],
  ['/automacoes', 'automacoes.html'],
  ['/infraestrutura', 'infraestrutura.html'],
  ['/studio', 'studio.html'],
  ['/funcionarios-digitais', 'funcionarios-digitais.html'],
  ['/clientes', 'clientes.html'],
  ['/contato', 'contato.html'],
  ['/projetos', 'projetos.html'],
  ['/parceiros', 'parceiros.html'],
  ['/privacidade', 'privacidade.html'],
];

function extractHrefs(html) {
  const hrefs = [];
  const re = /href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) hrefs.push(m[1]);
  return hrefs;
}

function visibleParceirosLinks(html) {
  const violations = [];
  const re = /<a[^>]*href=["']([^"']*parceiros[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const inner = m[2].replace(/<[^>]+>/g, '').trim();
    if (inner) violations.push({ href: m[1], text: inner.slice(0, 80) });
  }
  return violations;
}

function resolveInternal(href) {
  const base = href.split('#')[0];
  if (!base || base.startsWith('mailto:') || base.startsWith('tel:') || base.startsWith('javascript:')) return null;
  if (/\.(css|svg|png|jpg|jpeg|webp|js|woff2?)$/i.test(base)) return null;
  if (base.startsWith('http')) {
    if (!base.includes('dryos.com.br')) return null;
    try {
      return new URL(base).pathname.replace(/\/$/, '') || '/';
    } catch (e) { return null; }
  }
  let p = base.split('?')[0];
  if (!p) p = '/';
  if (!p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

const routeSet = new Set(ROUTES.map(([r]) => r));
const report = { pages: [], violations: [], broken: [] };
let navRef = null;
let footRef = null;

for (const [route, file] of ROUTES) {
  const fp = path.join(ROOT, file);
  const body = fs.readFileSync(fp, 'utf8');
  const entry = {
    path: route,
    file,
    nav: body.includes('site-global-nav'),
    footer: body.includes('site-footer-unified'),
  };
  report.pages.push(entry);

  const navBlock = body.match(/<!-- SITE-CHROME-NAV START -->[\s\S]*?<!-- SITE-CHROME-NAV END -->/);
  const footBlock = body.match(/<!-- SITE-CHROME-FOOTER START -->[\s\S]*?<!-- SITE-CHROME-FOOTER END -->/);
  function normNav(s) {
    return s.replace(/href="[^"]*diagnostico-form[^"]*"/g, 'href="DIAGNOSTICO"');
  }
  if (navBlock) {
    const norm = normNav(navBlock[0]);
    if (!navRef) navRef = norm;
    else if (norm !== navRef) report.violations.push({ path: route, type: 'nav_mismatch' });
  } else if (route !== '/parceiros') {
    report.violations.push({ path: route, type: 'missing_nav_markers' });
  }
  if (footBlock) {
    if (!footRef) footRef = footBlock[0];
    else if (footBlock[0] !== footRef) report.violations.push({ path: route, type: 'footer_mismatch' });
  }

  if (route !== '/parceiros') {
    for (const v of visibleParceirosLinks(body)) {
      report.violations.push({ path: route, type: 'visible_parceiros_link', ...v });
    }
  }

  for (const href of extractHrefs(body)) {
    const internal = resolveInternal(href);
    if (!internal) continue;
    if (!routeSet.has(internal)) {
      report.broken.push({ from: route, href: internal });
    }
  }
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.violations.length || report.broken.length ? 1 : 0);
