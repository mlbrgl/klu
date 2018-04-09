import React, { PureComponent } from 'react';
import Date from '../../components/Date/Date'
import styles from './Dates.module.css';

class Dates extends PureComponent {
  render() {
    let dates = [];
    if(!!this.props.donedate) {
      dates.push({date: this.props.donedate, type: 'done', icon: 'icon-aircraft-landing'})
    } else if(!!this.props.startdate || !!this.props.duedate) {
      if(!!this.props.startdate) {
        dates.push({date: this.props.startdate, type: 'start', icon: 'icon-aircraft-take-off'})
      }
      if(!!this.props.duedate) {
        dates.push({date: this.props.duedate, type: 'due', icon: 'icon-aircraft-landing'})
      }
    }

    if(dates.length) {
      return (
        <div className={styles.dates}>
          {
            dates.map((date) => {
              return (
                <Date
                  key={date.icon}
                  onRemoveDateHandler={this.props.onRemoveDateHandler}
                  itemId={this.props.itemId}
                  {...date} />
              )
            })
          }
        </div>
      )
    } else {
      return null;
    }
  }

}


export default Dates;
