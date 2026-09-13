import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-secondary-container text-on-secondary-container',
    secondary: 'bg-surface-container-high text-on-surface-variant',
    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    success: 'bg-primary-container text-on-primary-container',
    warning: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
