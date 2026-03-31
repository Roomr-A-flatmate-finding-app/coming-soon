/* ============================================================
   ROOMR — index.js v2.0
   All interactive logic: cursor, scroll, forms, animations
   ============================================================ */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR + CLICK RIPPLE
   ============================================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX  = 0, trailY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.10;
    trailY += (mouseY - trailY) * 0.10;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover state
  const hoverSel = 'a, button, .btn, .meme-card, .step-card, .about-feature, .testi-card, label, .m-tag, .quiz-badge, .social-link';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Ripple on click
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-circle';
    const size = 40;
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
    `;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();

/* ============================================================
   2. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = Math.min(100, pct) + '%';
  }, { passive: true });
})();

/* ============================================================
   3. THEME TOGGLE
   ============================================================ */
(function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;

  const saved = localStorage.getItem('roomr-theme') || 'dark';
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('change', () => {
      const newTheme = toggle.checked ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('roomr-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (toggle) toggle.checked = (theme === 'light');
  }
})();

/* ============================================================
   4. NAVBAR — scroll shrink + mobile menu
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }
})();

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. TILT CARDS — 3D on hover
   ============================================================ */
(function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear, border-color 0.3s, box-shadow 0.3s';
    });
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = (e.clientX - cx) / (rect.width  / 2);
      const dy      = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(700px) rotateX(${dy * -9}deg) rotateY(${dx * 9}deg) scale(1.025)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s, box-shadow 0.3s';
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();

/* ============================================================
   7. MAGNETIC BUTTONS
   ============================================================ */
(function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.15s ease';
    });
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

/* ============================================================
   8. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target || 0, 10);
      const dur    = 1600;
      const start  = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   9. ACTIVITY FEED — rotate live updates
   ============================================================ */
(function initActivityFeed() {
  const list = document.getElementById('activityList');
  if (!list) return;

  const feeds = [
    '😊 Ananya just joined from Delhi',
    '🎯 New match found: 97% compatible',
    '✅ Rohan verified his profile',
    '🏠 Priya found her perfect roommate',
    '🔥 Jake joined from Bengaluru',
    '💯 Match score: 94% lifestyle sync',
    '🌙 Siddharth matched: Night Owl ✓',
    '🧹 Clean-freak match found near you',
    '🎮 Gamer roommate matched in Mumbai',
    '📚 Study buddy match: 92% compat.',
  ];

  let items = list.querySelectorAll('.activity-item');
  let currentFeed = feeds.slice();

  function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let feedQueue = shuffleArr([...currentFeed]);
  let feedIdx   = 0;

  function nextFeed() {
    items = list.querySelectorAll('.activity-item');
    if (!items.length) return;

    // Shift: remove active from top, add new item
    const first = items[0];
    first.style.transition = 'opacity 0.3s, transform 0.3s';
    first.style.opacity  = '0';
    first.style.transform = 'translateX(-12px)';

    setTimeout(() => {
      // Move first to last and update text
      if (feedIdx >= feedQueue.length) {
        feedQueue = shuffleArr([...currentFeed]);
        feedIdx = 0;
      }
      first.textContent = feedQueue[feedIdx++];
      first.style.transition = 'none';
      first.style.opacity   = '0';
      first.style.transform = 'translateX(12px)';
      first.classList.remove('active');
      list.appendChild(first);

      // Re-query after DOM change
      const updatedItems = list.querySelectorAll('.activity-item');

      requestAnimationFrame(() => {
        first.style.transition = 'opacity 0.3s, transform 0.3s';
        first.style.opacity   = '0.6';
        first.style.transform = 'translateX(0)';
      });

      // Highlight the newest item (last in list, but always show first as active)
      updatedItems.forEach(it => it.classList.remove('active'));
      if (updatedItems[0]) updatedItems[0].classList.add('active');

    }, 300);
  }

  setInterval(nextFeed, 2800);
})();

/* ============================================================
   10. SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
  });
});

/* ============================================================
   11. TEXTAREA CHARACTER COUNT
   ============================================================ */
(function initCharCount() {
  const textarea  = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  if (!textarea || !charCount) return;

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    const max = parseInt(textarea.getAttribute('maxlength') || 300);
    charCount.textContent = `${len} / ${max}`;
    charCount.style.color = len > max * 0.9 ? 'var(--orange)' : 'var(--text-3)';
  });
})();

/* ============================================================
   12. WAITLIST FORM
   ============================================================ */
(function initForm() {
  const form       = document.getElementById('waitlistForm');
  if (!form) return;

  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput   = document.getElementById('message');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  const successEl  = document.getElementById('formSuccess');
  const errorEl    = document.getElementById('formErrorMsg');

  function showError(inputEl, errorId, msg) {
    inputEl.classList.add('error');
    const err = document.getElementById(errorId);
    if (err) err.textContent = msg;
  }

  function clearError(inputEl, errorId) {
    inputEl.classList.remove('error');
    const err = document.getElementById(errorId);
    if (err) err.textContent = '';
  }

  function validateName() {
    const val = nameInput.value.trim();
    if (!val)          { showError(nameInput, 'nameError', 'Name is required ✋'); return false; }
    if (val.length < 2){ showError(nameInput, 'nameError', 'Name too short 🤔'); return false; }
    clearError(nameInput, 'nameError');
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val)       { showError(emailInput, 'emailError', 'Email is required 📧'); return false; }
    if (!re.test(val)) { showError(emailInput, 'emailError', "Hmm, that doesn't look right 🤨"); return false; }
    clearError(emailInput, 'emailError');
    return true;
  }

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  nameInput.addEventListener('input', () => clearError(nameInput, 'nameError'));
  emailInput.addEventListener('input', () => clearError(emailInput, 'emailError'));

  function saveToLocalStorage(data) {
    try {
      const key      = 'roomr_waitlist';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...data, timestamp: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch (e) {
      console.warn('localStorage save failed:', e);
      return false;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameOk  = validateName();
    const emailOk = validateEmail();
    if (!nameOk || !emailOk) return;

    submitBtn.disabled = true;
    if (btnText)    btnText.style.display    = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    if (errorEl)    errorEl.style.display    = 'none';

    const formData = {
      name:    nameInput.value.trim(),
      email:   emailInput.value.trim(),
      message: msgInput?.value.trim() || ''
    };

    const action = form.getAttribute('action') || '';
    const isRealFormspree = action.includes('formspree.io/f/') && !action.includes('YOUR_FORM_ID');

    let success = false;

    if (isRealFormspree) {
      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData)
        });
        success = res.ok ? true : saveToLocalStorage(formData);
      } catch {
        saveToLocalStorage(formData);
        success = true;
      }
    } else {
      console.info('📋 Form saved locally (Formspree not configured). Replace mwvwbaaw to enable email.');
      console.table(formData);
      success = saveToLocalStorage(formData);
    }

    submitBtn.disabled = false;
    if (btnText)    btnText.style.display    = 'inline';
    if (btnLoading) btnLoading.style.display = 'none';

    if (success) {
      form.querySelectorAll('.form-group').forEach(g => g.style.display = 'none');
      submitBtn.style.display = 'none';
      if (successEl) {
        successEl.style.display   = 'block';
        successEl.style.animation = 'fadeInUp 0.5s ease both';
      }
    } else {
      if (errorEl) errorEl.style.display = 'block';
    }
  });
})();

/* ============================================================
   13. STICKER PARALLAX
   ============================================================ */
(function initParallaxStickers() {
  const stickers = document.querySelectorAll('.sticker');
  if (!stickers.length) return;
  const speeds = [0.04, -0.06, 0.035, -0.05, 0.07, -0.04];

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    stickers.forEach((s, i) => {
      s.style.transform = `translateY(${sy * speeds[i % speeds.length]}px)`;
    });
  }, { passive: true });
})();

/* ============================================================
   14. HERO ELEMENTS — immediate reveal on load
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('.hero .reveal');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 80 + i * 110);
  });
});

/* ============================================================
   15. INJECT CSS ANIMATIONS AT RUNTIME
   ============================================================ */
(function injectAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   16. KONAMI CODE EASTER EGG 🎮
   ============================================================ */
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        unleashConfetti();
      }
    } else { idx = 0; }
  });

  function unleashConfetti() {
    const emojis = ['🏠','✨','🔥','🎉','💥','🚀','🎯','💯','🌙','🧹'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}vw;
          top: -40px;
          font-size: ${0.9 + Math.random() * 1.8}rem;
          pointer-events: none;
          z-index: 99999;
          animation: konfettiFall ${1.4 + Math.random() * 2.2}s ease-in forwards;
        `;
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
      }, i * 50);
    }

    if (!document.getElementById('konfetti-style')) {
      const s = document.createElement('style');
      s.id = 'konfetti-style';
      s.textContent = `
        @keyframes konfettiFall {
          from { transform: translateY(0) rotate(0deg); opacity: 1; }
          to   { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `;
      document.head.appendChild(s);
    }
  }
})();