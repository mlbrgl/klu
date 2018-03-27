import React, { Component } from 'react';
import { DateTime } from 'luxon';
import styles from './Date.module.css';

class Date extends Component {
  render() {
    let parsedDate = DateTime.fromISO(this.props.date);
    let locale = 'en-gb';
    let format = {weekday: 'short', month: 'numeric', day: '2-digit'};
    return (
      <div onClick={this.onRemoveDateHandler} className={styles.date} key={this.props.icon}>
        <span className={this.props.icon}></span>
        <span>{parsedDate.setLocale(locale).toLocaleString(format)} ({this.formatRelativeTimeFromNow(parsedDate)})</span>
      </div>
    )
  }

  onRemoveDateHandler= () => {
    this.props.onRemoveDate(this.props.itemId, this.props.type)
  }

  formatRelativeTimeFromNow = (date) => {
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

}


export default Date;
