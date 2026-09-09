// ============ Mobile Nav ============
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============ Header scroll state + progress bar ============
const siteHeader = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = pct + '%';
  siteHeader.classList.toggle('scrolled', scrollTop > 10);
  backToTop.classList.toggle('show', scrollTop > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ Scroll reveal ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ============ Animated stat counters ============
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;

  statNums.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statsObserver.observe(heroStats);
}

// ============ Contact form (Web3Forms) ============
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

function setFieldError(group, isInvalid) {
  group.classList.toggle('invalid', isInvalid);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');
    formError.classList.remove('show');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    let valid = true;

    const nameGroup = nameInput.closest('.form-group');
    if (!nameInput.value.trim()) {
      setFieldError(nameGroup, true);
      valid = false;
    } else {
      setFieldError(nameGroup, false);
    }

    const emailGroup = emailInput.closest('.form-group');
    if (!isValidEmail(emailInput.value.trim())) {
      setFieldError(emailGroup, true);
      valid = false;
    } else {
      setFieldError(emailGroup, false);
    }

    const messageGroup = messageInput.closest('.form-group');
    if (!messageInput.value.trim()) {
      setFieldError(messageGroup, true);
      valid = false;
    } else {
      setFieldError(messageGroup, false);
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      });
      const result = await response.json();

      if (result.success) {
        formSuccess.classList.add('show');
        contactForm.reset();
      } else {
        formError.classList.add('show');
      }
    } catch (err) {
      formError.classList.add('show');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });
}

// ============ Footer year ============
document.getElementById('year').textContent = new Date().getFullYear();
