import React, { Component } from 'react';

import Frame from '../components/Frame/Frame';
import Thoughts from '../components/Thoughts/Thoughts';
import Focus from '../components/Focus/Focus';

import './App.css'

class App extends Component {

  localStorageKey = 'klu';

  keyPressedHandler = (itemId, event) => {
    const focusItems = [...this.state.focusItems]; // without the spread operator we
    const index = focusItems.findIndex((el) => el.id === itemId);

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        focusItems.splice(index + 1, 0, {id: Date.now(), value: ''})
        this.setState({focusItems: focusItems, setInputFocus: null})
        break;
      case 'Backspace':
        if(focusItems[index].value.length === 0) {
          event.preventDefault();
          this.deleteItemHandler(itemId)
        }
        break;
      default:
    }
  }

  changeItemHandler = (itemId, event) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    focusItems[index].value = event.target.innerHTML
    this.setState({focusItems: focusItems})
  }

  deleteItemHandler = (itemId) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    let setInputFocus = this.state.setInputFocus;

    if(focusItems.length === 1) {
      focusItems[0] = {id: itemId, value: ''};
      setInputFocus = itemId;
    } else {
      if(index === 0) {
        setInputFocus = focusItems[1].id;
      } else if(index === focusItems.length - 1) {
        setInputFocus = focusItems[focusItems.length - 2].id;
      } else {
        setInputFocus = focusItems[index + 1].id;
      }
      focusItems.splice(index, 1);
    }

    this.setState({setInputFocus: setInputFocus});
    this.setState({focusItems: focusItems});
  }

  // called when state is updated and component re-rendered
  // (cf.https://reactjs.org/docs/react-component.html#setstate)
  componentDidUpdate = () => {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.state));
  }

  componentWillMount = () => {
    const storedState = JSON.parse(localStorage.getItem(this.localStorageKey));
    if(storedState !== null) {
      this.setState(storedState)
    } else {
      this.setState({focusItems: [{id: Date.now(), value: ''}]})
    }
  }

  render() {
    return (
      <div className="app">
        <Frame>
          <Thoughts />
          <Focus
            changed={this.changeItemHandler}
            deleted={this.deleteItemHandler}
            keypressed={this.keyPressedHandler}
            items={this.state.focusItems}
            focus={this.state.setInputFocus}/>
        </Frame>
      </div>
    );
  }
}

export default App;
