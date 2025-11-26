// Initialize map after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
let mapOptions = {
    center:[-6.200000, 106.816666],
    zoom:10
}

let map = new L.map('map' , mapOptions);
    window.map = map; // Make map globally accessible

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

    // Invalidate map size after initialization
    setTimeout(function() {
        map.invalidateSize();
    }, 100);

const deviceData = {
    'Device 1': {
        status: 'hidup',
        audio: 'forest',
        visual: 'non-human'
    },
    'Device 2': {
        status: 'mati',
        audio: 'chainsaw',
        visual: 'human'
    }
};

const markers = {};

function createPopupContent(deviceName) {
    const data = deviceData[deviceName];
    let content;
    if (data) {
        content = `
            <div class="custom-popup">
                <h4>${deviceName}</h4>
                <ul class="popup-info">
                    <li><strong>Status:</strong> <span class="status-${data.status}">${data.status}</span></li>
                    <li><strong>Audio:</strong> ${data.audio}</li>
                    <li><strong>Visual:</strong> ${data.visual}</li>
                </ul>
            </div>
        `;
    } else {
        content = `
            <div class="custom-popup">
                <h4>${deviceName}</h4>
                <p>Status: Unknown</p>
            </div>
        `;
    }
    return content;
}

// Add a marker for Device 1
let marker1 = new L.Marker([-6.200000, 106.816666], { draggable: true });
marker1.addTo(map).bindPopup(createPopupContent('Device 1'));
markers['Device 1'] = marker1;

// Add a marker for Device 2
let marker2 = new L.Marker([-6.210000, 106.826666], { draggable: true });
marker2.addTo(map).bindPopup(createPopupContent('Device 2'));
markers['Device 2'] = marker2;

const addMarkerBtn = document.getElementById('add-marker-btn');
const markerNameInput = document.getElementById('marker-name');
const deviceListContainer = document.getElementById('device-list-container');
const deviceList = document.getElementById('device-list');

// Populate device list
for (const deviceName in deviceData) {
    const li = document.createElement('li');
    li.textContent = deviceName;
    li.addEventListener('click', () => {
        const allItems = document.querySelectorAll('#device-list li');
        allItems.forEach(item => item.classList.remove('selected'));
        li.classList.add('selected');
        const marker = markers[deviceName];
        if (marker) {
            map.flyTo(marker.getLatLng(), 15); // Zoom to level 15
            marker.openPopup();
        }
    });
    deviceList.appendChild(li);
}

addMarkerBtn.addEventListener('click', () => {
    map.once('click', (e) => {
        const markerName = markerNameInput.value || 'New Marker';
        const newMarker = new L.Marker(e.latlng, { draggable: true });
        newMarker.addTo(map).bindPopup(createPopupContent(markerName));
        markers[markerName] = newMarker;
        markerNameInput.value = '';

        // Add to device list
        const li = document.createElement('li');
        li.textContent = markerName;
        li.addEventListener('click', () => {
            const allItems = document.querySelectorAll('#device-list li');
            allItems.forEach(item => item.classList.remove('selected'));
            li.classList.add('selected');
            map.flyTo(newMarker.getLatLng(), 15);
            newMarker.openPopup();
        });
        deviceList.appendChild(li);
        });
    });
});