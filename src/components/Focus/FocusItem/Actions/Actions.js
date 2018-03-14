import React, { PureComponent } from 'react'
import styles from './Actions.module.css'


class Actions extends PureComponent {
  onDoneItemHandler = (event) => {
    this.props.onDoneItem(event, this.props.itemId)
  }

  render () {
    return (
      <div className={styles.actions}>
      {this.props.onFocusNextItem ?
        <span onClick={this.props.onFocusNextItem}>next up?</span>
        : null
      }
      {this.props.onDoneItem ?
        <span onClick={this.onDoneItemHandler}>did it!</span>
        : null
      }
      </div>
    )
  }

}

export default Actions;
