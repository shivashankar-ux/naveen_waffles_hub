// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── BURGER MENU ──
const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeBurger() {
  burger.classList.remove('open');
  mobMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ── SCROLL REVEAL ──
const revealCards = document.querySelectorAll('.reveal-card');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = (entry.target.style.getPropertyValue('--i') || 0) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealCards.forEach(el => revealObs.observe(el));

// ── STACKING CARDS ──
const stackWrapper = document.getElementById('stackWrapper');
if (stackWrapper) {
  const cards = Array.from(stackWrapper.querySelectorAll('.stack-card'));
  const dotsContainer = document.getElementById('stackDots');
  let current = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'stack-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateCards() {
    cards.forEach((card, i) => {
      const diff = i - current;
      if (diff === 0) card.dataset.state = 'active';
      else if (diff === -1 || diff === cards.length - 1) card.dataset.state = 'behind1';
      else if (diff === -2 || diff === cards.length - 2) card.dataset.state = 'behind2';
      else card.dataset.state = 'hidden';
    });
    document.querySelectorAll('.stack-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    updateCards();
  }

  document.getElementById('stackNext').addEventListener('click', () => goTo(current + 1));
  document.getElementById('stackPrev').addEventListener('click', () => goTo(current - 1));

  // Auto-advance
  setInterval(() => goTo(current + 1), 4500);

  // Touch/swipe
  let touchStart = 0;
  stackWrapper.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; });
  stackWrapper.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  updateCards();
}

// ── MENU TABS (menu.html) ──
const mtabs = document.querySelectorAll('.mtab');
if (mtabs.length) {
  mtabs.forEach(btn => {
    btn.addEventListener('click', () => {
      mtabs.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.menu-tab-content').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}