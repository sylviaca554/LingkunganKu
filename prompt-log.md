# Prompt Log - Modul 6: Konversi Desain Figma ke HTML5

**Nama:** [NamaLengkap]  
**Tanggal:** 07 Oktober 2026  
**Tools AI:** Kiro IDE (AI Code Editor)

---

## Rangkuman Proses

Proyek ini mengonversi desain aplikasi mobile **LingkunganKU** dari Figma menjadi 8 halaman HTML5 semantik murni, tanpa CSS eksternal, tanpa tag `<style>`, tanpa framework visual (Tailwind/Bootstrap), dan tanpa inline style.

---

## Log Prompt per Halaman

### Prompt 1 — Halaman Beranda (index.html)

**Prompt yang dikirim ke AI:**
```
Buatkan halaman HTML5 semantik murni untuk halaman Beranda aplikasi LingkunganKU.
Ketentuan:
- Tanpa file CSS, tanpa tag <style>, tanpa inline style, tanpa Bootstrap/Tailwind
- Gunakan tag semantik: header, nav, main, section, article, footer
- Hierarki heading: satu h1 utama, h2 untuk sub-seksi
- Terdapat: logo dengan anchor ke index.html, hero section dengan nama pengguna, 
  daftar laporan terakhir (ul > li > article), bottom navigation (nav > ul > li > a)
- Gambar pakai alt yang deskriptif, jalur relatif ./assets/images/
- Navigasi bawah dengan 5 item: Beranda, Laporan, Buat, Notifikasi, Profil
```

**Kode awal AI (sebelum refaktorisasi):**
```html
<!-- AI menghasilkan struktur dengan beberapa div wrapper berlebih -->
<div class="container">
  <div class="header">
    <div class="logo-wrapper">
      <a href="index.html"><img src="logo.png"></a>
    </div>
  </div>
  ...
</div>
```

**Perubahan refaktorisasi yang dilakukan:**
1. Ganti `<div class="container">` → `<header>`, `<main>`, `<nav>`
2. Hapus semua atribut `class` yang tidak perlu
3. Tambah atribut `aria-label` dan `aria-labelledby` untuk aksesibilitas
4. Tambah `alt` deskriptif pada semua `<img>`
5. Ubah jalur gambar menjadi relatif `./assets/images/`
6. Tambah `aria-current="page"` pada navigasi aktif

**Kode akhir (sesudah refaktorisasi):**
- Menggunakan `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<figure>`
- Tidak ada div berlebih
- Hierarki: `h1` (Halo, Salsа) → `h2` (Laporan di Sekitar) → `h3` (judul tiap laporan)

---

### Prompt 2 — Halaman Laporan Semua (laporan-semua.html)

**Prompt yang dikirim ke AI:**
```
Buatkan halaman HTML5 semantik murni untuk halaman daftar laporan (tab Semua).
Ketentuan sama seperti sebelumnya. Tambahan:
- Ada tab filter: Semua, Diproses, Selesai, Ditolak — gunakan <nav> dengan <ul> dan <a>
- Ada form pencarian dengan role="search", fieldset, legend, label, input[type="search"], button
- Daftar laporan sebagai <ul> > <li> > <article>
- Setiap article: img, h2, p (kategori), p (waktu), a (status)
- Tab "Semua" aktif dengan aria-current="page"
```

**Perubahan refaktorisasi:**
1. Hapus div wrapper pada setiap card laporan
2. Tambah `alt` deskriptif mengandung nama lokasi
3. Pastikan `<label>` terhubung dengan `for` ke `id` input

---

### Prompt 3 — Halaman Laporan Diproses, Selesai, Ditolak

**Prompt yang dikirim ke AI:**
```
Buat 3 halaman HTML5 untuk filter tab laporan: Diproses, Selesai, dan Ditolak.
Struktur sama dengan laporan-semua.html, hanya isi konten yang berbeda sesuai status.
- Ditolak: tambah paragraf alasan penolakan di dalam article
- Setiap halaman tab yang aktif diberi aria-current="page"
```

**Perubahan refaktorisasi:**
1. Pastikan tidak ada duplikasi id antar halaman
2. Setiap `<input>` search punya id unik (cari-diproses, cari-selesai, cari-ditolak)

---

### Prompt 4 — Halaman Detail Laporan (detail-laporan.html)

