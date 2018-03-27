import React, { Component } from 'react';
import Date from '../../components/Date/Date'
import styles from './Dates.module.css';

class Dates extends Component {
  render() {
    if(!!this.props.startdate || !!this.props.duedate) {
      let dates = [];
      if(!!this.props.startdate) {
        dates.push({date: this.props.startdate, type: 'start', icon: 'icon-aircraft-take-off'});
      }
      if(!!this.props.duedate) {
        dates.push({date: this.props.duedate, type: 'due', icon: 'icon-aircraft-landing'});
      }

      return (
        <div className={styles.dates}>
          {
            dates.map((date) => {
              return (
                <Date
                  key={date.icon}
                  onRemoveDate={this.props.onRemoveDate}
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
