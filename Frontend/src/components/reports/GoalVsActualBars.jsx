import React from 'react';

const ProgressBar = ({ label, actual, target, unit, colorClass, bgClass }) => {
  const percentage = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
  
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[13px]">
        <span className="font-semibold text-on-surface">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-on-surface">{Math.round(actual)}</span>
          <span className="text-on-surface-variant font-medium">/ {target} {unit}</span>
          <span className={`text-[11px] font-bold ml-1 ${percentage >= 100 ? 'text-primary' : 'text-on-surface-variant'}`}>
            ({percentage}%)
          </span>
        </div>
      </div>
      <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${bgClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const GoalVsActualBars = ({ goals, averages }) => {
  if (!goals) return null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="font-title-lg text-title-lg font-semibold text-on-surface">Goal vs Actual</h3>
        <p className="text-[13px] text-on-surface-variant mt-1">Compare your daily average intake with your targets.</p>
      </div>

      <div className="flex flex-col gap-5 flex-grow justify-center">
        <ProgressBar 
          label="Calories" 
          actual={averages.calories} 
          target={averages.targetCalories ?? goals?.targetCalories ?? 2000} 
          unit="kcal" 
          bgClass="bg-primary" 
        />
        <ProgressBar 
          label="Protein" 
          actual={averages.protein} 
          target={averages.targetProtein ?? goals?.targetProtein ?? 150} 
          unit="g" 
          bgClass="bg-[#7e57c2]" 
        />
        <ProgressBar 
          label="Carbohydrates" 
          actual={averages.carbs} 
          target={averages.targetCarbs ?? goals?.targetCarbs ?? 200} 
          unit="g" 
          bgClass="bg-[#22c55e]" 
        />
        <ProgressBar 
          label="Fat" 
          actual={averages.fat} 
          target={averages.targetFat ?? goals?.targetFat ?? 65} 
          unit="g" 
          bgClass="bg-[#f59e0b]" 
        />
      </div>
    </div>
  );
};

export default GoalVsActualBars;
