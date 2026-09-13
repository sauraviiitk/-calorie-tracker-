const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfImportController = require('../controllers/pdfImportController');
const { protect } = require('../middleware/authMiddleware');

// Save PDFs to disk so the worker can read them later
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `pdf-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  },
});

router.use(protect);

// POST /api/diary/import-pdf — enqueue async PDF import job
router.post('/import-pdf', upload.single('pdf'), pdfImportController.importPdf);

// GET /api/diary/import-pdf/:jobId/status — poll job status
router.get('/import-pdf/:jobId/status', pdfImportController.getPdfImportStatus);

module.exports = router;
