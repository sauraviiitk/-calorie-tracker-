import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 shadow-lg min-w-[150px]">
        <p className="text-[13px] font-semibold text-on-surface mb-2 pb-2 border-b border-outline-variant/40">{label}</p>
        <div className="flex flex-col gap-2">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-[12px] text-on-surface-variant">{entry.name}</span>
              </div>
              <span className="text-[13px] font-semibold text-on-surface">{Math.round(entry.value)} g</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const MacroTrendsChart = ({ data }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col h-full">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="font-title-lg text-title-lg font-semibold text-on-surface">Macronutrient Trends</h3>
          <p className="text-[13px] text-on-surface-variant mt-1">Track how your protein, carbohydrates, and fat intake changes.</p>
        </div>
      </div>

      <div className="h-[260px] w-full flex-grow">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="protein" name="Protein" stroke="#7e57c2" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="carbs" name="Carbohydrates" stroke="#22c55e" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="fat" name="Fat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">show_chart</span>
            <p className="text-[13px]">No macro data available for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroTrendsChart;
