import React from 'react';
import Card from '../ui/Card';
import CircularProgress from '../ui/CircularProgress';

const CalorieOverviewCard = ({ consumed = 0, target = 2200 }) => {
  const remaining = Math.max(0, target - consumed);
  const progress = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;

  return (
    <Card className="lg:col-span-5">
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Today's Calories</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Daily calculated energetic allowance</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
          Target: {target.toLocaleString()} kcal
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2 relative z-10">
        <CircularProgress progress={progress} size={160} strokeWidth={10} label={`${progress}%`} sublabel="consumed" />
        
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Consumed</span>
            <span className="font-title-md text-title-md text-on-surface font-semibold">{consumed.toLocaleString()} kcal</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Daily Goal</span>
            <span className="font-title-md text-title-md text-on-surface-variant font-semibold">{target.toLocaleString()} kcal</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary-container/70 text-on-surface">
            <span className="font-body-sm text-body-sm font-medium text-primary">Remaining</span>
            <span className="font-title-md text-title-md text-primary font-bold">{remaining.toLocaleString()} kcal</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm relative z-10">
        <div className="flex items-center gap-1.5 text-tertiary">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span className="font-medium">Deficit pacing ideal</span>
        </div>
        <button type="button" className="text-primary hover:text-primary-container font-label-md text-label-md font-semibold flex items-center gap-0.5">
          Details <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        </button>
      </div>
    </Card>
  );
};

export default CalorieOverviewCard;
