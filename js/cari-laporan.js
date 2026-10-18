(function () {
  var form = document.querySelector('.laporan-search-form');
  var input = document.getElementById('kata-kunci');
  var daftar = document.getElementById('daftar-hasil');
  var info = document.getElementById('hasil-info');
  var kosong = document.getElementById('hasil-kosong');

  if (!(form instanceof HTMLFormElement)
      || !(input instanceof HTMLInputElement)
      || !(daftar instanceof HTMLUListElement)
      || !(info instanceof HTMLParagraphElement)
      || !(kosong instanceof HTMLParagraphElement)) {
    console.error('Elemen pencarian laporan tidak lengkap.');
    return;
  }

  var query = new URLSearchParams(window.location.search).get('q') || '';
  var tokens = query.trim().toLocaleLowerCase('id').split(/\s+/).filter(Boolean);
  var items = Array.from(daftar.querySelectorAll('li[data-searchable]'));
  var jumlahCocok = 0;

  input.value = query;

  items.forEach(function (item) {
    var konten = (item.textContent + ' ' + item.dataset.searchable).toLocaleLowerCase('id');
    var cocok = tokens.length === 0 || tokens.every(function (token) {
      return konten.includes(token);
    });

    item.hidden = !cocok;
    if (cocok) jumlahCocok += 1;
  });

  if (tokens.length === 0) {
    info.textContent = 'Menampilkan semua ' + jumlahCocok + ' laporan.';
  } else if (jumlahCocok > 0) {
    info.textContent = jumlahCocok + ' laporan ditemukan untuk "' + query.trim() + '".';
  } else {
    info.textContent = 'Tidak ditemukan laporan untuk "' + query.trim() + '".';
  }

  kosong.hidden = jumlahCocok > 0;
  daftar.hidden = jumlahCocok === 0;
})();
