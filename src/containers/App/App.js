import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { DateTime } from 'luxon';
import { MemoryRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'

import Frame from '../../containers/Frame/Frame';
import ContentWrapper from '../ContentWrapper/ContentWrapper';
import FocusItem from '../FocusItem/FocusItem';
import Projects from '../Projects/Projects';
import Dates from '../Dates/Dates';
import Project from '../../components/Project/Project';
import Editable from '../../components/Editable/Editable';
import Actions from '../../components/Actions/Actions';
import Category from '../../components/Category/Category';

import { loadFromStorage, commitToStorage } from '../../helpers/storage'
import { isCaretAtBeginningFieldItem, isCaretAtEndFieldItem, setCaretPosition, getRandomElement } from '../../helpers/common'
import { isNurtureDoneToday, pickNurtureItem, pickOverdue, pickDueTodayTomorrow, pickDueNextTwoWeeks, getNextActionableItems, getNameProjectsWithRemainingWork, getNameNonEmptyProjects } from '../../selectors/selectors'

import './App.css';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }


class App extends Component {

  constructor(props) {
    super(props);
    this.localStorageKey = 'klu';
    this.state = {
      focusItems: [this.getNewFocusItem()],
      isFocusOn: false,
      focusItemId: null,
      inputFocusItemId: null,
      deleteItemId: null,
      projects: []
    }
    this.categories = [{name: 'inbox', icon: 'inbox'}, {name: 'nurture', icon: 'leaf'}, {name: 'energy', icon: 'light-up'}];
  }

  getNewFocusItem () {
    return {
      id: Date.now(),
      value: '',
      category: {name: 'inbox', icon: 'inbox'},
      dates: {start: null, done: null, due: null}
    };
  }

  getNewProject (name) {
    return {name: name, frequency: null}
  }

  componentDidUpdate = () => {
    commitToStorage(this.state);
  }

