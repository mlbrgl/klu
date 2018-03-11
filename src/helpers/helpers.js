import { DateTime } from 'luxon';

const isItemEligible = ({dates, category}) => {
  if (
      dates.done === null &&
      category.name !== 'inbox' &&
      (dates.start === null || DateTime.fromISO(dates.start) <= DateTime.local().startOf('day'))) {
    return true;
  } else {
    return false;
  }
}

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

const getRandomElement = (arr) => {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
}

// The maximum is inclusive and the minimum is inclusive
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { isItemEligible , isPast, isToday, isTomorrow, isWithinNextTwoWeeks, getRandomElement, getRandomIntInclusive};
