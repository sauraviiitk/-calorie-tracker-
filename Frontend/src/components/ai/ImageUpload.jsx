import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const POLL_INTERVAL_MS = 2000; // poll every 2 seconds

const ImageUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // BullMQ job state
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null); // PENDING | PROCESSING | COMPLETED | FAILED
  const pollTimerRef = useRef(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Stop polling on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  // -----------------------------------------------------------------------
  // Poll the job status endpoint until terminal state (COMPLETED / FAILED)
  // -----------------------------------------------------------------------
  const pollJobStatus = (id) => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);

    pollTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/ai/analyze-food/${id}/status`);
        const { status, result: jobResult, error: jobError } = res.data;

        setJobStatus(status);

        if (status === 'COMPLETED') {
          setResult(jobResult);
          setLoading(false);
        } else if (status === 'FAILED') {
          setError(jobError || 'AI analysis failed. Please try again.');
          setLoading(false);
        } else {
          // Still PENDING or PROCESSING — keep polling
          pollJobStatus(id);
        }
      } catch (err) {
        setError('Could not check analysis status. Please refresh the page.');
        setLoading(false);
      }
    }, POLL_INTERVAL_MS);
  };

  // -----------------------------------------------------------------------
  // Handle file selection — upload to API, get job ID, start polling
  // -----------------------------------------------------------------------
  const handleFile = async (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedImage(file);
    setResult(null);
    setError('');
    setJobId(null);
    setJobStatus(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Upload image — API now returns { jobId, status: "PENDING" }
      const response = await api.post('/ai/analyze-food', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const { jobId: id, status, result: immediateResult } = response.data;

        setJobId(id);
        setJobStatus(status);

        if (status === 'COMPLETED' && immediateResult) {
          // Idempotency hit — same file was already analysed before
          setResult(immediateResult);
          setLoading(false);
        } else {
          // Start polling for the result
          pollJobStatus(id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image for analysis');
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // -----------------------------------------------------------------------
  // Retry — clear state and let user re-upload
  // -----------------------------------------------------------------------
  const handleRetry = () => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    setPreviewUrl(null);
    setSelectedImage(null);
    setResult(null);
    setError('');
    setJobId(null);
    setJobStatus(null);
    setLoading(false);
  };

  const saveMeal = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const payload = {
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        imageUrl: result.imageUrl,
        date: new Date().toISOString(),
      };

      const response = await api.post('/meals', payload);
      if (response.data.success) {
        navigate('/diary');
      }
    } catch (err) {
      setError('Failed to save meal to diary');
      setSaving(false);
    }
  };

  // Status text shown during polling
  const statusLabel = {
    PENDING: 'Waiting in queue...',
    PROCESSING: 'AI is analyzing your food...',
  }[jobStatus] || 'Uploading...';

  return (
    <div className="flex flex-col gap-6">
      {!previewUrl ? (
        <div
          className={`w-full h-80 rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center p-8 cursor-pointer ${
            isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6 pointer-events-none">
            <span className="material-symbols-outlined text-[40px] text-primary">add_a_photo</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2 pointer-events-none">Upload Food Photo</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8 pointer-events-none">
            Snap a picture of your meal or a nutrition label. Our AI will automatically identify the food and extract the calories and macros.
          </p>
          <Button variant="primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Choose Image</Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm">
          <div className="w-full md:w-1/2 h-auto min-h-[16rem] rounded-xl overflow-hidden relative">
            <img src={previewUrl} alt="Uploaded food" className="w-full h-full object-cover absolute inset-0" />
            <button
              onClick={handleRetry}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-on-surface/50 text-surface flex items-center justify-center backdrop-blur-sm hover:bg-on-surface/70 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="w-full md:w-1/2 flex flex-col py-4 pr-4">
            {/* LOADING / POLLING STATE */}
            {loading && (
              <div className="flex flex-col justify-center h-full gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  <span className="font-title-md font-semibold text-title-md">{statusLabel}</span>
                </div>
                <p className="text-on-surface-variant text-body-md">
                  {jobStatus === 'PROCESSING'
                    ? 'Identifying ingredients, estimating portion sizes, and calculating nutritional values...'
                    : 'Image uploaded. Starting AI analysis shortly...'}
                </p>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-primary w-2/3 rounded-full animate-pulse"></div>
                </div>
                {jobId && (
                  <p className="text-on-surface-variant text-label-sm opacity-50">Job ID: {jobId}</p>
                )}
              </div>
            )}

            {/* ERROR STATE */}
            {error && !loading && (
              <div className="flex flex-col justify-center h-full gap-4 text-error">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">error</span>
                  <span className="font-title-md font-semibold">Analysis Failed</span>
                </div>
                <p>{error}</p>
                <Button variant="outlined" onClick={handleRetry}>Try Again</Button>
              </div>
            )}

            {/* RESULT STATE */}
            {result && !loading && (
              <div className="flex flex-col h-full">
                <h3 className="font-title-lg text-title-lg font-semibold text-on-surface mb-4">{result.name}</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface-container flex flex-col p-3 rounded-xl">
                    <span className="text-on-surface-variant text-label-md">Calories</span>
                    <span className="text-on-surface font-title-md font-bold">{result.calories} kcal</span>
                  </div>
                  <div className="bg-surface-container flex flex-col p-3 rounded-xl">
                    <span className="text-on-surface-variant text-label-md">Protein</span>
                    <span className="text-on-surface font-title-md font-bold">{result.protein}g</span>
                  </div>
                  <div className="bg-surface-container flex flex-col p-3 rounded-xl">
                    <span className="text-on-surface-variant text-label-md">Carbs</span>
                    <span className="text-on-surface font-title-md font-bold">{result.carbs}g</span>
                  </div>
                  <div className="bg-surface-container flex flex-col p-3 rounded-xl">
                    <span className="text-on-surface-variant text-label-md">Fat</span>
                    <span className="text-on-surface font-title-md font-bold">{result.fat}g</span>
                  </div>
                </div>

                <div className="mt-auto flex justify-end">
                  <Button variant="primary" onClick={saveMeal} disabled={saving}>
                    {saving ? 'Saving...' : 'Save to Diary'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
