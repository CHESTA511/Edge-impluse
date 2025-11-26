// Configuration for VoxSilva
// IMPORTANT: Untuk production, API key harus disimpan di backend, bukan di frontend
// File ini hanya untuk development/testing

const CONFIG = {
    // Google Gemini API Configuration
    GEMINI_API_KEY: 'AIzaSyATSW1pc3AvSSSIpDRXE-7LFnA7zgV9bXo', // API Key untuk development
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    
    // System prompt untuk AI Assistant
    SYSTEM_PROMPT: `Anda adalah AI Assistant untuk sistem VoxSilva, sebuah sistem pemantauan hutan berbasis AI untuk mendeteksi aktivitas illegal logging.

Konteks Sistem:
- VoxSilva menggunakan jaringan sensor yang terdiri dari Base Station dan Node
- Setiap Node memiliki radius cakupan 1-3km
- Sensor yang digunakan: MPU6050 (deteksi pergerakan), ESP32 Cam (deteksi visual), dan audio detection (chainsaw)
- Sistem memantau deteksi manusia, suara chainsaw, dan pergerakan perangkat

Tugas Anda:
1. Memberikan saran pemeliharaan perangkat berdasarkan data sensor
2. Menganalisis dan merangkum data dari sensor network
3. Memberikan rekomendasi berdasarkan deteksi illegal logging
4. Menjawab pertanyaan tentang sistem VoxSilva

Jawablah dengan ramah, informatif, dan dalam bahasa Indonesia. Gunakan format yang mudah dibaca dengan emoji yang sesuai.`
};

// Fungsi untuk mendapatkan API key
function getGeminiApiKey() {
    // Cek dari localStorage dulu (jika user sudah set manual)
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey && savedKey.trim() !== '') {
        return savedKey;
    }
    
    // Fallback ke config (untuk development)
    // Jika API key sudah diisi di config, gunakan itu
    if (CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY.trim() !== '') {
        return CONFIG.GEMINI_API_KEY;
    }
    
    return '';
}

// Fungsi untuk menyimpan API key
function setGeminiApiKey(key) {
    localStorage.setItem('gemini_api_key', key);
}

