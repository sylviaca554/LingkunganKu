/**
 * LingkunganKU — Hero Parallax
 * js/hero-parallax.js
 *
 * Fitur:
 * - Scroll parallax: setiap layer bergerak dengan kecepatan berbeda
 * - Mouse parallax: layer bergeser mengikuti posisi kursor (desktop)
 * - Touch scroll: efek ringan di perangkat sentuh
 * - requestAnimationFrame untuk performa optimal
 * - Menghormati prefers-reduced-motion
 * - Tidak memengaruhi elemen interaktif (input, button)
 */

(function () {
  'use strict';

  // Hentikan jika reduced motion aktif
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var hero    = document.querySelector('.hero');
  var layers  = document.querySelectorAll('.hero-layer[data-speed]');
  var content = document.querySelector('.hero-content');

  if (!hero || !layers.length) return;

  // State
  var mouseX     = 0;
  var mouseY     = 0;
  var targetMX   = 0;
  var targetMY   = 0;
  var rafId      = null;
  var isMobile   = window.matchMedia('(max-width: 767px)').matches;
  var heroHeight = hero.offsetHeight;

  // Intensitas gerakan mouse (lebih kecil = lebih halus)
  var MOUSE_INTENSITY = isMobile ? 0 : 12;
  var LERP_FACTOR     = 0.06; // interpolasi halus

  /**
   * Lerp (linear interpolation)
   */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Terapkan transform ke setiap layer
   */
  function applyParallax() {
    // Interpolasi mouse supaya gerakannya halus
    mouseX = lerp(mouseX, targetMX, LERP_FACTOR);
    mouseY = lerp(mouseY, targetMY, LERP_FACTOR);

    var heroRect   = hero.getBoundingClientRect();
    var heroTop    = -heroRect.top;       // seberapa jauh sudah di-scroll dari atas hero
    var heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    // Hanya proses saat hero terlihat
    if (!heroVisible) {
      rafId = requestAnimationFrame(applyParallax);
      return;
    }

    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      var speed = parseFloat(layer.getAttribute('data-speed')) || 0;

      // Scroll offset: layer belakang bergerak lebih lambat
      var scrollOffset = heroTop * speed * 0.4;

      // Mouse offset: layer belakang bergerak lebih sedikit
      var mx = (mouseX * speed * MOUSE_INTENSITY * 0.5);
      var my = (mouseY * speed * MOUSE_INTENSITY * 0.3);

      layer.style.transform =
        'translate3d(' + mx + 'px, calc(' + scrollOffset + 'px + ' + my + 'px), 0)';
    }

    rafId = requestAnimationFrame(applyParallax);
  }

  /**
   * Mouse move — hitung posisi relatif terhadap pusat hero
   */
  function onMouseMove(e) {
    // Jangan proses jika fokus ada di input/button
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;

    var rect = hero.getBoundingClientRect();
    var cx   = rect.left + rect.width  / 2;
    var cy   = rect.top  + rect.height / 2;

    // Normalize: -1 sampai 1
    targetMX = (e.clientX - cx) / (rect.width  / 2);
    targetMY = (e.clientY - cy) / (rect.height / 2);

    // Batasi range
    targetMX = Math.max(-1, Math.min(1, targetMX));
    targetMY = Math.max(-1, Math.min(1, targetMY));
  }

  /**
   * Scroll handler — tidak diperlukan lagi karena RAF menggunakan getBoundingClientRect
   * yang otomatis baca posisi scroll terkini. Tetap pasang untuk updateNavbarState.
   */
  function onScroll() {
    updateNavbarState();
  }

  /**
   * Resize — update flag mobile
   */
  function onResize() {
    isMobile        = window.matchMedia('(max-width: 767px)').matches;
    MOUSE_INTENSITY = isMobile ? 0 : 12;
    heroHeight      = hero.offsetHeight;
  }

  /**
   * Scroll class untuk navbar (efek "scrolled")
   */
  function updateNavbarState() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    if (window.pageYOffset > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Pasang event listeners
  hero.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll',  onScroll,    { passive: true });
  window.addEventListener('resize',  onResize,    { passive: true });

  // Mouse keluar area hero: kembalikan ke tengah
  hero.addEventListener('mouseleave', function () {
    targetMX = 0;
    targetMY = 0;
  });

  // Mulai RAF loop
  rafId = requestAnimationFrame(applyParallax);

  // Cleanup saat halaman unload
  window.addEventListener('pagehide', function () {
    if (rafId) cancelAnimationFrame(rafId);
  });

})();
