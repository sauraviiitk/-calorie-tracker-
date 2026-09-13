import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import ErrorAlert from '../ui/ErrorAlert';
import { normalizeApiError } from '../../utils/errorHandler';
import { isEditableDate, getLocalDateString } from '../../utils/dateUtils';
import api from '../../services/api';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const UNITS = ['grams', 'kg', 'ml', 'L', 'piece', 'serving', 'cup', 'bowl', 'slice', 'tablespoon', 'teaspoon'];

const selectClass = "w-full h-[46px] px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[14px] text-on-surface transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer";
const inputClass  = "w-full h-[46px] px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[14px] text-on-surface placeholder:text-outline transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass  = "block text-[12px] font-medium text-on-surface-variant mb-1";

const MealLoggerModal = ({ isOpen, onClose, onSave, selectedDate, defaultMealType }) => {
  const [mealType, setMealType] = useState(defaultMealType || 'Breakfast');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('grams');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scannedImageUrl, setScannedImageUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorObj, setErrorObj] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const reset = () => {
    setName(''); setQuantity(''); setUnit('grams');
    setCalories(''); setProtein(''); setCarbs(''); setFat('');
    setImage(null); setImagePreview(null); setScannedImageUrl(''); setErrorObj(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => { reset(); onClose(); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrorObj({ title: 'File Too Large', message: 'Image must be smaller than 5MB', retryable: true }); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorObj(null);
  };

  const handleRemoveImage = () => {
    setImage(null); setImagePreview(null); setScannedImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAiScan = async () => {
    if (!image) return;
    try {
      setIsScanning(true);
      setErrorObj(null);
      
      const formData = new FormData();
      formData.append('image', image);
      
      const response = await api.post('/ai/analyze-food', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        const { data, imageUrl } = response.data;
        if (data.name) setName(data.name);
        if (data.calories !== undefined) setCalories(data.calories);
        if (data.protein !== undefined) setProtein(data.protein);
        if (data.carbs !== undefined) setCarbs(data.carbs);
        if (data.fat !== undefined) setFat(data.fat);
        if (imageUrl) setScannedImageUrl(imageUrl);
      } else {
        setErrorObj({ title: 'AI Analysis Failed', message: response.data.message || 'AI failed to analyze the image', retryable: true, technicalDetails: JSON.stringify(response.data) });
      }
    } catch (err) {
      console.error(err);
      setErrorObj(normalizeApiError(err));
    } finally {
      setIsScanning(false);
    }
  };

  /* ── Validation ── */
  const isValid = (val) => val !== '' && !isNaN(Number(val)) && Number(val) >= 0;
  const isFormValid = () =>
    name.trim() && isValid(calories) && isValid(protein) && isValid(carbs) && isValid(fat);

  const handleSave = async () => {
    if (!name.trim())       { setErrorObj({ title: 'Validation Error', message: 'Food name is required', retryable: true }); return; }
    if (!isValid(calories)) { setErrorObj({ title: 'Validation Error', message: 'Calories is required', retryable: true }); return; }
    if (!isValid(protein))  { setErrorObj({ title: 'Validation Error', message: 'Protein (g) is required', retryable: true }); return; }
    if (!isValid(carbs))    { setErrorObj({ title: 'Validation Error', message: 'Carbs (g) is required', retryable: true }); return; }
    if (!isValid(fat))      { setErrorObj({ title: 'Validation Error', message: 'Fat (g) is required', retryable: true }); return; }

    const dateToSave = selectedDate || new Date();
    if (!isEditableDate(getLocalDateString(dateToSave))) {
      setErrorObj({ title: 'Read-Only Date', message: 'You can only add meals for today.', retryable: false });
      return;
    }

    try {
      setLoading(true);
      setErrorObj(null);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('mealType', mealType);
      formData.append('quantity', quantity || '');
      formData.append('unit', unit);
      formData.append('calories', Number(calories));
      formData.append('protein', Number(protein));
      formData.append('carbs', Number(carbs));
      formData.append('fat', Number(fat));
      formData.append('date', dateToSave.toISOString());
      
      if (image && !scannedImageUrl) {
        formData.append('image', image);
      } else if (scannedImageUrl) {
        formData.append('imageUrl', scannedImageUrl);
      }

      const response = await api.post('/meals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        reset();
        onSave(response.data.data);
      } else {
        setErrorObj({ title: 'Save Failed', message: response.data.message || 'Failed to save meal', retryable: true, technicalDetails: JSON.stringify(response.data) });
      }
    } catch (err) {
      setErrorObj(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /* Border colour: grey → green once filled */
  const macroBorder = (val) =>
    val === '' ? '' : Number(val) >= 0 ? 'border-green-400/70 focus:border-primary' : 'border-error';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]">restaurant</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Log Food</h2>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Fields marked <span className="text-error font-bold">*</span> are required
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {errorObj && (
            <ErrorAlert error={errorObj} onRetry={() => setErrorObj(null)} />
          )}

          {/* Meal Type */}
          <div>
            <label className={labelClass}>Meal Type <span className="text-error">*</span></label>
            <div className="relative">
              <select value={mealType} onChange={e => setMealType(e.target.value)} className={selectClass}>
                {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Food Name */}
          <div>
            <label className={labelClass}>Food Name <span className="text-error">*</span></label>
            <input
              type="text"
              placeholder="e.g. Oatmeal, Chicken Rice..."
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Quantity</label>
              <input type="number" placeholder="e.g. 300" min="0" value={quantity}
                onChange={e => setQuantity(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <div className="relative">
                <select value={unit} onChange={e => setUnit(e.target.value)} className={selectClass}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          {/* Calories */}
          <div>
            <label className={labelClass}>Calories (kcal) <span className="text-error">*</span></label>
            <input type="number" placeholder="e.g. 350" min="0" value={calories}
              onChange={e => setCalories(e.target.value)} className={inputClass} />
          </div>

          {/* ── Macronutrients — always visible, required ── */}
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 flex flex-col gap-3">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">nutrition</span>
              <span className="text-[13px] font-semibold text-on-surface">Macronutrients</span>
            </div>

            {/* Three macro inputs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Protein (g)', val: protein, set: setProtein, color: 'text-[#7e57c2]' },
                { label: 'Carbs (g)',   val: carbs,   set: setCarbs,   color: 'text-[#22c55e]' },
                { label: 'Fat (g)',     val: fat,      set: setFat,     color: 'text-[#f59e0b]' },
              ].map(({ label, val, set, color }) => (
                <div key={label}>
                  <label className={`${labelClass} ${color} font-semibold`}>
                    {label} <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={val}
                    onChange={e => set(e.target.value)}
                    className={`${inputClass} ${macroBorder(val)}`}
                  />
                </div>
              ))}
            </div>

            {/* Live kcal-from-macros hint */}
            {(protein !== '' || carbs !== '' || fat !== '') && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-on-surface-variant border-t border-outline-variant/30 mt-1">
                <span className="font-semibold text-[#7e57c2]">P: {Number(protein) || 0}g</span>
                <span>·</span>
                <span className="font-semibold text-[#22c55e]">C: {Number(carbs) || 0}g</span>
                <span>·</span>
                <span className="font-semibold text-[#f59e0b]">F: {Number(fat) || 0}g</span>
                <span className="ml-auto text-on-surface-variant/70">
                  ≈ {Math.round((Number(protein)||0)*4 + (Number(carbs)||0)*4 + (Number(fat)||0)*9)} kcal from macros
                </span>
              </div>
            )}
          </div>

          {/* Image Attachment */}
          <div>
            <label className={labelClass}>Attach Photo (optional)</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            {imagePreview ? (
              <div className="flex flex-col gap-3">
                <div className="relative rounded-xl overflow-hidden border border-outline-variant/60">
                  <img src={imagePreview} alt="Meal preview" className="w-full h-36 object-cover" />
                  <button onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 flex items-center justify-center hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
                <button 
                  type="button" 
                  onClick={handleAiScan}
                  disabled={isScanning}
                  className="w-full h-[40px] rounded-xl bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-colors flex items-center justify-center gap-2 font-semibold text-[13px]"
                >
                  {isScanning ? (
                    <>
                      <span className="w-4 h-4 border-2 border-on-primary-container/40 border-t-on-primary-container rounded-full animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      Extract Nutrition with AI
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full h-20 rounded-xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                <span className="font-body-sm text-[13px]">Click to attach a photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-outline-variant/60 bg-surface-container-low">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={loading || !isFormValid()}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                Saving...
              </span>
            ) : 'Save Entry'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealLoggerModal;
