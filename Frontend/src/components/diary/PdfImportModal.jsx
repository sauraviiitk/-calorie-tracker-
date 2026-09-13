import React, { useState, useRef, useCallback, useEffect } from 'react';
import api from '../../services/api';
import ErrorState from '../ui/ErrorState';
import { normalizeApiError } from '../../utils/errorHandler';

const MEAL_TYPE_COLORS = {
  Breakfast: 'bg-amber-100 text-amber-700',
  Lunch: 'bg-green-100 text-green-700',
  Dinner: 'bg-violet-100 text-violet-700',
  Snacks: 'bg-pink-100 text-pink-700',
};

const POLL_INTERVAL_MS = 2500;

const PdfImportModal = ({ isOpen, onClose, onImported }) => {
  // phases: idle | ready | uploading | queued | processing | success | empty | error
  const [phase, setPhase] = useState('idle');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [errorObj, setErrorObj] = useState(null);
  const [jobId, setJobId] = useState(null);
  const fileInputRef = useRef(null);
  const pollTimerRef = useRef(null);

  // Stop polling on unmount
  useEffect(() => {
    return () => { if (pollTimerRef.current) clearTimeout(pollTimerRef.current); };
  }, []);

  const reset = () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    setPhase('idle');
    setSelectedFile(null);
    setResult(null);
    setErrorObj(null);
    setDragOver(false);
    setJobId(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setErrorObj({ title: 'Invalid File', message: 'Only PDF files are supported. Please upload a .pdf file.', retryable: true });
      setPhase('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorObj({ title: 'File Too Large', message: 'Maximum size is 10MB.', retryable: true });
      setPhase('error');
      return;
    }
    setSelectedFile(file);
    setPhase('ready');
    setErrorObj(null);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  // -----------------------------------------------------------------------
  // Poll /api/diary/import-pdf/:jobId/status until terminal state
  // -----------------------------------------------------------------------
  const pollStatus = (id) => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);

    pollTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/diary/import-pdf/${id}/status`);
        const { status, entries, imported, skipped, message: msg, message: errorMessage } = res.data;

        if (status === 'COMPLETED') {
          const importResult = { imported: imported ?? 0, skipped: skipped ?? 0, message: msg, entries: entries ?? [] };
          setResult(importResult);
          setPhase(importResult.imported > 0 ? 'success' : 'empty');
        } else if (status === 'FAILED') {
          // Wrap the error string returned from the backend DB in our standardized error format
          const error = typeof errorMessage === 'string' && errorMessage.trim().startsWith('{')
             ? normalizeApiError({ response: { data: errorMessage } }) 
             : { title: 'Import Failed', message: errorMessage || 'AI parsing failed. Please try again.', retryable: true, technicalDetails: errorMessage };
          setErrorObj(error);
          setPhase('error');
        } else {
          // PENDING or PROCESSING — keep polling, update phase label
          setPhase(status === 'PROCESSING' ? 'processing' : 'queued');
          pollStatus(id);
        }
      } catch (err) {
        setErrorObj(normalizeApiError(err));
        setPhase('error');
      }
    }, POLL_INTERVAL_MS);
  };

  // -----------------------------------------------------------------------
  // Upload PDF → get jobId → start polling
  // -----------------------------------------------------------------------
  const handleUpload = async () => {
    if (!selectedFile) return;
    setPhase('uploading');
    setErrorObj(null);

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await api.post('/diary/import-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const { jobId: id, status, result: immediateResult } = response.data;
        setJobId(id);

        if (status === 'COMPLETED' && immediateResult) {
          // Idempotency hit — same file was already processed
          const r = { ...(immediateResult || {}) };
          setResult(r);
          setPhase(r.imported > 0 ? 'success' : 'empty');
        } else {
          setPhase('queued');
          pollStatus(id);
        }
      } else {
        // If the server returns 200/202 but success: false
        setErrorObj({
            title: 'Upload Failed',
            message: response.data.message || 'Import failed.',
            retryable: true,
            technicalDetails: JSON.stringify(response.data)
        });
        setPhase('error');
      }
    } catch (err) {
      setErrorObj(normalizeApiError(err));
      setPhase('error');
    }
  };

  const handleConfirmImport = () => {
    if (onImported) onImported(result);
    window.dispatchEvent(new Event('appDataChanged'));
    handleClose();
  };

  if (!isOpen) return null;

  // Phase label for the async loading spinner
  const asyncLabel = phase === 'processing'
    ? 'AI is reading your diary…'
    : 'Waiting in queue…';
  const asyncSub = phase === 'processing'
    ? 'Extracting meals and nutritional data from your PDF'
    : 'Your PDF is queued — processing will start shortly';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-outline-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[22px]">picture_as_pdf</span>
              </div>
              <div>
                <h2 className="font-title-lg font-bold text-on-surface text-lg">Import Food Diary</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Upload a PDF and AI will parse your meal history</p>
              </div>
            </div>
            <button onClick={handleClose}
              className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* ── IDLE / READY phase ── */}
          {(phase === 'idle' || phase === 'ready') && (
            <>
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : selectedFile
                    ? 'border-primary/60 bg-primary/5'
                    : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-500 text-[28px]">picture_as_pdf</span>
                    </div>
                    <div>
                      <p className="font-medium text-on-surface text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB · Click to change
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                      <span className="material-symbols-outlined text-green-600 text-[14px]">check_circle</span>
                      <span className="text-xs text-green-700 font-medium">Ready to import</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-primary/20' : 'bg-surface-container-high'}`}>
                      <span className={`material-symbols-outlined text-[32px] transition-colors ${dragOver ? 'text-primary' : 'text-on-surface-variant'}`}>
                        upload_file
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface text-sm">
                        {dragOver ? 'Drop it here!' : 'Drag & drop your PDF'}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">or click to browse · Max 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="mt-4 p-3 bg-surface-container rounded-xl">
                <p className="text-xs font-semibold text-on-surface-variant mb-1.5">💡 Supported formats</p>
                <ul className="text-xs text-on-surface-variant space-y-0.5">
                  <li>• MyFitnessPal, Cronometer, Lose It! exports</li>
                  <li>• Any tabular PDF with food names + macros</li>
                  <li>• Custom food diary PDFs (text-based only)</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button onClick={handleClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium text-sm hover:bg-surface-container transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  Import with AI
                </button>
              </div>
            </>
          )}

          {/* ── UPLOADING / QUEUED / PROCESSING phases (shared spinner UI) ── */}
          {(phase === 'uploading' || phase === 'queued' || phase === 'processing') && (
            <div className="py-8 flex flex-col items-center gap-5 text-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[28px]">auto_awesome</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-on-surface text-base">
                  {phase === 'uploading' ? 'Uploading your PDF…' : asyncLabel}
                </p>
                <p className="text-sm text-on-surface-variant mt-1">
                  {phase === 'uploading'
                    ? 'Sending file to server…'
                    : asyncSub}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              {jobId && (
                <p className="text-xs text-on-surface-variant opacity-40">Job: {jobId}</p>
              )}
            </div>
          )}

          {/* ── SUCCESS phase ── */}
          {phase === 'success' && result && (
            <div className="flex flex-col gap-4">
              {/* Summary banner */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-green-600 text-[22px]">check_circle</span>
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Parsing complete!</p>
                  <p className="text-xs text-green-700 mt-0.5">{result.message}</p>
                </div>
              </div>

              {/* Preview list */}
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">Preview ({result.entries.length} entries)</p>
                <div className="max-h-52 overflow-y-auto flex flex-col gap-2 pr-1">
                  {result.entries.map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface-container rounded-xl px-3 py-2.5">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${MEAL_TYPE_COLORS[entry.mealType] || 'bg-gray-100 text-gray-600'}`}>
                        {entry.mealType}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">{entry.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{entry.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">{entry.calories} kcal</p>
                        <p className="text-[10px] text-on-surface-variant">
                          P:{entry.protein}g · C:{entry.carbs}g · F:{entry.fat}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.skipped > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                  ⚠️ {result.skipped} entries were skipped due to missing data.
                </p>
              )}

              <div className="flex gap-3">
                <button onClick={reset}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium text-sm hover:bg-surface-container transition-colors">
                  Import Another
                </button>
                <button onClick={handleConfirmImport}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  View in Diary
                </button>
              </div>
            </div>
          )}

          {/* ── EMPTY phase ── */}
          {phase === 'empty' && (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">search_off</span>
              </div>
              <div>
                <p className="font-semibold text-on-surface">No entries found</p>
                <p className="text-sm text-on-surface-variant mt-1 max-w-[280px]">
                  The AI couldn't find any food entries. Make sure the PDF contains a food diary with nutritional data.
                </p>
              </div>
              <button onClick={reset}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all">
                Try Another File
              </button>
            </div>
          )}

          {/* ── ERROR phase ── */}
          {phase === 'error' && (
             <div className="py-2">
                 <ErrorState error={errorObj} onRetry={reset} />
                 <div className="flex gap-3 justify-center mt-2 px-8">
                   <button onClick={handleClose}
                     className="px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium text-sm hover:bg-surface-container transition-colors w-full max-w-[120px]">
                     Close
                   </button>
                 </div>
             </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PdfImportModal;
