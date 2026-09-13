import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import { getLocalDateString } from '../../utils/dateUtils';

const GoalForm = ({ onGoalUpdated }) => {
  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(150);
  const [targetCarbs, setTargetCarbs] = useState(200);
  const [targetFat, setTargetFat] = useState(65);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [targetWeight, setTargetWeight] = useState(65);
  const [selectedDate, setSelectedDate] = useState(''); // empty string means Global Default
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchGoals = async (dateStr) => {
    setLoading(true);
    try {
      const endpoint = dateStr ? `/goals?date=${dateStr}` : '/goals';
      const response = await api.get(endpoint);
      if (response.data.success && response.data.data) {
        const g = response.data.data;
        setTargetCalories(g.targetCalories || 2000);
        setTargetProtein(g.targetProtein || 150);
        setTargetCarbs(g.targetCarbs || 200);
        setTargetFat(g.targetFat || 65);
        setCurrentWeight(g.currentWeight || 70);
        setTargetWeight(g.targetWeight || 65);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals(selectedDate);
  }, [selectedDate]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        targetCalories: Number(targetCalories),
        targetProtein: Number(targetProtein),
        targetCarbs: Number(targetCarbs),
        targetFat: Number(targetFat),
        currentWeight: Number(currentWeight),
        targetWeight: Number(targetWeight),
        date: selectedDate || null
      };
      
      const response = await api.post('/goals', payload);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Goals saved successfully!' });
        if (onGoalUpdated) onGoalUpdated(payload);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save goals.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return <Card className="w-full p-6 text-center text-outline">Loading goals...</Card>;
  }

  return (
    <Card className="w-full p-6 lg:p-7">
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[22px] text-on-surface font-bold leading-tight">Calorie & Macro Targets</h3>
            {message.text && (
              <span className={`font-label-sm px-2 py-1 rounded-md mt-1 ${message.type === 'success' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
                {message.text}
              </span>
            )}
          </div>
          <p className="text-on-surface-variant text-[15px] leading-relaxed mb-6">
            Set your daily goals. Your macronutrients should roughly align with your total calorie target.
          </p>
          
          <div className="mb-6 bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-on-surface">Target Date</p>
              <p className="text-[12px] text-on-surface-variant">Select a date to set custom goals for a specific day.</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="date"
                min={getLocalDateString(new Date())}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-[40px] px-3 bg-surface border border-outline-variant rounded-lg text-[13px] text-on-surface focus:outline-none focus:border-primary"
              />
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate('')}
                  className="h-[40px] px-3 text-[13px] font-semibold text-error hover:bg-error-container rounded-lg transition-colors"
                >
                  Clear (Use Default)
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <Input label="Daily Calorie Target (kcal)" type="number" value={targetCalories} onChange={e => setTargetCalories(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Protein Target (g)" type="number" value={targetProtein} onChange={e => setTargetProtein(e.target.value)} />
              <Input label="Carbs Target (g)" type="number" value={targetCarbs} onChange={e => setTargetCarbs(e.target.value)} />
              <Input label="Fat Target (g)" type="number" value={targetFat} onChange={e => setTargetFat(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="mt-2 pt-8 border-t border-outline-variant/40">
          <h3 className="text-[22px] text-on-surface font-bold leading-tight mb-2">Weight Goal</h3>
          <p className="text-on-surface-variant text-[15px] leading-relaxed mb-6">
            Track your progress over time by setting a target weight.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Current Weight (kg)" type="number" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} />
            <Input label="Target Weight (kg)" type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={handleSave} disabled={saving} className="h-12 rounded-xl px-6 min-w-[140px]">
            {saving ? 'Saving...' : 'Save Goals'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GoalForm;
