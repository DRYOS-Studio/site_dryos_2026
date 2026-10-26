/**
 * Atribuição (UTM) + eventos de conversão no dataLayer (GTM-KS9H2KN).
 * Mesmos nomes de evento em home, /funcionarios-digitais e /parceiros.
 */
(function () {
  var TRACKING_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'gclid', 'fbclid'
  ];

  function captureTracking() {
    var params = new URLSearchParams(window.location.search);
    TRACKING_KEYS.forEach(function (key) {
      var val = params.get(key);
      if (val) sessionStorage.setItem('dryos_' + key, val);
    });
    if (!sessionStorage.getItem('dryos_referrer_origin') && document.referrer) {
      try {
        var refHost = new URL(document.referrer).hostname;
        if (refHost && refHost !== window.location.hostname) {
          sessionStorage.setItem('dryos_referrer_origin', document.referrer);
        }
      } catch (e) { /* referrer inválido */ }
    }
    if (!sessionStorage.getItem('dryos_landing_page')) {
      sessionStorage.setItem('dryos_landing_page', window.location.href);
    }
  }

  function pushDataLayer(payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (e) { /* GTM indisponível */ }
  }

  /** CTA “Diagnóstico gratuito de 30 min” (clique). */
  function trackDiagnosticoCta(extra) {
    pushDataLayer(Object.assign({
      event: 'generate_lead',
      form_id: 'diagnostico-cta'
    }, extra || {}));
  }

  /** Envio ok do formulário de diagnóstico na home (RD: diagnostico-site). */
  function trackDiagnosticoFormSubmit(extra) {
    pushDataLayer(Object.assign({
      event: 'generate_lead',
      form_id: 'diagnostico-site'
    }, extra || {}));
  }

  /** Clique no WhatsApp flutuante ou link wa.me/5521967287595. */
  function trackWhatsappClick(extra) {
    pushDataLayer(Object.assign({
      event: 'generate_lead',
      form_id: 'whatsapp-site'
    }, extra || {}));
  }

  function isDiagnosticoCtaLink(el) {
    if (!el || el.tagName !== 'A') return false;
    var href = el.getAttribute('href') || '';
    if (href.indexOf('diagnostico-form') !== -1 || href.indexOf('#diagnostico') !== -1) {
      return true;
    }
    if (href.indexOf('data-diagnostico') !== -1) return true;
    var text = (el.textContent || '').toLowerCase();
    return text.indexOf('diagnóstico gratuito') !== -1;
  }

  function isWhatsappLink(el) {
    if (!el || el.tagName !== 'A') return false;
    if (el.classList.contains('whatsapp-float')) return true;
    var href = el.getAttribute('href') || '';
    return href.indexOf('wa.me/5521967287595') !== -1;
  }

  function bindConversionListeners() {
    document.addEventListener('click', function (ev) {
      var link = ev.target && ev.target.closest ? ev.target.closest('a') : null;
      if (!link) return;
      if (isWhatsappLink(link)) {
        trackWhatsappClick({ link_url: link.href });
        return;
      }
      if (isDiagnosticoCtaLink(link)) {
        trackDiagnosticoCta({ link_url: link.href });
      }
    }, true);
  }

  captureTracking();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindConversionListeners);
  } else {
    bindConversionListeners();
  }

  window.dryosTrackDiagnosticoFormSubmit = trackDiagnosticoFormSubmit;
  window.dryosTrackGenerateLead = function (formId, extra) {
    pushDataLayer(Object.assign({ event: 'generate_lead', form_id: formId }, extra || {}));
  };
})();
