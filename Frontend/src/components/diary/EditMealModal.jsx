import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import ErrorAlert from '../ui/ErrorAlert';
import { normalizeApiError } from '../../utils/errorHandler';
import api from '../../services/api';

const EditMealModal = ({ meal, onClose, onSave, onDelete }) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorObj, setErrorObj] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (meal) {
      setName(meal.name || '');
      setCalories(meal.calories !== null && meal.calories !== undefined ? meal.calories : '');
      setProtein(meal.protein !== null && meal.protein !== undefined ? meal.protein : '');
      setCarbs(meal.carbs !== null && meal.carbs !== undefined ? meal.carbs : '');
      setFat(meal.fat !== null && meal.fat !== undefined ? meal.fat : '');
    }
  }, [meal]);

  if (!meal) return null;

  const inputClass = "w-full h-[46px] px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[14px] text-on-surface placeholder:text-outline transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClass = "block text-[12px] font-medium text-on-surface-variant mb-1";

  const isValid = (val) => val !== '' && !isNaN(Number(val)) && Number(val) >= 0;
  
  const isFormValid = () => 
    name.trim() && isValid(calories) && isValid(protein) && isValid(carbs) && isValid(fat);

  const handleSave = async () => {
    if (!name.trim()) { setErrorObj({ title: 'Validation Error', message: 'Food name is required', retryable: true }); return; }
    if (!isValid(calories)) { setErrorObj({ title: 'Validation Error', message: 'Valid calorie count is required', retryable: true }); return; }
    if (!isValid(protein)) { setErrorObj({ title: 'Validation Error', message: 'Protein is required', retryable: true }); return; }
    if (!isValid(carbs)) { setErrorObj({ title: 'Validation Error', message: 'Carbs are required', retryable: true }); return; }
    if (!isValid(fat)) { setErrorObj({ title: 'Validation Error', message: 'Fat is required', retryable: true }); return; }
    
    try {
      setLoading(true);
      setErrorObj(null);
      const response = await api.put(`/meals/${meal.id}`, {
        name: name.trim(),
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
      });
      if (response.data.success) {
        onSave(response.data.data);
      } else {
        setErrorObj({ title: 'Update Failed', message: response.data.message || 'Failed to update meal', retryable: true, technicalDetails: JSON.stringify(response.data) });
      }
    } catch (err) {
      setErrorObj(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      setDeleting(true);
      await api.delete(`/meals/${meal.id}`);
      onDelete(meal.id);
    } catch (err) {
      setErrorObj(normalizeApiError(err));
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${confirmDelete ? 'bg-error-container text-error' : 'bg-secondary-container text-secondary'} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-[20px]">{confirmDelete ? 'delete' : 'edit'}</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                {confirmDelete ? 'Delete Meal' : 'Edit Meal'}
              </h2>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {confirmDelete ? (
                  'Are you sure you want to delete this meal?'
                ) : (
                  <>Fields marked <span className="text-error font-bold">*</span> are required</>
                )}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {errorObj && (
            <ErrorAlert error={errorObj} onRetry={() => setErrorObj(null)} />
          )}

          {confirmDelete ? (
            <div className="flex flex-col gap-2 p-4 bg-error-container/20 border border-error/20 rounded-xl">
              <span className="font-title-md font-semibold text-on-surface">{meal.name}</span>
              <span className="text-[13px] text-error font-medium">This action cannot be undone.</span>
            </div>
          ) : (
            <>
              <div>
                <label className={labelClass}>Food Name <span className="text-error">*</span></label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} autoFocus />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>Calories <span className="text-error">*</span></label>
                  <input type="number" min="0" value={calories} onChange={e => setCalories(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Protein <span className="text-error">*</span></label>
                  <input type="number" min="0" value={protein} onChange={e => setProtein(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Carbs <span className="text-error">*</span></label>
                  <input type="number" min="0" value={carbs} onChange={e => setCarbs(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Fat <span className="text-error">*</span></label>
                  <input type="number" min="0" value={fat} onChange={e => setFat(e.target.value)} className={inputClass} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-outline-variant/60 bg-surface-container-low">
          {confirmDelete ? (
            <>
              <div className="flex items-center gap-3 ml-auto w-full justify-end">
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all bg-error text-on-error hover:bg-error/90 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all text-error hover:bg-error-container/50"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Delete
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={loading || !isFormValid()}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMealModal;
