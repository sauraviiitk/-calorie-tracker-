import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl ${
        noPadding ? '' : 'p-6'
      } shadow-[0_4px_24px_rgba(101,61,167,0.05)] flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
