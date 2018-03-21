import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { DateTime } from 'luxon';

import Frame from '../../containers/Frame/Frame';
import Focus from '../../containers/Focus/Focus';
import FocusItem from '../../containers/FocusItem/FocusItem';
import Editable from '../../components/Editable/Editable';
import Actions from '../../components/Actions/Actions';
import Category from '../../components/Category/Category';
import Dates from '../../components/Dates/Dates';

import { loadFromStorage, commitToStorage } from '../../helpers/storage'
import { isCaretAtBeginningFieldItem, isCaretAtEndFieldItem, setCaretPosition } from '../../helpers/common'
import { pickNextFocusItem } from '../../selectors/selectors'

import './App.css';

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update')
  whyDidYouUpdate(React)
}


class App extends Component {

  constructor(props) {
    super(props);
    this.localStorageKey = 'klu';
    this.state = {
      focusItems: [this.getNewFocusItem()],
      isFocusOn: false,
      focusItemId: null,
      inputFocusItemId: null,
      deleteItemId: null
    }
    this.categories = [{name: 'inbox', icon: 'inbox'}, {name: 'nurture', icon: 'leaf'}, {name: 'energy', icon: 'light-up'}];
  }

  componentDidUpdate = () => {
    commitToStorage(this.state);
  }

  render() {
    return (
      <div className="app">
        <Frame>
          <Focus>
            {this.state.focusItems
              .filter((item) => { return (item.id === this.state.focusItemId && this.state.isFocusOn) || !this.state.isFocusOn })
              .map((item, index) => {
                let isFocusOn = item.id === this.state.focusItemId && this.state.isFocusOn ? true : false;
                let isDeleteOn = this.state.deleteItemId === item.id ? true : false;

                return(
                  // onDeleted={props.onDeletedItem} @TODO #deleteanimation
                  <FocusItem
                    isFocusOn={isFocusOn}
                    key={item.id}
                    category={item.category}
                    dates={item.dates}
                    isDeleteOn={isDeleteOn} >

                      <Category
                        name={item.category.name}
                        icon={item.category.icon}
                        isFocusOn={isFocusOn}
                        isDeleteOn={isDeleteOn} />

                      <Editable
                        onKeyDownEditableItem={this.onKeyDownEditableItemHandler}
                        onInputEditableItem={this.onInputEditableItemHandler}
                        onResetInputFocusItem={this.onResetInputFocusItemHandler}
                        inputFocus={this.state.inputFocusItemId === item.id ? true : false}
                        isFocusOn={isFocusOn}
                        itemId={item.id}
                      >
                        {item.value}
                      </Editable>

                      <Dates
                        startdate={item.dates.start}
                        duedate={item.dates.due} />

                      <Actions
                        onDoneItem={this.onDoneItemHandler}
                        onFocusNextItem={this.onFocusNextItemHandler}
                        itemId={item.id}
                        isFocusOn={isFocusOn} />

                  </FocusItem>
                )
              })
            }
          </Focus>
        </Frame>
      </div>
    );
  }

  componentDidMount = () => {
    loadFromStorage().then((storedState) => {
      if(storedState !== null) {
        this.setState(storedState); // keep in mind this triggers a re-render as it happens async
      }
    }).catch((err) => {
      console.error(err);
    });;
  }


  /*
   * HANDLERS
   */

