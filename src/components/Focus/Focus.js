import React from 'react';
import FocusItem from './FocusItem/FocusItem';
import Actions from './FocusItem/Actions/Actions'
import styles from './Focus.module.css';

const focus = (props) => {
  return (
    <div className={styles.focus}>
      {props.items
        .filter((item) => { return (item.id === props.focusItemId && props.isFocusOn) || !props.isFocusOn })
        .map((item, index) => {
        return(
          <FocusItem
            onInput={props.onInputItem.bind(null, item.id)}
            onDeleted={props.onDeletedItem.bind(null, item.id)}
            onKeyDown={props.onKeyDownItem.bind(null, item.id)}
            onDone={props.onDoneItem.bind(null, item.id)}
            onFocusNextItem={props.onFocusNextItem}
            onToggleFocus={props.onToggleFocusItem.bind(null, item.id)}
            isFocusOn={item.id === props.focusItemId && props.isFocusOn ? true : false}
            resetInputFocus={props.resetInputFocusItem}
            inputFocus={props.inputFocusItemId === item.id ? true : false}
            key={item.id}
            id={item.id}
            category={item.category}
            dates={item.dates}
            delete={props.deleteItemId === item.id ? true : false}
          >
            {item.value}
          </FocusItem>)
        }
      )}
      {!props.isFocusOn ?
        <Actions onFocusNextItem={props.onFocusNextItem} />
        : null
      }
    </div>
  )
}

export default focus;
