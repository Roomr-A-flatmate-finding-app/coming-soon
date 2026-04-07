/* ============================================================
   ROOMR — splash.js  v2.0
   NEW FILE — no existing code modified.
   Load this in index.html as the FIRST script (before index.js):
     <script src="splash.js"></script>
     <script src="index.js"></script>

   What it does:
   • Checks for a cookie named "roomr_splash_seen".
   • If the cookie is absent → shows the animated splash, sets the
     cookie (TTL 30 min), then fades out into the main page.
   • If the cookie is present  → does nothing; main page shows normally.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Cookie helpers ──────────────────────────────────── */
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, minutes) {
    var expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  /* ── 2. Should we show the splash? ─────────────────────── */
  var COOKIE_NAME = 'roomr_splash_seesn';
  var COOKIE_TTL  = 30; /* minutes */

  if (getCookie(COOKIE_NAME)) {
    return; /* Cookie present — skip splash entirely */
  }

  /* ── 3. Inject styles + HTML via document.write ────────── */
  /*
   * Written inline so everything is available before first paint —
   * no flash of main page content. All animation is CSS-driven;
   * the canvas approach has been replaced with real DOM elements
   * using Manrope text and the actual logo.png image.
   */
  var styles = [
    /* base overlay */
    '#splashScreen{',
      'position:fixed;inset:0;z-index:999999;',
      'background:#080808;',
      'display:flex;flex-direction:column;',
      'align-items:center;justify-content:center;',
      'overflow:hidden;',
      'font-family:"Manrope","Helvetica Neue",Helvetica,Arial,sans-serif;',
    '}',

    /* ambient glow blobs */
    '#splashScreen .sp-blob{',
      'position:absolute;border-radius:50%;',
      'filter:blur(120px);pointer-events:none;',
    '}',
    '#splashScreen .sp-blob-1{',
      'width:520px;height:520px;background:#ea481e;',
      'top:-15%;left:-10%;opacity:0.13;',
      'animation:spBlobPulse 8s ease-in-out infinite;',
    '}',
    '#splashScreen .sp-blob-2{',
      'width:340px;height:340px;background:#f7940c;',
      'bottom:-10%;right:5%;opacity:0.10;',
      'animation:spBlobPulse 10s ease-in-out infinite reverse;',
    '}',
    '@keyframes spBlobPulse{',
      '0%,100%{transform:scale(1) translate(0,0)}',
      '50%{transform:scale(1.12) translate(20px,-20px)}',
    '}',

    /* wordmark row */
    '#splashWordmark{',
      'display:flex;align-items:center;',
      'gap:0;line-height:1;',
      'position:relative;z-index:1;',
    '}',

    /* R (left) — slides in from left */
    '#splashR1{',
      'font-size:clamp(3.2rem,8vw,6rem);',
      'font-weight:800;',
      'letter-spacing:-0.05em;',
      'color:#ffffff;',
      'opacity:0;transform:translateX(-36px);',
      'animation:spSlideInL 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.45s forwards;',
    '}',

    /* logo image — spins and scales in first */
    '#splashLogo{',
      'display:block;',
      'height:clamp(2.6rem,6.5vw,4.9rem);',
      'width:auto;',
      'margin:0 clamp(4px,0.6vw,10px);',
      'margin-top:-2px;',
      'opacity:0;transform:scale(0.5) rotate(-20deg);',
      'animation:spLogoIn 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.0s forwards;',
    '}',

    /* MR (right) — slides in from right */
    '#splashMR{',
      'font-size:clamp(3.2rem,8vw,6rem);',
      'font-weight:800;',
      'letter-spacing:-0.05em;',
      'color:#ffffff;',
      'opacity:0;transform:translateX(36px);',
      'animation:spSlideInR 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.45s forwards;',
    '}',

    /* gradient dot */
    '#splashDot{',
      'font-size:clamp(3.8rem,9.5vw,7.2rem);',
      'font-weight:800;line-height:1;margin-left:2px;',
      'background:linear-gradient(90deg,#ea481e,#f7940c);',
      '-webkit-background-clip:text;-webkit-text-fill-color:transparent;',
      'background-clip:text;',
      'opacity:0;transform:translateY(10px);',
      'animation:spFadeUp 0.4s cubic-bezier(0.4,0,0.2,1) 0.82s forwards;',
    '}',

    /* tagline below wordmark */
    '#splashTag{',
      'margin-top:clamp(18px,3vw,28px);',
      'font-size:clamp(0.68rem,1.5vw,0.85rem);',
      'font-weight:600;',
      'letter-spacing:0.22em;',
      'text-transform:uppercase;',
      'color:rgba(255,255,255,0.28);',
      'white-space:nowrap;',
      'opacity:0;transform:translateY(8px);',
      'animation:spFadeUpSimple 0.45s ease 1.0s forwards;',
      'position:relative;z-index:1;',
    '}',

    /* progress bar */
    '#splashBar{',
      'position:absolute;bottom:0;left:0;right:0;',
      'height:2.5px;background:rgba(255,255,255,0.06);z-index:1;',
    '}',
    '#splashBarFill{',
      'height:100%;width:0%;',
      'background:linear-gradient(90deg,#ea481e,#f7940c);',
      'border-radius:0 2px 2px 0;',
      'box-shadow:0 0 8px rgba(234,72,30,0.7);',
      'animation:spBarFill 1.55s cubic-bezier(0.4,0,0.2,1) 0.0s forwards;',
    '}',
    '@keyframes spBarFill{0%{width:0%}100%{width:100%}}',

    /* keyframes */
    '@keyframes spLogoIn{',
      '0%{opacity:0;transform:scale(0.5) rotate(-20deg)}',
      '55%{opacity:1;transform:scale(1.07) rotate(5deg)}',
      '75%{transform:scale(0.96) rotate(-2deg)}',
      '100%{opacity:1;transform:scale(1) rotate(0deg)}',
    '}',
    '@keyframes spSlideInL{',
      '0%{opacity:0;transform:translateX(-36px)}',
      '100%{opacity:1;transform:translateX(0)}',
    '}',
    '@keyframes spSlideInR{',
      '0%{opacity:0;transform:translateX(36px)}',
      '100%{opacity:1;transform:translateX(0)}',
    '}',
    '@keyframes spFadeUp{',
      '0%{opacity:0;transform:translateY(10px)}',
      '100%{opacity:1;transform:translateY(0)}',
    '}',
    '@keyframes spFadeUpSimple{',
      '0%{opacity:0;transform:translateY(8px)}',
      '100%{opacity:1;transform:translateY(0)}',
    '}',

    /* exit */
    '@keyframes splashFadeOut{',
      '0%{opacity:1;transform:scale(1)}',
      '100%{opacity:0;transform:scale(1.035)}',
    '}',

    /* reduced-motion */
    '@media(prefers-reduced-motion:reduce){',
      '#splashR1,#splashLogo,#splashMR,#splashDot,#splashTag{',
        'animation-duration:0.01ms!important;',
        'animation-delay:0ms!important;',
        'opacity:1!important;transform:none!important;',
      '}',
      '#splashBarFill{animation-duration:0.01ms!important;width:100%!important}',
    '}'
  ].join('');

  var html = [
    '<style id="splash-styles">' + styles + '</style>',
    '<div id="splashScreen">',
      '<div class="sp-blob sp-blob-1"></div>',
      '<div class="sp-blob sp-blob-2"></div>',
      '<div id="splashWordmark">',
        '<span id="splashR1" style="margin-right:2px;margin-bottom:4px">r</span>',
        '<img id="splashLogo" src="logo.png" alt="" aria-hidden="true" />',
        '<span id="splashMR">mrr</span>',
      '</div>',
      '<span id="splashTag">Find your tribe.</span>',
      '<div id="splashBar"><div id="splashBarFill"></div></div>',
    '</div>'
  ].join('');

  document.write(html);

  /* Lock body scroll while splash is up */
  document.documentElement.style.overflow = 'hidden';

  /* ── 4. Auto-dismiss after animations complete ───────────
   *
   * Timeline:
   *   0.00s  logo spins + scales in
   *   0.45s  "R" slides from left, "MR" from right
   *   0.82s  dot fades up
   *   1.00s  tagline fades up, bar reaches 100%
   *   1.75s  hold → exitSplash()
   */
  var DISMISS_AFTER = 1750; /* ms after DOMContentLoaded */

  window.addEventListener('DOMContentLoaded', function () {
    var splash = document.getElementById('splashScreen');
    if (!splash) return;

    setTimeout(function () {
      exitSplash(splash);
    }, DISMISS_AFTER);
  });

  /* ── Exit: fade out, set cookie, then remove ── */
  function exitSplash(splash) {
    // setCookie(COOKIE_NAME, '1', COOKIE_TTL);

    splash.style.animation     = 'splashFadeOut 0.55s cubic-bezier(0.4,0,0.2,1) forwards';
    splash.style.pointerEvents = 'none';

    splash.addEventListener('animationend', function () {
      splash.remove();
      document.documentElement.style.overflow = '';
    }, { once: true });
  }

})();