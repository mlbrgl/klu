import React, { Component } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import styles from './Date.module.css';
import Button from '../Button/Button';

class Date extends Component {
  onRemoveDateHandler = () => {
    const { onRemoveDateHandler, itemId, type } = this.props;
    onRemoveDateHandler(itemId, type);
  };

  formatRelativeTimeFromNow = (date) => {
    const today = DateTime.local().startOf('day');
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

  render() {
    const { icon, date } = this.props;
    const parsedDate = DateTime.fromISO(date);
    const locale = 'en-gb';
    const format = { weekday: 'short', month: 'numeric', day: '2-digit' };

    return (
      <Button onClick={this.onRemoveDateHandler} className={styles.date} key={icon}>
        <span className={icon} />
        <span>
          {parsedDate.setLocale(locale).toLocaleString(format)}
          {' '}
(
          {this.formatRelativeTimeFromNow(parsedDate)}
)
        </span>
      </Button>
    );
  }
}

Date.propTypes = {
  date: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  itemId: PropTypes.number.isRequired,
  onRemoveDateHandler: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default Date;
