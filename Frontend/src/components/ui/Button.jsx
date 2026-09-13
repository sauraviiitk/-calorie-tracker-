import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all active:scale-95';

  const variants = {
    primary: 'bg-primary hover:bg-primary-container text-on-primary shadow-[0_4px_16px_rgba(126,87,194,0.22)]',
    secondary: 'bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container',
    outline: 'bg-surface-container-high hover:bg-secondary-container text-primary',
    ghost: 'hover:bg-surface-container-high text-on-surface-variant rounded-lg',
  };

  const sizes = {
    icon: 'p-2',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 font-title-md text-body-md',
    lg: 'h-11 px-5 font-title-md text-title-md',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
