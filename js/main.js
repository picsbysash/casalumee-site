/* ==========================================================================
   Cherry Content — main.js
   - Mobile nav toggle
   - Service card hover/click expand
   - FAQ accordion
   - Reveal-on-scroll (IntersectionObserver)
   - Year stamp
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
})();
