# VoxSilva - Low-Cost AI-Powered Forest Surveillance System

Web App untuk sistem pemantauan hutan berbasis AI untuk mendeteksi aktivitas illegal logging dengan sensor network.

## Fitur

- ✅ **Sensor Network Monitoring**: Pantau Base Station dan Node dengan radius 1-3km per node
- ✅ **Real-Time Detection**: Deteksi manusia (ESP32 Cam), suara chainsaw, dan pergerakan (MPU6050)
- ✅ **AI Assistant**: ChatBot dengan Google Gemini API untuk saran pemeliharaan dan analisis data
- ✅ **Device Management**: Kelola Base Station dan Node dengan detail lengkap (baterai, durasi, lokasi, log)
- ✅ **Detection History**: Riwayat deteksi dengan filter dan visualisasi
- ✅ **Interactive Map**: Peta interaktif untuk visualisasi lokasi sensor
- ✅ **Progressive Web App (PWA)**: Dapat diinstall di perangkat mobile dan desktop
- ✅ **Offline Support**: Bekerja offline dengan service worker
- ✅ **Responsive Design**: Tampilan optimal di semua perangkat

## Cara Menggunakan

### 1. Menjalankan Web App

#### Opsi 1: Menggunakan server.py (Recommended)

File `server.py` sudah disediakan untuk kemudahan development:

```bash
# Jalankan server
python server.py
# atau
python3 server.py

# Menggunakan port custom (jika port 8000 sudah digunakan)
python server.py 8080
```

Server akan otomatis membuka browser di `http://localhost:8000`

#### Opsi 2: Menggunakan Python Built-in HTTP Server

```bash
# Python 3
python -m http.server 8000
# atau
python3 -m http.server 8000
```

#### Opsi 3: Server Lain

```bash
# Menggunakan Node.js (http-server)
npx http-server

# Menggunakan PHP
php -S localhost:8000
```

Kemudian buka `http://localhost:8000` di browser.

**📖 Detail lengkap**: Lihat file `README_SERVER.md`

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
- OpenAI API (untuk AI Assistant - GPT-4o)
- Chart.js (untuk visualisasi grafik)
- Leaflet.js (untuk peta interaktif)
- Font Awesome (untuk ikon)
- Service Worker (untuk PWA dan offline support)

## Setup AI Assistant (OpenAI API)

Untuk menggunakan fitur ChatBot AI, Anda perlu setup OpenAI API Key:

1. **Dapatkan API Key**: Kunjungi https://platform.openai.com/api-keys
2. **Masukkan API Key**: 
   - Buka halaman ChatBot AI
   - Klik tombol ⚙️ di pojok kanan input
   - Masukkan API Key dan klik Simpan

**Detail lengkap**: Lihat file `OPENAI_SETUP.md`

⚠️ **PENTING**: Untuk production, gunakan backend proxy untuk menyimpan API Key, jangan simpan di frontend!

## Catatan

- Data sensor saat ini menggunakan simulasi untuk demonstrasi
- Untuk koneksi ke sensor real, perlu integrasi dengan API atau WebSocket
- Icon PWA (`icon-192.png` dan `icon-512.png`) perlu dibuat untuk fitur install lengkap

## Struktur File

```
Edge-impluse/
├── index.html          # Halaman beranda (ikhtisar & rekomendasi AI)
├── monitoring.html     # Halaman monitoring real-time (MPU6050, ESP32 Cam, Audio)
├── history.html        # Halaman riwayat deteksi
├── device.html         # Halaman manajemen perangkat (Base Station & Node)
├── chatbot.html        # Halaman AI Assistant
├── maps.html           # Halaman peta interaktif
├── account.html        # Halaman profil & settings
├── style.css           # Stylesheet utama
├── app.js              # JavaScript utama
├── chatbot.js          # JavaScript untuk ChatBot AI
├── config.js           # Konfigurasi (API Key)
├── manifest.json       # Manifest untuk PWA
├── sw.js               # Service Worker
├── GEMINI_SETUP.md     # Instruksi setup Gemini API
└── README.md           # Dokumentasi
```

## Pengembangan Lebih Lanjut

### Integrasi dengan Sensor Real

1. Ganti fungsi simulasi di `app.js` dengan koneksi WebSocket atau API
2. Update fungsi `startRealTimeMonitoring()` untuk menerima data real
3. Sesuaikan format data sesuai dengan output sensor Anda

### Backend untuk Production

Untuk production, disarankan membuat backend API:
- Simpan API Key Gemini di server (environment variable)
- Buat endpoint `/api/chat` yang memanggil Gemini API
- Frontend memanggil backend API Anda, bukan langsung ke Gemini
- Ini mencegah API Key ter-expose di browser

Contoh backend ada di `GEMINI_SETUP.md`

## Lisensi

Proyek ini dibuat untuk keperluan monitoring gempa real-time.

