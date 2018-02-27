import React, { Component } from 'react';
import debounce from 'lodash.debounce';

import Frame from '../components/Frame/Frame';
import Thoughts from '../components/Thoughts/Thoughts';
import Focus from '../components/Focus/Focus';

import './App.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.localStorageKey = 'klu';
    this.debouncedCommitStorage = debounce(this.commitStorage, 250)
  }

  onKeyDownItemHandler = (itemId, event) => {
    const focusItems = [...this.state.focusItems]; // without the spread operator we
    const index = focusItems.findIndex((el) => el.id === itemId);

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        focusItems.splice(index + 1, 0, {id: Date.now(), value: ''})
        this.setState({focusItems: focusItems, inputFocus: null})
        break;
      case 'Backspace':
        if(focusItems[index].value.length === 0) {
          event.preventDefault();
          this.onDeletedItemHandler(itemId)
        }
        break;
      case 'ArrowUp':
        if(index > 0) {
          event.preventDefault();
          this.setState({inputFocus: focusItems[index - 1].id});
        }
        break;
      case 'ArrowDown':
        if(index < focusItems.length - 1) {
          this.setState({inputFocus: focusItems[index + 1].id});
        }
        break;
      default:
    }
  }

  onInputItemHandler = (itemId, event) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    focusItems[index].value = event.target.innerHTML
    this.setState({focusItems: focusItems})
  }

  onDeletedItemHandler = (itemId) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    let inputFocus = this.state.inputFocus;

    if(focusItems.length === 1) {
      focusItems[0] = {id: itemId, value: ''};
      inputFocus = itemId;
    } else {
      if(index === 0) {
        inputFocus = focusItems[1].id;
      } else if(index === focusItems.length - 1) {
        inputFocus = focusItems[focusItems.length - 2].id;
      } else {
        inputFocus = focusItems[index + 1].id;
      }
      focusItems.splice(index, 1);
    }

    this.setState({inputFocus: inputFocus});
    this.setState({focusItems: focusItems});
  }

  resetInputFocusItemHandler = () => {
    this.setState({inputFocus: null});
  }

  commitStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.state));
  }

  componentDidUpdate = () => {
    this.debouncedCommitStorage();
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
            onInputItem={this.onInputItemHandler}
            onDeletedItem={this.onDeletedItemHandler}
            onKeyDownItem={this.onKeyDownItemHandler}
            inputFocusItem={this.state.inputFocus}
            resetInputFocusItem={this.resetInputFocusItemHandler}
            items={this.state.focusItems}/>
        </Frame>
      </div>
    );
  }
}

export default App;
