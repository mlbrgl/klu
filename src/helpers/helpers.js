import { DateTime } from 'luxon';

const isItemEligible = ({dates, category}) => {
  // console.log("start <= today", DateTime.fromISO(dates.start) <= DateTime.local().startOf('day'))
  if (dates.done === null && category.name !== 'inbox' &&
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

export { isItemEligible , isToday, isTomorrow, getRandomElement};
