/**
 * Centralized date utility to enforce the "Today Only" business rule.
 */

/**
 * Returns a YYYY-MM-DD string for a given Date object specifically in IST (Asia/Kolkata).
 */
const getLocalDateString = (d = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', { 
    timeZone: 'Asia/Kolkata', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).format(d);
};

/**
 * Checks if a given date value represents today's date in IST.
 */
const isToday = (dateValue) => {
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

module.exports = {
  getLocalDateString,
  isToday
};
