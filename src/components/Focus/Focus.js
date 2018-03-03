import React from 'react';
import FocusItem from './FocusItem/FocusItem';
import styles from './Focus.module.css';

const focus =  (props) => {
  return (
    <div className={styles.focus}>
      {props.items
        .filter((item) => { return props.focusItem === null || props.focusItem === item.id })
        .map((item, index) => {
        return(
          <FocusItem
            onInput={props.onInputItem.bind(null, item.id)}
            onDeleted={props.onDeletedItem.bind(null, item.id, 'Click')}
            onKeyDown={props.onKeyDownItem.bind(null, item.id)}
            onToggleFocus={props.onToggleFocusItem.bind(null, item.id)}
            focus={props.focusItem}
            resetInputFocus={props.resetInputFocusItem}
            inputFocus={props.inputFocusItem}
            key={item.id}
            id={item.id}
            index={index}
            category={item.category}
          >
            {item.value}
          </FocusItem>)
        }
      )}
    </div>
  )
}

export default focus;
