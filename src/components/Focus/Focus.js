import React from 'react';
import FocusItem from './FocusItem/FocusItem';
import './Focus.css';

const focus =  (props) => {
  return (
    <div className="focus">
      {props.items.map((item, index) => {
        return(
          <FocusItem
            changed={props.changed.bind(null, item.id)}
            deleted={props.deleted.bind(null, item.id)}
            keypressed={props.keypressed.bind(null, item.id)}
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
