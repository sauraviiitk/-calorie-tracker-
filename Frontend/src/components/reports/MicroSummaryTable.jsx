import React from 'react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const micronutrients = [
  { name: 'Vitamin C', amount: 85, target: 90, unit: 'mg', color: 'bg-primary' },
  { name: 'Iron', amount: 14, target: 18, unit: 'mg', color: 'bg-[#DDEFE3]' },
  { name: 'Calcium', amount: 800, target: 1000, unit: 'mg', color: 'bg-[#DDEBF5]' },
  { name: 'Fiber', amount: 28, target: 30, unit: 'g', color: 'bg-[#F8E5D8]' },
  { name: 'Sodium', amount: 2100, target: 2300, unit: 'mg', color: 'bg-[#F8F0D5]' },
  { name: 'Potassium', amount: 3200, target: 3400, unit: 'mg', color: 'bg-secondary-fixed-dim' },
];

const MicroSummaryTable = () => {
  return (
    <Card className="w-full">
      <div className="mb-6">
        <h3 className="font-title-lg text-title-lg text-on-surface font-semibold mb-1">Micronutrients Summary</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Your average daily intake this week.</p>
      </div>

      <div className="flex flex-col gap-5">
        {micronutrients.map((nutrient, idx) => {
          const progress = Math.min(Math.round((nutrient.amount / nutrient.target) * 100), 100);
          return (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-body-sm font-medium text-on-surface">
                <span>{nutrient.name}</span>
                <span className="text-on-surface-variant">
                  {nutrient.amount} <span className="text-[12px]">{nutrient.unit}</span> / {nutrient.target} <span className="text-[12px]">{nutrient.unit}</span>
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${nutrient.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MicroSummaryTable;
