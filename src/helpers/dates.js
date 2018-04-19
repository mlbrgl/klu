import { DateTime } from 'luxon';

const isPast = (dateString) => {
  return dateString === null ? false : _daysFromNow(dateString) < 0;
}

const isToday = (dateString) => {
  return dateString === null ? false : _daysFromNow(dateString) === 0;
}

const isTomorrow = (dateString) => {
  return dateString === null ? false : _daysFromNow(dateString) === 1;
}

const isWithinNextTwoWeeks = dateString => {
  return dateString === null ? false : _daysFromNow(dateString) <= 14;
}

const isPeakTime = () => {
  const nowHour = DateTime.local().hour
  return nowHour >= 4 && nowHour < 14
}

const isTroughTime = () => {
  const nowHour = DateTime.local().hour
  return nowHour >= 14 && nowHour < 17
}

const _daysFromNow = (dateString, days) => {
  let today = DateTime.local().startOf('day');
  let date = DateTime.fromISO(dateString);
  return date.diff(today).as('days');
}

export {
  isPast,
  isToday,
  isTomorrow,
  isWithinNextTwoWeeks,
  isPeakTime,
  isTroughTime
};
