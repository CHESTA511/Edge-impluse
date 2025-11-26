# Setup OpenAI API untuk VoxSilva ChatBot

## Cara Mendapatkan API Key

1. **Kunjungi OpenAI Platform**
   - Buka: https://platform.openai.com/api-keys
   - Login dengan akun OpenAI Anda

2. **Buat API Key Baru**
   - Klik "Create new secret key"
   - Beri nama untuk API key (opsional)
   - Klik "Create secret key"
   - **PENTING**: Salin API key segera karena hanya ditampilkan sekali!

3. **Salin API Key**
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
2. Isi `OPENAI_API_KEY` dengan API Key Anda:
   ```javascript
   OPENAI_API_KEY: 'YOUR_API_KEY_HERE'
   ```
3. Simpan file

## Model yang Digunakan

VoxSilva menggunakan model OpenAI berikut (dengan fallback otomatis):
- **Primary**: `gpt-4o` (GPT-4 Optimized - terbaru dan tercepat)
- **Fallback**: 
  - `gpt-4-turbo`
  - `gpt-4`
  - `gpt-3.5-turbo`

Anda bisa mengubah model di `config.js`:
```javascript
OPENAI_MODEL: 'gpt-4o' // atau 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'
```

## Keamanan API Key

⚠️ **PENTING UNTUK PRODUCTION:**

Untuk aplikasi production, **JANGAN** simpan API Key di frontend! 

**Solusi yang Disarankan:**
1. Buat backend API proxy yang menyimpan API Key di server
2. Frontend memanggil backend API Anda
3. Backend yang memanggil OpenAI API
4. Ini mencegah API Key ter-expose di browser

**Contoh Backend (Node.js/Express):**
```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Dari environment variable
});

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: 'System prompt...' },
            ...history,
            { role: 'user', content: message }
        ]
    });
    
    res.json({ response: completion.choices[0].message.content });
});
```

## Troubleshooting

### Error: "Invalid API Key"
- Pastikan API Key sudah benar (tidak ada spasi di awal/akhir)
- Pastikan API Key aktif di OpenAI Platform
- Cek apakah API Key belum expired atau di-revoke

### Error: "You exceeded your current quota" / "Insufficient quota"
- **Penyebab**: API Key tidak memiliki credits yang cukup atau quota sudah habis
- **Solusi**:
  1. **Top Up Credits**: 
     - Kunjungi: https://platform.openai.com/account/billing
     - Klik "Add payment method" atau "Add credits"
     - Top up sesuai kebutuhan
  2. **Cek Usage**: 
     - Lihat penggunaan di: https://platform.openai.com/usage
     - Cek apakah ada credits tersisa
  3. **Free Tier**: 
     - Jika menggunakan free tier ($5 credit), mungkin sudah habis
     - Perlu upgrade ke paid plan untuk continue
  4. **Cek Billing**: 
     - Pastikan payment method valid
     - Pastikan tidak ada outstanding balance

### Error: "Rate limit exceeded"
- Anda telah mencapai batas rate limit
- Tunggu beberapa saat atau upgrade plan
- Free tier memiliki rate limit yang lebih rendah

### Error: CORS
- OpenAI API mungkin memblokir request dari browser langsung
- Solusi: Gunakan backend proxy (lihat bagian Keamanan di atas)

## Testing

Setelah setup API Key, coba kirim pesan seperti:
- "Berikan rangkuman data sensor hari ini"
- "Saran pemeliharaan perangkat"
- "Analisis deteksi illegal logging"

## Biaya

OpenAI API menggunakan pay-as-you-go pricing:
- **GPT-4o**: $2.50 / 1M input tokens, $10 / 1M output tokens
- **GPT-4 Turbo**: $10 / 1M input tokens, $30 / 1M output tokens
- **GPT-3.5 Turbo**: $0.50 / 1M input tokens, $1.50 / 1M output tokens

Cek pricing terbaru di: https://openai.com/api/pricing/

**Free Tier**: OpenAI memberikan $5 credit gratis untuk new users (terbatas waktu)

## Support

Jika ada masalah, cek:
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Platform](https://platform.openai.com/)
- [OpenAI Community Forum](https://community.openai.com/)

