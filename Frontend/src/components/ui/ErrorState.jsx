import React, { useState } from 'react';

const ErrorState = ({ error, onRetry }) => {
  if (!error) return null;

  const { title, message, severity, retryable, technicalDetails } = error;

  const iconColors = {
    error: 'text-red-500 bg-red-50',
    warning: 'text-amber-500 bg-amber-50',
    info: 'text-blue-500 bg-blue-50'
  };

  const icons = {
    error: 'error',
    warning: 'warning',
    info: 'info'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto w-full">
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 ${iconColors[severity || 'error']}`}>
        <span className="material-symbols-outlined text-[32px]">
          {icons[severity || 'error']}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-on-surface mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
        {message}
      </p>

      {retryable && onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all mb-4 shadow-sm"
        >
          Try Again
        </button>
      )}

    </div>
  );
};

export default ErrorState;
