import React, { useState } from 'react';

const ErrorAlert = ({ error, onRetry }) => {
  if (!error) return null;

  const { title, message, severity, retryable, technicalDetails } = error;

  const bgColors = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    error: 'text-red-800',
    warning: 'text-amber-800',
    info: 'text-blue-800'
  };

  const iconColors = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  };

  const icons = {
    error: 'error',
    warning: 'warning',
    info: 'info'
  };

  return (
    <div className={`p-4 rounded-2xl border ${bgColors[severity || 'error']} flex flex-col gap-3 transition-all`}>
      <div className="flex gap-3 items-start">
        <span className={`material-symbols-outlined ${iconColors[severity || 'error']} mt-0.5`}>
          {icons[severity || 'error']}
        </span>
        <div className="flex-1">
          <h3 className={`text-sm font-semibold ${textColors[severity || 'error']}`}>
            {title}
          </h3>
          <p className={`text-sm mt-1 opacity-90 ${textColors[severity || 'error']}`}>
            {message}
          </p>
          
          {(retryable && onRetry) && (
            <button 
              onClick={onRetry}
              className={`mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white/80 transition-colors border ${bgColors[severity || 'error']}`}
            >
              Try Again
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
