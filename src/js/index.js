import '../css/styles.css';

const root = document.documentElement;
const body = document.body;

const getStoredTheme = () => localStorage.getItem('artOfStoneTheme');
const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
};

applyTheme(getPreferredTheme());

const initThemeToggle = () => {
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('artOfStoneTheme', nextTheme);
      applyTheme(nextTheme);
    });
  });
};

const initHeader = () => {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!navToggle || !nav) return;

  const closeNavigation = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    body.classList.remove('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    body.classList.toggle('nav-open', !isOpen);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1120) closeNavigation();
  });
};

const initActiveNav = () => {
  const page = body.dataset.page;
  if (!page) return;
  const activeLink = document.querySelector(`[data-nav-link="${page}"]`);
  if (activeLink) activeLink.classList.add('is-active');
};

const initReveal = () => {
  const revealItems = [...document.querySelectorAll('.reveal')];
  if (!revealItems.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const initTestimonials = () => {
  const carousel = document.querySelector('[data-testimonial-carousel]');
  if (!carousel) return;

  const testimonials = [...carousel.querySelectorAll('.testimonial')];
  const previous = document.querySelector('[data-testimonial-prev]');
  const next = document.querySelector('[data-testimonial-next]');
  const dotsContainer = carousel.querySelector('[data-testimonial-dots]');
  let activeIndex = 0;

  const dots = testimonials.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Show testimonial ${index + 1}`);
    button.addEventListener('click', () => showTestimonial(index));
    dotsContainer?.append(button);
    return button;
  });

  function showTestimonial(index) {
    activeIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((testimonial, testimonialIndex) => {
      testimonial.classList.toggle('is-active', testimonialIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeIndex));
  }

  previous?.addEventListener('click', () => showTestimonial(activeIndex - 1));
  next?.addEventListener('click', () => showTestimonial(activeIndex + 1));
  showTestimonial(0);
};

const initProjectCarousels = () => {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('.project-slide')];
    const counter = carousel.querySelector('[data-carousel-counter]');
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    let activeIndex = 0;

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeIndex));
      if (counter) {
        counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      }
    };

    previous?.addEventListener('click', () => showSlide(activeIndex - 1));
    next?.addEventListener('click', () => showSlide(activeIndex + 1));
    showSlide(0);
  });
};

const initComparisons = () => {
  document.querySelectorAll('[data-comparison]').forEach((comparison) => {
    const range = comparison.querySelector('[data-comparison-range]');
    if (!range) return;

    const update = () => comparison.style.setProperty('--position', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });
};

const initProjectFilter = () => {
  const filter = document.querySelector('[data-project-filter]');
  if (!filter) return;

  const buttons = [...filter.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-project-category]')];

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      projects.forEach((project) => {
        const visible = category === 'all' || project.dataset.projectCategory === category;
        project.classList.toggle('is-filtered-out', !visible);
      });
    });
  });
};


const initClickableProjects = () => {
  document.querySelectorAll('[data-project-href]').forEach((project) => {
    const navigate = () => { window.location.href = project.dataset.projectHref; };
    project.addEventListener('click', (event) => {
      if (event.target.closest('a, button, input, textarea, select, label')) return;
      navigate();
    });
    project.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('a, button, input, textarea, select')) return;
      event.preventDefault();
      navigate();
    });
  });
};

const initContactForm = () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');

  const clearErrors = () => {
    form.querySelectorAll('[data-error-for]').forEach((error) => {
      error.textContent = '';
    });
  };

  const showError = (name, message) => {
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (error) error.textContent = message;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();
    if (status) status.textContent = '';

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const location = String(data.get('location') ?? '').trim();
    const projectType = String(data.get('projectType') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const consent = data.get('consent');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (name.length < 2) { showError('name', 'Please enter your name.'); isValid = false; }
    if (!emailPattern.test(email)) { showError('email', 'Please enter a valid email address.'); isValid = false; }
    if (location.length < 2) { showError('location', 'Please enter your city or project area.'); isValid = false; }
    if (!projectType) { showError('projectType', 'Please select a project type.'); isValid = false; }
    if (message.length < 15) { showError('message', 'Please add a little more detail about the project.'); isValid = false; }
    if (!consent) { showError('consent', 'Please confirm that we may contact you.'); isValid = false; }

    if (!isValid) {
      if (status) status.textContent = 'Please review the highlighted fields.';
      return;
    }

    if (status) {
      status.textContent = 'Demo form validated successfully. Connect this form to your email service or backend before launch.';
    }
    form.reset();
  });
};

const initCurrentYear = () => {
  document.querySelectorAll('[data-year]').forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
};

initThemeToggle();
initHeader();
initActiveNav();
initReveal();
initTestimonials();
initProjectCarousels();
initComparisons();
initProjectFilter();
initClickableProjects();
initContactForm();
initCurrentYear();
