import React from 'react';
import styles from './Category.module.css'

const category = (props) => {
  let categoryStyles = props.isFocusOn ? styles.focused : styles.category;
  let icon = props.isDeleteOn ? 'trash' : props.icon;

  return (
    <span className={categoryStyles + ' icon-' + icon}></span>
  )
}

export default category;
