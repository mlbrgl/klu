import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { DateTime } from 'luxon';
import { Route, Switch, withRouter } from 'react-router-dom'

import Frame from '../../containers/Frame/Frame';
import ContentWrapper from '../ContentWrapper/ContentWrapper';
import FocusItem from '../FocusItem/FocusItem';
import Projects from '../Projects/Projects';
import Dates from '../Dates/Dates';
import Project from '../../components/Project/Project';
import Editable from '../../components/Editable/Editable';
import Actions from '../../components/Actions/Actions';
import Category from '../../components/Category/Category';
// import localforage from 'localforage';

import { loadFromStorage, commitToStorage } from '../../helpers/storage'
import { getInitialState, getNewFocusItem } from '../../store/store'
import { isCaretAtBeginningFieldItem, isCaretAtEndFieldItem, setCaretPosition, getRandomElement } from '../../helpers/common'
import { isNurtureDoneToday, pickNurtureItem, pickOverdue, pickDueTodayTomorrow, pickDueNextTwoWeeks, getUpdatedProjects, getNextContract, isItemWithinProject, areProjectsPending } from '../../selectors/selectors'
import { PROJECT_PAUSED, PROJECT_COMPLETED} from '../../helpers/constants'

import './App.css';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

class App extends Component {

  constructor(props) {
    super(props);
    this.categories = [{name: 'inbox', icon: 'inbox'}, {name: 'nurture', icon: 'leaf'}, {name: 'energy', icon: 'light-up'}];
    this.state = null // redundant but makes the check in render clearer
  }

  componentWillMount = () => {
    loadFromStorage()
      .then((state) => {
        //EXPORT (on prod)
        // localStorage.setItem('state', JSON.stringify(state))
        //IMPORT (on local)
        // state = JSON.parse(localStorage.getItem('state'))
        // for(let item in state){
        //   localforage.setItem(item, state[item])
        //   .catch((err) => { console.error(err) })
        // }
        if(state !== null) {
          this.setState(state)
        } else {
          this.setState(getInitialState())
        }
      })
      .catch((err) => { console.log(err) })
  }

  render() {
    return (
      this.state === null ?
      null
      :
      <div className="app">
        <Frame>
          <ContentWrapper isFocusOn={this.state.isFocusOn}>
            <Switch>
              <Route path="/" exact render={this.renderFocusItems} />
              <Route path="/projects" render={this.renderProjects} />
            </Switch>
            <Actions
              onDoneItem={this.onDoneItemHandler}
              onFocusNextItem={this.onFocusNextItemHandler}
              itemId={this.state.focusItemId}
              isFocusOn={this.state.isFocusOn} />
          </ContentWrapper>
        </Frame>
      </div>
    );
  }

