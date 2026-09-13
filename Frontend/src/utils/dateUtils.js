/**
 * Centralized date utility to enforce the "Today Only" business rule.
 */

/**
 * Returns a local YYYY-MM-DD string for a given Date object.
 */
export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a given date value (Date object or YYYY-MM-DD string) represents today's local date.
 */
export const isToday = (dateValue) => {
  if (!dateValue) return false;
  
  let dateStr;
  if (typeof dateValue === 'string') {
    dateStr = dateValue.split('T')[0];
  } else if (dateValue instanceof Date) {
    if (isNaN(dateValue.getTime())) return false;
    dateStr = getLocalDateString(dateValue);
  } else {
    return false;
  }
  
  return dateStr === getLocalDateString(new Date());
};

/**
 * Alias for isToday to clearly communicate the business rule in the UI.
 * Meals can ONLY be modified if this returns true.
 */
export const isEditableDate = (dateValue) => {
  return isToday(dateValue);
};
