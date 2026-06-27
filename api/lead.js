// Lead capture → DRYOS Core (WEBHOOK_INBOUND automation).
// Server-side only: the webhook token lives in env (never reaches the browser).
//
// Required Vercel env vars (Project → Settings → Environment Variables):
//   CORE_API_BASE       e.g. https://api.chat.dryos.com.br   (no trailing slash, no /api/v1)
//   CORE_WEBHOOK_TOKEN  the raw token of a WEBHOOK_INBOUND automation in the target org
//
// The Core endpoint is POST {CORE_API_BASE}/api/v1/webhooks/automation/{TOKEN}.
// Reserved body fields consumed by Core: phone, email, idempotencyKey.
// Everything else (name, source, utm_*) lands in the automation's variables.webhook.*

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// BR-friendly phone normalization: digits only; prefix country code 55 for 10–11 digit locals.
function normalizePhoneBR(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if ((d.length === 10 || d.length === 11) && !d.startsWith('55')) d = '55' + d;
  return d;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const base = process.env.CORE_API_BASE;
  const token = process.env.CORE_WEBHOOK_TOKEN;
  if (!base || !token) {
    console.error('lead: missing CORE_API_BASE or CORE_WEBHOOK_TOKEN env');
    return res.status(500).json({ ok: false, error: 'Configuração indisponível. Tente pelo WhatsApp.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: real users never fill this hidden field. Pretend success for bots.
  if (body.company) return res.status(200).json({ ok: true });

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 160);
  const phone = normalizePhoneBR(body.phone);

  if (!name || name.length < 2) return res.status(400).json({ ok: false, error: 'Informe seu nome.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: 'E-mail inválido.' });
  if (phone.length < 12) return res.status(400).json({ ok: false, error: 'WhatsApp inválido (com DDD).' });

  const payload = {
    phone,
    email,
    idempotencyKey: `${phone}:${email}`,
    name,
    source: String(body.source || 'site-apresentacao-core').slice(0, 80),
    utm_source: body.utm_source || null,
    utm_medium: body.utm_medium || null,
    utm_campaign: body.utm_campaign || null,
    utm_content: body.utm_content || null,
    utm_term: body.utm_term || null,
  };

  try {
    const url = `${base.replace(/\/+$/, '')}/api/v1/webhooks/automation/${token}`;
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10000);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(t);
    if (!r.ok) {
      console.error('lead: Core webhook returned', r.status);
      return res.status(502).json({ ok: false, error: 'Não consegui registrar agora. Tente pelo WhatsApp.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('lead: error posting to Core', e && e.message);
    return res.status(502).json({ ok: false, error: 'Falha de conexão. Tente novamente.' });
  }
};
