var DATA = [
  { id: 1, kelompok: 'Hari ini', tipe: 'laporan', status: 'diproses', judul: 'Laporan Diproses',
    isi: 'Laporan Jalan Rusak di Jl. Diponegoro telah diterima oleh petugas.', waktu: '14:53', href: 'laporan-diproses.html' },
  { id: 2, kelompok: 'Hari ini', tipe: 'laporan', status: 'diterima', judul: 'Laporan Diterima',
    isi: 'Laporan Lampu Jalan Mati di Jl. Diponegoro sedang dalam proses peninjauan.', waktu: '09:12', href: 'detail-laporan.html' },
  { id: 3, kelompok: 'Hari ini', tipe: 'laporan', status: 'selesai', judul: 'Laporan Selesai',
    isi: 'Laporan Sampah Menumpuk telah selesai ditindaklanjuti.', waktu: '13:42', href: 'laporan-selesai.html' },
  { id: 4, kelompok: 'Hari ini', tipe: 'laporan', status: 'ditolak', judul: 'Laporan Ditolak',
    isi: 'Laporan Drainase tidak bisa diproses karena diluar wilayah Kabupaten Nganjuk.', waktu: '14:30', href: 'laporan-ditolak.html' },

  { id: 5, kelompok: 'Kemarin', tipe: 'info', status: 'info', judul: 'Pemerintah',
    isi: 'Perubahan Jadwal Pengambilan Sampah di Desa Mulyorejo.', waktu: '18:30', href: 'detail-penanganan.html' },
  { id: 6, kelompok: 'Kemarin', tipe: 'info', status: 'info', judul: 'App',
    isi: 'Upgrade Versi Terbaru v1.5', waktu: '14:13', href: 'detail-penanganan.html' },

  { id: 7, kelompok: 'Bulan Lalu', tipe: 'laporan', status: 'diproses', judul: 'Laporan Diproses',
    isi: 'Laporan Jalan Rusak di Jl. Diponegoro telah diterima oleh petugas.', waktu: '28-09-2026, 13:11', href: 'laporan-diproses.html' },
  { id: 8, kelompok: 'Bulan Lalu', tipe: 'laporan', status: 'diterima', judul: 'Laporan Diterima',
    isi: 'Laporan Lampu Jalan Mati di Jl. Diponegoro sedang dalam proses peninjauan.', waktu: '22-09-2026, 09:12', href: 'detail-laporan.html' },
  { id: 9, kelompok: 'Bulan Lalu', tipe: 'laporan', status: 'selesai', judul: 'Laporan Selesai',
    isi: 'Laporan Sampah Menumpuk telah selesai ditindaklanjuti.', waktu: '20-09-2026, 15:01', href: 'laporan-selesai.html' },
  { id: 10, kelompok: 'Bulan Lalu', tipe: 'laporan', status: 'ditolak', judul: 'Laporan Ditolak',
    isi: 'Laporan Drainase tidak bisa diproses karena diluar wilayah Kabupaten Nganjuk.', waktu: '18-09-2026, 14:54', href: 'laporan-ditolak.html' }
];

var IKON = {
  diproses: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  diterima: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  selesai:  '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  ditolak:  '<path d="M6 6l12 12M18 6L6 18"/>',
  info:     '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6M18 7a7 7 0 0 1 0 10"/>'
};

var KUNCI = 'lingkunganku_notif_dibaca';

// Tab awal dibaca dari alamat, misalnya notifikasi.html?tab=laporan
var tabAktif = new URLSearchParams(window.location.search).get('tab') || 'semua';
if (['semua', 'laporan', 'info'].indexOf(tabAktif) === -1) tabAktif = 'semua';

function ambilDibaca() {
  try { return JSON.parse(localStorage.getItem(KUNCI) || '[]'); } catch (e) { return []; }
}
function simpanDibaca(arr) {
  try { localStorage.setItem(KUNCI, JSON.stringify(arr)); } catch (e) {}
}

// Pada kunjungan pertama, dua notifikasi teratas dianggap belum dibaca
if (localStorage.getItem(KUNCI) === null) {
  simpanDibaca(DATA.slice(2).map(function (d) { return d.id; }));
}

function render() {
  var dibaca = ambilDibaca();
  var status = document.getElementById('filter-status').value;
  var kata = document.getElementById('cari').value.trim().toLowerCase();
  var html = '';
  var kelompokTerakhir = '';
  var jumlah = 0;

  DATA.forEach(function (d) {
    if (tabAktif !== 'semua' && d.tipe !== tabAktif) return;
    if (status !== 'semua' && d.status !== status) return;
    if (kata && (d.judul + ' ' + d.isi).toLowerCase().indexOf(kata) === -1) return;

    if (d.kelompok !== kelompokTerakhir) {
      html += '<h2 class="kelompok">' + d.kelompok + '</h2>';
      kelompokTerakhir = d.kelompok;
    }
    var baru = dibaca.indexOf(d.id) === -1 ? ' baru' : '';
    html +=
      '<a class="notif-item' + baru + '" href="' + d.href + '" data-id="' + d.id + '">' +
        '<span class="ikon ' + d.status + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + IKON[d.status] + '</svg></span>' +
        '<span class="isi"><strong>' + d.judul + '<i class="titik"></i></strong><p>' + d.isi + '</p></span>' +
        '<span class="waktu">' + d.waktu + '</span>' +
        '<svg class="panah" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>' +
      '</a>';
    jumlah++;
  });

  document.getElementById('daftar').innerHTML = html;
  document.getElementById('kosong').hidden = jumlah > 0;
}

// Tab
function aktifkanTab() {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.classList.toggle('aktif', t.getAttribute('data-tab') === tabAktif);
  });
}
document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    tabAktif = tab.getAttribute('data-tab');
    aktifkanTab();
    render();
  });
});

document.getElementById('filter-status').addEventListener('change', render);
document.getElementById('cari').addEventListener('input', render);

// Tandai semua dibaca
document.getElementById('btn-baca-semua').addEventListener('click', function () {
  simpanDibaca(DATA.map(function (d) { return d.id; }));
  render();
});

// Klik satu notifikasi = tandai sudah dibaca
document.getElementById('daftar').addEventListener('click', function (e) {
  var item = e.target.closest('.notif-item');
  if (!item) return;
  var id = Number(item.getAttribute('data-id'));
  var dibaca = ambilDibaca();
  if (dibaca.indexOf(id) === -1) { dibaca.push(id); simpanDibaca(dibaca); }
});

aktifkanTab();
render();

