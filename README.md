# Aplikasi Mahasiswa - Local Setup

Ringkasan:
Halaman `index.html` adalah aplikasi single-file untuk mengelola data mahasiswa. Fitur penting:
- Unggah CSV (multi-file), preview, mapping kolom, validasi, deduplikasi, dan ekspor ke XLSX.
- Integrasi Firestore untuk menyimpan data mahasiswa (konfigurasi diperlukan).

Quick start (testing lokal tanpa Firebase):
1. Buka `index.html` langsung di browser (double-click) atau gunakan static server

2. Klik "Contoh CSV" untuk mengunduh sample dan coba unggah untuk melihat preview.

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
cd '/home/kamachi/Documents/3 Bulan Liburan 2025/extractor/testing'
npm install
npm test
```

Catatan implementasi penting:
- Parser menggunakan PapaParse (CDN) untuk robust CSV parsing.
- Sebelum upload, aplikasi menampilkan preview yang memungkinkan mapping kolom CSV ke field target.
- Upload dilakukan dalam batch dan mencoba retry per dokumen; jika terjadi error fatal, aplikasi mencoba rollback perubahan yang dibuat selama upload.
