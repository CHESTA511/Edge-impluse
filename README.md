# Edge - Sistem Monitoring Gempa Real-Time

Web App untuk monitoring gempa real-time dengan sensor Edge.

## Fitur

- ✅ **Monitoring Real-Time**: Pantau data sensor (vibrasi, pergeseran, sumbu) secara real-time
- ✅ **History & Replay**: Lihat riwayat peristiwa dan grafik data historis
- ✅ **Device Management**: Kelola dan pantau status koneksi perangkat
- ✅ **Progressive Web App (PWA)**: Dapat diinstall di perangkat mobile dan desktop
- ✅ **Offline Support**: Bekerja offline dengan service worker
- ✅ **Responsive Design**: Tampilan optimal di semua perangkat

## Cara Menggunakan

### 1. Menjalankan Web App

Buka file `index.html` di browser modern (Chrome, Firefox, Edge, Safari).

Atau gunakan server lokal:
```bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js (http-server)
npx http-server

# Menggunakan PHP
php -S localhost:8000
```

Kemudian buka `http://localhost:8000` di browser.

### 2. Install sebagai PWA (Progressive Web App)

1. Buka web app di browser
2. Klik ikon "Install" di address bar (Chrome/Edge) atau menu browser
3. Web app akan terinstall dan dapat diakses seperti aplikasi native

### 3. Halaman yang Tersedia

- **Beranda** (`index.html`): Halaman utama dengan overview fitur
- **Monitoring** (`monitoring.html`): Monitoring real-time data sensor
- **History** (`history.html`): Riwayat peristiwa dan grafik data
- **Device** (`device.html`): Manajemen dan status perangkat

## Teknologi yang Digunakan

- HTML5
- CSS3 (Modern CSS dengan Grid & Flexbox)
- JavaScript (Vanilla JS)
- Chart.js (untuk visualisasi grafik)
- Font Awesome (untuk ikon)
- Service Worker (untuk PWA dan offline support)

## Catatan

- Data sensor saat ini menggunakan simulasi untuk demonstrasi
- Untuk koneksi ke sensor real, perlu integrasi dengan API atau WebSocket
- Icon PWA (`icon-192.png` dan `icon-512.png`) perlu dibuat untuk fitur install lengkap

## Struktur File

```
Edge-impluse/
├── index.html          # Halaman beranda
├── monitoring.html     # Halaman monitoring real-time
├── history.html       # Halaman riwayat
├── device.html        # Halaman manajemen perangkat
├── style.css          # Stylesheet utama
├── app.js             # JavaScript utama
├── manifest.json      # Manifest untuk PWA
├── sw.js              # Service Worker
└── README.md          # Dokumentasi
```

## Pengembangan Lebih Lanjut

Untuk mengintegrasikan dengan sensor real:

1. Ganti fungsi simulasi di `app.js` dengan koneksi WebSocket atau API
2. Update fungsi `startRealTimeMonitoring()` untuk menerima data real
3. Sesuaikan format data sesuai dengan output sensor Anda

## Lisensi

Proyek ini dibuat untuk keperluan monitoring gempa real-time.

