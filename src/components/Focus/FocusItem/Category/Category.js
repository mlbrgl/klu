import React from 'react';
import styles from './Category.module.css'

const category = (props) => {
  return (
    <span className={styles.category + ' icon-' + props.icon} onClick={props.onToggleFocus}></span>
  )
}

export default category;
