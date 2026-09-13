import React, { useState, useEffect } from 'react';
import GoalForm from '../components/goals/GoalForm';
import WeightGoalCard from '../components/dashboard/WeightGoalCard';
import api from '../services/api';

const GoalsPage = () => {
  const [goals, setGoals] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get('/goals');
        if (response.data.success) {
          setGoals(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error);
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <div>
          <GoalForm onGoalUpdated={setGoals} />
        </div>
        <div>
          <WeightGoalCard currentWeight={goals?.currentWeight || 70} targetWeight={goals?.targetWeight || 65} />
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
