var FOTO_DEFAULT = './assets/images/avatar-default.png';

// Sinkron data login ke profil
var nama = localStorage.getItem('lingkunganku_nama');

// Jika belum login, arahkan ke login
if (!nama) {
  window.location.href = 'login.html';
}

var elNamaDepan = document.getElementById('nama-depan');
var elNamaBelakang = document.getElementById('nama-belakang');
var elEmail = document.getElementById('email');
var elStatus = document.getElementById('status');
var fotoBaru = localStorage.getItem('lingkunganku_foto'); // foto yang sedang dipilih (belum tentu disimpan)

function tampilkanFoto(src) {
  var url = src || FOTO_DEFAULT;
  document.getElementById('foto-preview').src = url;
  document.getElementById('foto-sidebar').src = url;
}

function tampilkanPesan(teks, sukses) {
  elStatus.style.color = sukses ? '#1a8a4a' : '#c0392b';
  elStatus.textContent = teks;
}

function isiForm() {
  var n = localStorage.getItem('lingkunganku_nama') || '';
  var e = localStorage.getItem('lingkunganku_email') || '';
  var bagian = n.trim().split(' ');
  elNamaDepan.value = bagian.shift() || '';
  elNamaBelakang.value = bagian.join(' ');
  elEmail.value = e;
  elEmail.readOnly = true;
  fotoBaru = localStorage.getItem('lingkunganku_foto');
  tampilkanFoto(fotoBaru);
  document.getElementById('profil-nama').textContent = n || '-';
  document.getElementById('profil-kontak').textContent = e || '-';
}
isiForm();

// Unggah foto
document.getElementById('btn-unggah').addEventListener('click', function () {
  document.getElementById('input-foto').click();
});
document.getElementById('input-foto').addEventListener('change', function (e) {
  var file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    tampilkanPesan('Ukuran foto melebihi 2 MB.', false);
    return;
  }
  var reader = new FileReader();
  reader.onload = function () {
    fotoBaru = reader.result;
    tampilkanFoto(fotoBaru);
    elStatus.textContent = '';
  };
  reader.readAsDataURL(file);
});

// Hapus foto
document.getElementById('btn-hapus-foto').addEventListener('click', function () {
  fotoBaru = null;
  tampilkanFoto(null);
});

// Ubah email
document.getElementById('btn-ubah-email').addEventListener('click', function () {
  elEmail.readOnly = false;
  elEmail.focus();
});

// Ubah kata sandi (placeholder, hubungkan ke fitur kata sandi kalian)
document.getElementById('btn-ubah-sandi').addEventListener('click', function () {
  alert('Fitur ubah kata sandi belum tersedia.');
});

// Batal: kembalikan ke data tersimpan
document.getElementById('btn-batal').addEventListener('click', function () {
  isiForm();
  elStatus.textContent = '';
});

// Simpan
document.getElementById('form-akun').addEventListener('submit', function (e) {
  e.preventDefault();
  var depan = elNamaDepan.value.trim();
  var belakang = elNamaBelakang.value.trim();
  var emailBaru = elEmail.value.trim();

  if (!depan) {
    tampilkanPesan('Nama depan wajib diisi.', false);
    elNamaDepan.focus();
    return;
  }
  if (emailBaru && emailBaru.indexOf('@') === -1) {
    tampilkanPesan('Format email belum benar.', false);
    elEmail.focus();
    return;
  }

  try {
    localStorage.setItem('lingkunganku_nama', (depan + ' ' + belakang).trim());
    localStorage.setItem('lingkunganku_email', emailBaru);
    if (fotoBaru) {
      localStorage.setItem('lingkunganku_foto', fotoBaru);
    } else {
      localStorage.removeItem('lingkunganku_foto');
    }
  } catch (err) {
    tampilkanPesan('Gagal menyimpan. Coba foto dengan ukuran lebih kecil.', false);
    return;
  }

  isiForm();
  tampilkanPesan('Perubahan tersimpan.', true);
});

// Keluar
document.getElementById('link-keluar').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.removeItem('lingkunganku_logged_in');
  localStorage.removeItem('lingkunganku_nama');
  localStorage.removeItem('lingkunganku_email');
  localStorage.removeItem('lingkunganku_foto');
  window.location.href = 'index.html';
});


// Menu sidebar: tampilkan panel sesuai pilihan
(function () {
  var items = document.querySelectorAll('.menu-item');
  var panels = document.querySelectorAll('.panel');

  function tampil(id) {
    if (!document.getElementById('panel-' + id)) id = 'akun';
    panels.forEach(function (p) { p.hidden = (p.id !== 'panel-' + id); });
    items.forEach(function (i) {
      var aktif = i.getAttribute('data-panel') === id;
      i.classList.toggle('aktif', aktif);
      if (aktif) i.setAttribute('aria-current', 'true');
      else i.removeAttribute('aria-current');
    });
  }

  items.forEach(function (i) {
    i.addEventListener('click', function (e) {
      e.preventDefault();
      var id = i.getAttribute('data-panel');
      history.replaceState(null, '', '#' + id);
      tampil(id);
      if (window.innerWidth <= 760) {
        document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('hashchange', function () { tampil(location.hash.slice(1)); });

  // Panah di kartu profil membuka Akun
  var panah = document.querySelector('#info-profil > a');
  if (panah) {
    panah.addEventListener('click', function (e) {
      e.preventDefault();
      history.replaceState(null, '', '#akun');
      tampil('akun');
    });
  }

  tampil(location.hash.slice(1) || 'akun');
})();

// Bantuan: cari pertanyaan
(function () {
  var cari = document.getElementById('cari-bantuan');
  if (!cari) return;
  cari.addEventListener('input', function () {
    var kata = cari.value.trim().toLowerCase();
    var ada = 0;
    document.querySelectorAll('#faq .faq details').forEach(function (d) {
      var cocok = !kata || d.textContent.toLowerCase().indexOf(kata) !== -1;
      d.hidden = !cocok;
      if (cocok) ada++;
    });
    document.querySelectorAll('#faq .faq-grup').forEach(function (g) {
      g.hidden = !g.querySelector('details:not([hidden])');
    });
    document.getElementById('faq-kosong').hidden = ada > 0;
  });
})();

// Privasi dan Keamanan
document.getElementById('btn-sandi-privasi').addEventListener('click', function () {
  alert('Fitur ubah kata sandi belum tersedia.');
});
document.getElementById('btn-hapus-tampilan').addEventListener('click', function () {
  if (!confirm('Hapus penanda notifikasi dibaca dan posisi tombol asisten di perangkat ini?')) return;
  try {
    localStorage.removeItem('lingkunganku_notif_dibaca');
    localStorage.removeItem('lingkunganku_chatbot_pos');
  } catch (e) {}
  alert('Data tampilan dihapus.');
});
