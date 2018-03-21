import React, { PureComponent } from 'react'
import styles from './Actions.module.css'


class Actions extends PureComponent {
  onDoneItemHandler = (event) => {
    this.props.onDoneItem(this.props.itemId)
  }

  render () {
      return (
        <div className={styles.actions}>
          <span onClick={this.props.onFocusNextItem}>next up?</span>
          {this.props.isFocusOn ?
            <span onClick={this.onDoneItemHandler}>did it!</span>
            : null
          }
        </div>
      )
  }

}

export default Actions;
