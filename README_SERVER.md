# Cara Menjalankan VoxSilva dengan Python

Project VoxSilva adalah web application statis yang dapat dijalankan menggunakan HTTP server Python.

## Metode 1: Menggunakan server.py (Recommended)

### Langkah-langkah:

1. **Pastikan Python sudah terinstall**
   ```bash
   python --version
   # atau
   python3 --version
   ```

2. **Jalankan server**
   ```bash
   python server.py
   # atau
   python3 server.py
   ```

3. **Buka browser**
   - Server akan otomatis membuka browser di `http://localhost:8000`
   - Atau buka manual: `http://localhost:8000` atau `http://127.0.0.1:8000`

4. **Menggunakan port lain (jika port 8000 sudah digunakan)**
   ```bash
   python server.py 8080
   ```

## Metode 2: Menggunakan Python Built-in HTTP Server

### Python 3:
```bash
python -m http.server 8000
# atau
python3 -m http.server 8000
```

### Python 2 (jika masih menggunakan Python 2):
```bash
python -m SimpleHTTPServer 8000
```

Kemudian buka browser di: `http://localhost:8000`

## Metode 3: Menggunakan http.server dengan Custom Handler

```bash
python -m http.server 8000 --bind 127.0.0.1
```

## Troubleshooting

### Port sudah digunakan
Jika port 8000 sudah digunakan, gunakan port lain:
```bash
python server.py 8080
```

### Permission denied
Di Linux/Mac, jika port < 1024, mungkin perlu sudo:
```bash
sudo python server.py 80
```

### Firewall blocking
Pastikan firewall mengizinkan koneksi ke port yang digunakan.

## Catatan

- Server ini hanya untuk development/testing lokal
- Untuk production, gunakan web server seperti Nginx, Apache, atau cloud hosting
- Service Worker (PWA) memerlukan HTTPS di production

## Fitur server.py

- ✅ Auto-open browser
- ✅ Port checking
- ✅ Custom port support
- ✅ User-friendly messages

