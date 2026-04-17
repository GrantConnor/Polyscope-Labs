const body = document.body;
const toast = document.getElementById('toast');
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

window.addEventListener('load', () => {
  body.classList.add('is-loaded');
});

if (navToggle && header) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (siteNav) {
  siteNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (header?.classList.contains('is-open')) {
        header.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const sectionIds = ['about', 'products', 'research', 'testing', 'faq', 'contact'];
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
if ('IntersectionObserver' in window && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${visibleSection.target.id}`;
      link.classList.toggle('is-active', isMatch);
    });
  }, {
    threshold: 0.45,
    rootMargin: '-10% 0px -40% 0px'
  });

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const trigger = item.querySelector('.faq-trigger');
  const content = item.querySelector('.faq-content');

  trigger?.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
    content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : '0px';
  });
});

const productSearchInput = document.getElementById('product-search');
const productSearchForm = document.getElementById('product-search-form');
const productCards = Array.from(document.querySelectorAll('.product-card'));
const emptyState = document.getElementById('search-empty-state');

const runProductSearch = () => {
  if (!productSearchInput) return;

  const query = productSearchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const haystack = card.dataset.search || '';
    const match = !query || haystack.includes(query);
    card.classList.toggle('hidden', !match);
    if (match) visibleCount += 1;
  });

  emptyState?.classList.toggle('hidden', visibleCount !== 0);

  if (query) {
    showToast(visibleCount ? `Showing ${visibleCount} matching concept${visibleCount > 1 ? 's' : ''}.` : 'No matching concepts found.');
  }
};

productSearchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  runProductSearch();
});

productSearchInput?.addEventListener('input', () => {
  if (!productSearchInput.value.trim()) runProductSearch();
});

const testingForm = document.getElementById('testing-form');
testingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!testingForm.checkValidity()) {
    testingForm.reportValidity();
    return;
  }

  const formData = new FormData(testingForm);
  const name = formData.get('name');
  const interest = formData.get('interest');
  testingForm.reset();
  showToast(`Thanks, ${name}. Your ${interest} testing application has been received.`);
});

const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  const topic = formData.get('topic');
  contactForm.reset();
  showToast(`Message sent. We’ll follow up about “${topic}” soon.`);
});

const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!loginForm.checkValidity()) {
    loginForm.reportValidity();
    return;
  }

  loginForm.reset();
  showToast('Demo login submitted. Connect a backend later to enable real authentication.');
});

const registerForm = document.getElementById('register-form');
registerForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!registerForm.checkValidity()) {
    registerForm.reportValidity();
    return;
  }

  const formData = new FormData(registerForm);
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (password !== confirmPassword) {
    showToast('Passwords do not match yet. Please try again.');
    return;
  }

  registerForm.reset();
  showToast('Account request submitted. Connect real auth later to store user accounts.');
});

const passwordToggles = document.querySelectorAll('.password-toggle');
passwordToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = toggle.parentElement?.querySelector('input');
    if (!input) return;

    const showPassword = input.type === 'password';
    input.type = showPassword ? 'text' : 'password';
    toggle.textContent = showPassword ? 'Hide' : 'Show';
  });
});

let toastTimer;
function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}
