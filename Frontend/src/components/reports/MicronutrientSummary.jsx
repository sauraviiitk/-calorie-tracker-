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
    <div className="flex flex-col gap-1.5 py-3 border-b border-outline-variant/30 last:border-0 group">
      <div className="flex justify-between items-baseline text-[13px]">
        <span className="font-medium text-on-surface flex-1">{data.name}</span>
        <div className="flex items-baseline justify-end gap-4">
          <div className="text-right whitespace-nowrap min-w-[100px]">
            <span className="font-semibold text-on-surface">{formatNutrition(data.actual, data.unit)}</span>
            <span className="text-on-surface-variant font-medium"> / {formatNutrition(data.target, data.unit)} <span className="text-[11px]">{data.unit}</span></span>
          </div>
          <span className="text-[13px] font-bold text-primary w-9 text-right">{percentage}%</span>
        </div>
      </div>
      <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden flex opacity-60 group-hover:opacity-100 transition-opacity mt-0.5">
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
            <span className="text-[10px] px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded-md font-semibold tracking-wide border border-outline-variant/40">ESTIMATED</span>
          </h3>
          <p className="text-[14px] text-on-surface-variant mt-1">Values are estimated from your logged meals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <div>
          <div className="flex justify-between text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pb-2 border-b border-outline-variant">
            <span>Vitamins</span>
            <div className="flex gap-4 pr-1">
              <span className="min-w-[100px] text-right">Actual / Target</span>
              <span className="w-9 text-right">%</span>
            </div>
          </div>
          <div className="flex flex-col">
            {MOCK_MICROS.vitamins.map(v => <MicroRow key={v.name} data={v} />)}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pb-2 border-b border-outline-variant">
            <span>Minerals</span>
            <div className="flex gap-4 pr-1">
              <span className="min-w-[100px] text-right">Actual / Target</span>
              <span className="w-9 text-right">%</span>
            </div>
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
