// Inputs for the L5 snapshot: the three pre-existing sources.
const base = { name: 'Ana Lima', email: 'Ana@Ex.com', phone: '(21) 99999-0000',
  utm_source: 'g', utm_medium: 'cpc', utm_campaign: 'c', utm_content: 'x', utm_term: 't' };
module.exports = [
  { ...base, source: 'site-dryos-diagnostico', cargo: 'CEO', produto_interesse: 'automacoes', faturamento_mensal: '50k' },
  { ...base, source: 'site-apresentacao-core', cargo: 'Sócio' },
  { ...base, source: 'site-automacoes', spark: 'cobranca',
    // fields of the new form must NOT leak into legacy sources
    porte: '3_10', dor_principal: 'cobranca', qualificacao: 'qualificado' },
];