**Prompt yang dikirim ke AI:**
```
Buatkan halaman HTML5 semantik untuk halaman Detail Laporan.
Konten yang diperlukan:
- Navigasi kembali ke laporan-semua.html
- Foto laporan dalam <figure> + <figcaption>
- Judul laporan (h2), status dengan <mark>, lokasi, waktu
- Deskripsi laporan dalam <section> + <p>
- Tabel informasi detail (kategori, ID, pelapor, koordinat GPS) menggunakan <table> dengan <caption>
- Tombol "Lihat Detail Penanganan" sebagai <a> + <button>
```

**Perubahan refaktorisasi:**
1. Ganti dl/dt/dd yang dihasilkan AI → `<table>` dengan `<th scope="row">` dan `<td>`
2. Tambah `<caption>` pada tabel untuk aksesibilitas
3. Pastikan ada `<main>` yang membungkus konten utama

---

### Prompt 5 — Halaman Detail Penanganan (detail-penanganan.html)

**Prompt yang dikirim ke AI:**
```
Buatkan halaman HTML5 semantik untuk halaman Detail Penanganan laporan.
Konten yang diperlukan:
- Navigasi kembali ke detail-laporan.html
- Foto penanganan dalam <figure> + <figcaption>
- Info petugas dalam <table>
- Ringkasan info laporan dalam <table>
- Tahapan proses penanganan sebagai <ol> (ordered list) karena urutan penting
- Setiap tahap dalam <article> dengan h3, p deskripsi, dan <time datetime="...">
- Tombol Kembali
```

**Perubahan refaktorisasi:**
1. Tambah atribut `datetime` pada elemen `<time>` agar valid W3C
2. Ganti list biasa → `<ol>` karena urutan tahapan penting
3. Pisahkan tabel petugas dan tabel laporan sebagai dua `<section>` terpisah

---

### Prompt 6 — Halaman Buat Laporan (buat-laporan.html)

**Prompt yang dikirim ke AI:**
```
Buatkan halaman HTML5 semantik untuk formulir Buat Laporan Baru.
Ketentuan form:
- form action="#" method="post"
- Bagi dalam 4 fieldset + legend: Informasi Dasar, Lokasi, Foto Bukti, Informasi Pelapor
- Tambah fieldset Persetujuan dengan checkbox
- Setiap label terhubung via for ke id input
- Input types: text, search, select, textarea, file, tel, email, checkbox
- Dua tombol: button[type="reset"] dan button[type="submit"]
- Tambah <abbr title="wajib diisi">*</abbr> untuk field wajib
```

**Perubahan refaktorisasi:**
1. Hapus atribut `class` yang dihasilkan AI
2. Tambah `required` pada field wajib
3. Tambah `accept` pada `<input type="file">` untuk membatasi format
4. Tambah `multiple` pada input foto tambahan
5. Pastikan semua `id` input unik di seluruh halaman

---

## Checklist Elemen Wajib

| Elemen        | Ada di Halaman              |
|---------------|----------------------------|
| `<header>`    | Semua 8 halaman            |
| `<nav>`       | Semua 8 halaman            |
| `<main>`      | Semua 8 halaman            |
| `<section>`   | Semua 8 halaman            |
| `<article>`   | index, laporan-*, detail-* |
| `<footer>`    | —                          |
| `<h1>`–`<h3>` | Semua 8 halaman            |
| `<p>`         | Semua 8 halaman            |
| `<a>`         | Semua 8 halaman            |
| `<img>` + alt | Semua 8 halaman            |
| `<ul>` / `<ol>`| Semua laporan, penanganan |
| `<table>`     | detail-laporan, detail-penanganan |
| `<form>`      | laporan-semua/diproses/selesai/ditolak, buat-laporan |
| `<input>`     | Semua form                 |
| `<button>`    | Semua form                 |
| `<fieldset>`  | buat-laporan, form pencarian |
| `<legend>`    | buat-laporan, form pencarian |
| `<label>`     | Semua form (for terhubung ke id) |

---

## Strategi Iterasi

1. **Buat per seksi** — prompt dikirim per halaman, bukan seluruh proyek sekaligus
2. **Audit setiap output** — cek div berlebih, cek hierarki heading, cek relasi label-input
3. **Refaktorisasi manual** — hapus class/style, ganti div non-semantik, tambah ARIA
4. **Validasi akhir** — setiap file diuji di validator.w3.org/nu sebelum dinyatakan selesai

---

## Catatan Validasi W3C

Semua 8 file HTML telah diuji di [validator.w3.org/nu](https://validator.w3.org/nu) dan lulus dengan **0 error**.
Lihat tangkapan layar: `validation.png`
