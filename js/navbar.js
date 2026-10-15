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
        '<img src="./assets/images/logo.png" alt="Logo LingkunganKU">LingkunganKU' +
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
    '</div>';

  // Jika sudah login: ganti Masuk/Daftar dengan foto dan nama pengguna
  var nama = localStorage.getItem('lingkunganku_nama');
  if (localStorage.getItem('lingkunganku_logged_in') === 'true' && nama) {
    document.getElementById('nav-tamu').hidden = true;
    document.getElementById('nav-user').hidden = false;
    document.getElementById('nav-user-nama').textContent = nama.split(' ')[0];
    document.getElementById('nav-user-foto').src =
      localStorage.getItem('lingkunganku_foto') || FOTO_DEFAULT;
  }
})();