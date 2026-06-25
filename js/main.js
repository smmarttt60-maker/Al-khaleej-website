/* ═══════════════════════════════════════════════════════
   AL KHALEEJ ALUMINUM & GLASS — MAIN JAVASCRIPT
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM REFS ──────────────────────────────────────────
  const header      = document.querySelector('.site-header');
  const navToggle   = document.getElementById('navToggle');
  const navLinks    = document.getElementById('navLinks');
  const navItems    = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const backToTop   = document.getElementById('backToTop');
  const footerYear  = document.getElementById('footerYear');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryGrid = document.getElementById('galleryGrid');
  const contactForm = document.getElementById('contactForm');
  const sections    = document.querySelectorAll('section[id]');

  // ── FOOTER YEAR ──────────────────────────────────────
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ── SCROLL: header + back-to-top + active nav ────────
  function onScroll() {
    const y = window.scrollY;

    // Header background
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top
    if (y > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (y >= sectionTop) current = section.getAttribute('id');
    });

    navItems.forEach(link => {
      link.classList.toggle('active',
        link.getAttribute('href') === '#' + current
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── BACK TO TOP ──────────────────────────────────────
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── MOBILE NAV ───────────────────────────────────────
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ── SMOOTH SCROLL for anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── GALLERY FILTER ───────────────────────────────────
  if (filterBtns.length && galleryGrid) {
    const items = galleryGrid.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Show/hide items
        items.forEach(item => {
          const cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ── SCROLL REVEAL ────────────────────────────────────
  const revealTargets = document.querySelectorAll(
    '.service-card, .testimonial, .why-item, .about-pillar, .contact-item, .gallery-item'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('fade-in'));

    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => revealObs.observe(el));
  }

  // ── CONTACT FORM VALIDATION ───────────────────────────
  if (contactForm) {
    const fields = {
      fullName: { el: document.getElementById('fullName'), errEl: document.getElementById('nameError'),    validate: v => v.trim().length >= 2  ? '' : 'Please enter your full name.' },
      email:    { el: document.getElementById('email'),    errEl: document.getElementById('emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
      message:  { el: document.getElementById('message'),  errEl: document.getElementById('messageError'), validate: v => v.trim().length >= 10 ? '' : 'Please enter a message (at least 10 characters).' },
    };

    const submitBtn     = document.getElementById('submitBtn');
    const formSuccess   = document.getElementById('formSuccess');
    const btnText       = submitBtn.querySelector('.btn-text');
    const btnSending    = submitBtn.querySelector('.btn-sending');

    // Inline validation on blur
    Object.values(fields).forEach(({ el, errEl, validate }) => {
      el.addEventListener('blur', () => {
        const err = validate(el.value);
        errEl.textContent = err;
        el.classList.toggle('error', !!err);
      });
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) {
          const err = validate(el.value);
          errEl.textContent = err;
          el.classList.toggle('error', !!err);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all
      let valid = true;
      Object.values(fields).forEach(({ el, errEl, validate }) => {
        const err = validate(el.value);
        errEl.textContent = err;
        el.classList.toggle('error', !!err);
        if (err) valid = false;
      });

      if (!valid) {
        // Focus first errored field
        const firstErr = contactForm.querySelector('.error');
        if (firstErr) firstErr.focus();
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnSending.hidden = false;

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.hidden = false;
        btnSending.hidden = true;
        formSuccess.hidden = false;
        contactForm.reset();
        Object.values(fields).forEach(({ el }) => el.classList.remove('error'));

        // Hide success message after 6s
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      }, 1600);
    });
  }

  // ── KEYBOARD: close nav on Escape ────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });

  // ── HEADER: always visible at top (no bg flash) ──────
  // On very first load the scrollY may be 0 but user reloaded mid-page
  window.dispatchEvent(new Event('scroll'));

})();
