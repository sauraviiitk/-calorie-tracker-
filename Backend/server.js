const app = require('./src/app');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Start background workers in the same process (Monolith mode)
// We wrap in a try/catch in case Redis is completely unavailable so it doesn't crash the API
try {
  console.log('[Server] Booting background workers for monolith deployment...');
  require('./src/workers/foodAnalysis.worker.js');
  require('./src/workers/pdfImport.worker.js');
} catch (error) {
  console.error('[Server] Failed to start workers:', error.message);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
