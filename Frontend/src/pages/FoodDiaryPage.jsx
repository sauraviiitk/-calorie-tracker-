import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MealLoggerModal from '../components/diary/MealLoggerModal';
import EditMealModal from '../components/diary/EditMealModal';
import PdfImportModal from '../components/diary/PdfImportModal';
import ErrorState from '../components/ui/ErrorState';
import { normalizeApiError } from '../utils/errorHandler';
import { isEditableDate, getLocalDateString } from '../utils/dateUtils';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const MEAL_ICONS = {
  Breakfast: { icon: 'wb_sunny', color: 'bg-[#fff8e1] text-[#f59e0b]' },
  Lunch:     { icon: 'lunch_dining', color: 'bg-[#e8f5e9] text-[#22c55e]' },
  Dinner:    { icon: 'dinner_dining', color: 'bg-[#ede7f6] text-[#7e57c2]' },
  Snacks:    { icon: 'cookie', color: 'bg-[#fce4ec] text-[#e91e63]' },
};

/* ─── Date Navigator ─────────────────────────────────────── */
const DateNavigator = ({ date, onPrev, onNext, onToday }) => {
  const isToday = new Date().toDateString() === date.toDateString();
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button onClick={onPrev} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors" title="Previous day">
        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_left</span>
      </button>
      <div className="flex items-center justify-center min-w-[140px] px-2">
        <span className="font-title-md text-on-surface font-semibold text-[15px]">
          {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          {isToday && <span className="ml-1 text-primary text-[14px]"> (Today)</span>}
        </span>
      </div>
      <button 
        onClick={onNext} 
        disabled={isToday || date > new Date()}
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors ${isToday || date > new Date() ? 'text-outline-variant cursor-not-allowed opacity-50' : 'hover:bg-surface-container-high text-on-surface-variant'}`} 
        title="Next day"
      >
        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_right</span>
      </button>
      {!isToday && (
        <button onClick={onToday} className="ml-0 sm:ml-1 px-3 sm:px-4 py-1.5 rounded-full bg-primary text-white text-[12px] sm:text-[13px] font-semibold hover:bg-primary/90 transition-all shadow-sm">
          Today
        </button>
      )}
    </div>
  );
};

/* ─── Nutrition Summary Bar ──────────────────────────────── */
const NutritionSummary = ({ meals, goals }) => {
  const total = {
    calories: meals.reduce((s, m) => s + (m.calories || 0), 0),
    protein:  meals.reduce((s, m) => s + (m.protein  || 0), 0),
    carbs:    meals.reduce((s, m) => s + (m.carbs    || 0), 0),
    fat:      meals.reduce((s, m) => s + (m.fat      || 0), 0),
  };
  const targetCal = goals?.targetCalories || 2000;
  const pct = Math.min((total.calories / targetCal) * 100, 100);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 border border-outline-variant/60 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-1">
        <h2 className="font-title-lg text-on-surface font-semibold text-[18px]">Today's Nutrition</h2>
        <span className="font-label-md text-[14px] font-medium text-on-surface-variant">
          {Math.round(targetCal - total.calories)} kcal remaining
        </span>
      </div>

      {/* Calorie progress */}
      <div className="flex items-end gap-3 mb-3">
        <span className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">{Math.round(total.calories)}</span>
        <span className="font-body-md text-[14px] text-on-surface-variant mb-1">/ {targetCal} kcal</span>
      </div>
      <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden mb-6">
        <div
          className={`h-2 rounded-full transition-all ${pct >= 100 ? 'bg-error' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Macros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Protein', val: total.protein, target: goals?.targetProtein || 150, color: 'text-[#7e57c2]', bg: 'bg-[#ede7f6]', fg: 'bg-[#7e57c2]' },
          { label: 'Carbs',   val: total.carbs,   target: goals?.targetCarbs   || 200, color: 'text-[#22c55e]', bg: 'bg-[#e8f5e9]', fg: 'bg-[#22c55e]' },
          { label: 'Fat',     val: total.fat,     target: goals?.targetFat     ||  65, color: 'text-[#f59e0b]', bg: 'bg-[#fff8e1]', fg: 'bg-[#f59e0b]' },
        ].map(({ label, val, target, color, bg, fg }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={`font-label-sm text-[13px] font-semibold ${color}`}>{label}</span>
              <span className="font-label-sm text-[13px] text-on-surface-variant font-medium text-right">{Math.round(val)}g / {target}g</span>
            </div>
            <div className={`w-full h-1.5 rounded-full ${bg} overflow-hidden`}>
              <div className={`h-1.5 rounded-full ${fg} transition-all`} style={{ width: `${Math.min((val / target) * 100, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Meal Section (per type) ────────────────────────────── */
const MealSection = ({ type, meals, onAddFood, onEditMeal, isEditable = true }) => {
  const cfg = MEAL_ICONS[type] || { icon: 'restaurant', color: 'bg-surface-container text-on-surface-variant' };
  const sectionCal = meals.reduce((s, m) => s + (m.calories || 0), 0);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden flex flex-col">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-outline-variant/40 bg-surface-container-lowest/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0`}>
            <span className="material-symbols-outlined text-[20px]">{cfg.icon}</span>
          </div>
          <span className="font-title-md text-on-surface font-semibold text-[16px]">{type}</span>
        </div>
        <span className="font-title-sm text-[15px] text-on-surface font-bold text-right">{Math.round(sectionCal)} kcal</span>
      </div>

      {/* Food items */}
      <div className="flex flex-col">
        {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <p className="text-[14px] text-on-surface-variant mb-4">No food logged yet.</p>
            {isEditable && (
              <button
                onClick={() => onAddFood(type)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container/60 text-primary hover:bg-primary/20 transition-colors text-[13px] font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Food
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 hover:bg-surface-container-low transition-colors group border-b border-outline-variant/20 last:border-0 gap-3 sm:gap-0"
                >
                  <div className="flex flex-col min-w-0 pr-0 sm:pr-4">
                    <span className="font-title-sm text-on-surface font-medium text-[15px] leading-tight mb-0.5 truncate">{meal.name}</span>
                    {(meal.quantity && meal.unit) && (
                      <span className="font-body-sm text-on-surface-variant text-[13px]">{meal.quantity} {meal.unit}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-title-sm text-on-surface font-medium text-[14px] text-right min-w-[60px]">{Math.round(meal.calories)} kcal</span>
                    {isEditable && (
                      <button
                        onClick={() => onEditMeal(meal)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary"
                        title="Edit meal"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Add Food button for populated lists */}
            {isEditable && (
              <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/20 bg-surface-container-lowest/30">
                <button
                  onClick={() => onAddFood(type)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-[14px] font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Add Food
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const FoodDiaryPage = () => {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorObj, setErrorObj] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultMealType, setDefaultMealType] = useState('Breakfast');
  const [editingMeal, setEditingMeal] = useState(null);
  const [pdfImportOpen, setPdfImportOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setErrorObj(null);
    try {
      const dateStr = getLocalDateString(date);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [mealsRes, goalsRes] = await Promise.all([
        api.get(`/meals?startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`),
        api.get(`/goals?date=${dateStr}`),
      ]);
      if (mealsRes.data.success) setMeals(mealsRes.data.data);
      if (goalsRes.data.success) setGoals(goalsRes.data.data);
    } catch (err) {
      console.error('FoodDiary fetch error:', err);
      setErrorObj(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 

    const handleDataChanged = () => fetchData();
    window.addEventListener('appDataChanged', handleDataChanged);

    return () => {
      window.removeEventListener('appDataChanged', handleDataChanged);
    };
  }, [date]);

  const changeDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  };

  const openAddModal = (type) => {
    setDefaultMealType(type);
    setModalOpen(true);
  };

  const handleMealSaved = (newMeal) => {
    setMeals(prev => [...prev, newMeal]);
    setModalOpen(false);
  };

  const handleMealUpdated = (updated) => {
    setMeals(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingMeal(null);
  };

  const handleMealDeleted = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    setEditingMeal(null);
  };

  // Normalize mealType
  const normalizeMealType = (type) =>
    MEAL_TYPES.includes(type) ? type : 'Breakfast';

  const grouped = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = meals.filter(m => normalizeMealType(m.mealType) === type);
    return acc;
  }, {});

  const isEditable = isEditableDate(date);

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 flex flex-col gap-6 sm:gap-8 overflow-x-hidden">
      {/* Page title + Date nav + Import button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-md text-3xl font-bold text-on-surface">Food Diary</h1>
          <p className="text-on-surface-variant text-[15px]">Track what you eat, day by day.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setPdfImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant text-[14px] font-medium hover:bg-surface-container-highest transition-all h-[44px]"
            title="Import meals from PDF"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            <span>Import PDF</span>
          </button>
          <div className="h-[44px] flex items-center bg-surface-container-lowest border border-outline-variant/40 rounded-full px-4 shadow-sm">
            <DateNavigator
              date={date}
              onPrev={() => changeDate(-1)}
              onNext={() => changeDate(1)}
              onToday={() => setDate(new Date())}
            />
          </div>
        </div>
      </div>

      {errorObj ? (
        <div className="mt-8">
          <ErrorState error={errorObj} onRetry={fetchData} />
        </div>
      ) : (
        <>
          {/* Nutrition Summary */}
          {loading ? (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/60 animate-pulse h-[200px]" />
      ) : (
        <NutritionSummary meals={meals} goals={goals} />
      )}

      {/* Meal Sections */}
      <div className="flex flex-col gap-6">
        {loading ? (
          MEAL_TYPES.map(t => (
            <div key={t} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 h-[120px] animate-pulse" />
          ))
        ) : (
          MEAL_TYPES.map(type => (
            <MealSection
              key={type}
              type={type}
              meals={grouped[type]}
              isEditable={isEditable}
              onAddFood={openAddModal}
              onEditMeal={setEditingMeal}
            />
          ))
        )}
      </div>
        </>
      )}

      {/* Add Food Modal */}
      <MealLoggerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleMealSaved}
        selectedDate={date}
        defaultMealType={defaultMealType}
      />

      {/* Edit/Delete Modal */}
      {editingMeal && (
        <EditMealModal
          meal={editingMeal}
          onClose={() => setEditingMeal(null)}
          onSave={handleMealUpdated}
          onDelete={handleMealDeleted}
        />
      )}

      {/* PDF Import Modal */}
      <PdfImportModal
        isOpen={pdfImportOpen}
        onClose={() => setPdfImportOpen(false)}
        onImported={(result) => { 
          if (result && result.entries && result.entries.length > 0) {
            setDate(new Date(result.entries[0].date));
          } else {
            fetchData();
          }
          setPdfImportOpen(false); 
        }}
      />
    </div>
  );
};

export default FoodDiaryPage;
