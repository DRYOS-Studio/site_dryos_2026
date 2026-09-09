// Lead capture → DRYOS Core (WEBHOOK_INBOUND automation).
// Server-side only: the webhook token lives in env (never reaches the browser).
//
// Required Vercel env vars (Project → Settings → Environment Variables):
//   CORE_API_BASE       e.g. https://api.chat.dryos.com.br   (no trailing slash, no /api/v1)
//   CORE_WEBHOOK_TOKEN  the raw token of a WEBHOOK_INBOUND automation in the target org
// Optional:
//   RD_TOKEN            RD Station Marketing "Token público da API" → registers the
//                       conversion in RD Station Marketing. If unset, RD is skipped.
//
// The Core endpoint is POST {CORE_API_BASE}/api/v1/webhooks/automation/{TOKEN}.
// Reserved body fields consumed by Core: phone, email, idempotencyKey.
// Everything else (name, source, utm_*) lands in the automation's variables.webhook.*

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Allowlist: page source → RD Station conversion_identifier. Keeps each landing
// page's conversions separate in RD without letting the browser pick the value.
const RD_IDENTIFIERS = {
  'site-dryos-diagnostico': 'diagnostico-site',
  'site-apresentacao-core': 'apresentacao-core',
  'site-automacoes': 'automacoes',
};

// Best-effort push to RD Station Marketing. A failure is logged but does not
// prevent the other capture destination from receiving the lead.
async function sendToRD({ name, email, phone, body }) {
  const token = process.env.RD_TOKEN;
  if (!token) return false;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    const r = await fetch(
      `https://api.rd.services/platform/conversions?api_key=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          event_type: 'CONVERSION',
          event_family: 'CDP',
          payload: {
            conversion_identifier: RD_IDENTIFIERS[body.source] || 'apresentacao-core',
            name,
            email,
            mobile_phone: phone ? `+${phone}` : undefined,
            traffic_source: body.utm_source || undefined,
            traffic_medium: body.utm_medium || undefined,
            traffic_campaign: body.utm_campaign || undefined,
          },
        }),
      },
    );
    clearTimeout(t);
    if (!r.ok) {
      console.error('lead: RD conversion returned', r.status);
      return false;
    }
    return true;
  } catch (e) {
    console.error('lead: error posting to RD', e && e.message);
    return false;
  }
}

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
    spark: String(body.spark || '').slice(0, 40) || null,
    cargo: String(body.cargo || '').slice(0, 120) || null,
    produto_interesse: String(body.produto_interesse || '').slice(0, 80) || null,
    faturamento_mensal: String(body.faturamento_mensal || '').slice(0, 80) || null,
    utm_source: body.utm_source || null,
    utm_medium: body.utm_medium || null,
    utm_campaign: body.utm_campaign || null,
    utm_content: body.utm_content || null,
    utm_term: body.utm_term || null,
  };

  let coreOk = false;
  if (base && token) {
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
      coreOk = r.ok;
      if (!coreOk) console.error('lead: Core webhook returned', r.status);
    } catch (e) {
      console.error('lead: error posting to Core', e && e.message);
    }
  } else {
    console.error('lead: missing CORE_API_BASE or CORE_WEBHOOK_TOKEN env');
  }

  // RD is an independent destination: a Core outage must not block conversion capture.
  const rdOk = await sendToRD({ name, email, phone, body });
  if (!coreOk && !rdOk) {
    return res.status(502).json({ ok: false, error: 'Não consegui registrar agora. Tente pelo WhatsApp.' });
  }
  return res.status(200).json({ ok: true });
};
