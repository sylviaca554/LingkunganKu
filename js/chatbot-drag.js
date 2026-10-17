(function () {
  var SELECTOR = '#cb-fab';

  var KUNCI = 'lingkunganku_chatbot_pos';
  var MARGIN = 16;      // jarak minimal dari tepi layar
  var AMBANG = 5;       // geseran di bawah 5px dianggap klik biasa
  var btn = document.querySelector(SELECTOR);
  if (!btn) return;

  var mulaiX, mulaiY, awalKiri, awalAtas, bergeser = false, tahan = false, abaikanKlik = false;

  function batasi(x, y) {
    var maxX = window.innerWidth - btn.offsetWidth - MARGIN;
    var maxY = window.innerHeight - btn.offsetHeight - MARGIN;
    return {
      x: Math.min(Math.max(MARGIN, x), Math.max(MARGIN, maxX)),
      y: Math.min(Math.max(MARGIN, y), Math.max(MARGIN, maxY))
    };
  }

  function taruh(x, y) {
    var p = batasi(x, y);
    btn.style.position = 'fixed';
    btn.style.left = p.x + 'px';
    btn.style.top = p.y + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    document.dispatchEvent(new CustomEvent('chatbot:pindah', { detail: p }));
  }

  function simpan() {
    try {
      var r = btn.getBoundingClientRect();
      localStorage.setItem(KUNCI, JSON.stringify({ x: r.left, y: r.top }));
    } catch (e) {}
  }

  // Pulihkan posisi tersimpan
  try {
    var tersimpan = JSON.parse(localStorage.getItem(KUNCI) || 'null');
    if (tersimpan) taruh(tersimpan.x, tersimpan.y);
  } catch (e) {}

  btn.classList.add('bisa-digeser');

  btn.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    var r = btn.getBoundingClientRect();
    mulaiX = e.clientX; mulaiY = e.clientY;
    awalKiri = r.left; awalAtas = r.top;
    bergeser = false; tahan = true;
    btn.setPointerCapture(e.pointerId);
  });

  btn.addEventListener('pointermove', function (e) {
    if (!tahan) return;
    var dx = e.clientX - mulaiX, dy = e.clientY - mulaiY;
    if (!bergeser && Math.abs(dx) < AMBANG && Math.abs(dy) < AMBANG) return;
    bergeser = true;
    btn.classList.add('sedang-digeser');
    taruh(awalKiri + dx, awalAtas + dy);
  });

  function lepas(e) {
    if (!tahan) return;
    tahan = false;
    try { btn.releasePointerCapture(e.pointerId); } catch (err) {}
    btn.classList.remove('sedang-digeser');
    if (bergeser) {
      abaikanKlik = true;   // jangan buka chat setelah menggeser
      setTimeout(function () { abaikanKlik = false; }, 80);
      // Tempel ke sisi kiri/kanan terdekat
      var r = btn.getBoundingClientRect();
      var ke = (r.left + r.width / 2 < window.innerWidth / 2) ? MARGIN : window.innerWidth - r.width - MARGIN;
      btn.style.transition = 'left .2s ease';
      taruh(ke, r.top);
      setTimeout(function () { btn.style.transition = ''; }, 220);
      simpan();
    }
  }
  btn.addEventListener('pointerup', lepas);
  btn.addEventListener('pointercancel', lepas);

  // Cegah klik yang muncul setelah menggeser
  document.addEventListener('click', function (e) {
    if (abaikanKlik && e.target.closest(SELECTOR)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
    abaikanKlik = false;
  }, true);

  // Jaga agar tombol tidak keluar layar saat ukuran jendela berubah
  window.addEventListener('resize', function () {
    var r = btn.getBoundingClientRect();
    taruh(r.left, r.top);
    simpan();
  });
})();