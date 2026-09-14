import React, { useState, useEffect } from 'react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import CalorieOverviewCard from '../components/dashboard/CalorieOverviewCard';
import MacronutrientsCard from '../components/dashboard/MacronutrientsCard';
import MealsList from '../components/dashboard/MealsList';
import WeightGoalCard from '../components/dashboard/WeightGoalCard';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import MealLoggerModal from '../components/diary/MealLoggerModal';
import api from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import { normalizeApiError } from '../utils/errorHandler';
import { getLocalDateString, isEditableDate } from '../utils/dateUtils';

const DashboardPage = () => {
  const [goals, setGoals] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultMealType, setDefaultMealType] = useState('Breakfast');
  

  const [date, setDate] = useState(getLocalDateString(new Date()));
  const [mealType, setMealType] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateStr = date;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        if (mealType === 'All') {
          const todayRes = await api.get(`/reports/today?date=${dateStr}`);
          if (todayRes.data.success) {
            setGoals(todayRes.data.data.goals);
            setMeals(todayRes.data.data.meals || []);
          }
        } else {
          const [goalsRes, mealsRes] = await Promise.all([
            api.get(`/goals?date=${dateStr}`),
            api.get(`/meals?startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}&mealType=${mealType}`)
          ]);
          if (goalsRes.data.success) setGoals(goalsRes.data.data);
          if (mealsRes.data.success) setMeals(mealsRes.data.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(normalizeApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Listen for custom event triggered by the AI ChatBot to auto-refresh data
    const handleDataChanged = () => fetchData();
    window.addEventListener('appDataChanged', handleDataChanged);

    return () => {
      window.removeEventListener('appDataChanged', handleDataChanged);
    };
  }, [date, mealType]);

  const handleOpenAddModal = (type) => {
    if (!isEditable) return;
    if (typeof type === 'string' && type) {
      setDefaultMealType(type);
    } else {
      const hour = new Date().getHours();
      let guess = 'Snacks';
      if (hour >= 5 && hour < 11) guess = 'Breakfast';
      else if (hour >= 11 && hour < 16) guess = 'Lunch';
      else if (hour >= 17 && hour < 23) guess = 'Dinner';
      setDefaultMealType(guess);
    }
    setIsModalOpen(true);
  };

  const handleMealAdded = (newMeal) => {
    setMeals(prev => [newMeal, ...prev]);
  };

  const handleMealUpdated = (updatedMeal) => {
    setMeals(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
  };

  const handleMealDeleted = (deletedId) => {
    setMeals(prev => prev.filter(m => m.id !== deletedId));
  };

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFat = meals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

  if (error && !meals.length && !goals) {
    return (
      <div className="flex-1 w-full h-full min-h-[50vh] flex items-center justify-center">
        <ErrorState error={error} onRetry={() => window.dispatchEvent(new Event('appDataChanged'))} />
      </div>
    );
  }

  const isEditable = isEditableDate(date);

  return (
    <div className="flex flex-col gap-8 w-full relative">
      <WelcomeBanner onAddMeal={handleOpenAddModal} isEditable={isEditable} />
      
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/40 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">filter_list</span>
          <span className="font-title-md text-on-surface font-semibold">Dashboard Filters</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <input 
            type="date" 
            value={date}
            max={getLocalDateString(new Date())}
            onChange={e => setDate(e.target.value)}
            className="h-[40px] px-3 bg-surface-container border border-outline-variant/40 rounded-xl text-[13px] text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer w-full sm:w-auto"
          />
          <div className="relative w-full sm:w-auto">
            <select 
              value={mealType} 
              onChange={e => setMealType(e.target.value)}
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
        </div>
      </div>
      

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <CalorieOverviewCard consumed={totalCalories} target={goals?.targetCalories || 2000} />
        <MacronutrientsCard 
          protein={{ consumed: totalProtein, target: goals?.targetProtein || 150 }}
          carbs={{ consumed: totalCarbs, target: goals?.targetCarbs || 200 }}
          fat={{ consumed: totalFat, target: goals?.targetFat || 65 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <MealsList
            meals={meals}
            loading={loading}
            isEditable={isEditable}
            onAddMeal={handleOpenAddModal}
            onMealUpdated={handleMealUpdated}
            onMealDeleted={handleMealDeleted}
          />
        </div>
        <div className="lg:col-span-4">
          <WeightGoalCard currentWeight={goals?.currentWeight || 70} targetWeight={goals?.targetWeight || 65} />
        </div>
      </div>

      <WeeklyChart />

      <MealLoggerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newMeal) => {
          setIsModalOpen(false);
          handleMealAdded(newMeal);
        }}
        defaultMealType={defaultMealType}
      />
    </div>
  );
};

export default DashboardPage;
