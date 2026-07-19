(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = $('#siteHeader');
  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  $$('#mobileMenu a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && closeMenu());

  const handleScroll = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  const navLinks = $$('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-38% 0px -54%', threshold: 0 });
  $$('main section[id]').forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 4) * 55}ms`;
    revealObserver.observe(item);
  });

  const filterButtons = $$('.filter-btn');
  const projectCards = $$('.project-card');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    projectCards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.category === selected;
      card.classList.toggle('hidden-card', !visible);
      card.setAttribute('aria-hidden', String(!visible));
    });
  }));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      if (reducedMotion) el.textContent = `${target}${suffix}`;
      else {
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / 1200, 1);
          el.textContent = `${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.7 });
  $$('.counter').forEach((counter) => counterObserver.observe(counter));

  const testimonials = [
    { quote: 'Nova brought rare clarity to a complicated product. The result feels simple, fast, and unmistakably ours.', initials: 'AM', name: 'Avery Morgan', role: 'VP Product, Northstar' },
    { quote: 'The level of care was visible in every breakpoint and interaction. Our team shipped faster—and the product finally felt premium.', initials: 'JL', name: 'Jordan Lee', role: 'Founder, Fieldnote' },
    { quote: 'A genuine creative partner who can speak design and engineering equally well. Nova made our ambitious idea feel entirely achievable.', initials: 'RK', name: 'Rina Kapoor', role: 'Creative Director, Pulse' }
  ];
  const list = $('#testimonialList');
  const dots = $('#sliderDots');
  let slideIndex = 0;
  let autoPlay;

  if (list && dots) {
    list.innerHTML = testimonials.map((item) => `<article class="testimonial-card"><span class="quote-mark" aria-hidden="true">“</span><blockquote>${item.quote}</blockquote><div class="client"><span class="client-avatar">${item.initials}</span><p><strong>${item.name}</strong><span>${item.role}</span></p></div></article>`).join('');
    dots.innerHTML = testimonials.map((_, index) => `<button class="slider-dot${index === 0 ? ' active' : ''}" data-slide="${index}" aria-label="Show testimonial ${index + 1}"></button>`).join('');
  }

  const showSlide = (index) => {
    slideIndex = (index + testimonials.length) % testimonials.length;
    if (list) list.style.transform = `translateX(-${slideIndex * 100}%)`;
    $$('.slider-dot', dots).forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === slideIndex));
  };
  const restartSlider = () => {
    window.clearInterval(autoPlay);
    if (!reducedMotion) autoPlay = window.setInterval(() => showSlide(slideIndex + 1), 6000);
  };
  $('#prevTestimonial')?.addEventListener('click', () => { showSlide(slideIndex - 1); restartSlider(); });
  $('#nextTestimonial')?.addEventListener('click', () => { showSlide(slideIndex + 1); restartSlider(); });
  $$('.slider-dot', dots).forEach((dot) => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); restartSlider(); }));
  restartSlider();

  const form = $('#contactForm');
  const formMessage = $('#formMessage');
  const fields = [$('#nameInput'), $('#emailInput'), $('#messageInput')];
  const validateField = (field) => {
    const empty = !field.value.trim();
    const invalidEmail = field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value.trim());
    const invalid = empty || invalidEmail;
    field.classList.toggle('invalid', invalid);
    field.setAttribute('aria-invalid', String(invalid));
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.textContent = empty ? 'This field is required.' : invalidEmail ? 'Enter a valid email address.' : '';
    return !invalid;
  };
  fields.forEach((field) => field?.addEventListener('blur', () => validateField(field)));
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = fields.every(validateField);
    if (!valid) {
      formMessage.textContent = 'Please check the highlighted fields.';
      formMessage.style.color = '#a3302d';
      fields.find((field) => field.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }
    formMessage.textContent = 'Thanks! Your inquiry is ready to send.';
    formMessage.style.color = '#496415';
    form.reset();
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
  });

  if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
    const glow = $('#cursorGlow');
    window.addEventListener('pointermove', (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
      glow.style.opacity = '1';
    }, { passive: true });
    $$('.magnetic-btn').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .08}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
    const heroVisual = $('.hero-visual');
    heroVisual?.addEventListener('pointermove', (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      $('.profile-frame', heroVisual).style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });
    heroVisual?.addEventListener('pointerleave', () => { $('.profile-frame', heroVisual).style.transform = ''; });
  }

  $('#year').textContent = new Date().getFullYear();
})();
