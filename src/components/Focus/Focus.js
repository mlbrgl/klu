import React from 'react';
import FocusItem from './FocusItem/FocusItem';
import Actions from './FocusItem/Actions/Actions'
import styles from './Focus.module.css';

const focus = (props) => {
  const {items, ...passDownProps} = props;
  return (
    <div className={styles.focus}>
      {items
        .filter((item) => { return (item.id === props.focusItemId && props.isFocusOn) || !props.isFocusOn })
        .map((item, index) => {
        return(
          // onDeleted={props.onDeletedItem} @TODO #deleteanimation
          <FocusItem
            {...passDownProps}
            isFocusOn={item.id === props.focusItemId && props.isFocusOn ? true : false}
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
