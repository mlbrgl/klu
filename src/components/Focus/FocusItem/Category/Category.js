import React from 'react';
import styles from './Category.module.css'

const category = (props) => {
  let categoryStyles = props.isFocusOn ? styles.focused : styles.category;

  return (
    <span className={categoryStyles + ' icon-' + props.icon}></span>
  )
}

export default category;
