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
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const i = parseInt(entry.target.style.getPropertyValue('--i') || 0);
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
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
  let autoTimer = null;
  let isAnimating = false;

  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'stack-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateCards() {
    const total = cards.length;
    cards.forEach((card, i) => {
      const pos = (i - current + total) % total;
      if (pos === 0) card.dataset.state = 'active';
      else if (pos === 1) card.dataset.state = 'behind1';
      else if (pos === 2) card.dataset.state = 'behind2';
      else card.dataset.state = 'hidden';
    });
    document.querySelectorAll('.stack-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    if (isAnimating) return;
    isAnimating = true;
    current = (idx + cards.length) % cards.length;
    updateCards();
    setTimeout(() => { isAnimating = false; }, 700);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  document.getElementById('stackNext').addEventListener('click', () => {
    goTo(current + 1); stopAuto(); startAuto();
  });
  document.getElementById('stackPrev').addEventListener('click', () => {
    goTo(current - 1); stopAuto(); startAuto();
  });

  let touchStartX = 0, touchStartY = 0;
  stackWrapper.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  stackWrapper.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      goTo(current + (dx > 0 ? 1 : -1));
      stopAuto(); startAuto();
    }
  }, { passive: true });

  updateCards();
  startAuto();
}

// ── MENU TABS ──
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