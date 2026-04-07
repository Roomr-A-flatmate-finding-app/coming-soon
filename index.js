/* ============================================================
   ROOMR — index.js v3.0
   ============================================================ */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR + CLICK RIPPLE
   ============================================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX; mouseY = e.clientY;
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

  var hoverSel = 'a, button, .btn, .meme-card, .step-card, .about-feature, .testi-card, label, .m-tag, .quiz-badge, .social-link';
  document.querySelectorAll(hoverSel).forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
  });

  document.addEventListener('click', function(e) {
    var ripple = document.createElement('div');
    ripple.className = 'ripple-circle';
    ripple.style.cssText = 'width:40px;height:40px;left:' + e.clientX + 'px;top:' + e.clientY + 'px;';
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', function() { ripple.remove(); });
  });
})();

/* ============================================================
   2. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = Math.min(100, pct) + '%';
  }, { passive: true });
})();

/* ============================================================
   3. THEME TOGGLE
   ============================================================ */
(function initThemeToggle() {
  var toggle = document.getElementById('themeToggle');
  var html   = document.documentElement;
  var saved  = localStorage.getItem('roomr-theme') || 'dark';
  applyTheme(saved);
  if (toggle) {
    toggle.addEventListener('change', function() {
      var newTheme = toggle.checked ? 'light' : 'dark';
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
   4. NAVBAR
   ============================================================ */
(function initNavbar() {
  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('hamburger');
  var navLinks   = document.getElementById('navLinks');
  var navOverlay = document.getElementById('navOverlay');

  window.addEventListener('scroll', function() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    navOverlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) { closeMenu(); hamburger.focus(); }
    });
  }
})();

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(function() { el.classList.add('visible'); }, delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  reveals.forEach(function(el) { observer.observe(el); });
})();

/* ============================================================
   6. TILT CARDS
   ============================================================ */
(function initTiltCards() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.tilt-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      card.style.transition = 'transform 0.1s linear, border-color 0.3s, box-shadow 0.3s';
    });
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      var dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = 'perspective(700px) rotateX(' + (dy * -9) + 'deg) rotateY(' + (dx * 9) + 'deg) scale(1.025)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s';
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();

/* ============================================================
   7. MAGNETIC BUTTONS
   ============================================================ */
(function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.magnetic').forEach(function(btn) {
    btn.addEventListener('mouseenter', function() { btn.style.transition = 'transform 0.15s ease'; });
    btn.addEventListener('mousemove', function(e) {
      var rect = btn.getBoundingClientRect();
      var dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
      var dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
      btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform = 'translate(0,0)';
    });
  });
})();

/* ============================================================
   8. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  var counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.target || 0, 10);
      var dur = 1600, start = performance.now();
      function step(now) {
        var progress = Math.min((now - start) / dur, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function(c) { observer.observe(c); });
})();

/* ============================================================
   9. ACTIVITY FEED
   ============================================================ */
