# Setup Google Gemini API untuk VoxSilva ChatBot

## Cara Mendapatkan API Key

1. **Kunjungi Google AI Studio**
   - Buka: https://makersuite.google.com/app/apikey
   - Atau: https://aistudio.google.com/app/apikey

2. **Login dengan Google Account**
   - Pastikan Anda login dengan akun Google yang valid

3. **Buat API Key Baru**
   - Klik "Create API Key" atau "Get API Key"
   - Pilih project Google Cloud (atau buat baru)
   - API Key akan ditampilkan

4. **Salin API Key**
   - Salin API Key yang diberikan
   - **PENTING**: Jangan share API Key Anda ke publik!

## Cara Menggunakan di VoxSilva

### Metode 1: Melalui UI (Recommended)
1. Buka halaman ChatBot AI di VoxSilva
2. Klik tombol ⚙️ (ikon gear) di pojok kanan input chat
3. Masukkan API Key Anda di form yang muncul
4. Klik "Simpan"
5. API Key akan tersimpan di browser Anda (localStorage)

### Metode 2: Manual Setup (Development)
1. Buka file `config.js`
2. Isi `GEMINI_API_KEY` dengan API Key Anda:
   ```javascript
   GEMINI_API_KEY: 'YOUR_API_KEY_HERE'
   ```
3. Simpan file

## Keamanan API Key

⚠️ **PENTING UNTUK PRODUCTION:**

Untuk aplikasi production, **JANGAN** simpan API Key di frontend! 

**Solusi yang Disarankan:**
1. Buat backend API proxy yang menyimpan API Key di server
2. Frontend memanggil backend API Anda
3. Backend yang memanggil Gemini API
4. Ini mencegah API Key ter-expose di browser

**Contoh Backend (Node.js/Express):**
```javascript
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = process.env.GEMINI_API_KEY; // Dari environment variable
    
    // Call Gemini API dari server
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }]
        })
    });
    
    const data = await response.json();
    res.json(data);
});
```

## Troubleshooting

### Error: "API Key tidak valid"
- Pastikan API Key sudah benar (tidak ada spasi di awal/akhir)
- Pastikan API Key aktif di Google AI Studio
- Cek quota/limit API Key Anda

### Error: "CORS error"
- Gemini API mungkin memblokir request dari browser langsung
- Solusi: Gunakan backend proxy (lihat bagian Keamanan di atas)

### Error: "Rate limit exceeded"
- Anda telah mencapai batas penggunaan API
- Tunggu beberapa saat atau upgrade plan di Google Cloud

## Testing

Setelah setup API Key, coba kirim pesan seperti:
- "Berikan rangkuman data sensor hari ini"
- "Saran pemeliharaan perangkat"
- "Analisis deteksi illegal logging"

## Biaya

Google Gemini API memiliki **free tier** dengan limit tertentu:
- Free tier: 60 requests per menit
- Setelah itu, ada biaya per request

Cek pricing terbaru di: https://ai.google.dev/pricing

## Support

Jika ada masalah, cek:
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)

