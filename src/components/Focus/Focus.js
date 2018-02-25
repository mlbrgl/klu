import React from 'react';
import FocusItem from './FocusItem/FocusItem';
import './Focus.css';

const focus =  (props) => {
  return (
    <div className="focus">
      {props.items.map((item, index) => {
        return(
          <FocusItem
            changed={props.changedItem.bind(null, item.id)}
            deleted={props.deletedItem.bind(null, item.id)}
            keyPressed={props.keyPressedItem.bind(null, item.id)}
            resetInputFocus={props.resetInputFocusItem}
            key={item.id}
            id={item.id}
            index={index}
            focus={props.focus}
          >
            {item.value}
          </FocusItem>)
        }
      )}
    </div>
  )
}

export default focus;
