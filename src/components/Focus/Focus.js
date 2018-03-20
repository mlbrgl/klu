import React from 'react';
import styles from './Focus.module.css';

const focus = (props) => {
  return (
    <div className={styles.focus}>
      {props.children}
    </div>
  )
}

export default focus;
