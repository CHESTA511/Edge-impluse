// ChatBot AI Functionality dengan Google Gemini API
let chatHistory = [];

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
    checkApiKey();
    loadChatHistory();
});

function checkApiKey() {
    const apiKey = getGeminiApiKey();
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (!apiKey) {
        // Show API key config
        document.getElementById('api-key-config').style.display = 'block';
        chatInput.disabled = true;
        sendBtn.disabled = true;
        chatInput.placeholder = 'Masukkan API Key terlebih dahulu...';
    } else {
        document.getElementById('api-key-config').style.display = 'none';
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.placeholder = 'Tulis pesan Anda...';
    }
}

function toggleApiKeyConfig() {
    const config = document.getElementById('api-key-config');
    config.style.display = config.style.display === 'none' ? 'block' : 'none';
}

function saveApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        alert('API Key tidak boleh kosong!');
        return;
    }
    
    setGeminiApiKey(apiKey);
    apiKeyInput.value = '';
    checkApiKey();
    alert('API Key berhasil disimpan!');
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        alert('Silakan masukkan API Key terlebih dahulu!');
        toggleApiKeyConfig();
        return;
    }
    
    // Add user message to UI
    addMessage(message, 'user');
    input.value = '';
    input.disabled = true;
    
    // Add to chat history
    chatHistory.push({
        role: 'user',
        parts: [{ text: message }]
    });
    
    // Show loading indicator
    const loadingId = showLoadingMessage();
    
    try {
        // Call Gemini API
        const response = await callGeminiAPI(message, apiKey);
        
        // Remove loading indicator
        removeLoadingMessage(loadingId);
        
        // Add AI response to UI
        addMessage(response, 'ai');
        
        // Add to chat history
        chatHistory.push({
            role: 'model',
            parts: [{ text: response }]
        });
        
        // Save chat history
        saveChatHistory();
        
    } catch (error) {
        // Remove loading indicator
        removeLoadingMessage(loadingId);
        
        // Show error message
        let errorMsg = `Maaf, terjadi kesalahan: ${error.message}`;
        
        // Tambahkan pesan khusus untuk error tertentu
        if (error.message.includes('quota') || error.message.includes('billing')) {
            errorMsg += `\n\n⚠️ **Quota/Credits Habis**\n\n` +
                       `API Key Anda tidak memiliki quota yang cukup. Untuk mengatasi:\n\n` +
                       `1. **Cek Quota**: Kunjungi https://makersuite.google.com/app/apikey\n` +
                       `2. **Upgrade Plan**: Jika perlu, upgrade plan di Google Cloud Console\n\n` +
                       `**Alternatif**: Anda bisa menggunakan API key lain atau menunggu reset quota.`;
        } else if (error.message.includes('not found') || error.message.includes('not supported')) {
            errorMsg += `\n\nModel mungkin tidak tersedia. Sistem akan mencoba model alternatif.`;
        }
        
        addMessage(errorMsg, 'ai');
        console.error('Error calling Gemini API:', error);
    } finally {
        input.disabled = false;
        input.focus();
    }
}

async function callGeminiAPI(userMessage, apiKey) {
    // Menggunakan Gemini 2.0 Flash (model terbaru)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    // Get current sensor data context (simulated)
    const sensorContext = getSensorDataContext();
    
    // Build user message with context
    const userMessageWithContext = `${sensorContext}\n\nPertanyaan: ${userMessage}`;
    
    // Prepare request dengan system instruction
    const requestBody = {
        contents: [{
            role: 'user',
            parts: [{
                text: userMessageWithContext
            }]
        }],
        systemInstruction: {
            parts: [{
                text: CONFIG.SYSTEM_PROMPT
            }]
        },
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
        }
        
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        // Jika error karena model, coba dengan model alternatif
        if (error.message.includes('not found') || error.message.includes('not supported') || error.message.includes('404')) {
            console.warn('Gemini 2.0 tidak tersedia, mencoba model alternatif...');
            return await callGeminiAPIFallback(userMessage, apiKey);
        }
        throw error;
    }
}

// Fallback function dengan model alternatif
async function callGeminiAPIFallback(userMessage, apiKey) {
    // Daftar model alternatif (dari terbaru ke lama)
    // Prioritas: Gemini 2.0 (experimental dan stable), lalu 1.5
    const alternativeModels = [
        'gemini-2.0-flash-exp',  // Gemini 2.0 Flash Experimental
        'gemini-2.0-flash',      // Gemini 2.0 Flash (jika tersedia)
        'gemini-1.5-flash',      // Fallback ke 1.5 Flash
        'gemini-1.5-pro'         // Fallback ke 1.5 Pro
    ];
    
    const sensorContext = getSensorDataContext();
    const fullPrompt = `${CONFIG.SYSTEM_PROMPT}\n\n${sensorContext}\n\nUser: ${userMessage}\n\nAssistant:`;
    
    // Coba setiap model sampai berhasil
    for (const model of alternativeModels) {
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            };
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Jika model tidak ditemukan, coba model berikutnya
                if (errorData.error?.message?.includes('not found') || response.status === 404) {
                    console.warn(`Model ${model} tidak tersedia, mencoba model berikutnya...`);
                    continue;
                }
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid response from Gemini API');
            }
            
            console.log(`Berhasil menggunakan model: ${model}`);
            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            // Jika ini model terakhir, throw error
            if (model === alternativeModels[alternativeModels.length - 1]) {
                throw new Error(`Semua model tidak tersedia. Error terakhir: ${error.message}`);
            }
            // Jika bukan model terakhir, lanjut ke model berikutnya
            continue;
        }
    }
}

function getSensorDataContext() {
    // Simulated sensor data - dalam production, ini bisa diambil dari API atau state management
    return `Konteks Data Sensor Terkini:
- Total Node: 12 (11 online, 1 warning)
- Total Base Station: 3 (semua online)
- Alert hari ini: 5 deteksi mencurigakan
- Node NODE-003: Baterai 25% (perlu perhatian)
- Node NODE-007: Baterai 45%
- Base Station BS-001: Baterai 85%
- Deteksi chainsaw: 2 kali hari ini
- Deteksi manusia: 3 kali hari ini
- Pergerakan mencurigakan: 5 kali hari ini`;
}

function sendQuickMessage(message) {
    document.getElementById('chat-input').value = message;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-avatar user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
            </div>
        `;
    } else {
        // Format AI response (support markdown-like formatting)
        const formattedText = formatAIResponse(text);
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${formattedText}
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatAIResponse(text) {
    // Convert markdown-like formatting to HTML
    let formatted = escapeHtml(text);
    
    // Bold text **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Lists
    formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!formatted.startsWith('<')) {
        formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoadingMessage() {
    const messagesContainer = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    const loadingId = 'loading-' + Date.now();
    loadingDiv.id = loadingId;
    loadingDiv.className = 'message ai-message loading-message';
    loadingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return loadingId;
}

function removeLoadingMessage(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

function saveChatHistory() {
    // Save last 50 messages to localStorage
    const recentHistory = chatHistory.slice(-50);
    localStorage.setItem('voxsilva_chat_history', JSON.stringify(recentHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('voxsilva_chat_history');
    if (saved) {
        try {
            chatHistory = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading chat history:', e);
            chatHistory = [];
        }
    }
}
