#!/usr/bin/env node
/**
 * Injeta partials/site-nav.html e partials/site-footer.html entre marcadores.
 * Uso: node scripts/sync-site-chrome.js [--home]
 * --home: links de diagnóstico apontam para #diagnostico-form (só index.html)
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const NAV_TMPL = fs.readFileSync(path.join(ROOT, 'partials/site-nav.html'), 'utf8');
const FOOT = fs.readFileSync(path.join(ROOT, 'partials/site-footer.html'), 'utf8');

const FILES = [
  'index.html',
  'funcionarios-digitais.html',
  'projetos.html',
  'automacoes.html',
  'parceiros.html',
  'privacidade.html',
  'sobre.html',
  'dryos-os.html',
  'estruturacao-de-processos.html',
  'automacoes.html',
  'infraestrutura.html',
  'studio.html',
  'clientes.html',
  'contato.html',
];

const NAV_START = '<!-- SITE-CHROME-NAV START -->';
const NAV_END = '<!-- SITE-CHROME-NAV END -->';
const FOOT_START = '<!-- SITE-CHROME-FOOTER START -->';
const FOOT_END = '<!-- SITE-CHROME-FOOTER END -->';

function navFor(isHome) {
  const href = isHome ? '#diagnostico-form' : '/contato#diagnostico-form';
  return NAV_TMPL.replace(/\{\{DIAGNOSTICO_HREF\}\}/g, href);
}

function syncFile(rel, isHome) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const nav = navFor(isHome);
  if (html.includes(NAV_START)) {
    html = html.replace(new RegExp(`${NAV_START}[\\s\\S]*?${NAV_END}`), `${NAV_START}\n${nav}\n${NAV_END}`);
  } else {
    console.warn(`SKIP nav markers: ${rel}`);
  }
  if (html.includes(FOOT_START)) {
    html = html.replace(new RegExp(`${FOOT_START}[\\s\\S]*?${FOOT_END}`), `${FOOT_START}\n${FOOT}\n${FOOT_END}`);
  } else {
    console.warn(`SKIP footer markers: ${rel}`);
  }
  fs.writeFileSync(file, html);
  console.log(`synced ${rel}`);
}

for (const rel of [...new Set(FILES)]) {
  syncFile(rel, rel === 'index.html');
}
