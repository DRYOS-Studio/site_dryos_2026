(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var nav = document.querySelector('nav');
  var progress = document.createElement('div');
  var heroVisual = document.querySelector('.hero-visual');
  var hero = document.querySelector('.hero');
  var scene = document.querySelector('.spotlight-core');
  var sceneMap = document.querySelector('.operational-map');
  var scenePillars = scene ? scene.querySelectorAll('.pillar') : [];
  var ticking = false;
  var sectionObserver;

  progress.className = 'dryos-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  root.classList.add('motion-ready');

  function updateScrollState() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var amount = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, amount)) + ')';
    if (heroVisual && window.innerWidth > 768) {
      heroVisual.style.setProperty('--hero-shift', Math.min(window.scrollY * -0.08, 42) + 'px');
    }
    if (scene && sceneMap) {
      var sceneRect = scene.getBoundingClientRect();
      var sceneRange = Math.max(1, sceneRect.height - window.innerHeight * 0.28);
      var sceneProgress = Math.max(0, Math.min(1, (window.innerHeight * 0.72 - sceneRect.top) / sceneRange));
      sceneMap.style.setProperty('--map-progress', sceneProgress);
      var activePillar = Math.min(scenePillars.length - 1, Math.floor(sceneProgress * scenePillars.length));
      scenePillars.forEach(function (pillar, index) {
        pillar.classList.toggle('is-scene-active', index === activePillar && sceneProgress > 0.08);
      });
    }
    if (nav) nav.classList.toggle('motion-scrolled', window.scrollY > 12);
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    }
  }

  if (!reduce) {
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate, { passive: true });
  }

  if (!reduce && hero && window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
      var y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      hero.style.setProperty('--hero-pointer-x', x.toFixed(2) + 'px');
      hero.style.setProperty('--hero-pointer-y', y.toFixed(2) + 'px');
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-pointer-x', '0px');
      hero.style.setProperty('--hero-pointer-y', '0px');
    });
  }

  if (!reduce && window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-primary, .nav-cta, .core-card-cta, .spark-cta-card').forEach(function (target) {
      target.classList.add('motion-magnetic');
      target.addEventListener('pointermove', function (event) {
        var rect = target.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.08;
        target.style.setProperty('--magnet-x', x.toFixed(2) + 'px');
        target.style.setProperty('--magnet-y', y.toFixed(2) + 'px');
      }, { passive: true });
      target.addEventListener('pointerleave', function () {
        target.style.setProperty('--magnet-x', '0px');
        target.style.setProperty('--magnet-y', '0px');
      });
    });
  }

  document.querySelectorAll('.section-header, .manifesto-text').forEach(function (item) {
    item.classList.add('reveal');
  });
  document.querySelectorAll('.steps, .proof-stats').forEach(function (item) {
    item.setAttribute('data-motion-sequence', '');
  });

  var revealItems = document.querySelectorAll('.reveal, [data-motion-sequence]');
  var projectItems = document.querySelectorAll('.project-detail-grid');
  var map = document.querySelector('.operational-map');
  if (reduce || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible', 'in');
    });
    projectItems.forEach(function (item) { item.classList.add('is-visible'); });
    if (map) map.classList.add('is-visible');
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible', 'in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (item) { observer.observe(item); });
    projectItems.forEach(function (item) { observer.observe(item); });
    if (map) observer.observe(map);
  }

  var sectionLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  var sections = sectionLinks.map(function (link) {
    var target = document.getElementById(link.getAttribute('href').slice(1));
    return target ? { link: link, target: target } : null;
  }).filter(Boolean);

  function setActiveSection(target) {
    sections.forEach(function (item) {
      var active = item.target === target;
      item.link.classList.toggle('motion-active', active);
      if (active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }

  if (sections.length && !reduce && 'IntersectionObserver' in window) {
    sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveSection(entry.target);
      });
    }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
    sections.forEach(function (item) { sectionObserver.observe(item.target); });
  }

  updateScrollState();
})();
