import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const goal = payload.find(p => p.dataKey === 'target')?.value || 0;
    const actual = payload.find(p => p.dataKey === 'calories')?.value || 0;
    const diff = actual - goal;
    
    return (
      <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 shadow-lg min-w-[150px]">
        <p className="text-[13px] font-semibold text-on-surface mb-2">{label}</p>
        
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between items-center gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-[12px] text-on-surface-variant">{entry.name}</span>
            </div>
            <span className="text-[13px] font-semibold text-on-surface">{Math.round(entry.value)} kcal</span>
          </div>
        ))}
        
        <div className="flex justify-between items-center gap-4 mt-2 pt-2 border-t border-outline-variant/40">
          <span className="text-[12px] text-on-surface-variant">Difference</span>
          <span className={`text-[12px] font-bold ${diff > 0 ? 'text-error' : 'text-[#22c55e]'}`}>
            {diff > 0 ? '+' : ''}{Math.round(diff)} kcal
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const WeeklyCalorieChart = ({ data, targetCalories }) => {
  // Use data directly as target is now provided per day from backend
  const chartData = data || [];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col w-full">
      <div className="mb-6">
        <h3 className="font-title-lg text-title-lg font-semibold text-on-surface">Weekly Calorie Intake</h3>
        <p className="text-[13px] text-on-surface-variant mt-1">Your daily calorie intake compared with your target.</p>
      </div>

      <div className="h-[300px] w-full">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--on-surface-variant)', fontSize: 12 }}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              
              <Bar dataKey="target" name="Daily Target" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="calories" name="Actual Intake" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={32} />
              
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">bar_chart</span>
            <p className="text-[13px]">No nutrition data available for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyCalorieChart;
