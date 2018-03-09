import { DateTime } from 'luxon';

const isItemEligible = ({dates, category, id}, excludedItemId) => {
  // console.log("start <= today", DateTime.fromISO(dates.start) <= DateTime.local().startOf('day'))
  if (id !== excludedItemId &&
      dates.done === null && category.name !== 'inbox' &&
      (dates.start === null || DateTime.fromISO(dates.start) <= DateTime.local().startOf('day'))) {
    return true;
  } else {
    return false;
  }
}

const isToday = (dateString) => {
  return _isInDays(dateString, 0);
}

const isTomorrow = (dateString) => {
  return _isInDays(dateString, 1);
}

const _isInDays = (dateString, days) => {
  if (dateString === null) {
    return false;
  } else {
    let today = DateTime.local().startOf('day');
    let date = DateTime.fromISO(dateString);
    return date.diff(today).as('days') === days
  }
}

const getRandomElement = (arr) => {
  return arr.length !== 0 ? arr[Math.floor(Math.random() * arr.length)] : null;
}

// The maximum is inclusive and the minimum is inclusive
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { isItemEligible , isToday, isTomorrow, getRandomElement, getRandomIntInclusive};