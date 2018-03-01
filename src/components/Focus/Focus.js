import React from 'react';
import FocusItem from './FocusItem/FocusItem';
import styles from './Focus.module.css';

const focus =  (props) => {
  return (
    <div className={styles.component}>
      {props.items.map((item, index) => {
        return(
          <FocusItem
            onInput={props.onInputItem.bind(null, item.id)}
            onDeleted={props.onDeletedItem.bind(null, item.id, 'Click')}
            onKeyDown={props.onKeyDownItem.bind(null, item.id)}
            resetInputFocus={props.resetInputFocusItem}
            inputFocus={props.inputFocusItem}
            key={item.id}
            id={item.id}
            index={index}
          >
            {item.value}
          </FocusItem>)
        }
      )}
    </div>
  )
}

export default focus;
