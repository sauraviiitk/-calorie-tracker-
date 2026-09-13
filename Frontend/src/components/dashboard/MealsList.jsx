import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EditMealModal from '../diary/EditMealModal';
import api from '../../services/api';

/* ─── Meal type config ───────────────────────────────────────────── */
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const MEAL_CONFIG = {
  Breakfast: { icon: 'wb_sunny',       iconBg: 'bg-amber-100', iconColor: 'text-amber-500' },
  Lunch:     { icon: 'lunch_dining',   iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  Dinner:    { icon: 'dinner_dining',  iconBg: 'bg-violet-100',iconColor: 'text-violet-600' },
  Snacks:    { icon: 'cookie',         iconBg: 'bg-rose-100',  iconColor: 'text-rose-500' },
};

/* ─── Single Meal Item ───────────────────────────────────────────── */
const MealItem = ({ meal, onEdit, onDelete, isEditable }) => {
  const { name, date, calories, protein, carbs, fat } = meal;
  const timeStr = date
    ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    try {
      setDeleting(true);
      await api.delete(`/meals/${meal.id}`);
      onDelete(meal.id);
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group border
        ${confirmDelete
          ? 'bg-red-50 border-red-200/70'
          : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container-low'
        }`}
    >
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-on-surface text-[14px] truncate">{name}</span>
          {timeStr && (
            <>
              <span className="text-outline-variant text-[12px]">•</span>
              <span className="text-on-surface-variant text-[12px] flex-shrink-0">{timeStr}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[12px] text-on-surface-variant flex-wrap">
          <span className="font-semibold text-on-surface">{Math.round(calories)} kcal</span>
          <span className="text-outline-variant">•</span>
          <span>P: {Math.round(protein || 0)}g</span>
          <span className="text-outline-variant">•</span>
          <span>C: {Math.round(carbs || 0)}g</span>
          <span className="text-outline-variant">•</span>
          <span>F: {Math.round(fat || 0)}g</span>
        </div>
      </div>

      {isEditable && (
        <div className={`flex items-center gap-1 flex-shrink-0 ml-3 transition-opacity duration-200
          ${confirmDelete ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {!confirmDelete && (
            <button onClick={() => onEdit(meal)} title="Edit meal"
              className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[17px]">edit</span>
            </button>
          )}
          <button onClick={handleDeleteClick} disabled={deleting}
            title={confirmDelete ? 'Click again to confirm' : 'Delete meal'}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-all
              ${confirmDelete ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-50 hover:text-red-600'}
              ${deleting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
            <span className="material-symbols-outlined text-[15px]">
              {deleting ? 'hourglass_empty' : 'delete'}
            </span>
            {confirmDelete && <span>{deleting ? 'Deleting…' : 'Confirm?'}</span>}
          </button>
          {confirmDelete && !deleting && (
            <button onClick={() => setConfirmDelete(false)}
              className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Meal Section (per type) ───────────────────────────────────── */
const MealSection = ({ type, meals, onAddMeal, onEdit, onDelete, isEditable }) => {
  const cfg = MEAL_CONFIG[type];
  const sectionCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const isEmpty = meals.length === 0;

  return (
    <div className={`rounded-2xl border transition-all
      ${isEmpty
        ? 'border-dashed border-outline-variant/50 bg-surface-container-lowest/40'
        : 'border-outline-variant/40 bg-surface-container-lowest'
      }`}>
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
            <span className={`material-symbols-outlined text-[20px] ${cfg.iconColor}`}>{cfg.icon}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface text-[14px]">{type}</span>
            {!isEmpty && (
              <span className="text-on-surface-variant text-[12px]">
                {meals.length} item{meals.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isEmpty && (
            <span className="font-bold text-on-surface text-[14px]">{Math.round(sectionCal)} kcal</span>
          )}
          {isEditable && isEmpty && (
            <button onClick={() => onAddMeal(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all text-[13px] font-medium">
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Food
            </button>
          )}
          {isEditable && !isEmpty && (
            <button onClick={() => onAddMeal(type)} title={`Add to ${type}`}
              className="w-8 h-8 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
            </button>
          )}
        </div>
      </div>

      {isEmpty && (
        <div className="px-4 pb-4 text-[13px] text-on-surface-variant italic">No meal added yet</div>
      )}

      {!isEmpty && (
        <div className="flex flex-col gap-1.5 px-3 pb-3">
          {meals.map((meal) => (
            <MealItem
              key={meal.id}
              meal={meal}
              isEditable={isEditable}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main MealsList Card ───────────────────────────────────────── */
const MealsList = ({ meals = [], loading, onAddMeal, onMealUpdated, onMealDeleted, isEditable = true }) => {
  const [editingMeal, setEditingMeal] = useState(null);

  const normalizeMealType = (type) => MEAL_TYPES.includes(type) ? type : 'Snacks';

  const grouped = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = meals.filter((m) => normalizeMealType(m.mealType) === type);
    return acc;
  }, {});

  const totalLogged = MEAL_TYPES.filter((t) => grouped[t].length > 0).length;

  if (loading) {
    return (
      <Card className="lg:col-span-8 p-6 flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-container-low animate-pulse" />
        ))}
      </Card>
    );
  }

  return (
    <>
      <Card className="lg:col-span-8 flex flex-col gap-0" noPadding>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-outline-variant/40">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[24px]">restaurant_menu</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Today's Meals</h2>
            <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
              {totalLogged} of 4 logged
            </span>
          </div>
          {isEditable && (
            <Button variant="secondary" icon="add_circle" onClick={() => onAddMeal()}>
              Add Meal
            </Button>
          )}
        </div>

        {/* Grouped meal sections */}
        <div className="flex flex-col gap-3 p-4">
          {MEAL_TYPES.map((type) => (
            <MealSection
              key={type}
              type={type}
              meals={grouped[type]}
              isEditable={isEditable}
              onAddMeal={(mealType) => onAddMeal(mealType)}
              onEdit={setEditingMeal}
              onDelete={(id) => onMealDeleted(id)}
            />
          ))}
        </div>
      </Card>

      {editingMeal && (
        <EditMealModal
          meal={editingMeal}
          onClose={() => setEditingMeal(null)}
          onSave={(updated) => { onMealUpdated(updated); setEditingMeal(null); }}
          onDelete={(id) => { onMealDeleted(id); setEditingMeal(null); }}
        />
      )}
    </>
  );
};

export default MealsList;
