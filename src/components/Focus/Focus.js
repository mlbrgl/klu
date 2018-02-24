import React, { Component } from 'react';
import FocusItem from './FocusItem/FocusItem';
import './Focus.css';

class Focus extends Component {

  shouldComponentUpdate = (nextProps, nextState) => {
    // we shouldn't update the component if the number of items hasn't changed,
    // since it means that the state was updated as part as user editing the content
    // without adding or removing elements. Otherwise, we are messing with the
    // caret position, on top of executing useless renders.
    // @TODO ... except if the user clicked on the first element to clear its content
    // without deleting it.
    // console.log(nextProps.items[0].value === '')
    // return this.props.items.length !== nextProps.items.length || (nextProps.items.length === 1 && nextProps.items[0].value === '') ;
    return true;
  }

  render() {
    // console.log('in focus render')
    return (
      <div className="focus">
        {this.props.items.map((item, index) => {
          return(
            <FocusItem
              changed={this.props.changed.bind(null, item.id)}
              deleted={this.props.deleted.bind(null, item.id)}
              keypressed={this.props.keypressed.bind(null, item.id)}
              key={item.id}
              id={item.id}
              index={index}
              focus={this.props.focus}
            >
              {item.value}
            </FocusItem>)
          }
        )}
      </div>
    )
  }
}

export default Focus;
