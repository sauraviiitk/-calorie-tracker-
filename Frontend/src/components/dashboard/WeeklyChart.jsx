import React, { useState, useEffect, useCallback } from 'react';
import Card from '../ui/Card';
import api from '../../services/api';
import { getLocalDateString } from '../../utils/dateUtils';

const WeeklyChart = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeeklyData = useCallback(async () => {
    try {
      const res = await api.get('/reports/weekly');
      if (res.data.success) {
        setWeeklyData(res.data.data);
      }
    } catch (err) {
      console.warn('[WeeklyChart] Failed to fetch weekly report:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyData();

    const handleDataChanged = () => fetchWeeklyData();
    window.addEventListener('appDataChanged', handleDataChanged);

    return () => {
      window.removeEventListener('appDataChanged', handleDataChanged);
    };
  }, [fetchWeeklyData]);

  const targetCalories = weeklyData?.goals?.targetCalories || 2000;
  const avgCalories = weeklyData?.avgDailyCalories || 0;
  const isOnTrack = avgCalories <= targetCalories;

  const dailyBreakdown = weeklyData?.dailyBreakdown || [];
  const todayStr = getLocalDateString(new Date());

  // Determine Y-axis ceiling (at least 2,500 or rounded up to nearest 500 above max)
  const maxCalorieInWeek = Math.max(
    targetCalories,
    ...dailyBreakdown.map((d) => d.calories || 0),
    2000
  );
  const yAxisMax = Math.ceil((maxCalorieInWeek * 1.15) / 500) * 500 || 2500;
  const yAxisSteps = [
    yAxisMax,
    Math.round(yAxisMax * 0.8),
    Math.round(yAxisMax * 0.6),
    Math.round(yAxisMax * 0.4),
    Math.round(yAxisMax * 0.2),
    0,
  ];

  return (
    <Card className="border border-outline-variant/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-outline-variant/40">
        <div className="flex flex-col gap-1.5">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                Weekly Calories
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-body-sm font-medium">
                <span className="text-on-surface font-semibold">
                  Weekly Avg: {avgCalories.toLocaleString()} kcal
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-semibold ${
                    isOnTrack
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOnTrack ? 'bg-tertiary' : 'bg-error'
                    }`}
                  ></span>
                  {isOnTrack ? 'On Track' : 'Over Target'}
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Your calorie intake over the last 7 days compared to your daily target. (Cached in Redis)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 font-label-md text-label-md text-on-surface-variant flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="font-medium">Intake</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 border-b-2 border-dashed border-primary"></span>
            <span className="font-medium">Target ({targetCalories.toLocaleString()} kcal)</span>
          </div>
        </div>
      </div>

      <div className="relative pt-6 pb-2 overflow-x-auto custom-scrollbar">
        <div className="min-w-[500px]">
          <div className="relative flex h-72 w-full">
            {/* Y Axis */}
            <div className="flex flex-col justify-between items-end pr-3 pb-8 text-label-sm font-medium text-on-surface-variant/70 select-none w-16 flex-shrink-0">
              {yAxisSteps.map((val, idx) => (
                <span key={idx}>{val.toLocaleString()}</span>
              ))}
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
              <div
                className="absolute left-0 right-0 border-b-2 border-dashed border-primary/60 pointer-events-none z-10 flex items-center justify-end pr-1"
                style={{
                  bottom: `calc(32px + (${targetCalories} / ${yAxisMax}) * (100% - 32px))`,
                }}
              >
                <span className="-top-3 relative px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-primary shadow-sm">
                  {targetCalories.toLocaleString()} kcal Target
                </span>
              </div>

              {/* Bars */}
              <div className="relative z-20 grid grid-cols-7 gap-2 sm:gap-4 md:gap-6 h-full items-end">
                {dailyBreakdown.map((day, idx) => {
                  const isToday = day.date === todayStr;
                  const calories = day.calories || 0;
                  const diff = calories - (day.targetCalories || targetCalories);
                  const heightPercent = Math.min(100, Math.max(4, Math.round((calories / yAxisMax) * 100)));

                  return (
                    <div
                      key={day.date || idx}
                      className="flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 flex flex-col items-center z-30 pointer-events-none whitespace-nowrap">
                        <div className="bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center">
                          <span className="font-title-md text-[13px] font-bold text-inverse-on-surface leading-tight">
                            {day.dayName} · {calories.toLocaleString()} kcal
                          </span>
                          <span className="text-[11px] text-primary-fixed-dim font-medium leading-none mt-0.5">
                            Target: {(day.targetCalories || targetCalories).toLocaleString()} kcal | Diff:{' '}
                            {diff >= 0 ? `+${diff}` : `${diff}`} kcal
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-inverse-surface rotate-45 -mt-1"></div>
                      </div>

                      {/* Bar Fill */}
                      {calories > 0 ? (
                        <div
                          className={`w-full max-w-[42px] rounded-t-lg transition-all ${
                            isToday
                              ? 'bg-primary shadow-[0_4px_16px_rgba(101,61,167,0.35)]'
                              : 'bg-primary-container/80 group-hover:bg-primary-container'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      ) : (
                        <div
                          className="w-full max-w-[42px] border-2 border-dashed border-outline-variant/60 rounded-t-lg bg-surface-container-low/40 flex items-center justify-center transition-all"
                          style={{ height: '12%' }}
                        >
                          <span className="text-outline text-[12px] font-bold select-none">—</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex items-center pl-16">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 md:gap-6 w-full text-center font-label-md text-label-md pt-2">
              {dailyBreakdown.map((day, idx) => {
                const isToday = day.date === todayStr;
                return (
                  <div key={day.date || idx} className="flex flex-col items-center">
                    <span
                      className={`font-medium ${
                        isToday ? 'text-primary font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    {isToday ? (
                      <span className="inline-block px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-[10px] font-bold mt-0.5">
                        Today
                      </span>
                    ) : (
                      <span className="text-[11px] text-outline font-normal mt-0.5">
                        {day.calories > 0 ? day.calories.toLocaleString() : 'No data'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyChart;
