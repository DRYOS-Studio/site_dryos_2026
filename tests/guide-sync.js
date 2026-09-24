// G4: os comandos e o prompt de teste da página são os mesmos do README do plugin.
// Uso: node tests/guide-sync.js [README local | URL raw]  (default: raw do GitHub)
const fs = require('node:fs'); const path = require('node:path');
const SRC = process.argv[2] || 'https://raw.githubusercontent.com/DRYOS-Studio/agentes-juridicos/main/README.md';
const PAGE = process.argv[3] || path.join(__dirname, '..', 'agentes-juridicos.html');
const dec = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

(async () => {
  const md = /^https?:/.test(SRC) ? await (await fetch(SRC)).text() : fs.readFileSync(SRC, 'utf8');
  const html = fs.readFileSync(PAGE, 'utf8');
  const [before, rest = ''] = md.split('<!-- teste:inicio -->');
  const [testBlock = ''] = rest.split('<!-- teste:fim -->');
  const blocks = s => [...s.matchAll(/```\n([\s\S]*?)\n\s*```/g)].map(m => m[1].trim());
  const mdCmds = new Set(blocks(before.replace(/^ +/gm, '')));
  const mdPrompt = blocks(testBlock)[0] || '';
  const pageCmds = new Set([...html.matchAll(/<code data-cmd>([\s\S]*?)<\/code>/g)].map(m => dec(m[1]).trim()));
  const pagePrompt = dec((html.match(/<code data-prompt>([\s\S]*?)<\/code>/) || [])[1] || '').trim();
  const onlyMd = [...mdCmds].filter(c => !pageCmds.has(c)), onlyPage = [...pageCmds].filter(c => !mdCmds.has(c));
  let bad = 0;
  if (mdCmds.size < 8) { console.log(`G4 FAIL: README com só ${mdCmds.size} comandos`); bad++; }
  if (onlyMd.length || onlyPage.length) { console.log('G4 FAIL: comandos divergem', { onlyMd, onlyPage }); bad++; }
  if (!mdPrompt || mdPrompt !== pagePrompt) { console.log('G4 FAIL: prompt de teste diverge'); bad++; }
  if (!bad) console.log(`G4 ok: ${mdCmds.size} comandos + prompt de teste idênticos`);
  process.exit(bad ? 1 : 0);
})();
