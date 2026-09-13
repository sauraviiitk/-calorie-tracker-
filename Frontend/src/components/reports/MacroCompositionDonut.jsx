import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }}></span>
          <span className="text-[13px] font-medium text-on-surface">{data.name}</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <span className="text-[12px] text-on-surface-variant">Calories</span>
          <span className="text-[13px] font-semibold">{Math.round(data.value)} kcal</span>
        </div>
      </div>
    );
  }
  return null;
};

const MacroCompositionDonut = ({ protein, carbs, fat }) => {
  // Convert grams to calories
  const pCals = (protein || 0) * 4;
  const cCals = (carbs || 0) * 4;
  const fCals = (fat || 0) * 9;
  const totalMacroCals = pCals + cCals + fCals;

  const data = [
    { name: 'Protein', value: pCals, fill: '#7e57c2', percentage: totalMacroCals > 0 ? Math.round((pCals / totalMacroCals) * 100) : 0 },
    { name: 'Carbohydrates', value: cCals, fill: '#22c55e', percentage: totalMacroCals > 0 ? Math.round((cCals / totalMacroCals) * 100) : 0 },
    { name: 'Fat', value: fCals, fill: '#f59e0b', percentage: totalMacroCals > 0 ? Math.round((fCals / totalMacroCals) * 100) : 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="font-title-lg text-title-lg font-semibold text-on-surface">Today's Macro Composition</h3>
        <p className="text-[13px] text-on-surface-variant mt-1">How today's macro calories are distributed.</p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative">
        {totalMacroCals > 0 ? (
          <>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[20px] font-bold text-on-surface leading-tight">{Math.round(totalMacroCals)}</span>
                <span className="text-[11px] font-medium text-on-surface-variant">kcal</span>
              </div>
            </div>
            
            <div className="w-full flex justify-center gap-6 mt-4">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-on-surface-variant">{item.name}</span>
                    <span className="text-[13px] font-bold text-on-surface">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-on-surface-variant h-[200px]">
            <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">donut_large</span>
            <p className="text-[13px]">No macros logged today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroCompositionDonut;
