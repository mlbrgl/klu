import { DateTime } from 'luxon';

const isPeakTime = now => now.hour >= 4 && now.hour < 14;

const isTroughTime = now => now.hour >= 14 && now.hour < 17;

const daysFromNow = (now, dateString) => {
  const today = now.startOf('day');
  const date = DateTime.fromISO(dateString);
  return date.diff(today).as('days');
};

const isPast = (now, dateString) => (dateString === null ? false : daysFromNow(now, dateString) < 0);

const isToday = (now, dateString) => {
  const daysFromNowVal = daysFromNow(now, dateString);
  return dateString === null ? false : daysFromNowVal === 0;
};

const isTomorrow = (now, dateString) => (dateString === null ? false : daysFromNow(now, dateString) === 1);

const isWithinNextTwoWeeks = (now, dateString) => (dateString === null ? false : daysFromNow(now, dateString) <= 14);

export {
  isPast, isToday, isTomorrow, isWithinNextTwoWeeks, isPeakTime, isTroughTime,
};
