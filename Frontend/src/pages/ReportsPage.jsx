import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import { normalizeApiError } from '../utils/errorHandler';

import NutritionSummaryMetrics from '../components/reports/NutritionSummaryMetrics';
import WeeklyCalorieChart from '../components/reports/WeeklyCalorieChart';
import MacroTrendsChart from '../components/reports/MacroTrendsChart';
import MacroCompositionDonut from '../components/reports/MacroCompositionDonut';
import DailyNutritionPerformance from '../components/reports/DailyNutritionPerformance';
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
  const [isDownloading, setIsDownloading] = useState(false);

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
      } else if (dateRangeType === '15_days') {
        const start = new Date();
        start.setDate(today.getDate() - 14);
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

      const res = await api.get(`/reports/analytics?startDate=${startDateLocal}&endDate=${endDateLocal}&mealType=${mealTypeFilter}`);

      if (res.data.success) {
        const report = res.data.data;
        setGoals(report.goals);
        setMeals(report.meals || []);
        setDailyData(report.dailyData || []);
        setSummaryData(report.summaryData || { calories: 0, protein: 0, carbs: 0, fat: 0 });
        setTodayMacros(report.todayMacros || { protein: 0, carbs: 0, fat: 0 });
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

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Handle pages if it's too long
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Nutrition_Report_${dateRangeType}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full relative pb-10">
      
      {/* 1. HEADER + DATE RANGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-1 tracking-tight">Nutrition Report</h1>
          <p className="text-on-surface-variant text-[14px]">See how your intake compares with your daily targets.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {dateRangeType === 'custom' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="date" 
                value={customStart} 
                onChange={e => setCustomStart(e.target.value)}
                className="h-[40px] px-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[13px] text-on-surface focus:outline-none focus:border-primary w-full sm:w-auto"
              />
              <span className="text-on-surface-variant text-[13px] font-medium">to</span>
              <input 
                type="date" 
                value={customEnd} 
                onChange={e => setCustomEnd(e.target.value)}
                className="h-[40px] px-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[13px] text-on-surface focus:outline-none focus:border-primary w-full sm:w-auto"
              />
            </div>
          )}
          
          <div className="relative w-full sm:w-auto">
            <select 
              value={dateRangeType} 
              onChange={e => setDateRangeType(e.target.value)}
              className="h-[40px] pl-4 pr-10 bg-surface-container border border-outline-variant/40 hover:border-outline-variant/80 rounded-xl text-[13px] font-semibold text-on-surface transition-all focus:outline-none appearance-none cursor-pointer w-full"
            >
              <option value="7_days">7 Days</option>
              <option value="15_days">15 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
          </div>

          <div className="relative w-full sm:w-auto">
            <select 
              value={mealTypeFilter} 
              onChange={e => setMealTypeFilter(e.target.value)}
              className="h-[40px] pl-4 pr-10 bg-surface-container border border-outline-variant/40 hover:border-outline-variant/80 rounded-xl text-[13px] font-semibold text-on-surface transition-all focus:outline-none appearance-none cursor-pointer w-full"
            >
              <option value="All">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading || meals.length === 0}
            className={`h-[40px] px-4 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2 ${
              isDownloading || meals.length === 0
                ? 'bg-surface-variant/50 text-on-surface-variant/50 cursor-not-allowed'
                : 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
            }`}
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-[18px]">download</span>
            )}
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
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
        <div id="report-content" className="flex flex-col gap-8 bg-surface p-4 rounded-2xl -mx-4 sm:mx-0 sm:p-2">
          {/* 2. SUMMARY METRICS */}
          <NutritionSummaryMetrics {...summaryData} />

          {/* 3. FULL WIDTH: WEEKLY CALORIE INTAKE */}
          <WeeklyCalorieChart data={dailyData} />

          {/* 4. TWO COLUMNS: MACRO TRENDS | TODAY'S DONUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
            <MacroTrendsChart data={dailyData} />
            <MacroCompositionDonut {...todayMacros} />
          </div>

          {/* 5. FULL WIDTH/TWO COLUMNS: DAILY NUTRITION */}
          <div className="grid grid-cols-1 gap-6 w-full">
            <DailyNutritionPerformance goals={goals} averages={summaryData} />
          </div>

          {/* 6. FULL WIDTH: MICRONUTRIENT SUMMARY */}
          <MicronutrientSummary />
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
