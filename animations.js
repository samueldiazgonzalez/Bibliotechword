/* animations.js — BiblioUni shared JS animations */

// ── PAGE ENTRANCE ──


// ── SIDEBAR SLIDE IN ──
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) setTimeout(() => sidebar.classList.add('in'), 60);

  const topbar = document.querySelector('.topbar');
  if (topbar) setTimeout(() => topbar.classList.add('in'), 120);
});

// ── SCROLL REVEAL (Intersection Observer) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });
}
document.addEventListener('DOMContentLoaded', initReveal);

// ── RIPPLE EFFECT on buttons ──
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-submit, .login-btn, .ripple-host').forEach(btn => {
    btn.classList.add('ripple-host');
    btn.addEventListener('click', addRipple);
  });
});

// ── SMOOTH PAGE NAVIGATION ──
function navigateTo(href) {
  location.href = href;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(href);
    });
  });
});

// ── MAGNETIC HOVER on avatar ──
document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.querySelector('.avatar');
  if (!avatar) return;
  avatar.addEventListener('mousemove', e => {
    const rect = avatar.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    avatar.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
  });
  avatar.addEventListener('mouseleave', () => {
    avatar.style.transform = '';
  });
});

// ── COUNTER ANIMATION (for stats) ──
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const initial = 0;
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(initial + (target - initial) * eased);
    el.textContent = current.toLocaleString('es-CO');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}
document.addEventListener('DOMContentLoaded', initCounters);

// ── TYPEWRITER for hero title ──
function typewriter(el, text, speed = 42) {
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 18);
    }
  };
  tick();
}

// ── TILT EFFECT on book cover ──
function initTilt() {
  const cover = document.querySelector('.book-cover-main');
  const wrap = document.querySelector('.cover-wrap');
  if (!cover || !wrap) return;
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cover.style.transform = `perspective(600px) rotateY(${x * 16}deg) rotateX(${-y * 12}deg) scale(1.04)`;
    cover.style.boxShadow = `${-x * 24 + 16}px ${-y * 16 + 20}px 50px rgba(108,92,231,.28)`;
    cover.style.transition = 'transform .08s, box-shadow .08s';
  });
  wrap.addEventListener('mouseleave', () => {
    cover.style.transform = '';
    cover.style.boxShadow = '';
    cover.style.transition = 'transform .5s cubic-bezier(0.34,1.56,0.64,1), box-shadow .5s';
  });
}
document.addEventListener('DOMContentLoaded', initTilt);

// ── SEARCH BAR: highlight on focus ──
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.search-bar');
  if (!bar) return;
  const input = bar.querySelector('input');
  if (!input) return;
  input.addEventListener('focus', () => bar.classList.add('focused'));
  input.addEventListener('blur', () => bar.classList.remove('focused'));
});

// expose globals
window.BiblioAnim = { typewriter, animateCounter, navigateTo };