(function initActivityFeed() {
  var list = document.getElementById('activityList');
  if (!list) return;
  var feeds = [
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
  function shuffleArr(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }
  var queue = shuffleArr(feeds.slice()), idx = 0;
  function nextFeed() {
    var items = list.querySelectorAll('.activity-item');
    if (!items.length) return;
    var first = items[0];
    first.style.transition = 'opacity 0.3s, transform 0.3s';
    first.style.opacity = '0';
    first.style.transform = 'translateX(-12px)';
    setTimeout(function() {
      if (idx >= queue.length) { queue = shuffleArr(feeds.slice()); idx = 0; }
      first.textContent = queue[idx++];
      first.style.transition = 'none';
      first.style.opacity = '0';
      first.style.transform = 'translateX(12px)';
      first.classList.remove('active');
      list.appendChild(first);
      var updated = list.querySelectorAll('.activity-item');
      requestAnimationFrame(function() {
        first.style.transition = 'opacity 0.3s, transform 0.3s';
        first.style.opacity = '0.6';
        first.style.transform = 'translateX(0)';
      });
      updated.forEach(function(it) { it.classList.remove('active'); });
      if (updated[0]) updated[0].classList.add('active');
    }, 300);
  }
  setInterval(nextFeed, 2800);
})();

/* ============================================================
   10. SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var navH = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
  });
});

/* ============================================================
   11. CHAR COUNT
   ============================================================ */
(function initCharCount() {
  var textarea  = document.getElementById('message');
  var charCount = document.getElementById('charCount');
  if (!textarea || !charCount) return;
  textarea.addEventListener('input', function() {
    var len = textarea.value.length;
    var max = parseInt(textarea.getAttribute('maxlength') || 300);
    charCount.textContent = len + ' / ' + max;
    charCount.style.color = len > max * 0.9 ? 'var(--orange)' : 'var(--text-3)';
  });
})();

/* ============================================================
   12. WAITLIST FORM
   ============================================================ */
(function initForm() {
  var form      = document.getElementById('waitlistForm');
  if (!form) return;
  var nameInput  = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var msgInput   = document.getElementById('message');
  var submitBtn  = document.getElementById('submitBtn');
  var btnText    = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  var btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
  var successEl  = document.getElementById('formSuccess');
  var errorEl    = document.getElementById('formErrorMsg');

  function showError(inputEl, errorId, msg) { inputEl.classList.add('error'); var err = document.getElementById(errorId); if (err) err.textContent = msg; }
  function clearError(inputEl, errorId) { inputEl.classList.remove('error'); var err = document.getElementById(errorId); if (err) err.textContent = ''; }
  function validateName() {
    var val = nameInput.value.trim();
    if (!val) { showError(nameInput, 'nameError', 'Name is required ✋'); return false; }
    if (val.length < 2) { showError(nameInput, 'nameError', 'Name too short 🤔'); return false; }
    clearError(nameInput, 'nameError'); return true;
  }
  function validateEmail() {
    var val = emailInput.value.trim();
    var re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { showError(emailInput, 'emailError', 'Email is required 📧'); return false; }
    if (!re.test(val)) { showError(emailInput, 'emailError', "Hmm, that doesn't look right 🤨"); return false; }
    clearError(emailInput, 'emailError'); return true;
  }

  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  nameInput.addEventListener('input', function() { clearError(nameInput, 'nameError'); });
  emailInput.addEventListener('input', function() { clearError(emailInput, 'emailError'); });

  function saveToLocalStorage(data) {
    try {
      var key = 'roomr_waitlist';
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(Object.assign({}, data, { timestamp: new Date().toISOString() }));
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch(e) { return false; }
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!validateName() || !validateEmail()) return;
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    if (errorEl) errorEl.style.display = 'none';

    var formData = { name: nameInput.value.trim(), email: emailInput.value.trim(), message: msgInput ? msgInput.value.trim() : '' };
    var action = form.getAttribute('action') || '';
    var isRealFormspree = action.includes('formspree.io/f/') && !action.includes('YOUR_FORM_ID');
    var success = false;

    if (isRealFormspree) {
      try {
        var res = await fetch(action, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formData) });
        success = res.ok ? true : saveToLocalStorage(formData);
      } catch(err) { saveToLocalStorage(formData); success = true; }
    } else {
      success = saveToLocalStorage(formData);
    }

    submitBtn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnLoading) btnLoading.style.display = 'none';

    if (success) {
      form.querySelectorAll('.form-group').forEach(function(g) { g.style.display = 'none'; });
      submitBtn.style.display = 'none';
      if (successEl) { successEl.style.display = 'block'; successEl.style.animation = 'fadeInUp 0.5s ease both'; }
    } else {
      if (errorEl) errorEl.style.display = 'block';
    }
  });
})();

/* ============================================================
   13. STICKER PARALLAX
   ============================================================ */
(function initParallaxStickers() {
  var stickers = document.querySelectorAll('.sticker');
  if (!stickers.length) return;
  var speeds = [0.04, -0.06, 0.035, -0.05, 0.07, -0.04];
  window.addEventListener('scroll', function() {
    var sy = window.scrollY;
    stickers.forEach(function(s, i) { s.style.transform = 'translateY(' + (sy * speeds[i % speeds.length]) + 'px)'; });
  }, { passive: true });
})();

/* ============================================================
   14. HERO REVEAL ON LOAD
   ============================================================ */
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.hero .reveal').forEach(function(el, i) {
    setTimeout(function() { el.classList.add('visible'); }, 80 + i * 110);
  });
});

/* ============================================================
   15. INJECT CSS ANIMATIONS
   ============================================================ */
(function injectAnimations() {
  var style = document.createElement('style');
  style.textContent = '@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
  document.head.appendChild(style);
})();

/* ============================================================
   16. KONAMI CODE EASTER EGG
   ============================================================ */
