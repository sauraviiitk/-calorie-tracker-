// pdfImportController.js
// Async variant: upload PDF → SHA-256 idempotency check → enqueue BullMQ job → return jobId
// The AI parsing + meal insertion now happen in pdfImport.worker.js

const crypto = require('crypto');
const fs = require('fs');
const prisma = require('../config/db');
const { getPdfImportQueue } = require('../queues/pdfImport.queue');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// -----------------------------------------------------------------------
// POST /api/diary/import-pdf
// Accepts a PDF, enqueues a BullMQ job, returns { jobId, status }
// -----------------------------------------------------------------------
exports.importPdf = asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError('No PDF file uploaded.', 400));
    }

    const userId = req.user.id;
    const pdfPath = req.file.path; // saved to disk by multer diskStorage

    // Compute SHA-256 of the file for idempotency
    const fileBuffer = fs.readFileSync(pdfPath);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check for an existing job for this user + exact file
    const existing = await prisma.pdfImportJob.findUnique({
      where: { userId_fileHash: { userId, fileHash } },
    });

    if (existing) {
      if (existing.status === 'COMPLETED') {
        return res.status(200).json({
          success: true,
          jobId: existing.imageId,
          status: 'COMPLETED',
          result: existing.result,
          message: 'Result from previous identical upload.',
        });
      }
      // Still in-progress
      return res.status(200).json({
        success: true,
        jobId: existing.imageId,
        status: existing.status,
        message: 'A job for this PDF is already in progress.',
      });
    }

    // --- Enqueue BullMQ job ---
    const queue = getPdfImportQueue();

    if (!queue) {
      return next(new AppError('PDF import service is temporarily unavailable. Please try again shortly.', 503));
    }

    const job = await queue.add('parse', {
      userId,
      pdfPath,
      fileHash,
    });

    // Create DB record (status = PENDING)
    await prisma.pdfImportJob.create({
      data: {
        imageId: job.id,
        pdfPath,
        fileHash,
        status: 'PENDING',
        userId,
      },
    });

    console.log(`[PDF Import] Queued job ${job.id} for user ${userId}`);

    return res.status(202).json({
      success: true,
      jobId: job.id,
      status: 'PENDING',
      message: 'PDF received. AI parsing is running in the background.',
    });
});

// -----------------------------------------------------------------------
// GET /api/diary/import-pdf/:jobId/status
// Returns the status (and result if COMPLETED) for a PDF import job.
// Security: job MUST belong to the authenticated user.
// -----------------------------------------------------------------------
exports.getPdfImportStatus = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { jobId } = req.params;

    const job = await prisma.pdfImportJob.findUnique({
      where: { imageId: jobId },
    });

    // Return 404 whether not found OR belongs to another user
    if (!job || job.userId !== userId) {
      return next(new AppError('Job not found.', 404));
    }

    const response = {
      success: true,
      jobId: job.imageId,
      status: job.status,
    };

    if (job.status === 'COMPLETED') {
      // Spread the stored result (imported, skipped, message, entries)
      Object.assign(response, job.result || {});
    }
    if (job.status === 'FAILED') {
      response.message = job.errorMsg || 'PDF parsing failed. Please try again.';
    }

    return res.status(200).json(response);
});
