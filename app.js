// Main Application JavaScript
// Edge - Sistem Monitoring Gempa Real-Time

// Data storage (simulasi)
let deviceData = {
    connected: false,
    devices: [],
    history: [],
    logs: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePage();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }
});

// Navigation handling
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Page-specific initialization
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'monitoring.html':
            initMonitoringPage();
            break;
        case 'history.html':
            initHistoryPage();
            break;
        case 'device.html':
            initDevicePage();
            break;
    }
}

// Home page initialization
function initHomePage() {
    const startBtn = document.querySelector('.btn-primary');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            window.location.href = 'monitoring.html';
        });
    }
    
    const featureBtns = document.querySelectorAll('.btn-feature');
    featureBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const pages = ['monitoring.html', 'history.html', '#'];
            if (pages[index]) {
                window.location.href = pages[index];
            }
        });
    });
}

// Monitoring page initialization
function initMonitoringPage() {
    // Simulate device connection
    setTimeout(() => {
        connectDevice();
    }, 1000);
    
    // Start real-time updates
    startRealTimeMonitoring();
}

// Device page initialization
function initDevicePage() {
    checkDeviceStatus();
    setInterval(checkDeviceStatus, 3000);
}

// History page initialization
function initHistoryPage() {
    const historyBtn = document.querySelector('.history-btn');
    if (historyBtn) {
        historyBtn.addEventListener('click', loadHistoryData);
    }
    
    loadEventLogs();
}

// Device management
function connectDevice() {
    deviceData.connected = true;
    deviceData.devices = [
        {
            id: 'EDGE-001',
            name: 'Sensor Gempa - Jakarta',
            location: 'Jakarta Pusat',
            status: 'normal',
            lastUpdate: new Date(),
            metrics: {
                vibration: { value: 0.05, unit: 'g' },
                displacement: { value: 0.12, unit: 'mm' },
                axis: {
                    x: { value: 0.03, unit: 'g' },
                    y: { value: 0.04, unit: 'g' },
                    z: { value: 0.05, unit: 'g' }
                }
            }
        }
    ];
    
    updateMonitoringDisplay();
    updateDeviceStatus();
}

function checkDeviceStatus() {
    const statusCard = document.querySelector('.device-status-card');
    if (!statusCard) return;
    
    if (deviceData.connected && deviceData.devices.length > 0) {
        statusCard.classList.remove('empty');
        const emptyState = statusCard.querySelector('.device-empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Create device status display
        let statusHTML = `
            <div class="device-status-content">
                <div class="status-item">
                    <i class="fas fa-circle" style="color: #22c55e;"></i>
                    <span>Device Terhubung</span>
                </div>
                <div class="device-info">
                    <h3>${deviceData.devices[0].name}</h3>
                    <p>ID: ${deviceData.devices[0].id}</p>
                    <p>Lokasi: ${deviceData.devices[0].location}</p>
                    <p>Status: <span class="status-badge normal">Normal</span></p>
                    <p>Terakhir Update: ${formatTime(deviceData.devices[0].lastUpdate)}</p>
                </div>
            </div>
        `;
        
        const existingContent = statusCard.querySelector('.device-status-content');
        if (existingContent) {
            existingContent.remove();
        }
        statusCard.insertAdjacentHTML('beforeend', statusHTML);
    }
}

function updateDeviceStatus() {
    if (deviceData.devices.length > 0) {
        const device = deviceData.devices[0];
        device.lastUpdate = new Date();
    }
}

// Real-time monitoring
function startRealTimeMonitoring() {
    if (!deviceData.connected) return;
    
    setInterval(() => {
        if (deviceData.devices.length > 0) {
            // Simulate sensor data changes
            const device = deviceData.devices[0];
            device.metrics.vibration.value = (Math.random() * 0.1).toFixed(3);
            device.metrics.displacement.value = (Math.random() * 0.2).toFixed(2);
            device.metrics.axis.x.value = (Math.random() * 0.1 - 0.05).toFixed(3);
            device.metrics.axis.y.value = (Math.random() * 0.1 - 0.05).toFixed(3);
            device.metrics.axis.z.value = (Math.random() * 0.1 - 0.05).toFixed(3);
            device.lastUpdate = new Date();
            
            updateMonitoringDisplay();
            
            // Check for earthquake detection
            if (device.metrics.vibration.value > 0.08) {
                addEventLog('GEMPA KUAT!', 'Terdeteksi getaran kuat pada sensor');
            }
        }
    }, 2000);
}

function updateMonitoringDisplay() {
    const devicesGrid = document.querySelector('.devices-grid');
    if (!devicesGrid || deviceData.devices.length === 0) return;
    
    devicesGrid.classList.remove('empty-state');
    devicesGrid.innerHTML = '';
    
    deviceData.devices.forEach(device => {
        const deviceCard = createDeviceCard(device);
        devicesGrid.appendChild(deviceCard);
    });
}

function createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = 'device-card';
    
    const statusClass = device.status === 'normal' ? 'status-normal' : 'status-warning';
    const statusText = device.status === 'normal' ? 'Normal' : 'Peringatan';
    
    card.innerHTML = `
        <div class="device-header">
            <div>
                <div class="device-name">${device.name}</div>
                <div class="device-desc">${device.location}</div>
            </div>
            <span class="status-chip ${statusClass}">${statusText}</span>
        </div>
        
        <div class="metric-group">
            <div class="metric-group-title">Sensor Data</div>
            <div class="metric-list">
                <div class="metric-item">
                    <div class="metric-icon">
                        <i class="fas fa-wave-square"></i>
                    </div>
                    <div class="metric-info">
                        <span class="metric-label">Vibrasi</span>
                        <span class="metric-value">${device.metrics.vibration.value} ${device.metrics.vibration.unit}</span>
                    </div>
                </div>
                <div class="metric-item">
                    <div class="metric-icon">
                        <i class="fas fa-arrows-alt"></i>
                    </div>
                    <div class="metric-info">
                        <span class="metric-label">Pergeseran</span>
                        <span class="metric-value">${device.metrics.displacement.value} ${device.metrics.displacement.unit}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="metric-group">
            <div class="metric-group-title">Sumbu Akselerasi</div>
            <div class="metric-list axis">
                <div class="metric-item">
                    <span class="axis-label">X:</span>
                    <span class="metric-value">${device.metrics.axis.x.value} ${device.metrics.axis.x.unit}</span>
                </div>
                <div class="metric-item">
                    <span class="axis-label">Y:</span>
                    <span class="metric-value">${device.metrics.axis.y.value} ${device.metrics.axis.y.unit}</span>
                </div>
                <div class="metric-item">
                    <span class="axis-label">Z:</span>
                    <span class="metric-value">${device.metrics.axis.z.value} ${device.metrics.axis.z.unit}</span>
                </div>
            </div>
        </div>
        
        <div class="device-footer">
            <small style="color: #64748b;">Terakhir update: ${formatTime(device.lastUpdate)}</small>
        </div>
    `;
    
    return card;
}