(function initKonami() {
  var code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var idx = 0;
  document.addEventListener('keydown', function(e) {
    if (e.key === code[idx]) { idx++; if (idx === code.length) { idx = 0; unleashConfetti(); } }
    else { idx = 0; }
  });
  function unleashConfetti() {
    var emojis = ['🏠','✨','🔥','🎉','💥','🚀','🎯','💯','🌙','🧹'];
    for (var i = 0; i < 50; i++) {
      (function(i) {
        setTimeout(function() {
          var el = document.createElement('span');
          el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          el.style.cssText = 'position:fixed;left:' + (Math.random()*100) + 'vw;top:-40px;font-size:' + (0.9+Math.random()*1.8) + 'rem;pointer-events:none;z-index:99999;animation:konfettiFall ' + (1.4+Math.random()*2.2) + 's ease-in forwards;';
          document.body.appendChild(el);
          el.addEventListener('animationend', function() { el.remove(); });
        }, i * 50);
      })(i);
    }
    if (!document.getElementById('konfetti-style')) {
      var s = document.createElement('style');
      s.id = 'konfetti-style';
      s.textContent = '@keyframes konfettiFall{from{transform:translateY(0) rotate(0deg);opacity:1}to{transform:translateY(110vh) rotate(720deg);opacity:0}}';
      document.head.appendChild(s);
    }
  }
})();

/* ============================================================
   17. TESTIMONIALS CAROUSEL
   ============================================================ */
(function initTestiCarousel() {

  var wrapper  = document.querySelector('.testi-carousel-wrapper');
  var track    = document.getElementById('testiTrack');
  var prevBtn  = document.getElementById('testiPrev');
  var nextBtn  = document.getElementById('testiNext');
  var dotsWrap = document.getElementById('testiDots');

  if (!track || !prevBtn || !nextBtn || !wrapper || !dotsWrap) return;

  var cards = Array.from(track.querySelectorAll('.testi-card'));
  if (!cards.length) return;

  var currentIndex = 0;
  var autoTimer    = null;
  var isPaused     = false;
  var isMobile     = false;

  /* ── On mobile, move arrows into a centred row below the track ── */
  function layoutArrows() {
    isMobile = window.innerWidth <= 768;
    if (isMobile) {
      var row = wrapper.querySelector('.testi-arrow-row');
      if (!row) {
        row = document.createElement('div');
        row.className = 'testi-arrow-row';
        wrapper.appendChild(row);
      }
      if (!row.contains(prevBtn)) row.appendChild(prevBtn);
      if (!row.contains(nextBtn)) row.appendChild(nextBtn);
    } else {
      /* desktop: put arrows back in wrapper before/after track */
      var row = wrapper.querySelector('.testi-arrow-row');
      if (row) {
        wrapper.insertBefore(prevBtn, track);
        wrapper.appendChild(nextBtn);
        row.remove();
      }
    }
  }

  layoutArrows();
  window.addEventListener('resize', layoutArrows, { passive: true });

  /* ── Build dot indicators ── */
  dotsWrap.innerHTML = '';
  cards.forEach(function(_, i) {
    var dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', function() { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.from(dotsWrap.querySelectorAll('.testi-dot'));

  /* ── Scroll track to show card[index] ── */
  function goTo(index) {
    index = Math.max(0, Math.min(cards.length - 1, index));
    currentIndex = index;
    /* Use scrollLeft directly — works on both desktop and mobile */
    track.scrollTo({ left: cards[index].offsetLeft, behavior: 'smooth' });
    syncUI();
  }

  /* ── Update dots + disabled states ── */
  function syncUI() {
    dots.forEach(function(d, i) { d.classList.toggle('active', i === currentIndex); });
    prevBtn.classList.toggle('is-disabled', currentIndex === 0);
    nextBtn.classList.toggle('is-disabled', currentIndex === cards.length - 1);
  }

  /* ── Arrow clicks ── */
  prevBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) goTo(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < cards.length - 1) goTo(currentIndex + 1);
  });

  /* ── Keep currentIndex in sync when user swipes on mobile ── */
  var swipeTimer;
  track.addEventListener('scroll', function() {
    clearTimeout(swipeTimer);
    swipeTimer = setTimeout(function() {
      var best = 0, bestDist = Infinity;
      cards.forEach(function(card, i) {
        var dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      if (best !== currentIndex) { currentIndex = best; syncUI(); }
    }, 80);
  }, { passive: true });

  /* ── Auto-advance ── */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() {
      if (isPaused) return;
      goTo(currentIndex >= cards.length - 1 ? 0 : currentIndex + 1);
    }, 4500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  wrapper.addEventListener('mouseenter', function() { isPaused = true; });
  wrapper.addEventListener('mouseleave', function() { isPaused = false; });
  track.addEventListener('touchstart', function() { isPaused = true; }, { passive: true });
  track.addEventListener('touchend', function() { setTimeout(function() { isPaused = false; }, 2500); }, { passive: true });

  /* ── Keyboard navigation ── */
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); if (currentIndex > 0) goTo(currentIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); if (currentIndex < cards.length - 1) goTo(currentIndex + 1); }
  });

  /* ── Hook arrows + dots into custom cursor ── */
  [prevBtn, nextBtn].concat(dots).forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
  });

  /* ── Init ── */
  goTo(0);
  startAuto();

})();