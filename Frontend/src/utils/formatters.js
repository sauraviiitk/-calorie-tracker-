/**
 * Formats a nutrition value appropriately based on its unit and scale.
 * Avoids exposing floating point calculation artifacts (e.g. 128.57142857 -> 129).
 * 
 * @param {number} value - The numerical value to format
 * @param {string} unit - The unit of measurement (e.g., 'kcal', 'g', 'mg', 'mcg')
 * @returns {string} - The formatted value as a string with thousands separators
 */
export const formatNutrition = (value, unit = '') => {
  if (value === undefined || value === null) return '0';
  
  const numValue = Number(value);
  if (isNaN(numValue)) return '0';

  const normalizedUnit = unit.toLowerCase().trim();

  // Calories and grams (Macros) -> whole numbers
  if (normalizedUnit === 'kcal' || normalizedUnit === 'g') {
    return Math.round(numValue).toLocaleString('en-US');
  }
  
  // mg and mcg (Micros) -> up to 1 decimal place for small numbers
  if (normalizedUnit === 'mg' || normalizedUnit === 'mcg') {
    // If it's a large micro (like Potassium 2800 mg), no decimal needed
    if (numValue >= 100) {
      return Math.round(numValue).toLocaleString('en-US');
    }
    // For smaller numbers, show 1 decimal only if it has a non-zero decimal part
    const rounded = Math.round(numValue * 10) / 10;
    return rounded.toLocaleString('en-US', { maximumFractionDigits: 1 });
  }

  // Fallback for any other unit (or no unit)
  return Math.round(numValue).toLocaleString('en-US');
};