// History page functions
function loadHistoryData() {
    const placeholder = document.querySelector('.history-placeholder');
    if (!placeholder) return;
    
    // Generate sample history data
    const historyData = generateHistoryData();
    
    // Create chart container
    placeholder.innerHTML = '<canvas id="historyChart"></canvas>';
    
    // Initialize chart
    setTimeout(() => {
        createHistoryChart(historyData);
    }, 100);
}

function generateHistoryData() {
    const data = [];
    const now = new Date();
    
    for (let i = 99; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000); // Every minute
        data.push({
            time: time,
            displacement: Math.random() * 0.3,
            vibration: Math.random() * 0.15
        });
    }
    
    return data;
}

function createHistoryChart(data) {
    const ctx = document.getElementById('historyChart');
    if (!ctx) return;
    
    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        script.onload = () => renderChart(ctx, data);
        document.head.appendChild(script);
    } else {
        renderChart(ctx, data);
    }
}

function renderChart(ctx, data) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => formatTime(d.time)),
            datasets: [
                {
                    label: 'Pergeseran (mm)',
                    data: data.map(d => d.displacement),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Vibrasi (g)',
                    data: data.map(d => d.vibration),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Data History Sensor (100 Data Terakhir)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadEventLogs() {
    const logContainer = document.querySelector('.log-container');
    if (!logContainer) return;
    
    if (deviceData.logs.length === 0) {
        logContainer.classList.add('empty');
        return;
    }
    
    logContainer.classList.remove('empty');
    logContainer.innerHTML = '';
    
    const logList = document.createElement('div');
    logList.className = 'log-list';
    
    deviceData.logs.slice(-20).reverse().forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div class="log-time">${formatTime(log.time)}</div>
            <div class="log-message">${log.message}</div>
            <div class="log-details">${log.details}</div>
        `;
        logList.appendChild(logItem);
    });
    
    logContainer.appendChild(logList);
}

function addEventLog(message, details) {
    deviceData.logs.push({
        time: new Date(),
        message: message,
        details: details
    });
    
    // Update history page if open
    if (window.location.pathname.includes('history.html')) {
        loadEventLogs();
    }
}

// Utility functions
function formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

