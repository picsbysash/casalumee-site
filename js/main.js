/* ==========================================================================
   Casa Lumee — main.js
   - Mobile nav toggle
   - Service card hover/click expand
   - FAQ accordion
   - Reveal-on-scroll (IntersectionObserver)
   - Year stamp
   - EN/ES language toggle (data-lang on <html>; spans toggled by CSS)
   - A-la-carte add-on selector + contact form integration
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Year stamp ---- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // close when a link is clicked (mobile)
    links.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Services: click to switch detail panel ---- */
  const cards = document.querySelectorAll('.service-card');
  const details = document.querySelectorAll('.service-detail');

  function activateService(name) {
    cards.forEach((c) => {
      const active = c.dataset.service === name;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-pressed', String(active));
    });
    details.forEach((d) => {
      d.classList.toggle('is-open', d.dataset.detail === name);
    });
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => activateService(card.dataset.service));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateService(card.dataset.service);
      }
    });
    // hover preview on desktop
    card.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        activateService(card.dataset.service);
      }
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---- Reveal on scroll ---- */
  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveal.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
    );
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add('is-in'));
  }

  /* ---- EN/ES language toggle ----
     Default = en. Persists choice in localStorage. Also reads ?lang=es from URL for share-links. */
  const langButtons = document.querySelectorAll('[data-lang-set]');
  const root = document.documentElement;

  function applyLang(lang) {
    const next = lang === 'es' ? 'es' : 'en';
    root.setAttribute('data-lang', next);
    root.setAttribute('lang', next === 'es' ? 'es' : 'en');

    // Toggle the `hidden` HTML attribute on every lang span.
    // (The `hidden` attribute is a UA-level display:none that we set in HTML
    //  for first-paint correctness — but it persists and overrides CSS,
    //  so we have to flip it explicitly when language changes.)
    document.querySelectorAll('.lang-en').forEach(el => { el.hidden = (next !== 'en'); });
    document.querySelectorAll('.lang-es').forEach(el => { el.hidden = (next !== 'es'); });

    langButtons.forEach((btn) => {
      const active = btn.dataset.langSet === next;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('cc-lang', next); } catch (e) {}
  }

  function initLang() {
    let initial = 'en';
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('lang') === 'es') initial = 'es';
      else {
        const stored = localStorage.getItem('cc-lang');
        if (stored === 'es') initial = 'es';
      }
    } catch (e) {}
    applyLang(initial);
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.langSet));
  });

  initLang();

  /* ---- A-la-carte add-on selector + live "Your tailored package" panel ---- */
  const addonGrid = document.getElementById('addonsGrid');
  const addonCount = document.getElementById('addonCount');
  const addonPlural = document.getElementById('addonPlural');
  const addonCountEs = document.querySelector('.addon-count-es');
  const tailoredList = document.getElementById('tailoredList');
  const selectedAddonsField = document.getElementById('selectedAddonsField');
  const interestSelect = document.getElementById('interest');
  const messageField = document.getElementById('message');
  const addonCTA = document.getElementById('addonCTA');
  const selected = new Set();

  // Add-on labels (EN + ES) keyed for both form payload and side panel rendering
  const addonLabels = {
    'brand-identity': { en: 'Brand identity + brand book', es: 'Identidad de marca + manual' },
    'website-build':  { en: 'Website build',                 es: 'Construcción de sitio web' },
    'seo-foundation': { en: 'SEO foundation (one-time)',     es: 'Base de SEO (única vez)' },
    'seo-growth':     { en: 'SEO growth (monthly)',          es: 'Crecimiento SEO (mensual)' },
    'gmb':            { en: 'Google My Business ranking',    es: 'Ranking en Google My Business' },
    'cro':            { en: 'Conversion optimisation sprint',es: 'Sprint de optimización de conversión' },
    'ai-tracking':    { en: 'AI audience intelligence',      es: 'Inteligencia de audiencia con IA' },
    'crm-portal':     { en: 'Branded CRM + AI assistant',    es: 'CRM + asistente IA con tu marca' },
    'brand-video':    { en: 'Brand video production',        es: 'Producción de video de marca' },
    'studio-shoot':   { en: 'Studio shoot',                  es: 'Sesión en estudio' },
  };

  const emptyMessages = {
    en: 'Tick add-ons on the left to build your package.',
    es: 'Selecciona servicios a la izquierda para armar tu paquete.',
  };

  function updateAddonUI() {
    const n = selected.size;

    // Counts
    if (addonCount) addonCount.textContent = String(n);
    if (addonCountEs) addonCountEs.textContent = String(n);
    if (addonPlural) addonPlural.textContent = n === 1 ? '' : 's';

    // Hidden form field (pipe-separated)
    if (selectedAddonsField) {
      const labels = Array.from(selected).map((k) => addonLabels[k] ? addonLabels[k].en : k);
      selectedAddonsField.value = labels.join(' | ');
    }

    // Live tailored package list
    if (tailoredList) {
      if (n === 0) {
        tailoredList.innerHTML =
          '<li class="tailored-empty">' +
          '<span class="lang-en">' + emptyMessages.en + '</span>' +
          '<span class="lang-es" hidden>' + emptyMessages.es + '</span>' +
          '</li>';
      } else {
        tailoredList.innerHTML = Array.from(selected).map((k) => {
          const label = addonLabels[k] || { en: k, es: k };
          return '<li>'
            + '<span class="lang-en">' + label.en + '</span>'
            + '<span class="lang-es" hidden>' + label.es + '</span>'
            + '</li>';
        }).join('');
      }
      // Re-apply current language visibility to the newly-rendered spans
      const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
      tailoredList.querySelectorAll('.lang-' + (currentLang === 'es' ? 'en' : 'es')).forEach(el => el.hidden = true);
      tailoredList.querySelectorAll('.lang-' + currentLang).forEach(el => el.hidden = false);
    }
  }

  if (addonGrid) {
    addonGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.addon-card');
      if (!card) return;
      const key = card.dataset.addon;
      if (!key) return;
      if (selected.has(key)) {
        selected.delete(key);
        card.classList.remove('is-selected');
        card.setAttribute('aria-pressed', 'false');
      } else {
        selected.add(key);
        card.classList.add('is-selected');
        card.setAttribute('aria-pressed', 'true');
      }
      updateAddonUI();
    });
  }

  if (addonCTA) {
    addonCTA.addEventListener('click', () => {
      if (selected.size === 0) return;
      const labels = Array.from(selected).map((k) => addonLabels[k] ? addonLabels[k].en : k);

      // Auto-set the interest dropdown to the a-la-carte option
      if (interestSelect) {
        const target = Array.from(interestSelect.options).find((o) =>
          o.value && o.value.toLowerCase().includes('a-la-carte')
        );
        if (target) interestSelect.value = target.value;
      }

      // Prepend selections to the message body
      if (messageField) {
        const prefix = 'Add-ons I\'m interested in: ' + labels.join(', ');
        if (!messageField.value.includes(prefix)) {
          messageField.value = prefix + (messageField.value ? '\n\n' + messageField.value : '');
        }
      }
    });
  }
})();
