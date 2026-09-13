import React from 'react';

const ProgressBar = ({ progress, colorClass = 'bg-primary', className = '' }) => {
  return (
    <div className={`w-full h-3 bg-surface-container-high rounded-full overflow-hidden p-0.5 ${className}`}>
      <div
        className={`h-full ${colorClass} rounded-full transition-all duration-700`}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
