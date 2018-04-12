import React, { PureComponent } from 'react'

import styles from './Filter.module.css'

class Filter extends PureComponent {

  render() {
    const stylesFilter = this.props.active ? styles.active : styles.filter
    return (
      <div className={stylesFilter} onClick={this.onToggleFilterDateHandler}></div>
    )
  }

  onToggleFilterDateHandler = () => {
    this.props.onToggleFilterDateHandler(this.props.type)
  }
}


export default Filter
