import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { DateTime } from 'luxon';
import localforage from 'localforage';

import Frame from '../components/Frame/Frame';
import Thoughts from '../components/Thoughts/Thoughts';
import Focus from '../components/Focus/Focus';
import { isItemEligible, isToday, isTomorrow, getRandomElement } from '../helpers/helpers'

import './App.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.localStorageKey = 'klu';
    this.debouncedCommitStorage = debounce(this.commitStorage, 250);
    this.state = {
      focusItems: [this.getNewFocusItem()],
      isFocusOn: false,
      focusItemId: null,
      inputFocusItemId: null,
      deleteItemId: null
    }
    this.categories = [{name: 'inbox', icon: 'inbox'}, {name: 'nurture', icon: 'leaf'}, {name: 'energy', icon: 'light-up'}];
  }

  onKeyDownItemHandler = (itemId, event) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);

    if(event.key !== 'Enter' && this.state.deleteItemId !== null) {
      this.setState({deleteItemId: null});
    }

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (event.metaKey) {
          if (event.shiftKey) {
            this.onDoneItemHandler(itemId)
          } else {
            this.onToggleFocusItemHandler(itemId);
          }
        } else if (this.state.deleteItemId !== null) {
          this.onDeletedItemHandler(itemId, event.key)
        } else {
          const indexNewItem = window.getSelection().anchorOffset === 0 && focusItems[index].value !== '' ? index : index + 1;
          focusItems.splice(indexNewItem, 0, this.getNewFocusItem())

          if(this.state.isFocusOn === true) {
            this.setState({isFocusOn: false});
          }
          this.setState({focusItems: focusItems, inputFocusItemId: focusItems[indexNewItem].id});
        }
        break;

      case 'Backspace':
      case 'Delete':
        if(focusItems[index].value.length === 0) {
          event.preventDefault();
          this.onDeletedItemHandler(itemId, event.key)
        } else if (event.metaKey) {
          event.preventDefault();
          this.setState({deleteItemId: itemId})
        }
        break;

      case 'ArrowUp':
        if(event.metaKey) {
          event.preventDefault();
          this.shiftDate (focusItems, index, 'minus', event.altKey ? {weeks: 1} : {days: 1})
        } else if(index > 0) {
          event.preventDefault();
          this.setState({inputFocusItemId: focusItems[index - 1].id});
        }
        break;

      case 'ArrowDown':
        if(event.metaKey) {
          event.preventDefault();
          this.shiftDate (focusItems, index, 'plus', event.altKey ? {weeks: 1} : {days: 1})
        } else if(index < focusItems.length - 1) {
          event.preventDefault();
          this.setState({inputFocusItemId: focusItems[index + 1].id});
        }
        break;

      case 'ArrowRight':
        if(!event.shiftKey) {
          if(event.metaKey) {
            this.setCaretPosition(event.target.childNodes[0], event.target.childNodes[0].length);
          } else if(this.caretAtEndFieldItem()) {
            //cycle through categories
            let idxOfCurrentCategory = focusItems[index].category !== null ? this.categories.map((category) => category.name).indexOf(focusItems[index].category.name) : 0;
            let idxOfNextCategory = (idxOfCurrentCategory + 1) % this.categories.length;
            focusItems[index].category = {...this.categories[idxOfNextCategory]};
            this.setState({focusItems: focusItems});
          }
        }
        break;

      case 'ArrowLeft':
        if(!event.shiftKey) {
          if(event.metaKey) {
            this.setCaretPosition(event.target.childNodes[0], 0);
          } else if(this.caretAtBeginningFieldItem()) {
            this.setState({deleteItemId: itemId});
          }
        }
        break;
      case 'Escape':
        this.onToggleFocusItemHandler(); //we only toggle focus, we don't set it
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
    let inputFocusItemId = this.state.inputFocusItemId; // in the current state of things, should always be null since reset after use, but kept here for consistency
    let focusItemId = this.state.focusItemId;
    let isFocusOn = this.state.isFocusOn;

    if(focusItems.length === 1) {
      focusItems[0] = this.getNewFocusItem();
      inputFocusItemId = focusItems[0].id;
      focusItemId = null;
      isFocusOn = false;
    } else {
      if(isFocusOn === false) { // List mode
        let newIndex;
        switch (key) {
          case 'Backspace':
            newIndex = index === 0 ? index + 1 : index - 1;
            break;
          default: //'Delete', 'Click', 'Enter'
            newIndex = index === focusItems.length - 1 ? index - 1 : index + 1;
        }
        inputFocusItemId = focusItems[newIndex].id;
      } else { // Focus mode
        focusItemId = this.pickNextFocusItem();
        inputFocusItemId = focusItemId === null ? focusItems[0].id : focusItemId;
        isFocusOn = focusItemId === null ? false : isFocusOn;
      }
      focusItems.splice(index, 1);
    }

    this.setState({
      inputFocusItemId: inputFocusItemId,
      focusItems: focusItems,
      deleteItemId: null,
      focusItemId: focusItemId,
      isFocusOn: isFocusOn
    });
  }

  onToggleFocusItemHandler = (itemId = this.state.focusItemId) => {
    this.setState({
      focusItemId: itemId,
      isFocusOn: itemId === null ? false : !this.state.isFocusOn,
      inputFocusItemId: itemId
    });
  }

  onDoneItemHandler = (itemId) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    const newItemId = this.pickNextFocusItem();
    focusItems[index].dates.done = DateTime.local().toISODate();

    this.setState({
      focusItems: focusItems,
      focusItemId: newItemId,
      isFocusOn: newItemId === null ? false : this.state.isFocusOn,
      inputFocusItemId: newItemId
    });
  };

  componentDidUpdate = () => {
    this.debouncedCommitStorage();
  }

  componentWillMount = () => {
    localforage.getItem(this.localStorageKey).then((storedState) => {
      if(storedState !== null) {
        this.setState(storedState);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="app">
        <Frame
          focus={this.state.isFocusOn}>
          <Thoughts />
          <Focus
            onInputItem={this.onInputItemHandler}
            onDeletedItem={this.onDeletedItemHandler}
            onKeyDownItem={this.onKeyDownItemHandler}
            onDoneItem={this.onDoneItemHandler}
            onToggleFocusItem={this.onToggleFocusItemHandler}
            focusItemId={this.state.focusItemId}
            isFocusOn={this.state.isFocusOn}
            deleteItemId={this.state.deleteItemId}
            inputFocusItemId={this.state.inputFocusItemId}
            resetInputFocusItem={this.resetInputFocusItemHandler}
            items={this.state.focusItems}/>
        </Frame>
      </div>
    );
  }

  /** Helpers **/
  // @TODO: check if merging inputFocusItem with resetInputFocusItemHandler makes sense
  resetInputFocusItemHandler = () => {
    this.setState({inputFocusItemId: null});
  }

  caretAtBeginningFieldItem = () => {
    return window.getSelection().anchorOffset === 0;
  }

  // Warning: doesn't work as expected with multiple spaces at the end of the field,
  // as they are translated into &nbsp;
  caretAtEndFieldItem = () => {
    return window.getSelection().anchorOffset === window.getSelection().anchorNode.length;
  }

  shiftDate = (focusItems, index, operator, offset) => {
    let dateType = null;
    if(this.caretAtBeginningFieldItem()) {
      dateType = 'start';
    } else if (this.caretAtEndFieldItem()) {
      dateType = 'due';
    }
    if(dateType !== null) {
      let refTime = focusItems[index].dates[dateType] ? DateTime.fromISO(focusItems[index].dates[dateType]) : DateTime.local();
      focusItems[index].dates[dateType] = refTime[operator](offset).toISODate();
      this.setState({focusItems: focusItems});
    }
  }

  pickNextFocusItem = () => {
    let picked = null;
    let doneToday = this.state.focusItems.filter((item) => isToday(item.dates.done));

    let eligibleItems = this.state.focusItems.filter((item) => isItemEligible(item, this.state.focusItemId));

    // If nothing has been done today yet, we start with a nurture task
    if (doneToday.length === 0) {
      let nurtureEligibleItems = eligibleItems.filter((item) => item.category.name === 'nuture');
      picked = getRandomElement(nurtureEligibleItems);
    } else {
      let dueTodayTomorrow = eligibleItems.filter((item) => isToday(item.dates.due) || isTomorrow(item.dates.due));
      if (dueTodayTomorrow.length !== 0) {
        picked = getRandomElement(dueTodayTomorrow);
      } else {
        picked = getRandomElement(eligibleItems);
      }
    }
    return picked ? picked.id : null  ;
  }

  setCaretPosition = (element, position) => {
    let range = document.createRange();
    range.setStart(element, position);
    range.collapse(true);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  commitStorage() {
    localforage.setItem(this.localStorageKey, this.state).catch((err) => {
      console.error(err);
    })
  }

  getNewFocusItem () {
    return {
      id: Date.now(),
      value: '',
      category: {name: 'inbox', icon: 'inbox'},
      dates: {start: null, done: null, due: null}
    };
  }




}

export default App;
