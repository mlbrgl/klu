import React from 'react';
import { DateTime } from 'luxon';
import styles from './Dates.module.css';

const dates = (props) => {
  if(!!props.startdate || !!props.duedate) {
    let dateFormat = {weekday: 'long', month: 'long', day: '2-digit'};
    let dates = [];
    if(!!props.startdate) {
      dates.push({formattedDate: DateTime.fromISO(props.startdate).toLocaleString(dateFormat), icon: 'icon-controller-play'});
    }
    if(!!props.duedate) {
      dates.push({formattedDate: DateTime.fromISO(props.duedate).toLocaleString(dateFormat), icon: 'icon-controller-stop'});
    }

    return (
      <div className={styles.dates}>
      {
        dates.map((date) => {
          return (
            <div className={styles.date} key={date.icon}>
              <span className={date.icon}></span><span>{date.formattedDate}</span>
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

export default dates;
