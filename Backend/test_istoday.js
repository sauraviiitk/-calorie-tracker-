const { isToday, getLocalDateString } = require('./src/utils/dateUtils');
const date1 = new Date();
const date2 = new Date('2026-09-14T06:30:00.000Z');
console.log('Now:', date1);
console.log('MealDate:', date2);
console.log('isToday(date2):', isToday(date2));
console.log('getLocalDateString(date2):', getLocalDateString(date2));
console.log('getLocalDateString(new Date()):', getLocalDateString(new Date()));
