import React, { useState } from 'react';

const ErrorState = ({ error, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);

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

      {technicalDetails && (
        <div className="w-full text-left mt-4 border-t border-outline-variant/30 pt-4">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs flex items-center justify-center gap-1 w-full text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              {showDetails ? 'expand_less' : 'expand_more'}
            </span>
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </button>
          
          {showDetails && (
            <div className="mt-3 p-3 bg-surface-container-high rounded-xl border border-outline-variant/30 overflow-x-auto">
              <pre className="text-[10px] leading-relaxed text-on-surface-variant whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                {technicalDetails}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorState;
