import React from 'react';

const CircularProgress = ({ progress, size = 120, strokeWidth = 10, label, sublabel }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="stroke-surface-container-high"
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="stroke-primary transition-all duration-1000 ease-out"
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="font-numeric-metric text-numeric-metric text-on-surface leading-none">{label || `${Math.round(progress)}%`}</span>
        {sublabel && (
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-medium tracking-wide uppercase">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
