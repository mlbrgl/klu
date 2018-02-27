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
        const indexNewItem = window.getSelection().anchorOffset === 0 && focusItems[index].value !== '' ? index : index + 1;
        focusItems.splice(indexNewItem, 0, {id: Date.now(), value: ''})
        this.setState({focusItems: focusItems})
        // No need to set focus, as the new element gets it automatically
        break;
      case 'Backspace':
      case 'Delete':
        if(focusItems[index].value.length === 0) {
          event.preventDefault();
          this.onDeletedItemHandler(itemId, event.key)
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

  onDeletedItemHandler = (itemId, key) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    let inputFocus;

    if(focusItems.length === 1) { // Necessary for deletion by click
      focusItems[0] = {id: itemId, value: ''};
      inputFocus = itemId;
    } else {
      if(index === focusItems.length - 1 || key === 'Backspace') {
        inputFocus = focusItems[index - 1].id;
      } else if(index === 0 || key === 'Delete') {
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
