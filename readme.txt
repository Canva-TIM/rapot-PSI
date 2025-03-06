# Sistem Pencarian Rapor Berbasis Google Apps Script

Proyek ini adalah Google Apps Script yang memungkinkan pencarian dan pengunduhan rapor siswa berbasis NISN. Data siswa dan file rapor dikelola di Google Spreadsheet dan di-cache untuk meningkatkan performa akses.

## 🚀 Fitur
- 🔄 **Cache Data**: Menggunakan Google Script CacheService untuk mempercepat akses data.
- 📄 **Pencarian Berdasarkan NISN**: Mencocokkan nama siswa dengan file rapor yang tersedia.
- 📂 **Konversi ke PDF**: Mengubah lembar rapor menjadi file PDF yang bisa diunduh.
- ⚡ **Cek Status Cache**: Memeriksa apakah data sudah tersedia atau masih diperbarui.

## 🛠️ Teknologi
- **Google Apps Script** (GAS)
- **Google Spreadsheet** (Sebagai database)
- **CacheService** (Untuk caching data sementara)
- **Google Drive** (penyimpanan file rapor)

## 📌 Cara Kerja
1. **updateRaporCache()**
   - Mengambil data siswa dan file rapor dari Google Spreadsheet.
   - Memetakan siswa berdasarkan NISN dan mencocokkan dengan file rapor.
   - Menyimpan hasilnya dalam cache selama 1 jam.

2. **doGet(e)**
   - Jika `checkCache=true`, akan mengembalikan status cache (`ready` atau `updating`).
   - Jika `nisn=123456`, akan mencari rapor siswa berdasarkan NISN dan mengembalikan URL PDF rapor.

## 📖 Endpoint API
### 1. **Cek Status Cache**
   ```
   GET https://script.google.com/macros/s/AKfycb.../exec?checkCache=true
   ```
   **Response:**
   ```json
   { "status": "ready" } atau { "status": "updating" }
   ```

### 2. **Ambil Rapor Berdasarkan NISN**
   ```
   GET https://script.google.com/macros/s/AKfycb.../exec?nisn=1234567890
   ```
   **Response jika ditemukan:**
   ```json
   { "status": "success", "data": { "nama": "JOHN DOE", "kelas": "3A", "url": "https://drive.google.com/..." } }
   ```
   **Response jika tidak ditemukan:**
   ```json
   { "status": "error", "message": "❌ NISN tidak ditemukan." }
   ```

## 🔧 Cara Deploy
1. Buka [Google Apps Script](https://script.google.com/).
2. Tambahkan kode dari proyek ini.
3. Ganti ID Spreadsheet sesuai dengan dokumen Anda.
4. Deploy sebagai **Web App** dengan akses "Anyone with the link".
5. Salin **URL hasil deploy** ke variabel scriptUrl dalam index.html:

// 🌐 Variabel Global untuk URL Apps Script
const BASE_SCRIPT_URL = "PASTE_URL_DISINI";


## 📝 Lisensi
Proyek ini menggunakan lisensi MIT. Bebas digunakan dan dimodifikasi.

---
💡 **Kontribusi & Saran**
Jika ada perbaikan atau tambahan fitur yang diinginkan, silakan buat issue atau pull request di repo ini! 🚀

