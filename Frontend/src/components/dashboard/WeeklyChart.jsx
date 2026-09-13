import React from 'react';
import Card from '../ui/Card';

const WeeklyChart = () => {
  return (
    <Card className="border border-outline-variant/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-outline-variant/40">
        <div className="flex flex-col gap-1.5">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">Weekly Calories</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-body-sm font-medium">
                <span className="text-on-surface font-semibold">Weekly Avg: 2,158 kcal</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>On Track
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Your calorie intake over the last 7 days compared to your daily target.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 font-label-md text-label-md text-on-surface-variant flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-container"></span>
            <span className="font-medium">Intake</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 border-b-2 border-dashed border-primary"></span>
            <span className="font-medium">Target (2,200 kcal)</span>
          </div>
        </div>
      </div>

      <div className="relative pt-6 pb-2 overflow-x-auto custom-scrollbar">
        <div className="min-w-[500px]">
          <div className="relative flex h-72 w-full">
          {/* Y Axis */}
          <div className="flex flex-col justify-between items-end pr-3 pb-8 text-label-sm font-medium text-on-surface-variant/70 select-none w-16 flex-shrink-0">
            <span>2,500</span>
            <span>2,000</span>
            <span>1,500</span>
            <span>1,000</span>
            <span>500</span>
            <span>0</span>
          </div>
          
          <div className="relative flex-1 h-full pb-8">
            {/* Grid lines */}
            <div className="absolute inset-0 pb-8 flex flex-col justify-between pointer-events-none z-0">
              <div className="w-full border-b border-surface-container-high"></div>
              <div className="w-full border-b border-surface-container-high"></div>
              <div className="w-full border-b border-surface-container-high"></div>
              <div className="w-full border-b border-surface-container-high"></div>
              <div className="w-full border-b border-surface-container-high"></div>
              <div className="w-full border-b border-outline-variant"></div>
            </div>
            
            {/* Target Line */}
            <div className="absolute left-0 right-0 border-b-2 border-dashed border-primary/60 pointer-events-none z-10 flex items-center justify-end pr-1" style={{ bottom: 'calc(32px + (2200 / 2500) * (100% - 32px))' }}>
              <span className="-top-3 relative px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-primary shadow-sm">2,200 kcal Target</span>
            </div>

            {/* Bars */}
            <div className="relative z-20 grid grid-cols-7 gap-2 sm:gap-4 md:gap-6 h-full items-end">
              <div className="flex flex-col items-center h-full justify-end group relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-md text-label-sm font-semibold pointer-events-none whitespace-nowrap shadow-md z-30">2,050 kcal (-150)</div>
                <div className="w-full max-w-[42px] bg-secondary-container/70 group-hover:bg-primary-container transition-colors rounded-t-lg" style={{ height: '82%' }}></div>
              </div>
              <div className="flex flex-col items-center h-full justify-end group relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-md text-label-sm font-semibold pointer-events-none whitespace-nowrap shadow-md z-30">2,180 kcal (-20)</div>
                <div className="w-full max-w-[42px] bg-secondary-container/70 group-hover:bg-primary-container transition-colors rounded-t-lg" style={{ height: '87.2%' }}></div>
              </div>
              <div className="flex flex-col items-center h-full justify-end group relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-md text-label-sm font-semibold pointer-events-none whitespace-nowrap shadow-md z-30">2,250 kcal (+50)</div>
                <div className="w-full max-w-[42px] bg-secondary-fixed-dim group-hover:bg-primary-container transition-colors rounded-t-lg" style={{ height: '90%' }}></div>
              </div>
              <div className="flex flex-col items-center h-full justify-end group relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-md text-label-sm font-semibold pointer-events-none whitespace-nowrap shadow-md z-30">2,100 kcal (-100)</div>
                <div className="w-full max-w-[42px] bg-secondary-container/70 group-hover:bg-primary-container transition-colors rounded-t-lg" style={{ height: '84%' }}></div>
              </div>
              <div className="flex flex-col items-center h-full justify-end group relative cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-md text-label-sm font-semibold pointer-events-none whitespace-nowrap shadow-md z-30">2,300 kcal (+100)</div>
                <div className="w-full max-w-[42px] bg-secondary-fixed-dim group-hover:bg-primary-container transition-colors rounded-t-lg" style={{ height: '92%' }}></div>
              </div>
              
              {/* Today's Bar */}
              <div className="flex flex-col items-center h-full justify-end relative cursor-pointer group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 flex flex-col items-center z-30 pointer-events-none">
                  <div className="bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center whitespace-nowrap">
                    <span className="font-title-md text-[13px] font-bold text-inverse-on-surface leading-tight">Sat · 1,980 kcal</span>
                    <span className="text-[11px] text-primary-fixed-dim font-medium leading-none mt-0.5">Daily Target: 2,200 kcal | Diff: -220 kcal</span>
                  </div>
                  <div className="w-2 h-2 bg-inverse-surface rotate-45 -mt-1"></div>
                </div>
                <div className="w-full max-w-[42px] bg-primary rounded-t-lg shadow-[0_4px_16px_rgba(101,61,167,0.35)]" style={{ height: '79.2%' }}></div>
              </div>
              
              {/* Future Day */}
              <div className="flex flex-col items-center h-full justify-end">
                <div className="w-full max-w-[42px] h-full border-2 border-dashed border-outline-variant/60 rounded-t-lg bg-surface-container-low/40 flex items-center justify-center" style={{ height: '40%' }}>
                  <span className="text-outline text-[16px] font-bold select-none">—</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* X Axis Labels */}
        <div className="flex items-center pl-16">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 md:gap-6 w-full text-center font-label-md text-label-md pt-2">
            <div className="flex flex-col items-center">
              <span className="text-on-surface-variant font-medium">Mon</span>
              <span className="text-[11px] text-outline font-normal mt-0.5">2,050</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-on-surface-variant font-medium">Tue</span>
              <span className="text-[11px] text-outline font-normal mt-0.5">2,180</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-on-surface-variant font-medium">Wed</span>
              <span className="text-[11px] text-outline font-normal mt-0.5">2,250</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-on-surface-variant font-medium">Thu</span>
              <span className="text-[11px] text-outline font-normal mt-0.5">2,100</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-on-surface-variant font-medium">Fri</span>
              <span className="text-[11px] text-outline font-normal mt-0.5">2,300</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-primary font-bold">Sat</span>
              <span className="inline-block px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-[10px] font-bold mt-0.5">Today</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-outline font-medium">Sun</span>
              <span className="text-[11px] text-outline/60 italic font-normal mt-0.5">No data</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyChart;
