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
};