  componentDidMount = () => {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Escape':
        if (this.state.deleteItemId !== null) {
          this.setState({deleteItemId: null});
        } else {
          this.onToggleFocusItemHandler();
          this.props.history.push('/')
        }
        break;
        default:
      }
    })
  }

  componentDidUpdate = () => {
    commitToStorage(this.state);
  }

  /*
   * COMPONENT TREES
   */

  renderFocusItems = (routeProps) => {
    const projectName = new URLSearchParams(routeProps.location.search).get('project')
    return (
      this.state.focusItems
      .filter((item) => {
        return (
          (this.state.isFocusOn && item.id === this.state.focusItemId) ||
          (!this.state.isFocusOn && projectName && isItemWithinProject(item, {name: projectName})) ||
          (!this.state.isFocusOn && !projectName) ||
          false
        )
      })
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

          </FocusItem>

        )
      })
    )
  }

  renderProjects = () => {
    return (
      <Projects onMount={this.onUpdateProjectsHandler}>
        {this.state.projects.map((project, index) => {
          return (
            <Project
              key={project.name}
              frequency={project.frequency}
              status={project.status}
              name={project.name}
              onUpProjectFrequency={this.onUpProjectFrequencyHandler}
              onDownProjectFrequency={this.onDownProjectFrequencyHandler}
              onAddWorkProject={this.onAddWorkProjectHandler}
              onSetProjectStatus={this.onSetProjectStatusHandler} />
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
        const projectName = new URLSearchParams(this.props.location.search).get('project')
        let newItem = getNewFocusItem();
        if(projectName) {
          newItem.value = '+' + projectName
        }
        focusItems.splice(indexNewItem, 0, newItem)

        if (this.state.isFocusOn === true) {
          this.setState({isFocusOn: false});
        }
        this.setState({
          focusItems: focusItems,
          inputFocusItemId: focusItems[indexNewItem].id
        });
      }
      break;

    case 'Backspace':
    case 'Delete':
      if (focusItems[index].value.length === 0) {
        event.preventDefault();
        this.onDeletedItemHandler(itemId, event.key)
      } else if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        this.setState({deleteItemId: itemId})
      }
      break;

    case 'ArrowUp':
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        this.shiftDate(focusItems, index, 'plus', event.altKey ? {weeks: 1} : {days: 1})
      } else if (index > 0) {
        event.preventDefault();
        this.setState({inputFocusItemId: focusItems[index - 1].id});
      }
      break;

    case 'ArrowDown':
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        this.shiftDate(focusItems, index, 'minus', event.altKey ? {weeks: 1} : {days: 1})
      } else if (index < focusItems.length - 1) {
        event.preventDefault();
        this.setState({inputFocusItemId: focusItems[index + 1].id});
      }
      break;

    case 'ArrowRight':
      if (!event.shiftKey) {
        if (event.metaKey || event.ctrlKey) {
          setCaretPosition(event.target.childNodes[0], event.target.childNodes[0].length);
        } else if (isCaretAtEndFieldItem()) {
          //cycle through categories
          let idxOfCurrentCategory = focusItems[index].category !== null ? this.categories.map((category) => category.name).indexOf(focusItems[index].category.name) : 0;
          let idxOfNextCategory = (idxOfCurrentCategory + 1) % this.categories.length;
          focusItems[index].category = this.categories[idxOfNextCategory];
          this.setState({focusItems: focusItems});
        }
      }
      break;

    case 'ArrowLeft':
      if (!event.shiftKey) {
        if (event.metaKey || event.ctrlKey) {
          setCaretPosition(event.target.childNodes[0], 0);
        } else if (isCaretAtBeginningFieldItem()) {
          this.setState({deleteItemId: itemId});
        }
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
      focusItems[0] = getNewFocusItem();
      inputFocusItemId = focusItems[0].id;
      focusItemId = null;
      isFocusOn = false;
    } else {
      focusItems.splice(index, 1);
      if(isFocusOn === false) { // List mode
        let newIndex;
        switch (key) {
         case 'Backspace':
         case 'Enter':
           newIndex = index === 0 ? index : index - 1;
           break;
         default: //'Delete', 'Click'
           newIndex = index === focusItems.length ? index - 1 : index;
        }
        inputFocusItemId = focusItems[newIndex].id;
        if(focusItemId === itemId) {
          focusItemId = this.pickNextFocusItem(focusItems)
        }
      } else { // Focus mode
        focusItemId = this.pickNextFocusItem(focusItems)
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
    const newItemId = this.pickNextFocusItem()

    this.setState({
      focusItemId: newItemId,
      isFocusOn: newItemId === null ? false : true,
      inputFocusItemId: newItemId
    });
  }

  onDoneItemHandler = (itemId) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);
    focusItems[index].dates = {...focusItems[index].dates, done: DateTime.local().toISODate()};
    if(this.state.isFocusOn) {
      const focusItemId = this.pickNextFocusItem()
      this.setState({
        focusItems: focusItems,
        focusItemId: focusItemId,
        isFocusOn: !!focusItemId,
        inputFocusItemId: focusItemId
      });
    } else {
      this.setState({focusItems: focusItems})
      if(areProjectsPending(this.state.projects, focusItems)) {
        this.props.history.push('/projects')
      }
    }
  };

  // @TODO: check if merging inputFocusItem with resetInputFocusItemHandler makes sense
  onResetInputFocusItemHandler = () => {
     this.setState({inputFocusItemId: null});
   }

  onUpdateProjectsHandler = () => {
    this.setState({projects: getUpdatedProjects(this.state.projects, this.state.focusItems)})
  }

  onUpProjectFrequencyHandler = (projectName) => {
    const projects = [...this.state.projects]
    const index = projects.findIndex((el) => el.name === projectName);
    const currentFrequency = projects[index].frequency;

    projects[index].frequency = currentFrequency !== null ? currentFrequency + 1 : 0
    this.setState({projects: projects})
  }

  onDownProjectFrequencyHandler = (projectName) => {
    const projects = [...this.state.projects]
    const index = projects.findIndex((el) => el.name === projectName);
    const currentFrequency = projects[index].frequency;

    projects[index].frequency = projects[index].frequency !== null ? projects[index].frequency-- : null;
    if(currentFrequency !== null) {
      projects[index].frequency = currentFrequency === 0 ? null : currentFrequency - 1
      this.setState({projects: projects})
    }
  }

  pickNextFocusItem = (focusItems = this.state.focusItems) => {
    if(areProjectsPending(this.state.projects, focusItems)) {
      this.props.history.push('/projects')
      return null
    } else {
      this.props.history.push('/')
      const items = getNextContract(focusItems, this.state.projects)
      if(items.length) {
        return (
          (isNurtureDoneToday(focusItems) ? null : pickNurtureItem(items)) ||
          pickOverdue(items) ||
          pickDueTodayTomorrow(items) ||
          pickDueNextTwoWeeks(items) ||
          getRandomElement(items).id
        )
      } else {
        return null
      }
    }
  }

  onAddWorkProjectHandler = (projectName) => {

    const focusItems = [...this.state.focusItems];
    const newItem = getNewFocusItem()

    newItem.value = '+' + projectName
    focusItems.push(newItem)

    this.setState({
      focusItems: focusItems,
      focusItemId: newItem.id,
      inputFocusItemId: newItem.id
    });
  }

  onSetProjectStatusHandler = (projectName, status) => {
    const projects = [...this.state.projects]
    const index = projects.findIndex((project) => project.name === projectName)
    projects[index].status = status;
    if(status === PROJECT_COMPLETED || status === PROJECT_PAUSED) {
      projects[index].frequency = 0;
    }

    this.setState({projects: projects})
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

export default withRouter(App);
