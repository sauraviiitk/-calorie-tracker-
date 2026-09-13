import React from 'react';
import { formatNutrition } from '../../utils/formatters';

const MetricCard = ({ label, actual, target, unit }) => {
  const percentage = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
  const isOver = actual > target;
  const diff = Math.abs(target - actual);
  
  // Semantic messaging
  let statusMsg = '';
  let statusColor = 'text-on-surface-variant';
  
  if (percentage >= 100) {
    statusMsg = isOver ? `${formatNutrition(diff, unit)} ${unit} over target` : 'Target reached';
    statusColor = isOver ? (label === 'Calories' || label === 'Fat' ? 'text-amber-600' : 'text-primary') : 'text-primary';
  } else if (percentage >= 85) {
    statusMsg = 'Near daily target';
    statusColor = 'text-[#22c55e]';
  } else {
    statusMsg = `${formatNutrition(diff, unit)} ${unit} remaining`;
  }

  return (
    <div className="flex flex-col p-5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl hover:border-outline-variant transition-colors group">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h4 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">{label}</h4>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-bold text-on-surface leading-none tracking-tight">{formatNutrition(actual, unit)}</span>
            <span className="text-[14px] font-medium text-on-surface-variant">/ {formatNutrition(target, unit)} {unit}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[16px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">{percentage}%</span>
        </div>
      </div>
      
      <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mb-3">
        <div 
          className="h-full rounded-full bg-primary transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <span className={`text-[13px] font-medium ${statusColor}`}>
        {statusMsg}
      </span>
    </div>
  );
};

const DailyNutritionPerformance = ({ goals, averages }) => {
  if (!goals) return null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col w-full">
      <div className="mb-6 md:mb-8">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Daily Nutrition</h3>
        <p className="text-[14px] text-on-surface-variant mt-1">Your intake compared with your personalized daily targets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <MetricCard 
          label="Calories" 
          actual={averages.calories} 
          target={averages.targetCalories ?? goals?.targetCalories ?? 2000} 
          unit="kcal" 
        />
        <MetricCard 
          label="Protein" 
          actual={averages.protein} 
          target={averages.targetProtein ?? goals?.targetProtein ?? 150} 
          unit="g" 
        />
        <MetricCard 
          label="Carbohydrates" 
          actual={averages.carbs} 
          target={averages.targetCarbs ?? goals?.targetCarbs ?? 200} 
          unit="g" 
        />
        <MetricCard 
          label="Fat" 
          actual={averages.fat} 
          target={averages.targetFat ?? goals?.targetFat ?? 65} 
          unit="g" 
        />
      </div>
    </div>
  );
};

export default DailyNutritionPerformance;
