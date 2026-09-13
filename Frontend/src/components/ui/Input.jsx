import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[14px] font-medium text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`h-[48px] bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 text-[15px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm ${
          error ? 'border-error focus:border-error focus:ring-error' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-error text-[13px] mt-0.5">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
