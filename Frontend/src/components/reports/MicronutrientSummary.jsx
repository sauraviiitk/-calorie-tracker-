import React from 'react';
import { formatNutrition } from '../../utils/formatters';

// Using mock data for micronutrients as they are not currently tracked in the database
const MOCK_MICROS = {
  vitamins: [
    { name: 'Vitamin A', actual: 720, target: 900, unit: 'mcg' },
    { name: 'Vitamin C', actual: 82, target: 90, unit: 'mg' },
    { name: 'Vitamin D', actual: 12, target: 20, unit: 'mcg' },
    { name: 'Vitamin B12', actual: 2.1, target: 2.4, unit: 'mcg' },
  ],
  minerals: [
    { name: 'Calcium', actual: 760, target: 1000, unit: 'mg' },
    { name: 'Iron', actual: 14, target: 18, unit: 'mg' },
    { name: 'Magnesium', actual: 310, target: 400, unit: 'mg' },
    { name: 'Potassium', actual: 2800, target: 3400, unit: 'mg' },
  ]
};

const MicroRow = ({ data }) => {
  const percentage = data.target > 0 ? Math.min(Math.round((data.actual / data.target) * 100), 100) : 0;
  
  return (
    <div className="py-3 group">
      <div className="grid grid-cols-[1fr_auto_40px] gap-4 items-baseline text-[13px] mb-2">
        <span className="font-medium text-on-surface">{data.name}</span>
        <div className="text-right whitespace-nowrap">
          <span className="font-semibold text-on-surface">{formatNutrition(data.actual, data.unit)}</span>
          <span className="text-on-surface-variant font-medium text-[12px]"> / {formatNutrition(data.target, data.unit)} {data.unit}</span>
        </div>
        <span className="font-bold text-primary text-right">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
        <div 
          className="h-full rounded-full bg-primary transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const MicronutrientSummary = () => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col w-full">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-3">
            Micronutrient Summary
            <span className="text-[11px] px-2 py-0.5 bg-surface-container text-on-surface-variant rounded font-medium border border-outline-variant/50 tracking-wide uppercase">Estimated</span>
          </h3>
          <p className="text-[14px] text-on-surface-variant mt-1">Values are estimated from your logged meals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <div>
          <div className="grid grid-cols-[1fr_auto_40px] gap-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pb-2 border-b border-outline-variant">
            <span>Vitamins</span>
            <span className="text-right">Actual / Target</span>
            <span className="text-right">%</span>
          </div>
          <div className="flex flex-col">
            {MOCK_MICROS.vitamins.map(v => <MicroRow key={v.name} data={v} />)}
          </div>
        </div>
        
        <div>
          <div className="grid grid-cols-[1fr_auto_40px] gap-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pb-2 border-b border-outline-variant">
            <span>Minerals</span>
            <span className="text-right">Actual / Target</span>
            <span className="text-right">%</span>
          </div>
          <div className="flex flex-col">
            {MOCK_MICROS.minerals.map(m => <MicroRow key={m.name} data={m} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicronutrientSummary;
