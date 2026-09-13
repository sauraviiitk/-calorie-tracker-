import React from 'react';
import Button from '../ui/Button';

const DateSelector = ({ date, onChangeDate }) => {
  return (
    <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-xl border border-outline-variant/60 w-fit">
      <Button variant="ghost" size="icon" onClick={() => onChangeDate(-1)} icon="chevron_left" />
      <div className="flex flex-col items-center min-w-[120px]">
        <span className="font-title-md text-title-md text-on-surface font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">Today</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onChangeDate(1)} icon="chevron_right" />
    </div>
  );
};

export default DateSelector;
