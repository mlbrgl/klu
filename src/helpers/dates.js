import { DateTime } from 'luxon';

const isPeakTime = () => {
  const nowHour = DateTime.local().hour;
  return nowHour >= 4 && nowHour < 14;
};

const isTroughTime = () => {
  const nowHour = DateTime.local().hour;
  return nowHour >= 14 && nowHour < 17;
};

const daysFromNow = (dateString) => {
  const today = DateTime.local().startOf('day');
  const date = DateTime.fromISO(dateString);
  return date.diff(today).as('days');
};

const isPast = dateString => (dateString === null ? false : daysFromNow(dateString) < 0);

const isToday = dateString => (dateString === null ? false : daysFromNow(dateString) === 0);

const isTomorrow = dateString => (dateString === null ? false : daysFromNow(dateString) === 1);

// eslint-disable-next-line max-len
const isWithinNextTwoWeeks = dateString => (dateString === null ? false : daysFromNow(dateString) <= 14);

export {
  isPast, isToday, isTomorrow, isWithinNextTwoWeeks, isPeakTime, isTroughTime,
};
