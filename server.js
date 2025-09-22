const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Simulated robot state (in-memory)
let robotState = {
  status: 'idle',
  depth: 0,
  isDrilling: false,
  maxDepth: 100
};

// API Routes
app.get('/api/status', (req, res) => {
  res.json(robotState);
});

app.post('/api/drill/start', (req, res) => {
  if (robotState.status === 'idle' && !robotState.isDrilling) {
    robotState.status = 'drilling';
    robotState.isDrilling = true;
    // Simulate drilling progress (in a real app, use intervals or workers)
    const interval = setInterval(() => {
      if (robotState.depth < robotState.maxDepth) {
        robotState.depth += 10;
      } else {
        clearInterval(interval);
        robotState.status = 'complete';
        robotState.isDrilling = false;
      }
    }, 1000); // Simulate 1m/s drilling speed
    res.json({ message: 'Drilling started', state: robotState });
  } else {
    res.status(400).json({ error: 'Robot is already active or not idle' });
  }
});

app.post('/api/drill/stop', (req, res) => {
  if (robotState.isDrilling) {
    robotState.status = 'stopped';
    robotState.isDrilling = false;
    res.json({ message: 'Drilling stopped', state: robotState });
  } else {
    res.status(400).json({ error: 'Robot is not drilling' });
  }
});

app.post('/api/drill/reset', (req, res) => {
  robotState = { status: 'idle', depth: 0, isDrilling: false, maxDepth: 100 };
  res.json({ message: 'Robot reset', state: robotState });
});

app.post('/api/depth/adjust', (req, res) => {
  const { depth } = req.body;
  if (typeof depth === 'number' && depth >= 0 && depth <= robotState.maxDepth) {
    robotState.depth = depth;
    res.json({ message: 'Depth adjusted', state: robotState });
  } else {
    res.status(400).json({ error: 'Invalid depth (must be 0-100)' });
  }
});

// Serve UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Freeport Robot Drilling App running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
