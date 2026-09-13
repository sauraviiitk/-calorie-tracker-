import React from 'react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const MacroRow = ({ title, caloriesPerGram, consumed, target, colorClass, barColor, badgeColor }) => {
  const remaining = Math.max(0, target - consumed);
  const progress = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></span>
          <span className="font-title-md text-title-md text-on-surface font-semibold">{title}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{caloriesPerGram} kcal/g</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="font-title-md text-title-md font-bold text-on-surface">{Math.round(consumed)}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">/ {target} g</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full ${badgeColor} font-label-sm text-label-sm font-bold`}>{progress}%</span>
        </div>
      </div>
      <ProgressBar progress={progress} colorClass={barColor} />
      <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-0.5">
        <span className={`${title === 'Protein' ? 'text-primary' : title === 'Fat' ? 'text-secondary' : 'text-primary-container'} font-medium`}>
          {Math.round(remaining)}g left
        </span>
        <span>Target: {target}g</span>
      </div>
    </div>
  );
};

const MacronutrientsCard = ({ 
  protein = { consumed: 0, target: 150 }, 
  carbs = { consumed: 0, target: 200 }, 
  fat = { consumed: 0, target: 65 } 
}) => {
  return (
    <Card className="lg:col-span-7">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Macronutrients</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Today's intake vs daily targets</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
          Balanced Ratio
        </span>
      </div>

      <div className="flex flex-col gap-5 my-auto relative z-10">
        <MacroRow 
          title="Protein" 
          caloriesPerGram={4} 
          consumed={protein.consumed} 
          target={protein.target} 
          colorClass="bg-primary" 
          barColor="bg-primary" 
          badgeColor="bg-secondary-container text-on-secondary-container" 
        />
        <MacroRow 
          title="Carbohydrates" 
          caloriesPerGram={4} 
          consumed={carbs.consumed} 
          target={carbs.target} 
          colorClass="bg-primary-container" 
          barColor="bg-primary-container" 
          badgeColor="bg-secondary-fixed text-on-secondary-fixed-variant" 
        />
        <MacroRow 
          title="Fat" 
          caloriesPerGram={9} 
          consumed={fat.consumed} 
          target={fat.target} 
          colorClass="bg-secondary" 
          barColor="bg-secondary" 
          badgeColor="bg-surface-container-high text-on-surface" 
        />
      </div>

      <div className="pt-4 mt-2 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm relative z-10 border-t border-outline-variant/60">
        <div className="flex items-center gap-1.5 text-secondary">
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span className="font-medium">Daily macro distribution optimal</span>
        </div>
        <button type="button" className="text-primary hover:text-primary-container font-label-md text-label-md font-semibold flex items-center gap-0.5">
          Macro Breakdown <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        </button>
      </div>
    </Card>
  );
};

export default MacronutrientsCard;
