
(function () {
  const cover = document.getElementById('page-cover');
  if (cover) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { cover.classList.add('gone'); });
    });
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) setTimeout(() => sidebar.classList.add('in'), 60);

  const topbar = document.querySelector('.topbar');
  if (topbar) setTimeout(() => topbar.classList.add('in'), 120);
});

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

function navigateTo(href) {
  const cover = document.getElementById('page-cover');
  if (!cover) { location.href = href; return; }
  cover.style.transformOrigin = 'bottom';
  cover.style.transition = 'transform .4s cubic-bezier(0.4, 0, 0.2, 1)';
  cover.style.transform = 'scaleY(1)';
  setTimeout(() => { location.href = href; }, 380);
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

function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const initial = 0;
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

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

document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.search-bar');
  if (!bar) return;
  const input = bar.querySelector('input');
  if (!input) return;
  input.addEventListener('focus', () => bar.classList.add('focused'));
  input.addEventListener('blur', () => bar.classList.remove('focused'));
});

window.BiblioAnim = { typewriter, animateCounter, navigateTo };
