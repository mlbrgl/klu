import React from 'react'
import styles from './Actions.module.css'

const actions = (props) => {
  return (
    <div className={styles.actions}>
      <span onClick={props.onDone} className='icon-circular-graph'></span>
      <span onClick={props.onDone} className='icon-check'></span>
    </div>
  )
}

export default actions;
