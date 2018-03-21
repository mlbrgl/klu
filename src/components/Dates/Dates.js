import React from 'react';
import { DateTime } from 'luxon';
import styles from './Dates.module.css';

const dates = (props) => {
  if(!!props.startdate || !!props.duedate) {
    let locale = 'en-gb';
    let format = {weekday: 'short', month: 'numeric', day: '2-digit'};
    let dates = [];
    if(!!props.startdate) {
      dates.push({date: props.startdate, icon: 'icon-aircraft-take-off'});
    }
    if(!!props.duedate) {
      dates.push({date: props.duedate, icon: 'icon-aircraft-landing'});
    }

    return (
      <div className={styles.dates}>
      {
        dates.map((date) => {
          let parsedDate = DateTime.fromISO(date.date);
          return (
            <div className={styles.date} key={date.icon}>
              <span className={date.icon}></span>
              <span>{parsedDate.setLocale(locale).toLocaleString(format)} ({_formatRelativeTimeFromNow(parsedDate)})</span>
            </div>
          )
        })
      }
      </div>
    )
  } else {
    return null;
  }
}

const _formatRelativeTimeFromNow = (date) => {
  let today = DateTime.local().startOf('day');
  let past = false;
  let duration = date.diff(today, ['months', 'weeks', 'days']);
  let str = null;

  if(date < today) {
    past = true;
    duration = duration.negate();
  }
  let { months, weeks, days } = duration.toObject();

  if(months !== undefined) {
    let unit = months > 1 ? 'months' : 'month';
    str = past ? 'about ' + months + ' ' + unit + ' ago' : 'in about ' + months + ' ' + unit ;
  } else {
    if(weeks !== undefined) {
      let unit = weeks > 1 ? 'weeks' : 'week';
      str = past ? 'about ' + weeks + ' ' + unit + ' ago' : 'in about ' + weeks + ' ' + unit ;
    } else {
      if(days > 1) {
        str = past ? days + ' days ago' : 'in ' + days + ' days';
      } else if (days === 1) {
        str = past ? 'yesterday' : 'tomorrow';
      } else {
        str = 'today';
      }
    }
  }

  return str;
}

export default dates;
