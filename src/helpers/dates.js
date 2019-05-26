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

const formatRelativeTimeFromNow = (now, date) => {
  const today = now.startOf('day');
  let past = false;
  let duration = date.diff(today, ['months', 'weeks', 'days']);
  let str = null;

  if (date < today) {
    past = true;
    duration = duration.negate();
  }
  const { months, weeks, days } = duration.toObject();

  if (months !== 0) {
    const unit = months > 1 ? 'months' : 'month';
    str = past ? `about ${months} ${unit} ago` : `in about ${months} ${unit}`;
  } else if (weeks !== 0) {
    const unit = weeks > 1 ? 'weeks' : 'week';
    str = past ? `about ${weeks} ${unit} ago` : `in about ${weeks} ${unit}`;
  } else if (days > 1) {
    str = past ? `${days} days ago` : `in ${days} days`;
  } else if (days === 1) {
    str = past ? 'yesterday' : 'tomorrow';
  } else {
    str = 'today';
  }

  return str;
};

export {
  isPast,
  isToday,
  isTomorrow,
  isWithinNextTwoWeeks,
  isPeakTime,
  isTroughTime,
  formatRelativeTimeFromNow,
};