   onKeyDownEditableItemHandler = (event, itemId) => {
     const focusItems = [...this.state.focusItems];
     const index = focusItems.findIndex((el) => el.id === itemId);

     switch (event.key) {
       case 'Enter':
         event.preventDefault();
         if (event.metaKey || event.ctrlKey) {
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
         } else if (event.metaKey || event.ctrlKey) {
           event.preventDefault();
           this.setState({deleteItemId: itemId})
         }
         break;

       case 'ArrowUp':
         if(event.metaKey || event.ctrlKey) {
           event.preventDefault();
           this.shiftDate(focusItems, index, 'plus', event.altKey ? {weeks: 1} : {days: 1})
         } else if(index > 0) {
           event.preventDefault();
           this.setState({inputFocusItemId: focusItems[index - 1].id});
         }
         break;

       case 'ArrowDown':
         if(event.metaKey || event.ctrlKey) {
           event.preventDefault();
           this.shiftDate (focusItems, index, 'minus', event.altKey ? {weeks: 1} : {days: 1})
         } else if(index < focusItems.length - 1) {
           event.preventDefault();
           this.setState({inputFocusItemId: focusItems[index + 1].id});
         }
         break;

       case 'ArrowRight':
         if(!event.shiftKey) {
           if(event.metaKey || event.ctrlKey) {
             setCaretPosition(event.target.childNodes[0], event.target.childNodes[0].length);
           } else if(isCaretAtEndFieldItem()) {
             //cycle through categories
             let idxOfCurrentCategory = focusItems[index].category !== null ? this.categories.map((category) => category.name).indexOf(focusItems[index].category.name) : 0;
             let idxOfNextCategory = (idxOfCurrentCategory + 1) % this.categories.length;
             focusItems[index].category = this.categories[idxOfNextCategory];
             this.setState({focusItems: focusItems});
           }
         }
         break;

       case 'ArrowLeft':
         if(!event.shiftKey) {
           if(event.metaKey || event.ctrlKey) {
             setCaretPosition(event.target.childNodes[0], 0);
           } else if(isCaretAtBeginningFieldItem()) {
             this.setState({deleteItemId: itemId});
           }
         }
         break;
       case 'Escape':
         if(this.state.deleteItemId !== null) {
           this.setState({deleteItemId: null});
         } else {
           this.onToggleFocusItemHandler(); //we only toggle focus, we don't set it
         }
         break;
       default:
     }
   }

   onInputEditableItemHandler = debounce((innerHTML, itemId) => {
     const focusItems = [...this.state.focusItems];
     const index = focusItems.findIndex((el) => el.id === itemId);
     focusItems[index].value = innerHTML;
     this.setState({focusItems: focusItems})
   }, 250)

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
         focusItemId = focusItemId === itemId ? pickNextFocusItem(this.state.focusItems, itemId) : focusItemId;
       } else { // Focus mode
         focusItemId = pickNextFocusItem(this.state.focusItems, itemId);
         inputFocusItemId = focusItemId === null ? focusItems[0].id : focusItemId;
         isFocusOn = focusItemId === null ? false : true;
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

   onFocusNextItemHandler = () => {
     let nextFocusItemId = pickNextFocusItem(this.state.focusItems);
     this.setState({
       focusItemId: nextFocusItemId,
       isFocusOn: nextFocusItemId === null ? false : true,
       inputFocusItemId: nextFocusItemId
     });
   }

   onDoneItemHandler = (itemId) => {
     const focusItems = [...this.state.focusItems];
     const index = focusItems.findIndex((el) => el.id === itemId);
     const newItemId = pickNextFocusItem(this.state.focusItems, itemId);
     focusItems[index].dates = {...focusItems[index].dates, done: DateTime.local().toISODate()};

     this.setState({
       focusItems: focusItems,
       focusItemId: newItemId,
       isFocusOn: newItemId === null ? false : this.state.isFocusOn,
       inputFocusItemId: newItemId
     });
   };

  // @TODO: check if merging inputFocusItem with resetInputFocusItemHandler makes sense
   onResetInputFocusItemHandler = () => {
     this.setState({inputFocusItemId: null});
   }

   shiftDate = (focusItems, index, operator, offset) => {
     let dateType = null;
     if(isCaretAtBeginningFieldItem()) {
       dateType = 'start';
     } else if (isCaretAtEndFieldItem()) {
       dateType = 'due';
     }
     if(dateType !== null) {
       let refTime = focusItems[index].dates[dateType] ? DateTime.fromISO(focusItems[index].dates[dateType]) : DateTime.local();
       focusItems[index].dates = {...focusItems[index].dates, [dateType]: refTime[operator](offset).toISODate()}
       this.setState({focusItems: focusItems});
     }
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
