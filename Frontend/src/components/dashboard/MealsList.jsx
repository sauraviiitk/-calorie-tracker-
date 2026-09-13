import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EditMealModal from '../diary/EditMealModal';
import api from '../../services/api';

/* ─── Single Meal Row ───────────────────────────────────────────── */
const MealItem = ({ meal, onEdit, onDelete }) => {
  const { name, date, calories, protein, carbs, fat } = meal;
  const timeStr = date
    ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* First click arms confirm; second click fires delete */
  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // auto-cancel after 3 s
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
      className={`relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group
        ${confirmDelete
          ? 'bg-red-50 border border-red-200/70 shadow-sm'
          : 'bg-surface-container-low hover:bg-surface-container hover:shadow-sm border border-transparent'
        }`}
    >
      {/* Left: icon + text */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">set_meal</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-title-md text-title-md text-on-surface font-semibold truncate">{name}</h3>
            {timeStr && (
              <>
                <span className="text-outline text-body-sm">•</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant flex-shrink-0">{timeStr}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 font-label-sm text-label-sm flex-wrap">
            <span className="font-semibold text-on-surface">{Math.round(calories)} kcal</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant">P: {protein || 0}g</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant">C: {carbs || 0}g</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant">F: {fat || 0}g</span>
          </div>
        </div>
      </div>

      {/* Right: action buttons (visible on hover, always visible when confirming) */}
      <div
        className={`flex items-center gap-1 flex-shrink-0 ml-3 transition-opacity duration-200
          ${confirmDelete ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        {/* Edit button – hidden while confirming delete */}
        {!confirmDelete && (
          <button
            onClick={() => onEdit(meal)}
            title="Edit meal"
            className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        )}

        {/* Delete / Confirm delete */}
        <button
          onClick={handleDeleteClick}
          disabled={deleting}
          title={confirmDelete ? 'Click again to confirm deletion' : 'Delete meal'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 select-none
            ${confirmDelete
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
              : 'text-red-500 hover:bg-red-50 hover:text-red-600'
            }
            ${deleting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {deleting ? 'hourglass_empty' : 'delete'}
          </span>
          {confirmDelete && (
            <span className="pr-0.5 whitespace-nowrap">
              {deleting ? 'Deleting…' : 'Confirm?'}
            </span>
          )}
        </button>

        {/* Cancel confirmation */}
        {confirmDelete && !deleting && (
          <button
            onClick={() => setConfirmDelete(false)}
            title="Cancel"
            className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Meals List Card ───────────────────────────────────────────── */
const MealsList = ({ meals = [], loading, onAddMeal, onMealUpdated, onMealDeleted }) => {
  const [editingMeal, setEditingMeal] = useState(null);

  if (loading) {
    return (
      <Card className="lg:col-span-8 p-6 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-container-low animate-pulse" />
        ))}
      </Card>
    );
  }

  return (
    <>
      <Card className="lg:col-span-8 flex flex-col gap-0" noPadding>
        {/* Card header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-outline-variant/40">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[24px]">restaurant_menu</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Logged Meals</h2>
            <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
              {meals.length} items
            </span>
          </div>
          <Button variant="secondary" icon="add_circle" onClick={onAddMeal}>
            Add Meal
          </Button>
        </div>

        {/* Meal rows */}
        <div className="flex flex-col gap-2 p-4">
          {meals.length === 0 ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border-2 border-dashed border-outline-variant hover:border-primary transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-outline text-[22px]">restaurant</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">No meals logged yet</h3>
                  <p className="font-body-md text-body-md text-outline italic mt-0.5">Start tracking your food!</p>
                </div>
              </div>
              <Button variant="outline" icon="add" onClick={onAddMeal}>Add Food</Button>
            </div>
          ) : (
            meals.map((meal) => (
              <MealItem
                key={meal.id}
                meal={meal}
                onEdit={setEditingMeal}
                onDelete={(id) => onMealDeleted(id)}
              />
            ))
          )}
        </div>
      </Card>

      {/* Edit modal */}
      {editingMeal && (
        <EditMealModal
          meal={editingMeal}
          onClose={() => setEditingMeal(null)}
          onSave={(updated) => {
            onMealUpdated(updated);
            setEditingMeal(null);
          }}
          onDelete={(id) => {
            onMealDeleted(id);
            setEditingMeal(null);
          }}
        />
      )}
    </>
  );
};

export default MealsList;
