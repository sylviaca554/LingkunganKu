# LingkunganKU

LingkunganKU adalah website untuk pelaporan dan pemantauan masalah lingkungan di lingkungan sekitar masyarakat. Website ini memungkinkan pengguna untuk melihat laporan terkini, mencari isu lingkungan, membuka detail laporan, serta mengajukan laporan baru.

## Fitur utama

- Halaman beranda dengan hero section dan daftar laporan terkini
- Fitur pencarian laporan berdasarkan kata kunci
- Daftar laporan berdasarkan status: Semua, Diproses, Selesai, Ditolak
- Detail laporan dan detail penanganan
- Formulir untuk membuat laporan baru
- Notifikasi dan profil pengguna
- Tampilan responsif untuk desktop dan mobile
- Desain statis berbasis HTML, CSS, dan JavaScript

## Teknologi yang digunakan

- HTML5
- CSS3
- JavaScript vanilla
- Server statis Python untuk menjalankan website lokal

## Struktur folder

```text
LingkunganKU/
├── assets/
│   └── images/
├── css/
│   ├── base.css
│   ├── buat-laporan.css
│   ├── chatbot.css
│   ├── index.css
│   ├── laporan.css
│   ├── navbar.css
│   ├── notifikasi.css
│   ├── profil.css
│   └── style.css
├── js/
│   ├── chatbot-drag.js
│   ├── chatbot.js
│   ├── faq-data.js
│   ├── foto-crop.js
│   ├── hero-parallax.js
│   ├── navbar.js
│   ├── notifikasi.js
│   └── profil.js
├── index.html
├── login.html
├── register.html
├── buat-laporan.html
├── cari-laporan.html
├── laporan-semua.html
├── laporan-diproses.html
├── laporan-selesai.html
├── laporan-ditolak.html
├── detail-laporan.html
├── detail-penanganan.html
├── notifikasi.html
├── notifikasi-semua.html
├── notifikasi-laporan.html
├── notifikasi-pemberitahuan.html
├── profil.html
├── prompt-log.md
├── README.md
└── ...
```

## Halaman utama

- Beranda: `index.html`
- Login: `login.html`
- Register: `register.html`
- Buat laporan: `buat-laporan.html`
- Cari laporan: `cari-laporan.html`
- Daftar laporan: `laporan-semua.html`
- Detail laporan: `detail-laporan.html`
- Detail penanganan: `detail-penanganan.html`
- Notifikasi: `notifikasi.html`
- Profil: `profil.html`

## Cara menjalankan

1. Buka terminal di folder proyek.
2. Jalankan server lokal:

```bash
cd d:\LingkunganKU
py -m http.server 8000
```

3. Buka browser dan akses:

```text
http://localhost:8000/
```

## Catatan

Proyek ini merupakan website statis dan belum terhubung ke backend/database. Data laporan yang ditampilkan bersifat contoh dan dibuat untuk kebutuhan UI/UX prototype.

## Lisensi

Proyek ini dibuat untuk kebutuhan pembelajaran dan demo prototype aplikasi web lingkungan.

## Penjelasan singkat

LingkunganKU dibuat untuk membantu masyarakat melaporkan masalah lingkungan secara cepat, seperti sampah menumpuk, jalan berlubang, lampu mati, selokan tersumbat, dan masalah serupa. Dengan antarmuka yang sederhana, pengguna dapat memantau proses penanganan dan melihat status laporan.
