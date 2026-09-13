import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import { normalizeApiError } from '../utils/errorHandler';

import NutritionSummaryMetrics from '../components/reports/NutritionSummaryMetrics';
import WeeklyCalorieChart from '../components/reports/WeeklyCalorieChart';
import MacroTrendsChart from '../components/reports/MacroTrendsChart';
import MacroCompositionDonut from '../components/reports/MacroCompositionDonut';
import GoalVsActualBars from '../components/reports/GoalVsActualBars';
import MicronutrientSummary from '../components/reports/MicronutrientSummary';

const ReportsPage = () => {
  const [dateRangeType, setDateRangeType] = useState('7_days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('All');
  
  const [goals, setGoals] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorObj, setErrorObj] = useState(null);

  // Derived state for the charts
  const [summaryData, setSummaryData] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [dailyData, setDailyData] = useState([]);
  const [todayMacros, setTodayMacros] = useState({ protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    fetchReportData();
    
    const handleDataChanged = () => fetchReportData();
    window.addEventListener('appDataChanged', handleDataChanged);

    return () => {
      window.removeEventListener('appDataChanged', handleDataChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRangeType, customStart, customEnd, mealTypeFilter]);

  const fetchReportData = async () => {
    // Only fetch if custom dates are selected when in custom mode
    if (dateRangeType === 'custom' && (!customStart || !customEnd)) {
      return; 
    }

    setLoading(true);
    setErrorObj(null);

    try {
      let startDateIso, endDateIso;
      let startDateLocal, endDateLocal;
      
      const getLocalDateString = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const today = new Date();
      endDateLocal = getLocalDateString(today);
      
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      endDateIso = end.toISOString();

      if (dateRangeType === '7_days') {
        const start = new Date();
        start.setDate(today.getDate() - 6);
        startDateLocal = getLocalDateString(start);
        
        start.setHours(0, 0, 0, 0);
        startDateIso = start.toISOString();
      } else if (dateRangeType === '30_days') {
        const start = new Date();
        start.setDate(today.getDate() - 29);
        startDateLocal = getLocalDateString(start);
        
        start.setHours(0, 0, 0, 0);
        startDateIso = start.toISOString();
      } else if (dateRangeType === 'custom') {
        const startParts = customStart.split('-');
        const start = new Date(startParts[0], startParts[1] - 1, startParts[2]);
        startDateLocal = getLocalDateString(start);
        start.setHours(0, 0, 0, 0);
        startDateIso = start.toISOString();
        
        const endParts = customEnd.split('-');
        const customEndDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);
        endDateLocal = getLocalDateString(customEndDate);
        customEndDate.setHours(23, 59, 59, 999);
        endDateIso = customEndDate.toISOString();
      }

      const [goalsRes, mealsRes] = await Promise.all([
        api.get(`/goals/range?startDate=${startDateLocal}&endDate=${endDateLocal}`),
        api.get(`/meals?startDate=${startDateIso}&endDate=${endDateIso}&mealType=${mealTypeFilter}`)
      ]);

      let fetchedGoals = [];
      if (goalsRes.data.success) {
        fetchedGoals = goalsRes.data.data;
        // set the default global goal for components that expect a single goal object
        const defaultGoal = fetchedGoals.find(g => g.date === null) || fetchedGoals[0];
        setGoals(defaultGoal);
      }
      
      if (mealsRes.data.success) {
        const fetchedMeals = mealsRes.data.data;
        setMeals(fetchedMeals);
        processMealsData(fetchedMeals, fetchedGoals, startDateIso, endDateIso);
      }

    } catch (err) {
      console.error('Error fetching reports:', err);
      setErrorObj(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const processMealsData = (fetchedMeals, fetchedGoals, startIso, endIso) => {
    const start = new Date(startIso);
    start.setHours(0,0,0,0);
    const end = new Date(endIso);
    end.setHours(23,59,59,999);

    const getLocalDateString = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateString(new Date());
    const defaultGoal = fetchedGoals.find(g => g.date === null);

    // 1. Group meals by date (YYYY-MM-DD)
    const mealsByDate = {};
    let current = new Date(start);
    
    // Initialize all dates in range
    while (current <= end) {
      const dateKey = getLocalDateString(current);
      
      // Find if there is a specific goal for this date
      const specificGoal = fetchedGoals.find(g => g.date === dateKey);
      
      const targetCalories = specificGoal ? specificGoal.targetCalories : (defaultGoal?.targetCalories || 2000);
      const targetProtein = specificGoal ? specificGoal.targetProtein : (defaultGoal?.targetProtein || 150);
      const targetCarbs = specificGoal ? specificGoal.targetCarbs : (defaultGoal?.targetCarbs || 200);
      const targetFat = specificGoal ? specificGoal.targetFat : (defaultGoal?.targetFat || 65);

      mealsByDate[dateKey] = {
        name: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: dateKey,
        isToday: dateKey === todayStr,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        target: targetCalories,
        targetProtein,
        targetCarbs,
        targetFat
      };
      current.setDate(current.getDate() + 1);
    }

    // Accumulate actual meals
    fetchedMeals.forEach(meal => {
      if (!meal.date) return;
      const mealDateKey = getLocalDateString(new Date(meal.date));
      if (mealsByDate[mealDateKey]) {
        mealsByDate[mealDateKey].calories += (meal.calories || 0);
        mealsByDate[mealDateKey].protein += (meal.protein || 0);
        mealsByDate[mealDateKey].carbs += (meal.carbs || 0);
        mealsByDate[mealDateKey].fat += (meal.fat || 0);
      }
    });

    const dailyArray = Object.values(mealsByDate);
    setDailyData(dailyArray);

    // 2. Calculate Averages
    const totalDays = dailyArray.length || 1;
    let totalCals = 0, totalP = 0, totalC = 0, totalF = 0;
    let targetCals = 0, targetP = 0, targetC = 0, targetF = 0;
    
    dailyArray.forEach(d => {
      totalCals += d.calories;
      totalP += d.protein;
      totalC += d.carbs;
      totalF += d.fat;
      
      targetCals += d.target;
      targetP += d.targetProtein;
      targetC += d.targetCarbs;
      targetF += d.targetFat;
    });

    setSummaryData({
      calories: totalCals / totalDays,
      protein: totalP / totalDays,
      carbs: totalC / totalDays,
      fat: totalF / totalDays,
      targetCalories: targetCals / totalDays,
      targetProtein: targetP / totalDays,
      targetCarbs: targetC / totalDays,
      targetFat: targetF / totalDays,
    });

    // 3. Today's Macros specifically
    const todayKey = getLocalDateString(new Date());
    if (mealsByDate[todayKey]) {
      setTodayMacros({
        protein: mealsByDate[todayKey].protein,
        carbs: mealsByDate[todayKey].carbs,
        fat: mealsByDate[todayKey].fat,
      });
    } else {
      setTodayMacros({ protein: 0, carbs: 0, fat: 0 });
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full relative pb-10">
      
      {/* 1. HEADER + DATE RANGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Nutrition Reports</h1>
          <p className="text-on-surface-variant font-body-md text-body-md">Understand your nutrition trends and progress toward your goals.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {dateRangeType === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={customStart} 
                onChange={e => setCustomStart(e.target.value)}
                className="h-[40px] px-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[13px] text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="text-on-surface-variant text-[13px] font-medium">to</span>
              <input 
                type="date" 
                value={customEnd} 
                onChange={e => setCustomEnd(e.target.value)}
                className="h-[40px] px-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[13px] text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          )}
          
          <div className="relative">
            <select 
              value={dateRangeType} 
              onChange={e => setDateRangeType(e.target.value)}
              className="h-[40px] pl-4 pr-10 bg-surface-container border border-outline-variant/40 hover:border-outline-variant/80 rounded-xl text-[13px] font-semibold text-on-surface transition-all focus:outline-none appearance-none cursor-pointer"
            >
              <option value="7_days">7 Days</option>
              <option value="30_days">30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
          </div>

          <div className="relative">
            <select 
              value={mealTypeFilter} 
              onChange={e => setMealTypeFilter(e.target.value)}
              className="h-[40px] pl-4 pr-10 bg-surface-container border border-outline-variant/40 hover:border-outline-variant/80 rounded-xl text-[13px] font-semibold text-on-surface transition-all focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      {errorObj ? (
        <div className="mt-8">
          <ErrorState error={errorObj} onRetry={fetchReportData} />
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-[14px] font-medium animate-pulse">Loading your nutrition data...</p>
        </div>
      ) : meals.length === 0 && dateRangeType !== 'custom' ? (
        <div className="flex flex-col items-center justify-center p-16 bg-surface-container-low rounded-3xl border border-outline-variant/40 text-center">
          <span className="material-symbols-outlined text-[64px] text-primary mb-6 opacity-80">monitoring</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">No nutrition data available</h3>
          <p className="text-[14px] text-on-surface-variant max-w-md mx-auto mb-8">
            Log a few meals to start seeing your nutrition trends and progress over this period.
          </p>
        </div>
      ) : (
        <>
          {/* 2. SUMMARY METRICS */}
          <NutritionSummaryMetrics {...summaryData} />

          {/* 3. FULL WIDTH: WEEKLY CALORIE INTAKE */}
          <WeeklyCalorieChart data={dailyData} />

          {/* 4. TWO COLUMNS: MACRO TRENDS | TODAY'S DONUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
            <MacroTrendsChart data={dailyData} />
            <MacroCompositionDonut {...todayMacros} />
          </div>

          {/* 5. FULL WIDTH/TWO COLUMNS: GOAL VS ACTUAL */}
          <div className="grid grid-cols-1 gap-6 w-full">
            <GoalVsActualBars goals={goals} averages={summaryData} />
          </div>

          {/* 6. FULL WIDTH: MICRONUTRIENT SUMMARY */}
          <MicronutrientSummary />


        </>
      )}
    </div>
  );
};

export default ReportsPage;
