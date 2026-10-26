#!/usr/bin/env node
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = '/opt/cursor/artifacts/menu-previews';
const PORT = 8777;
const PAGES = [
  ['home', '/'],
  ['sobre', '/sobre'],
  ['dryos-os', '/dryos-os'],
  ['estruturacao-de-processos', '/estruturacao-de-processos'],
  ['automacoes', '/automacoes'],
  ['infraestrutura', '/infraestrutura'],
  ['studio', '/studio'],
  ['clientes', '/clientes'],
  ['contato', '/contato'],
];

fs.mkdirSync(OUT, { recursive: true });

const server = spawn('npx', ['--yes', 'serve', ROOT, '-l', String(PORT), '--no-clipboard'], {
  stdio: 'ignore',
  cwd: ROOT,
});
await new Promise((r) => setTimeout(r, 3000));

const browser = await chromium.launch();
for (const [name, url] of PAGES) {
  for (const [tag, width, height] of [['1440', 1440, 900], ['390', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, `${name}-${tag}.png`), fullPage: true });
    await page.close();
  }
}
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desk.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
await desk.locator('#servicesMenuBtn').click();
await desk.locator('#servicesDropdown').waitFor({ state: 'visible' });
await desk.screenshot({ path: path.join(OUT, 'home-1440-dropdown-servicos.png'), fullPage: false });
await desk.close();

const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
await mob.locator('#menuToggle').click();
await mob.locator('#drawerServicesBtn').click();
await mob.screenshot({ path: path.join(OUT, 'home-390-drawer-servicos.png'), fullPage: false });
await mob.close();

await browser.close();
server.kill();
console.log('saved to', OUT);
