/* ============================================================
   TESTIMONIALS CAROUSEL — FIXED v2
   ─────────────────────────────────────────────────────────────
   INSTRUCTIONS:
   If you previously added a carousel block to index.js, DELETE
   that old block first (the one starting with
   "/* ============ 17. TESTIMONIALS CAROUSEL").
   Then APPEND this entire file to the bottom of index.js.
   ============================================================ */

(function initTestiCarousel() {
  'use strict';

  /* ── DOM refs ── */
  const wrapper  = document.querySelector('.testi-carousel-wrapper');
  const track    = document.getElementById('testiTrack');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');

  if (!track || !prevBtn || !nextBtn || !wrapper) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  if (!cards.length) return;

  /* ── On mobile, move both arrows into a centred row below the track ── */
  function setupMobileArrows() {
    if (window.innerWidth <= 768) {
      let row = wrapper.querySelector('.testi-arrow-row');
      if (!row) {
        row = document.createElement('div');
        row.className = 'testi-arrow-row';
        wrapper.appendChild(row);
      }
      if (!row.contains(prevBtn)) row.appendChild(prevBtn);
      if (!row.contains(nextBtn)) row.appendChild(nextBtn);
    } else {
      /* desktop — put arrows back as direct children of wrapper in order */
      if (!wrapper.contains(prevBtn) || wrapper.querySelector('.testi-arrow-row')?.contains(prevBtn)) {
        const row = wrapper.querySelector('.testi-arrow-row');
        if (row) {
          wrapper.insertBefore(prevBtn, track);
          wrapper.appendChild(nextBtn);
          row.remove();
        }
      }
    }
  }
  setupMobileArrows();
  window.addEventListener('resize', setupMobileArrows, { passive: true });

  /* ── State ── */
  let currentIndex = 0;
  let autoTimer    = null;
  let isPaused     = false;

  /* ── Build dots ── */
  dotsWrap.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.testi-dot'));

  /* ── Core: scroll track so card[index] is fully in view ── */
  function goTo(index, animate) {
    /* clamp */
    index = Math.max(0, Math.min(cards.length - 1, index));
    currentIndex = index;

    const card     = cards[index];
    const cardLeft = card.offsetLeft;

    /* Smooth-scroll the track */
    track.scrollTo({ left: cardLeft, behavior: animate === false ? 'auto' : 'smooth' });

    updateUI();
  }

  /* ── Sync dots + arrow disabled states ── */
  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    prevBtn.classList.toggle('testi-arrow-disabled', currentIndex === 0);
    nextBtn.classList.toggle('testi-arrow-disabled', currentIndex === cards.length - 1);
  }

  /* ── Arrow clicks — no event delegation confusion ── */
  prevBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) goTo(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < cards.length - 1) goTo(currentIndex + 1);
  });

  /* ── Keep currentIndex in sync when user swipes on mobile ── */
  let swipeDebounce;
  track.addEventListener('scroll', function () {
    clearTimeout(swipeDebounce);
    swipeDebounce = setTimeout(function () {
      /* Find which card's left edge is closest to the track's current scroll */
      let best = 0;
      let bestDist = Infinity;
      cards.forEach(function (card, i) {
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      if (best !== currentIndex) {
        currentIndex = best;
        updateUI();
      }
    }, 80);
  }, { passive: true });

  /* ── Auto-advance every 4.5 s ── */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      if (isPaused) return;
      const next = currentIndex >= cards.length - 1 ? 0 : currentIndex + 1;
      goTo(next);
    }, 4500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  /* Pause on hover / touch */
  wrapper.addEventListener('mouseenter', function () { isPaused = true;  });
  wrapper.addEventListener('mouseleave', function () { isPaused = false; });
  track.addEventListener('touchstart',   function () { isPaused = true;  }, { passive: true });
  track.addEventListener('touchend',     function () {
    setTimeout(function () { isPaused = false; }, 2500);
  }, { passive: true });

  /* ── Keyboard: arrow keys when track is focused ── */
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prevBtn.click(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); nextBtn.click(); }
  });

  /* ── Hook into existing cursor system ── */
  if (typeof document.body.classList !== 'undefined') {
    [prevBtn, nextBtn, ...dots].forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

  /* ── Init ── */
  goTo(0, false);
  startAuto();

})();