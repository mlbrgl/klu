import React from 'react';
import { DateTime } from 'luxon';
import styles from './Dates.module.css';

const dates = (props) => {
  if(!!props.startdate || !!props.duedate) {
    let date = props.startdate !== null ? props.startdate : props.duedate;
    let formattedDate = DateTime.fromISO(date).toLocaleString({weekday: 'long', month: 'long', day: '2-digit'});
    let icon = props.startdate ? 'icon-controller-play' : 'icon-controller-stop'

    return (
      <div className={styles.dates}>
        <span className={icon}></span><span>{formattedDate}</span>
      </div>
    )
  } else {
    return null;
  }
}

export default dates;
