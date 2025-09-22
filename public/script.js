const API_BASE = '/api';
let logList = document.getElementById('log-list');

// Fetch and update status every 2 seconds
function updateStatus() {
    fetch(`${API_BASE}/status`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('status-text').textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
            document.getElementById('depth').textContent = data.depth + 'm';
            document.getElementById('drilling').textContent = data.isDrilling ? 'Yes' : 'No';
            
            // Enable/disable buttons based on state
            document.getElementById('start-btn').disabled = data.status !== 'idle' || data.isDrilling;
            document.getElementById('stop-btn').disabled = !data.isDrilling;
        })
        .catch(err => console.error('Error fetching status:', err));
}

// Add log entry
function addLog(message) {
    const li = document.createElement('li');
    li.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    logList.appendChild(li);
    logList.scrollTop = logList.scrollHeight;
}

// Event listeners
document.getElementById('start-btn').addEventListener('click', () => {
    fetch(`${API_BASE}/drill/start`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            addLog(data.message);
            updateStatus();
        })
        .catch(err => addLog('Error: ' + err.message));
});

document.getElementById('stop-btn').addEventListener('click', () => {
    fetch(`${API_BASE}/drill/stop`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            addLog(data.message);
            updateStatus();
        })
        .catch(err => addLog('Error: ' + err.message));
});

document.getElementById('reset-btn').addEventListener('click', () => {
    fetch(`${API_BASE}/drill/reset`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            addLog(data.message);
            updateStatus();
        })
        .catch(err => addLog('Error: ' + err.message));
});

document.getElementById('adjust-btn').addEventListener('click', () => {
    const depth = parseInt(document.getElementById('depth-input').value);
    if (depth >= 0 && depth <= 100) {
        fetch(`${API_BASE}/depth/adjust`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ depth })
        })
        .then(res => res.json())
        .then(data => {
            addLog(data.message);
            updateStatus();
        })
        .catch(err => addLog('Error: ' + err.message));
    } else {
        addLog('Invalid depth');
    }
});

// Initial load and periodic updates
updateStatus();
setInterval(updateStatus, 2000);
addLog('App initialized. Robot ready.');
