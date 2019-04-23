import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Date from '../../components/Date/Date';
import styles from './Dates.module.css';

class Dates extends PureComponent {
  render() {
    const dates = [];
    const { startdate, duedate, donedate } = this.props;

    if (donedate) {
      dates.push({ date: donedate, type: 'done', icon: 'icon-aircraft-landing' });
    } else if (!!startdate || !!duedate) {
      if (startdate) {
        dates.push({ date: startdate, type: 'start', icon: 'icon-aircraft-take-off' });
      }
      if (duedate) {
        dates.push({ date: duedate, type: 'due', icon: 'icon-aircraft-landing' });
      }
    }

    if (dates.length) {
      const { itemId, onRemoveDateHandler } = this.props;
      return (
        <div className={styles.dates}>
          {dates.map(date => (
            <Date
              key={date.icon}
              onRemoveDateHandler={onRemoveDateHandler}
              itemId={itemId}
              {...date}
            />
          ))}
        </div>
      );
    }
    return null;
  }
}

Dates.defaultProps = {
  donedate: null,
  duedate: null,
  startdate: null,
};

Dates.propTypes = {
  donedate: PropTypes.string,
  duedate: PropTypes.string,
  startdate: PropTypes.string,
  itemId: PropTypes.number.isRequired,
  onRemoveDateHandler: PropTypes.func.isRequired,
};

export default Dates;
