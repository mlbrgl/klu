import React, { Component } from 'react'
import styles from './QuickEntry.module.css'

class QuickEntry extends Component {

  render() {
    return (
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          type="text"
          ref={(el) => this.el = el}
          onKeyDown={this.onKeyDownHandler} />
      </div>
    )
  }

  onKeyDownHandler = (event) => {
    if(event.key === 'Enter') {
      this.props.onEnterHandler(event.target, this.el)
      this.el.value = ''
    }
  }
}

export default QuickEntry
