import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import styles from './QuickEntry.module.css'

class QuickEntry extends Component {

  render() {
    return (
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          type="text"
          ref={(el) => this.el = el}
          onKeyDown={this.onKeyDownHandler}
          onChange={this.onChangeHandler}
          autoFocus />
        { this.props.projectName ?
          <span
            className={styles.project}
            onClick={this.props.onRemoveProjectFilter}>
            {'+' + this.props.projectName}
          </span>
          : null
        }
      </div>
    )
  }

  onChangeHandler = () => {
    this.onSearchHandler()
  }

  onSearchHandler = debounce(() => {
    this.props.onSearchHandler(this.el.value)
  }, 250)

  onKeyDownHandler = (event) => {
    if(event.key === 'Enter') {
      const itemValue = this.props.projectName ? this.el.value + ' +'  + this.props.projectName : this.el.value
      this.props.onEnterHandler(itemValue)
      this.el.value = null
    }
  }
}

export default QuickEntry
