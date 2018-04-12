import React, { Component } from 'react';

import styles from './Filters.module.css'

class Filters extends Component {

  render() {
    return (
      <div className={styles.filters}>
        {this.props.children}
      </div>
    )
  }
}

export default Filters;
