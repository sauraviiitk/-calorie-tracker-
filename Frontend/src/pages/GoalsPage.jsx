import React, { useState, useEffect } from 'react';
import GoalForm from '../components/goals/GoalForm';
import WeightGoalCard from '../components/dashboard/WeightGoalCard';
import api from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import { normalizeApiError } from '../utils/errorHandler';

const GoalsPage = () => {
  const [goals, setGoals] = useState(null);
  const [errorObj, setErrorObj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchGoals = async () => {
    setLoading(true);
    setErrorObj(null);
    try {
        const response = await api.get('/goals');
        if (response.data.success) {
          setGoals(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error);
        setErrorObj(normalizeApiError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1240px] mx-auto px-4 lg:px-8">
      <div>
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">My Goals</h1>
        <p className="text-on-surface-variant font-body-md text-body-md">Manage your daily targets and long-term health objectives.</p>
      </div>

      {errorObj ? (
        <div className="mt-8">
          <ErrorState error={errorObj} onRetry={fetchGoals} />
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-[14px] font-medium animate-pulse">Loading goals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
          <div>
            <GoalForm onGoalUpdated={setGoals} />
          </div>
          <div>
            <WeightGoalCard currentWeight={goals?.currentWeight || 70} targetWeight={goals?.targetWeight || 65} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
