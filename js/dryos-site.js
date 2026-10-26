/**
 * Atribuição (UTM) + eventos no dataLayer (GTM-KS9H2KN).
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

  function trackDiagnosticoCta(extra) {
    pushDataLayer(Object.assign({
      event: 'cta_click',
      form_id: 'diagnostico-cta'
    }, extra || {}));
  }

  function trackDiagnosticoFormSubmit(extra) {
    pushDataLayer(Object.assign({
      event: 'generate_lead',
      form_id: 'diagnostico-site'
    }, extra || {}));
  }

  function trackWhatsappClick(extra) {
    pushDataLayer(Object.assign({
      event: 'whatsapp_click',
      form_id: 'whatsapp-site'
    }, extra || {}));
  }

  function isDiagnosticoCtaLink(el) {
    if (!el || el.tagName !== 'A') return false;
    var href = el.getAttribute('href') || '';
    if (href.indexOf('diagnostico-form') !== -1 || href.indexOf('#diagnostico') !== -1) {
      return true;
    }
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
    var diagnosticFormStarted = false;
    document.addEventListener('focusin', function (ev) {
      var form = ev.target && ev.target.closest ? ev.target.closest('#dryos-diagnostico-form') : null;
      if (!form || diagnosticFormStarted) return;
      diagnosticFormStarted = true;
      pushDataLayer({ event: 'form_start', form_id: 'diagnostico-site' });
    }, true);

    document.addEventListener('click', function (ev) {
      var link = ev.target && ev.target.closest ? ev.target.closest('a') : null;
      if (!link) return;
      var route = link.getAttribute('data-route');
      if (route) pushDataLayer({ event: 'route_select', route: route, link_url: link.href });
      if (isWhatsappLink(link)) {
        trackWhatsappClick({ link_url: link.href });
        return;
      }
      if (isDiagnosticoCtaLink(link)) {
        trackDiagnosticoCta({ link_url: link.href });
      }
    }, true);
  }

  function bindMobileMenu() {
    var menuBtn = document.getElementById('menuToggle');
    var drawer = document.getElementById('mobileDrawer');
    if (!menuBtn || !drawer) return;
    menuBtn.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function bindServicesMenu() {
    var servicesBtn = document.getElementById('servicesMenuBtn');
    var dropdown = document.getElementById('servicesDropdown');
    if (servicesBtn && dropdown) {
      servicesBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var open = dropdown.hasAttribute('hidden');
        if (open) {
          dropdown.removeAttribute('hidden');
          servicesBtn.setAttribute('aria-expanded', 'true');
        } else {
          dropdown.setAttribute('hidden', '');
          servicesBtn.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('click', function () {
        dropdown.setAttribute('hidden', '');
        servicesBtn.setAttribute('aria-expanded', 'false');
      });
      dropdown.addEventListener('click', function (ev) {
        ev.stopPropagation();
      });
    }

    var drawerBtn = document.getElementById('drawerServicesBtn');
    var drawerPanel = document.getElementById('drawerServicesPanel');
    if (drawerBtn && drawerPanel) {
      drawerBtn.addEventListener('click', function () {
        var open = drawerPanel.hasAttribute('hidden');
        if (open) {
          drawerPanel.removeAttribute('hidden');
          drawerBtn.setAttribute('aria-expanded', 'true');
        } else {
          drawerPanel.setAttribute('hidden', '');
          drawerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  captureTracking();
  function onReady() {
    bindConversionListeners();
    bindMobileMenu();
    bindServicesMenu();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  window.dryosTrackDiagnosticoFormSubmit = trackDiagnosticoFormSubmit;
  window.dryosTrackGenerateLead = function (formId, extra) {
    pushDataLayer(Object.assign({ event: 'generate_lead', form_id: formId }, extra || {}));
  };
})();
