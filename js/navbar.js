(function () {
  var host = document.querySelector('.site-header');
  if (!host) return;

  var FOTO_DEFAULT = './assets/images/foto_profil.jpg';

  // Tentukan menu aktif dari nama file (bisa ditimpa lewat data-aktif)
  var halaman = location.pathname.split('/').pop() || 'index.html';
  var aktif = host.getAttribute('data-aktif');
  if (!aktif) {
    if (halaman === 'index.html') aktif = 'beranda';
    else if (halaman.indexOf('buat-laporan') === 0) aktif = 'buat';
    else if (halaman.indexOf('notifikasi') === 0) aktif = 'notifikasi';
    else if (halaman.indexOf('profil') === 0) aktif = 'profil';
    else if (halaman.indexOf('laporan') === 0 || halaman.indexOf('cari-laporan') === 0 ||
             halaman.indexOf('detail-') === 0) aktif = 'laporan';
  }

  var MENU = [
    { id: 'beranda',    teks: 'Beranda',      href: 'index.html' },
    { id: 'laporan',    teks: 'Laporan',      href: 'laporan-semua.html' },
    { id: 'buat',       teks: 'Buat Laporan', href: 'buat-laporan.html' },
    { id: 'notifikasi', teks: 'Notifikasi',   href: 'notifikasi.html' },
    { id: 'profil',     teks: 'Profil',       href: 'profil.html' }
  ];

  var menuHtml = MENU.map(function (m) {
    return '<li><a href="' + m.href + '"' +
      (m.id === aktif ? ' aria-current="page"' : '') + '>' + m.teks + '</a></li>';
  }).join('');

  host.innerHTML =
    '<div class="navbar">' +
      '<a class="brand" href="index.html">' +
        '<img src="./assets/images/logo.png" alt="Logo LingkunganKu"><span class="brand-teks">Lingkungan<span class="brand-ku">Ku</span></span>' +
      '</a>' +
      '<nav aria-label="Menu Situs"><ul>' + menuHtml + '</ul></nav>' +
      '<div class="nav-aksi">' +
        '<div class="nav-tamu" id="nav-tamu">' +
          '<a class="nav-masuk" href="login.html">Masuk</a>' +
          '<a class="nav-daftar" href="register.html">Daftar</a>' +
        '</div>' +
        '<a class="nav-user" id="nav-user" href="profil.html" hidden>' +
          '<img id="nav-user-foto" src="' + FOTO_DEFAULT + '" alt="">' +
          '<span id="nav-user-nama"></span>' +
        '</a>' +
      '</div>' +
      '<button class="nav-hamburger" id="nav-hamburger" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-mobile-menu">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
      '</button>' +
    '</div>';

  // Hamburger toggle
  var hamburger = document.getElementById('nav-hamburger');
  var navMenu   = host.querySelector('nav[aria-label="Menu Situs"]');
  if (hamburger && navMenu) {
    navMenu.id = 'nav-mobile-menu';
    hamburger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.innerHTML = isOpen
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    // Tutup menu saat Escape ditekan
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        hamburger.focus(); // kembalikan fokus ke tombol hamburger
      }
    });

    // Tutup menu saat klik di luar navbar
    document.addEventListener('click', function (e) {
      if (!host.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      }
    });
  }

  // Jika sudah login: ganti Masuk/Daftar dengan foto dan nama pengguna
  var nama = localStorage.getItem('lingkunganku_nama');
  if (localStorage.getItem('lingkunganku_logged_in') === 'true' && nama) {
    document.getElementById('nav-tamu').hidden = true;
    document.getElementById('nav-user').hidden = false;
    document.getElementById('nav-user-nama').textContent = nama.split(' ')[0];
    document.getElementById('nav-user-foto').src =
      localStorage.getItem('lingkunganku_foto') || FOTO_DEFAULT;
  }
  
   // Efek kaca bertahap: nilai 0 (di atas) sampai 1 (setelah gulir 80px)
  var menunggu = false;
  function aturGulir() {
    var g = Math.min(Math.max(window.scrollY / 80, 0), 1);
    host.style.setProperty('--nb-g', g.toFixed(3));
    menunggu = false;
  }
  window.addEventListener('scroll', function () {
    if (!menunggu) { menunggu = true; requestAnimationFrame(aturGulir); }
  }, { passive: true });
  aturGulir();
})();