  render() {
    return (
      <MemoryRouter>
        <div className="app">
          <Frame>
            <ContentWrapper isFocusOn={this.state.isFocusOn}>
              <Route path="/" exact render={this.renderFocusItems} />
              <Route path="/projects" render={this.renderProjects} />
              { !this.state.isFocusOn ?
                  <Actions
                    onFocusNextItem={this.onFocusNextItemHandler} />
                  : null
              }
            </ContentWrapper>
          </Frame>
        </div>
      </MemoryRouter>
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
   * COMPONENT TREES
   */

  renderFocusItems = () => {
    return (
      this.state.focusItems
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
                itemId={item.id}
              >
                {item.value}
              </Editable>

              <Dates
                onRemoveDate={this.onRemoveDateHandler}
                startdate={item.dates.start}
                duedate={item.dates.due}
                itemId={item.id} />

              { isFocusOn ?
                <Actions
                  onDoneItem={this.onDoneItemHandler}
                  onFocusNextItem={this.onFocusNextItemHandler}
                  itemId={item.id}
                  isFocusOn={isFocusOn} />
                : null
              }

          </FocusItem>

        )
      })
    )
  }

  renderProjects = () => {
    return (
      <Projects onMount={this.onUpdateProjects}>
        {this.state.projects.map((project, index) => {
          return (
            <Project
              key={project.name}
              frequency={project.frequency}
              onUpProjectFrequency={this.onUpProjectFrequency}
              onDownProjectFrequency={this.onDownProjectFrequency}
              name={project.name} />
          )
        })}
      </Projects>
    )
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
    let focusItems = [...this.state.focusItems];
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
      focusItems.splice(index, 1);
      if(isFocusOn === false) { // List mode
        let newIndex;
        switch (key) {
         case 'Backspace':
           newIndex = index === 0 ? index : index - 1;
           break;
         default: //'Delete', 'Click', 'Enter'
           newIndex = index === focusItems.length ? index - 1 : index;
        }
        inputFocusItemId = focusItems[newIndex].id;
        if(focusItemId === itemId) {
          const tmp = this.pickNextFocusItem(focusItems);
          focusItemId = tmp.newItemId;
          focusItems = tmp.appendedFocusItems
        }
      } else { // Focus mode
        const tmp = this.pickNextFocusItem(focusItems)
        focusItemId = tmp.newItemId;
        focusItems = tmp.appendedFocusItems
        inputFocusItemId = focusItemId === null ? focusItems[0].id : focusItemId;
        isFocusOn = focusItemId === null ? false : true;
      }
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
    const focusItems = [...this.state.focusItems]
    const { newItemId, appendedFocusItems } = this.pickNextFocusItem(focusItems);

    this.setState({
      focusItems: appendedFocusItems,
      focusItemId: newItemId,
      isFocusOn: newItemId === null ? false : true,
      inputFocusItemId: newItemId
    });
  }

  onDoneItemHandler = (itemId) => {
     const focusItems = [...this.state.focusItems];
     const index = focusItems.findIndex((el) => el.id === itemId);
     focusItems[index].dates = {...focusItems[index].dates, done: DateTime.local().toISODate()};
     const { newItemId, appendedFocusItems } = this.pickNextFocusItem(focusItems);

     this.setState({
       focusItems: appendedFocusItems,
       focusItemId: newItemId,
       isFocusOn: newItemId === null ? false : this.state.isFocusOn,
       inputFocusItemId: newItemId
     });
   };

  // @TODO: check if merging inputFocusItem with resetInputFocusItemHandler makes sense
  onResetInputFocusItemHandler = () => {
     this.setState({inputFocusItemId: null});
   }

  onUpdateProjects = () => {
    const namesOfNonEmptyProjects = getNameNonEmptyProjects(this.state.focusItems)
    const savedProjetsWithItems = this.state.projects.filter((project) => {
      return !!namesOfNonEmptyProjects.find((p) => p === project.name)
    })

    const newProjectsFromItems = getNameProjectsWithRemainingWork(this.state.focusItems)
      .filter((projectName) => {
        return !this.state.projects.find((p) => p.name === projectName)
      }).map((projectName) => this.getNewProject(projectName))

    const allActiveProjects = [...savedProjetsWithItems, ...newProjectsFromItems].sort((p1, p2) => {
      return p2.frequency - p1.frequency
    })

    this.setState({projects: allActiveProjects})
  }

  onUpProjectFrequency = (projectName) => {
    const projects = [...this.state.projects]
    const index = projects.findIndex((el) => el.name === projectName);
    const currentFrequency = projects[index].frequency;

    projects[index].frequency = currentFrequency !== null ? currentFrequency + 1 : 1
    this.setState({projects: projects})
  }

  onDownProjectFrequency = (projectName) => {
    const projects = [...this.state.projects]
    const index = projects.findIndex((el) => el.name === projectName);
    const currentFrequency = projects[index].frequency;

    projects[index].frequency = projects[index].frequency !== null ? projects[index].frequency-- : null;
    if(currentFrequency !== null) {
      projects[index].frequency = currentFrequency === 0 ? null : currentFrequency - 1
      this.setState({projects: projects})
    }
  }

  pickNextFocusItem = (focusItems) => {

    let {items: actionableItems, projectName } = getNextActionableItems(focusItems, this.state.projects);
    console.log(actionableItems)
    if(actionableItems.length) {
      let newItemId =
        (isNurtureDoneToday(focusItems) ? null : pickNurtureItem(actionableItems)) ||
        pickOverdue(actionableItems) ||
        pickDueTodayTomorrow(actionableItems) ||
        pickDueNextTwoWeeks(actionableItems) ||
        getRandomElement(actionableItems).id
      return { newItemId: newItemId, appendedFocusItems: focusItems}
    } else if(projectName !== null){
      return this.onCreateNewItemProject(projectName, focusItems)
    } else {
      return { newItemId: null, appendedFocusItems: focusItems}
    }
  }

  onCreateNewItemProject = (projectName, focusItems) => {
    const newItem = this.getNewFocusItem()

    newItem.value = '+' + projectName
    focusItems.push(newItem)

    return { newItemId: newItem.id, appendedFocusItems: focusItems }
  }

  onRemoveDateHandler = (itemId, dateType) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    focusItems[index].dates = {...focusItems[index].dates, [dateType]: null};

    this.setState({focusItems: focusItems})
  }

  /**
  * Helpers
  */

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

}

export default App;
