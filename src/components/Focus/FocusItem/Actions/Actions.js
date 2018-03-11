import React from 'react'
import styles from './Actions.module.css'

const actions = (props) => {
  return (
    <div className={styles.actions}>
      {props.onFocusNextItem ?
        <span onClick={props.onFocusNextItem}>next up?</span>
        : null
      }
      {props.onDone ?
        <span onClick={props.onDone}>did it!</span>
        : null
      }
    </div>
  )
}

export default actions;
