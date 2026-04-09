// ===== NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Highlight active nav link
(function setActiveLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });
})();

// ===== SCROLL-TO-TOP =====
const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 350);
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, duration = 3200) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== ACCORDION =====
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // Close all
    document.querySelectorAll('.accordion-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    // Open clicked if it was closed
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Message sent! We will get back to you soon.');
    contactForm.reset();
  });
}

// ===== MARKET PRICE LIVE TICKER (simulated) =====
function randomChange(base, pct = 0.02) {
  const change = base * pct * (Math.random() - 0.5) * 2;
  return parseFloat((base + change).toFixed(2));
}

function updateMarketPrices() {
  const rows = document.querySelectorAll('[data-base-price]');
  rows.forEach(row => {
    const base = parseFloat(row.dataset.basePrice);
    const priceCell = row.querySelector('.live-price');
    const trendCell = row.querySelector('.price-trend');
    if (!priceCell || !trendCell) return;

    const oldPrice = parseFloat(priceCell.textContent.replace(/[^0-9.]/g, ''));
    const newPrice = randomChange(base);
    priceCell.textContent = `₹ ${newPrice.toFixed(2)}`;

    if (newPrice > oldPrice) {
      priceCell.className = 'live-price price-up';
      trendCell.textContent = '▲';
      trendCell.className = 'price-trend trend-up';
    } else if (newPrice < oldPrice) {
      priceCell.className = 'live-price price-down';
      trendCell.textContent = '▼';
      trendCell.className = 'price-trend trend-down';
    } else {
      priceCell.className = 'live-price price-flat';
      trendCell.textContent = '—';
      trendCell.className = 'price-trend';
    }
  });
}

if (document.querySelector('[data-base-price]')) {
  setInterval(updateMarketPrices, 4000);
}

// ===== WEATHER WIDGET (simulated) =====
function initWeatherWidget() {
  const widget = document.getElementById('weatherWidget');
  if (!widget) return;

  const conditions = [
    { icon: '☀️', label: 'Sunny',       temp: 32 },
    { icon: '⛅', label: 'Partly Cloudy', temp: 28 },
    { icon: '🌧️', label: 'Rainy',       temp: 24 },
    { icon: '🌥️', label: 'Overcast',    temp: 26 },
    { icon: '⛈️', label: 'Thunderstorm', temp: 22 },
  ];

  const today = conditions[Math.floor(Math.random() * conditions.length)];
  const humid = Math.floor(Math.random() * 30 + 55);
  const wind  = Math.floor(Math.random() * 20 + 5);

  const iconEl = widget.querySelector('.weather-icon-big');
  const tempEl = widget.querySelector('.weather-temp');
  const condEl = widget.querySelector('.weather-condition');
  const humEl  = widget.querySelector('.weather-humid');
  const winEl  = widget.querySelector('.weather-wind');

  if (iconEl) iconEl.textContent = today.icon;
  if (tempEl) tempEl.textContent = today.temp + '°C';
  if (condEl) condEl.textContent = today.label;
  if (humEl)  humEl.textContent  = humid + '%';
  if (winEl)  winEl.textContent  = wind + ' km/h';
}

document.addEventListener('DOMContentLoaded', initWeatherWidget);

// ===== CROP SEASON FILTER =====
const filterBtns = document.querySelectorAll('[data-filter]');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');

      document.querySelectorAll('[data-season]').forEach(card => {
        if (filter === 'all' || card.dataset.season === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count, 10);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current).toLocaleString() + (counter.dataset.suffix || '');
    }, 16);
  });
}

// Observe stats bar
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(statsBar);
}
