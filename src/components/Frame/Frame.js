import React from 'react';
import { getRandomIntInclusive } from '../../helpers/helpers'
import styles from './Frame.module.css'

const frame = (props) => {
  const style = {
    backgroundImage: "url('/images/" + getRandomIntInclusive(1,45) + ".jpg')"
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
