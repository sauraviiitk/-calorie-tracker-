import React from 'react';

// Using mock data for micronutrients as they are not currently tracked in the database
const MOCK_MICROS = {
  vitamins: [
    { name: 'Vitamin A', actual: 720, target: 900, unit: 'mcg', percentage: 80 },
    { name: 'Vitamin C', actual: 82, target: 90, unit: 'mg', percentage: 91 },
    { name: 'Vitamin D', actual: 12, target: 20, unit: 'mcg', percentage: 60 },
    { name: 'Vitamin B12', actual: 2.1, target: 2.4, unit: 'mcg', percentage: 87 },
  ],
  minerals: [
    { name: 'Calcium', actual: 760, target: 1000, unit: 'mg', percentage: 76 },
    { name: 'Iron', actual: 14, target: 18, unit: 'mg', percentage: 77 },
    { name: 'Magnesium', actual: 310, target: 400, unit: 'mg', percentage: 77 },
    { name: 'Potassium', actual: 2800, target: 3400, unit: 'mg', percentage: 82 },
  ]
};

const MicroRow = ({ data }) => {
  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-outline-variant/30 last:border-0">
      <div className="flex justify-between items-center text-[13px]">
        <span className="font-semibold text-on-surface">{data.name}</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-on-surface">{data.actual} <span className="text-[11px] font-medium text-on-surface-variant">{data.unit}</span></span>
          <span className="text-[12px] font-bold text-primary w-10 text-right">{data.percentage}%</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden flex">
        <div 
          className="h-full rounded-full bg-primary/70 transition-all duration-1000"
          style={{ width: `${data.percentage}%` }}
        />
      </div>
    </div>
  );
};

const MicronutrientSummary = () => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col w-full">
      <div className="mb-6">
        <h3 className="font-title-lg text-title-lg font-semibold text-on-surface">Micronutrient Summary <span className="text-[10px] ml-2 px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full font-bold uppercase tracking-wider">Estimated</span></h3>
        <p className="text-[13px] text-on-surface-variant mt-1">Vitamins and minerals estimated from your logged meals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <h4 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pb-2 border-b border-outline-variant/60">Vitamins</h4>
          <div className="flex flex-col">
            {MOCK_MICROS.vitamins.map(v => <MicroRow key={v.name} data={v} />)}
          </div>
        </div>
        
        <div>
          <h4 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 pb-2 border-b border-outline-variant/60">Minerals</h4>
          <div className="flex flex-col">
            {MOCK_MICROS.minerals.map(m => <MicroRow key={m.name} data={m} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicronutrientSummary;
