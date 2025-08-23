# CSVampus — Import CSV & Kelola Data Mahasiswa

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)


CSVampus adalah aplikasi web ringan untuk mengimpor dan mengelola data mahasiswa dari file CSV. Unggah file CSV, pratinjau dan peta kolom (mis. `NIM`, `Nama Full Rombel`), atur strategi duplikat, lalu simpan langsung ke Firebase (Firestore). Aplikasi juga menyediakan tampilan per rombel, grup, dan opsi ekspor ke Excel.

Ringkasan fitur utama:
- Unggah CSV multi-file dan pratinjau data sebelum menyimpan.
- Pemetaan kolom otomatis dengan alias yang umum (termasuk `nama_full_rombel`).
- Penanganan duplikat (keep first / keep last / merge) dan perbaikan batch.
- Integrasi Firebase (Firestore & Storage) untuk penyimpanan data dan foto.
- Ekspor data ke XLSX dan fitur edit/hapus data.

Quick start (testing lokal tanpa Firebase):
1. Buka `index.html` langsung di browser (double-click) atau jalankan static server.
2. Klik "Contoh CSV" untuk mengunduh sample dan coba unggah untuk melihat preview.

Instalasi & Pengembangan
------------------------
Untuk menjalankan pengujian parser CSV (Node):

```bash
cd testing
npm install
npm test
```

Untuk melihat aplikasi di browser saat pengembangan, gunakan static server sederhana (mis. serve atau http-server):

```bash
# jika belum terinstall, pasang http-server
npm install -g http-server
# jalankan dari root project
http-server . -c-1
# buka http://localhost:8080/index.html
```

Contoh CSV (contoh sederhana)
----------------------------
Gunakan contoh CSV ini untuk mencoba fitur preview dan mapping kolom:

```csv
No,Rombel,NIM,Nama Full Rombel,Status
1,TI01,012345678,SAEPUL RIZKY,Isi KRS
2,TI02,012345679,AHMAD TAULADAN,Isi KRS
3,TI03,012345670,FEBRY HARYANDI,Isi KRS
```

Tips penggunaan
---------------
- Jika CSV Anda memiliki baris kosong atau baris header yang bersih dari nilai (mis. hanya koma), aplikasi akan mencoba mengabaikan baris awal tersebut.
- Pastikan kolom NIM dan Nama (atau `Nama Full Rombel`) terdeteksi di pemetaan sebelum menekan "Konfirmasi & Unggah".

Menambahkan konfigurasi Firebase (untuk upload ke Firestore):
1. Buat proyek Firebase dan aktifkan Firestore serta Storage.
2. Dapatkan config Firebase (object JS) dari Firebase Console.
3. Saat menyajikan halaman, definisikan variabel global `__firebase_config` dan `__app_id` serta opsi token jika perlu, misalnya dengan menyisipkan skrip sebelum modul utama:

```html
<script>
  window.__app_id = 'my-app-id';
  window.__firebase_config = JSON.stringify({
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  });
</script>
```

4. Reload halaman. Jika konfigurasi benar, aplikasi akan melakukan sign-in anonim dan mendengarkan koleksi Firestore.

Testing parseCSV (node):
```bash
cd testing
npm install
npm test
```

Catatan implementasi penting:
- Parser menggunakan PapaParse (CDN) untuk robust CSV parsing.
- Sebelum upload, aplikasi menampilkan preview yang memungkinkan mapping kolom CSV ke field target.
- Upload dilakukan dalam loop dan mencoba menangani error per dokumen; untuk batch besar pertimbangkan batching/parallelism dengan backoff.
