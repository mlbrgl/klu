import React from 'react';
import styles from './FocusItem.module.css';
import Editable from '../../Editable/Editable'

const focusItem = (props) => {
  return (
    <div className={styles.focusitem}>
      <span className={styles.delete + " icon-right-open-big"}  onClick={props.onDeleted}></span>
      <Editable
        onKeyDown={props.onKeyDown}
        onInput={props.onInput}
        onDeleted={props.onDeleted}
        resetInputFocus={props.resetInputFocus}
        inputFocus={props.inputFocus}
        id={props.id}
        index={props.index}
      >
        {props.children}
      </Editable>

    </div>
  )
}

export default focusItem;
