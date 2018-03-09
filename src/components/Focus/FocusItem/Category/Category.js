import React from 'react';
import styles from './Category.module.css'

const category = (props) => {
  let categoryStyles = props.focus ? styles.focused : styles.category;

  return (
    <span className={categoryStyles + ' icon-' + props.icon} onClick={props.onToggleFocus}></span>
  )
}

export default category;
