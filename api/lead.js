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
  'site-agentes-juridicos': 'agents_escritorio_adv',
};

// Landing agentes-juridicos: qualification form. Enum-validated here; the
// browser's values are never trusted, and `qualificacao` is computed server-side.
const QUALIFY_SOURCE = 'site-agentes-juridicos';
const QUALIFY_ENUMS = {
  cargo: ['socio', 'advogado', 'secretaria', 'estagiario', 'juridico_empresa', 'estudante'],
  porte: ['solo', '2', '3_10', '11_30', '30_mais'],
  whatsapp_quem: ['socio', 'equipe', 'sem_responsavel', 'nao_atende'],
  fora_horario: ['na_hora', 'dia_seguinte', 'demora_dias'],
  cobranca: ['socio', 'equipe', 'sistema', 'ninguem'],
  sistema: ['software_juridico', 'planilha', 'agenda_papel', 'nenhum'],
  a_receber: ['sei', 'mais_ou_menos', 'nao_sei'],
  dor_principal: ['whatsapp', 'cliente_esfria', 'cobranca', 'sistemas', 'numeros', 'pecas'],
};
const QUALIFY_AREAS = ['trabalhista', 'previdenciario', 'familia', 'consumidor', 'civel',
  'criminal', 'tributario', 'empresarial', 'imobiliario'];
// ICP derivado de prospeccao-escritorios.md (fonte executável é esta): 3–30 pessoas, Niterói,
// área de volume de pessoa física.
const ICP_PORTES = ['3_10', '11_30'];
const ICP_AREAS = ['trabalhista', 'previdenciario', 'familia', 'consumidor'];
// "Niterói", "Niteroi - RJ", "Icaraí, Niterói": the word niteroi anywhere in the city text.
const isIcpCity = c => /\bniteroi\b/.test(String(c || '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase());

// Returns the 10 form fields (normalized) plus `qualificacao`.
function qualify(body) {
  const f = {};
  for (const [k, allowed] of Object.entries(QUALIFY_ENUMS)) {
    f[k] = allowed.includes(body[k]) ? body[k] : null;
  }
  const raw = Array.isArray(body.areas) ? body.areas : String(body.areas || '').split(',');
  const areas = raw.map(a => String(a).trim()).filter(a => QUALIFY_AREAS.includes(a));
  f.areas = areas.length ? areas.join(',') : null;
  f.cidade = String(body.cidade || '').trim().slice(0, 80) || null;
  if (['juridico_empresa', 'estudante'].includes(f.cargo) || f.whatsapp_quem === 'nao_atende') {
    f.qualificacao = 'descartado';
  } else if (ICP_PORTES.includes(f.porte) && f.whatsapp_quem
    && areas.some(a => ICP_AREAS.includes(a)) && isIcpCity(f.cidade)) {
    f.qualificacao = 'qualificado';
  } else {
    f.qualificacao = 'nao_qualificado';
  }
  return f;
}

// Best-effort push to RD Station Marketing. A failure is logged but does not
// prevent the other capture destination from receiving the lead.
async function sendToRD({ name, email, phone, body, cf }) {
  const token = process.env.RD_TOKEN;
  if (!token) return false;
  const ok = await postRD(token, { name, email, phone, body, cf });
  // A cf_* field missing in RD may reject the whole conversion: retry once without them.
  if (ok === 400 && cf) return (await postRD(token, { name, email, phone, body })) === true;
  return ok === true;
}

// Returns true on success, the HTTP status on an RD error, false on a network error.
async function postRD(token, { name, email, phone, body, cf }) {
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
            ...cf,
          },
        }),
      },
    );
    clearTimeout(t);
    if (!r.ok) {
      console.error('lead: RD conversion returned', r.status);
      return r.status;
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
  // utm_* reach Core variables and RD traffic_*: coerce to bounded strings.
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (body[k] != null) body[k] = String(body[k]).slice(0, 120);
  }

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
  let cf;
  if (payload.source === QUALIFY_SOURCE) {
    const q = qualify(body);
    Object.assign(payload, q);
    // Core drops a repeated idempotencyKey while its outbox event exists: keep this form's
    // run separate from a conversion the same person made on another page.
    payload.idempotencyKey = `${phone}:${email}:${QUALIFY_SOURCE}`;
    cf = Object.fromEntries(Object.entries(q).map(([k, v]) => [`cf_${k}`, v === null ? undefined : v]));
  }

  // Core and RD are independent destinations, sent in parallel: one outage or slowness
  // must not block or delay the other.
  const [core, rd] = await Promise.allSettled([
    sendToCore(base, token, payload),
    sendToRD({ name, email, phone, body, cf }),
  ]);
  const coreOk = core.status === 'fulfilled' && core.value;
  const rdOk = rd.status === 'fulfilled' && rd.value;
  if (!coreOk && !rdOk) {
    return res.status(502).json({ ok: false, error: 'Não consegui registrar agora. Tente pelo WhatsApp.' });
  }
  return res.status(200).json({ ok: true });
};

async function sendToCore(base, token, payload) {
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
  return coreOk;
}
