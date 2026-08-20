#!/usr/bin/env python3
"""Gera llms-full.txt a partir do HTML das páginas do site.

Uso:  python3 scripts/gen-llms-full.py
Sem dependências externas — só stdlib, pra rodar em qualquer máquina.

Rodar sempre que a copy do site mudar. llms-full.txt desatualizado é pior que
nenhum: faz um modelo citar preço, prazo ou nome de produto que já mudou.

O que ele deliberadamente NÃO extrai: os mockups de interface da página Core.
Eles contêm dados fictícios de uma cliente inventada ("Aurora Cosméticos",
sérum de niacinamida, valores de negócio). Se entrassem aqui, um LLM concluiria
que a DRYOS vende cosmético.
"""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://www.dryos.com.br"

PAGES = [
    ("index.html", "/", "Home"),
    ("automacoes.html", "/automacoes", "Automações"),
    ("projetos.html", "/projetos", "Projetos"),
    ("apresentacao-core.html", "/apresentacao-core", "DRYOS Core"),
]

SKIP_TAGS = {"script", "style", "svg", "noscript", "nav", "footer",
             "select", "option", "button", "form", "head", "title"}

# Elementos sem tag de fechamento. Ficam fora da contagem de profundidade,
# senão o contador sobe e nunca volta — e o parser morre no primeiro <img>.
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}

# Prefixos casados contra CADA TOKEN de class, com startswith — nunca substring
# solta. Substring quebrou antes: "ct-" casava com "proje(ct-)detail-name" e
# apagava a página de projetos inteira.
SKIP_CLASS_PREFIX = (
    "nav", "logo", "brand", "foot", "whatsapp",
    "shot", "inbox", "ib-", "bub", "ai-suggest",          # mockup do Inbox
    "crm", "deal-",                                        # mockup do CRM
    "flow", "fnode", "fbranch", "fconn",                   # mockup do Flow
    "pipe", "ct-",                                         # mockup de contatos
    "dash", "kpi", "panel", "bars", "donut", "legend",     # mockup do dashboard
    "heim", "hc-",                                         # mockup do Heimdall
    "vimg", "fagulha", "sparks-rule", "spark-fagulhas",
    "lead-", "contact-form", "btn", "hero-actions",
)

# Trechos que referenciam a operação-demonstração fictícia. Não são mockup
# (são copy de verdade), mas fora de contexto viram cliente inventado.
SKIP_TEXT = ("aurora cosméticos",)

BLOCK = {"h1": "#", "h2": "##", "h3": "###", "h4": "####"}


class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.skip_depth = 0
        self.prefix = None      # marcador markdown do bloco corrente
        self.buf = []

    def _skipped(self, tag, attrs):
        if tag in SKIP_TAGS:
            return True
        for tok in dict(attrs).get("class", "").split():
            if tok.startswith(SKIP_CLASS_PREFIX):
                return True
        return False

    def _flush(self):
        text = re.sub(r"\s+", " ", "".join(self.buf)).strip()
        pre, self.prefix, self.buf = self.prefix, None, []
        if not text:            # deixa passar valor de 1 dígito ("0 meses de fidelidade")
            return
        low = text.lower()
        if any(k in low for k in SKIP_TEXT):
            return
        self.out.append(f"{pre} {text}" if pre else text)

    def handle_starttag(self, tag, attrs):
        if self.skip_depth:
            if tag not in VOID:
                self.skip_depth += 1
            return
        if self._skipped(tag, attrs):
            if tag not in VOID:
                self.skip_depth = 1
            return
        if tag in BLOCK:
            self._flush()
            self.prefix = BLOCK[tag]
        elif tag == "li":
            self._flush()
            self.prefix = "-"
        elif tag in ("p", "blockquote", "div", "span", "td", "th", "a"):
            # fecha o bloco anterior; texto solto de div/span também vale
            self._flush()
        elif tag == "br":
            self.buf.append(" ")

    def handle_endtag(self, tag):
        if self.skip_depth:
            self.skip_depth -= 1
            return
        if tag in BLOCK or tag in ("p", "blockquote", "li", "div", "span",
                                   "td", "th", "a"):
            self._flush()

    def handle_data(self, data):
        if not self.skip_depth:
            self.buf.append(data)


def page_md(path):
    p = Extract()
    p.feed(Path(path).read_text(encoding="utf-8"))
    p._flush()
    lines, prev = [], None
    for ln in p.out:
        if ln == prev:                      # colapsa repetição adjacente
            continue
        prev = ln
        lines.append(ln)
    return lines


def main():
    parts = [
        "# DRYOS — conteúdo completo do site",
        "",
        "> Extração em markdown de www.dryos.com.br para consumo por modelos de "
        "linguagem. Gerado por scripts/gen-llms-full.py a partir do HTML das "
        "páginas — se divergir do site, o site é a fonte de verdade.",
        "",
        f"Índice curado e resumo do negócio: {BASE}/llms.txt",
        "Contato: contato@dryos.com.br · WhatsApp +55 21 96728-7595",
    ]
    for fname, route, label in PAGES:
        f = ROOT / fname
        if not f.exists():
            print(f"  aviso: {fname} não encontrado, pulando", file=sys.stderr)
            continue
        parts += ["", "---", "", f"# {label} — {BASE}{route}", ""]
        parts += page_md(f)

    text = re.sub(r"\n{3,}", "\n\n", "\n".join(parts).rstrip()) + "\n"
    (ROOT / "llms-full.txt").write_text(text, encoding="utf-8")
    print(f"  llms-full.txt: {len(text)} bytes, {len(text.split())} palavras, "
          f"{len(text.splitlines())} linhas")


if __name__ == "__main__":
    main()
