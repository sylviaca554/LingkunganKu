(function () {
  var form = document.querySelector('.laporan-search-form');
  var input = document.querySelector('.laporan-search-input');
  var list = document.querySelector('.laporan-list');

  if (!(form instanceof HTMLFormElement)
      || !(input instanceof HTMLInputElement)
      || !(list instanceof HTMLUListElement)) {
    console.error('Elemen pencarian pada halaman laporan tidak lengkap.');
    return;
  }

  var items = Array.from(list.querySelectorAll('li'));
  var emptyState = document.createElement('p');
  emptyState.className = 'laporan-search-empty';
  emptyState.setAttribute('role', 'status');
  emptyState.hidden = true;
  list.insertAdjacentElement('afterend', emptyState);

  function filterReports(query) {
    var normalizedQuery = query.trim().toLocaleLowerCase('id');
    var tokens = normalizedQuery.split(/\s+/).filter(Boolean);
    var visibleCount = 0;

    items.forEach(function (item) {
      var content = item.textContent.toLocaleLowerCase('id');
      var matches = tokens.length === 0 || tokens.every(function (token) {
        return content.includes(token);
      });

      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    emptyState.hidden = visibleCount > 0;
    emptyState.textContent = normalizedQuery
      ? 'Tidak ada laporan yang cocok dengan "' + query.trim() + '".'
      : 'Belum ada laporan untuk ditampilkan.';
  }

  function updateQueryString(query) {
    var url = new URL(window.location.href);
    var normalizedQuery = query.trim();

    if (normalizedQuery) {
      url.searchParams.set('q', normalizedQuery);
    } else {
      url.searchParams.delete('q');
    }

    window.history.replaceState(null, '', url);
  }

  input.value = new URLSearchParams(window.location.search).get('q') || '';
  filterReports(input.value);

  input.addEventListener('input', function () {
    filterReports(input.value);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    filterReports(input.value);
    updateQueryString(input.value);
  });
})();
