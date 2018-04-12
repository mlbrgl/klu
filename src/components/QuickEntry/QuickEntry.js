import React, { PureComponent } from 'react'
import debounce from 'lodash.debounce'

import styles from './QuickEntry.module.css'

class QuickEntry extends PureComponent {

  render() {
    return (
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          type="text"
          defaultValue={this.props.initValue}
          ref={(el) => this.el = el}
          onKeyDown={this.onKeyDownHandler}
          onChange={this.onChangeHandler}
          autoFocus />
        { this.props.projectName ?
          <span
            className={styles.project}
            onClick={this.props.onRemoveProjectFilterHandler}>
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
      const value = this.el.value
      if (event.metaKey || event.ctrlKey) {
        this.props.onToggleFilterProjectHandler(value.split(' ')[0])
        this.props.onResetSearchHandler()
        this.el.value = null
      } else {
        const itemValue = this.props.projectName ? value + ' +'  + this.props.projectName : value
        this.props.onEnterHandler(itemValue)
        this.el.value = null
      }
    }
  }
}

export default QuickEntry
