import React from 'react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const WeightGoalCard = ({ currentWeight = 78.0, targetWeight = 72.0 }) => {
  const difference = Math.abs(currentWeight - targetWeight);
  const progress = currentWeight > targetWeight 
    ? Math.max(0, Math.min(100, ((80 - currentWeight) / (80 - targetWeight)) * 100)) // placeholder logic
    : 50; // if target is higher

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 lg:p-7">
        <div>
          <div className="grid grid-cols-[1fr_auto] gap-4 items-start mb-6">
            <h2 className="text-[22px] font-bold text-on-surface leading-tight">Weight Goal</h2>
            <span className="whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-[13px] font-semibold leading-none mt-0.5">
              Target: Oct 30
            </span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[14px] text-on-surface-variant block mb-1">Current Weight</span>
              <span className="text-[30px] text-on-surface font-bold leading-none">
                {currentWeight} <span className="text-[14px] font-normal text-on-surface-variant ml-0.5">kg</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[14px] text-on-surface-variant block mb-1">Target</span>
              <span className="text-[24px] text-on-surface font-semibold leading-none">
                {targetWeight} <span className="text-[14px] font-normal text-on-surface-variant ml-0.5">kg</span>
              </span>
            </div>
          </div>
          
          <div className="mt-8 mb-2">
            <div className="flex justify-between items-baseline text-[14px] text-on-surface-variant mb-3">
              <span>{currentWeight} kg</span>
              <span className="font-semibold text-primary">In progress</span>
              <span>{targetWeight} kg</span>
            </div>
            <ProgressBar progress={progress} />
          </div>
          
          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
              <span className="text-[15px] text-on-surface-variant leading-none">Remaining difference</span>
            </div>
            <span className="text-[16px] text-on-surface font-bold leading-none">{difference.toFixed(1)} kg</span>
          </div>
        </div>
        
        <div className="mt-6">
          <a href="#" className="inline-flex items-center gap-1.5 text-[15px] text-primary hover:text-primary/80 font-semibold transition-colors group">
            <span>View Weight Progress</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
      </Card>

      {/* Streak Badge */}
      <div className="bg-primary rounded-[16px] p-5 text-on-primary shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-[12px] bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-bold tracking-tight mb-0.5">Daily Streak: 14 Days</span>
          <span className="text-[13px] text-white/80 leading-snug pr-2">Consistent tracking leads to lasting transformation!</span>
        </div>
      </div>
    </div>
  );
};

export default WeightGoalCard;
