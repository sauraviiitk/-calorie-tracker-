const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'Backend', '.env') });
const geminiVisionService = require('./Backend/src/services/geminiVisionService');

// Create a dummy image
const fs = require('fs');
fs.writeFileSync('dummy.jpg', 'dummy content');

geminiVisionService.analyzeImage('dummy.jpg').then(console.log).catch(console.error);
