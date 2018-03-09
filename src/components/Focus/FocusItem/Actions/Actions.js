import React from 'react'
import styles from './Actions.module.css'

const actions = (props) => {
  return (
    <div className={styles.actions}>
      <span onClick={props.onDone}>did it!</span>
    </div>
  )
}

export default actions;
