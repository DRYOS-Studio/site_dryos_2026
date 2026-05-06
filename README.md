# DRYOS — Site Institucional

Site institucional da DRYOS Growth Systems. HTML estático, sem build step, sem dependências.

## Estrutura

```
dryos-deploy/
├── index.html       # Home — hero, vilões, Core, Spark, Studio, projetos, clientes, contato
├── projetos.html    # Portfolio detalhado (5 projetos)
├── vercel.json      # Config básica de headers de segurança
└── README.md        # Este arquivo
```

## Deploy no Vercel

### Opção 1 — Drag & Drop (mais rápido, ~2 min)

1. Acesse https://vercel.com/new
2. Arraste a pasta `dryos-deploy` inteira para a área de upload
3. Clique em **Deploy**
4. Pronto. Vercel te dá uma URL tipo `dryos-xyz.vercel.app`

### Opção 2 — Git (recomendado pra produção)

1. Crie um repo no GitHub: `github.com/seu-user/dryos-site`
2. Faça push da pasta `dryos-deploy` como root do repo
3. No Vercel: **Add New → Project → Import** o repo
4. Cada `git push` faz deploy automático

### Domínio customizado

Após deploy, em **Settings → Domains** do Vercel, adicione `dryos.com.br`. Vercel te dá o registro DNS pra apontar no seu registrador (Registro.br ou similar).

---

## Checklist antes de publicar

Antes de mandar o link pra prospect, troque os placeholders:

- [ ] **WhatsApp** — `index.html` linha do `wa.me/5500000000000` → trocar pelo seu número real (formato: 55 + DDD + número, sem espaços)
- [ ] **Email** — confirmar/trocar `hello@dryos.com.br`
- [ ] **LinkedIn** — trocar `/company/dryos` pela URL real (ou remover o link se ainda não criou a página)
- [ ] **Form RD Station** — substituir o bloco `<div class="contact-form-placeholder">...</div>` pelo embed do RD Station Marketing
- [ ] **Anos** — todos os projetos estão como 2024; ajustar onde for necessário
- [ ] **Descrições dos projetos** — refinar com os textos reais (Eventmetrics, Casa Financeira, DeMarchi, Kratos Content)

---

## Manutenção

Como o site é HTML estático puro, qualquer editor de texto serve pra mexer. Não tem build step, não tem dependência. Edita, salva, dá push — Vercel publica.

Se quiser adicionar uma 3ª página depois (ex: `/sobre.html`, `/blog.html`), é só criar o arquivo na raiz da pasta. O design system já está autocontido em cada arquivo.

---

DRYOS Growth Systems — Crescimento com raiz.
