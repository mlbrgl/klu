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
    this.debouncedCommitStorage = debounce(this.commitStorage, 250);
    this.state = {
      focusItems: [this.getNewFocusItem()],
      focusItem: null,
      inputFocusItem: null,
    }
    this.categories = [{name: 'inbox', icon: 'inbox'}, {name: 'nurture', icon: 'leaf'}, {name: 'energy', icon: 'light-up'}];
  }

  onKeyDownItemHandler = (itemId, event) => {
    const focusItems = [...this.state.focusItems]; // without the spread operator we
    const index = focusItems.findIndex((el) => el.id === itemId);

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        const indexNewItem = window.getSelection().anchorOffset === 0 && focusItems[index].value !== '' ? index : index + 1;
        focusItems.splice(indexNewItem, 0, this.getNewFocusItem())
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
          this.setState({inputFocusItem: focusItems[index - 1].id});
        }
        break;
      case 'ArrowDown':
        if(index < focusItems.length - 1) {
          event.preventDefault();
          this.setState({inputFocusItem: focusItems[index + 1].id});
        }
        break;
      case 'ArrowRight':
        if(window.getSelection().anchorOffset === this.state.focusItems[index].value.length) {
          //cycle through categories
          let idxOfCurrentCategory = focusItems[index].category !== null ? this.categories.map((category) => category.name).indexOf(focusItems[index].category.name) : 0;
          let idxOfNextCategory = (idxOfCurrentCategory + 1) % this.categories.length;
          focusItems[index].category = {...this.categories[idxOfNextCategory]};
          this.setState({focusItems: focusItems});
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
    let inputFocusItem;

    if(focusItems.length === 1) {
      // Necessary for deletion by click
      focusItems[0] = this.getNewFocusItem();
      // No need to set the inputFocusItem since we are recreating a new component
    } else {
      let newIndex;
      switch (key) {
        case 'Backspace':
          newIndex = index === 0 ? index + 1 : index - 1;
          break;
        case 'Delete':
        case 'Click':
          newIndex = index === focusItems.length - 1 ? index - 1 : index + 1;
          break;
        default:
      }
      inputFocusItem = focusItems[newIndex].id;
      focusItems.splice(index, 1);
    }

    this.setState({inputFocusItem: inputFocusItem});
    this.setState({focusItems: focusItems});
  }

  onToggleFocusItemHandler = (itemId) => {
    this.setState({focusItem: this.state.focusItem === itemId ? null : itemId})
  }

  componentDidUpdate = () => {
    this.debouncedCommitStorage();
  }

  componentWillMount = () => {
    const storedState = JSON.parse(localStorage.getItem(this.localStorageKey));
    if(storedState !== null) {
      this.setState(storedState);
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
            onToggleFocusItem={this.onToggleFocusItemHandler}
            focusItem={this.state.focusItem}
            inputFocusItem={this.state.inputFocusItem}
            resetInputFocusItem={this.resetInputFocusItemHandler}
            items={this.state.focusItems}/>
        </Frame>
      </div>
    );
  }

  /** Helpers **/
  // @TODO: check if merging inputFocusItem with resetInputFocusItemHandler makes sense
  resetInputFocusItemHandler = () => {
    this.setState({inputFocusItem: null});
  }

  commitStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.state));
  }

  getNewFocusItem () {
    return {id: Date.now(), value: '', category: {name: 'inbox', icon: 'inbox'}};
  }


}



export default App;
