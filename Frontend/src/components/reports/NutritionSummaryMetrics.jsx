import React from 'react';

const NutritionSummaryMetrics = ({ calories, protein, carbs, fat }) => {
  const MetricCard = ({ label, value, unit, colorClass }) => (
    <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col gap-1 transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)]">
      <span className="text-[12px] font-medium text-on-surface-variant uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-[24px] font-bold ${colorClass}`}>{Math.round(value)}</span>
        <span className="text-[13px] text-on-surface-variant font-medium">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <MetricCard label="Average Calories" value={calories} unit="kcal" colorClass="text-on-surface" />
      <MetricCard label="Average Protein" value={protein} unit="g" colorClass="text-[#7e57c2]" />
      <MetricCard label="Average Carbs" value={carbs} unit="g" colorClass="text-[#22c55e]" />
      <MetricCard label="Average Fat" value={fat} unit="g" colorClass="text-[#f59e0b]" />
    </div>
  );
};

export default NutritionSummaryMetrics;
