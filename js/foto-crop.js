/* Pengatur foto profil: geser dan zoom sebelum foto dipakai.
   Foto hasil berupa JPG persegi 512x512, lalu diteruskan ke kode profil.js. */
(function () {
  var input = document.getElementById('input-foto');
  if (!input) return;

  var V = 280;        // ukuran bingkai di layar (px)
  var HASIL = 512;    // ukuran foto hasil (px)
  var lewat = false;  // true saat foto hasil potong diteruskan ke profil.js

  // ---------- Gaya ----------
  var css = document.createElement('style');
  css.textContent =
    '.fc-latar{position:fixed;inset:0;z-index:2000;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.fc-latar[hidden]{display:none}' +
    '.fc-kotak{background:#fff;border-radius:10px;width:100%;max-width:340px;padding:18px;box-shadow:0 12px 40px rgba(15,23,42,.25);font-family:"Inter","Segoe UI",system-ui,sans-serif;color:#0F172A}' +
    '.fc-kotak h3{margin:0 0 4px;font-size:1.05rem;font-weight:600}' +
    '.fc-kotak p{margin:0 0 12px;font-size:.85rem;color:#64748B}' +
    '.fc-bingkai{position:relative;width:' + V + 'px;height:' + V + 'px;margin:0 auto;overflow:hidden;background:#E2E8F0;border-radius:8px;touch-action:none;cursor:grab}' +
    '.fc-bingkai img{position:absolute;left:0;top:0;max-width:none;user-select:none;-webkit-user-drag:none;pointer-events:none}' +
    '.fc-bingkai::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 400px rgba(255,255,255,.65);pointer-events:none}' +
    '.fc-zoom{display:flex;align-items:center;gap:10px;margin-top:14px;font-size:.8rem;color:#64748B}' +
    '.fc-zoom input{flex:1;min-width:0}' +
    '.fc-aksi{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}' +
    '.fc-btn{font:inherit;font-size:.85rem;font-weight:500;padding:6px 14px;border-radius:6px;border:1px solid #E2E8F0;background:#fff;color:#0F172A;cursor:pointer}' +
    '.fc-btn:hover{border-color:#64748B}' +
    '.fc-btn.fc-utama{background:#2563EB;border-color:#2563EB;color:#fff}' +
    '.fc-btn.fc-utama:hover{background:#1D4ED8;border-color:#1D4ED8}';
  document.head.appendChild(css);

  // ---------- Jendela ----------
  var latar = document.createElement('div');
  latar.className = 'fc-latar';
  latar.hidden = true;
  latar.innerHTML =
    '<div class="fc-kotak" role="dialog" aria-modal="true" aria-labelledby="fc-judul">' +
      '<h3 id="fc-judul">Atur foto profil</h3>' +
      '<p>Seret foto untuk menggeser, geser penggeser untuk memperbesar.</p>' +
      '<div class="fc-bingkai" id="fc-bingkai" tabindex="0" aria-label="Area foto. Seret atau gunakan tombol panah untuk menggeser.">' +
        '<img id="fc-img" alt="">' +
      '</div>' +
      '<div class="fc-zoom"><span>Kecil</span><input type="range" id="fc-zoom" min="1" max="3" step="0.01" value="1" aria-label="Perbesar foto"><span>Besar</span></div>' +
      '<div class="fc-aksi">' +
        '<button type="button" class="fc-btn" id="fc-batal">Batal</button>' +
        '<button type="button" class="fc-btn fc-utama" id="fc-ok">Terapkan</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(latar);

  var bingkai = document.getElementById('fc-bingkai');
  var img = document.getElementById('fc-img');
  var zoom = document.getElementById('fc-zoom');
  var nw, nh, base, z, s, ox, oy, url = null;

  // ---------- Posisi dan zoom ----------
  function gambar() {
    ox = Math.min(0, Math.max(V - nw * s, ox));   // foto tidak boleh meninggalkan celah kosong
    oy = Math.min(0, Math.max(V - nh * s, oy));
    img.style.width = nw * s + 'px';
    img.style.height = nh * s + 'px';
    img.style.left = ox + 'px';
    img.style.top = oy + 'px';
  }
  function atur(zBaru) {
    zBaru = Math.min(3, Math.max(1, zBaru));
    var cx = (V / 2 - ox) / s, cy = (V / 2 - oy) / s;   // titik tengah tetap di tempatnya
    z = zBaru; s = base * z;
    ox = V / 2 - cx * s; oy = V / 2 - cy * s;
    zoom.value = z;
    gambar();
  }

  // ---------- Buka dan tutup ----------
  function buka(file) {
    url = URL.createObjectURL(file);
    var tmp = new Image();
    tmp.onload = function () {
      nw = tmp.naturalWidth; nh = tmp.naturalHeight;
      base = V / Math.min(nw, nh);
      z = 1; s = base;
      ox = (V - nw * s) / 2; oy = (V - nh * s) / 2;
      img.src = url;
      zoom.value = 1;
      gambar();
      latar.hidden = false;
      bingkai.focus();
    };
    tmp.onerror = function () {
      URL.revokeObjectURL(url); url = null; input.value = '';
      alert('Foto tidak dapat dibaca. Coba foto lain.');
    };
    tmp.src = url;
  }
  function tutup(batal) {
    latar.hidden = true;
    if (url) { URL.revokeObjectURL(url); url = null; }
    img.removeAttribute('src');
    if (batal) input.value = '';
  }

  // ---------- Geser dengan mouse atau sentuhan ----------
  var tarik = null;
  bingkai.addEventListener('pointerdown', function (e) {
    tarik = { x: e.clientX, y: e.clientY, ox: ox, oy: oy };
    bingkai.setPointerCapture(e.pointerId);
    bingkai.style.cursor = 'grabbing';
  });
  bingkai.addEventListener('pointermove', function (e) {
    if (!tarik) return;
    ox = tarik.ox + (e.clientX - tarik.x);
    oy = tarik.oy + (e.clientY - tarik.y);
    gambar();
  });
  function lepas() { tarik = null; bingkai.style.cursor = ''; }
  bingkai.addEventListener('pointerup', lepas);
  bingkai.addEventListener('pointercancel', lepas);

  // Roda mouse = zoom, tombol panah = geser, + dan - = zoom
  bingkai.addEventListener('wheel', function (e) {
    e.preventDefault();
    atur(z - e.deltaY * 0.002);
  }, { passive: false });
  bingkai.addEventListener('keydown', function (e) {
    var langkah = 10, pakai = true;
    if (e.key === 'ArrowLeft') ox += langkah;
    else if (e.key === 'ArrowRight') ox -= langkah;
    else if (e.key === 'ArrowUp') oy += langkah;
    else if (e.key === 'ArrowDown') oy -= langkah;
    else if (e.key === '+' || e.key === '=') { atur(z + 0.1); return e.preventDefault(); }
    else if (e.key === '-') { atur(z - 0.1); return e.preventDefault(); }
    else pakai = false;
    if (pakai) { e.preventDefault(); gambar(); }
  });
  zoom.addEventListener('input', function () { atur(parseFloat(zoom.value)); });

  // ---------- Terapkan ----------
  function terapkan() {
    var c = document.createElement('canvas');
    c.width = c.height = HASIL;
    var g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, HASIL, HASIL);
    g.drawImage(img, -ox / s, -oy / s, V / s, V / s, 0, 0, HASIL, HASIL);
    c.toBlob(function (blob) {
      if (!blob) { alert('Foto tidak dapat diproses.'); return; }
      var hasil = new File([blob], 'foto-profil.jpg', { type: 'image/jpeg' });
      var dt = new DataTransfer();
      dt.items.add(hasil);
      input.files = dt.files;
      tutup(false);
      lewat = true;   // teruskan foto hasil ke kode profil.js
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'image/jpeg', 0.9);
  }

  document.getElementById('fc-ok').addEventListener('click', terapkan);
  document.getElementById('fc-batal').addEventListener('click', function () { tutup(true); });
  latar.addEventListener('mousedown', function (e) { if (e.target === latar) tutup(true); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !latar.hidden) tutup(true);
  });

  // ---------- Cegat pemilihan foto (sebelum kode profil.js) ----------
  input.addEventListener('change', function (e) {
    if (lewat) { lewat = false; return; }
    var f = input.files && input.files[0];
    if (!f) return;
    // Format salah atau lebih dari 2 MB: biarkan profil.js menampilkan pesan kesalahannya
    if (!/^image\/(png|jpeg|gif)$/.test(f.type) || f.size > 2 * 1024 * 1024) return;
    e.stopImmediatePropagation();
    buka(f);
  }, true);
})();