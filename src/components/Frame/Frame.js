import React from 'react';
import styles from './Frame.module.css'

const frame = (props) => {
  const style = {
    backgroundImage: "url('/images/25.jpg')"
  }

  return (
    <div className={props.focus ? styles.focused : styles.frame} style={style}>
      <div className={styles.inner}>
        {props.children}
      </div>
    </div>
  )
}

export default frame;
