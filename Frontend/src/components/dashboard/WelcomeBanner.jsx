import React from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const WelcomeBanner = ({ onAddMeal, isEditable = true }) => {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'User';
  
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            {greeting}, {userName}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body-md text-body-md text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            {dateStr}
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
          <span className="text-secondary font-medium italic">"Stay consistent today — small choices add up."</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search food library..."
            className="h-11 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-sm transition-all w-48 sm:w-64"
          />
        </div>
        {isEditable && (
          <Button variant="primary" size="lg" icon="add" onClick={onAddMeal}>
            Add Meal
          </Button>
        )}
      </div>
    </div>
  );
};

export default WelcomeBanner;
