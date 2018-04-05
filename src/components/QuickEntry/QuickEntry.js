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
          onChange={this.onChangeHandler} />
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

  onChangeHandler = (event) => {
    this.onSearchHandler(event.target.value)
  }

  onSearchHandler = debounce((searchQuery) => {
    this.props.onSearchHandler(searchQuery)
  }, 250)

  onKeyDownHandler = (event) => {
    if(event.key === 'Enter') {
      const itemValue = this.props.projectName ? this.el.value + ' +'  + this.props.projectName : this.el.value
      this.props.onEnterHandler(itemValue)
      this.el.value = ''
    }
  }
}

export default QuickEntry
