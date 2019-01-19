import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { DateTime } from 'luxon';
import { Route, Switch, withRouter } from 'react-router-dom'
import SearchApi from 'js-worker-search'

import Frame from '../Frame/Frame';
import ContentWrapper from '../ContentWrapper/ContentWrapper';
import Filters from '../Filters/Filters';
import FocusItem from '../FocusItem/FocusItem';
import Projects from '../Projects/Projects';
import Dates from '../Dates/Dates';
import QuickEntry from '../../components/QuickEntry/QuickEntry'
import Filter from '../../components/Filter/Filter'
import Project from '../../components/Project/Project';
import Editable from '../../components/Editable/Editable';
import Actions from '../../components/Actions/Actions';
import Category from '../../components/Category/Category';
// import localforage from 'localforage';

import { loadFromStorage, commitToStorage } from '../../helpers/storage'
import { getInitialState, getNewFocusItem, buildIndex } from '../../store/store'
import { isCaretAtBeginningFieldItem, isCaretAtEndFieldItem, setCaretPosition, getRandomElement } from '../../helpers/common'
import { pickOverdue, pickDueTodayTomorrow, pickDueNextTwoWeeks, isItemDone, isItemActionable, isItemFuture, getUpdatedProjects, getProjectNameFromItem, getNextContractItems, getChronoItems, isItemWithinProject, areProjectsPending } from '../../selectors/selectors'
import { PROJECT_PAUSED, PROJECT_COMPLETED} from '../../helpers/constants'

import './App.css';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

class App extends Component {

  constructor(props) {
    super(props)
    this.categories = [{name: 'inbox', icon: 'inbox'}, {name: 'peak', icon: 'area-graph'}, {name: 'trough', icon: 'calculator'}, {name: 'recovery', icon: 'palette'}];
    this.initSearch()
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
        this.searchApi = new SearchApi()
        if(state !== null) {
          state.filters= {done: false, actionable: true, future: false}
          this.setState(state)
          buildIndex(this.searchApi, state.focusItems)
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
          <Route path="/" exact render={this.renderQuickEntry} />
          <Route path="/" exact render={this.renderFilters} />
          <ContentWrapper isFocusOn={this.state.isFocusOn}>
            <Switch>
              <Route path="/" exact render={this.renderFocusItems} />
              <Route path="/projects" render={this.renderProjects} />
            </Switch>
            <Actions
              onDoneItem={this.onDoneItemHandler}
              onDoneAndWaitingItem={this.onDoneAndWaitingItemHandler}
              onFocusNextItem={this.onFocusNextItemHandler}
              itemId={this.state.focusItemId}
              isFocusOn={this.state.isFocusOn} />
          </ContentWrapper>
        </Frame>
      </div>
    );
  }

  /*
  * COMPONENT TREES
  */

  renderQuickEntry = (routeProps) => {
    const projectName = new URLSearchParams(routeProps.location.search).get('project')
    return (
      !this.state.isFocusOn ?
        <QuickEntry
          initValue={this.searchQuery}
          projectName={projectName}
          onEnterHandler={this.onEnterQuickEntryHandler}
          onToggleFilterProjectHandler={this.onToggleFilterProjectHandler}
          onRemoveProjectFilterHandler={this.onRemoveProjectFilterHandler}
          onResetSearchHandler={this.onResetSearchHandler}
          onSearchHandler={this.onSearchHandler} />
        : null
    )
  }

  renderFilters = () => {
    return (
      !this.state.isFocusOn ?
        <Filters>
          <Filter active={this.state.filters.done} type="done" onToggleFilterDateHandler={this.onToggleFilterDateHandler}></Filter>
          <Filter active={this.state.filters.actionable} type="actionable" onToggleFilterDateHandler={this.onToggleFilterDateHandler}></Filter>
          <Filter active={this.state.filters.future} type="future" onToggleFilterDateHandler={this.onToggleFilterDateHandler}></Filter>
        </Filters>
      : null
    )
  }

  renderFocusItems = (routeProps) => {
    const projectName = new URLSearchParams(routeProps.location.search).get('project')

    return (
      this.state.focusItems
      .filter((item) => {
        if(this.state.isFocusOn){
          return item.id === this.state.focusItemId
        } else if(!this.searchQuery || this.searchResults.find((res) => item.id === res)) {
          return (
            (!projectName || isItemWithinProject(item, {name: projectName})) &&
            (
              (this.state.filters.done && isItemDone(item)) ||
              (this.state.filters.actionable && isItemActionable(item)) ||
              (this.state.filters.future && isItemFuture(item))
            )
          )
        }
        return false
      })
      .slice(0, projectName || this.searchQuery ? Infinity : 20)
      .map((item, index) => {
        let isFocusOn = item.id === this.state.focusItemId && this.state.isFocusOn ? true : false;
        let isDeleteOn = this.state.deleteItemId === item.id ? true : false;

        return(
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
                onKeyDownHandler={this.onKeyDownEditableItemHandler}
                onInputHandler={this.onInputEditableItemHandler}
                itemId={item.id}
              >
                {item.value}
              </Editable>

              <Dates
                onRemoveDateHandler={this.onRemoveDateHandler}
                startdate={item.dates.start}
                duedate={item.dates.due}
                donedate={item.dates.done}
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
              onToggleFilterProjectHandler={this.onToggleFilterProjectHandler}
              onUpProjectFrequency={this.onUpProjectFrequencyHandler}
              onDownProjectFrequency={this.onDownProjectFrequencyHandler}
              onSetProjectStatus={this.onSetProjectStatusHandler} />
          )
        })}
      </Projects>
    )
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
          break
        default:
      }
    })

    // Makes sure multiple instances of the app remain in sync
    // Two caveats:
    // - sync will only happen when the window regains focus, even if it is not hidden
    // - if the focus was not on the app frame before moving onto another tab / window,
    // coming back to that tab will not trigger onfocus. Once the app regains focus
    // (e.g. click within the app frame), onfocus is triggered and the app updates.
    window.onfocus = () => {
      loadFromStorage()
        .then((state) => {
          // No need to check for state === null since the app has at least been
          // mounted once (before it lost focus) and the state initialized in componentWillMount
          this.setState(state)
          // the index needs to be rebuilt here as it is not saved to the state
          buildIndex(this.searchApi, state.focusItems)
        })
    }
  }

  componentDidUpdate = () => {
    commitToStorage(this.state);
  }

  /*
  * HANDLERS: QUICK ENTRY
  */

  onEnterQuickEntryHandler = (itemValue) => {
    const newItem = getNewFocusItem(itemValue)
    const focusItems = [newItem, ...this.state.focusItems]
    this.onResetSearchHandler()

    this.searchApi.indexDocument(newItem.id, newItem.value)
    this.setState({focusItems: focusItems})
  }

  onRemoveProjectFilterHandler = () => {
    this.props.history.push('/')
  }

  onResetSearchHandler = () => {
    this.searchQuery = ''
    this.searchResults = []
  }

  onSearchHandler = (searchQuery) => {
    if(searchQuery) {
      this.searchApi.search(searchQuery).then((results) => {
        this.searchResults = results
        this.searchQuery = searchQuery
        this.forceUpdate()
      })
    } else {
      this.onResetSearchHandler()
      this.forceUpdate()
    }
  }

  /*
  * HANDLERS: DATE FILTERS
  */

 onToggleFilterDateHandler = (type) => {
   const filters = {...this.state.filters}
   filters[type] = !filters[type]
   this.setState({filters: filters})
 }

  /*
  * HANDLERS: ITEMS
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
          this.onToggleFilterProjectHandler(getProjectNameFromItem(focusItems[index]))
        }
      } else if (this.state.deleteItemId === null){
        this.onToggleFocusItemHandler(itemId);
      } else if (this.state.deleteItemId !== null) {
        this.onDeletedItemHandler(itemId, event.key)
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
        if(this.isCaretAtEdges()) {
          focusItems[index].dates = this.shiftDate(focusItems[index].dates, 'plus', event.altKey ? {weeks: 1} : {days: 1})
          this.sortMutable(focusItems)
          this.setState({focusItems: focusItems})
        }
      }
      break;

    case 'ArrowDown':
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        if(this.isCaretAtEdges()) {
          focusItems[index].dates = this.shiftDate(focusItems[index].dates, 'minus', event.altKey ? {weeks: 1} : {days: 1})
          this.sortMutable(focusItems)
          this.setState({focusItems: focusItems})
        }
      }
      break;

    case 'ArrowRight':
      if (!event.shiftKey) {
        if (event.metaKey || event.ctrlKey) {
          if(event.target.childNodes[0]) { // field not empty
            setCaretPosition(event.target.childNodes[0], event.target.childNodes[0].length);
          }
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
     focusItems[index].dates.modified = Date.now();
     this.sortMutable(focusItems)

     this.searchApi.indexDocument(itemId, innerHTML)
     this.setState({focusItems: focusItems})
   }, 250)

  onDeletedItemHandler = (itemId, key) => {
    let focusItems = [...this.state.focusItems]
    const index = focusItems.findIndex((el) => el.id === itemId)
    let focusItemId = this.state.focusItemId

    focusItems.splice(index, 1);
    if(focusItems.length === 0) {
      focusItems[0] = getNewFocusItem()
      focusItemId = null
    } else if(focusItemId === itemId) {
      focusItemId = this.pickNextFocusItem(focusItems)
    }

    this.setState({
     focusItems: focusItems,
     deleteItemId: null,
     focusItemId: focusItemId,
     isFocusOn: focusItemId === null ? false : this.state.isFocusOn
    })
  }

  onToggleFocusItemHandler = (itemId = this.state.focusItemId) => {
     this.setState({
       focusItemId: itemId,
       isFocusOn: itemId === null ? false : !this.state.isFocusOn,
     });
   }

  onFocusNextItemHandler = () => {
    const newItemId = this.pickNextFocusItem()

    this.setState({
      focusItemId: newItemId,
      isFocusOn: newItemId === null ? false : true,
    });
  }

  onDoneItemHandler = (itemId) => {
    const focusItems = [...this.state.focusItems];
    const index = focusItems.findIndex((el) => el.id === itemId);

    if(!focusItems[index].dates.done) {
      focusItems[index].dates = {...focusItems[index].dates, done: DateTime.local().toISODate(), modified: Date.now()}
      const focusItemId = this.state.focusItemId === itemId ? this.pickNextFocusItem(focusItems) : this.state.focusItemId

      this.sortMutable(focusItems)

      this.setState({
        focusItems: focusItems,
        focusItemId: focusItemId,
        isFocusOn: focusItemId === null ? false : this.state.isFocusOn
      })
    }
  }

  onDoneAndWaitingItemHandler = (itemId) => {
    const focusItems = [...this.state.focusItems]
    const index = focusItems.findIndex((el) => el.id === itemId);
    const category = focusItems[index].category
    focusItems[index].dates = {...focusItems[index].dates, done: DateTime.local().toISODate(), modified: Date.now()}

    const newItem = getNewFocusItem('@qw ' + focusItems[index].value)
    const futureDate = DateTime.local().plus({days: 3}).toISODate()
    focusItems.unshift(newItem)
    focusItems[0].dates = {...focusItems[0].dates, start: futureDate, due: futureDate}
    focusItems[0].category = category
    const focusItemId = newItem.id

    this.sortMutable(focusItems)

    this.setState({
      focusItems: focusItems,
      focusItemId: focusItemId
    })
  }

  onToggleFilterProjectHandler = (projectName) => {
    if(new URLSearchParams(this.props.location.search).get('project')) {
      this.props.history.push('/')
    } else if(projectName) {
      this.props.history.push('/?project=' + projectName)
    }
  }

  onUpdateProjectsHandler = () => {
    this.setState({projects: getUpdatedProjects(this.state.projects, this.state.focusItems)})
  }

  onUpProjectFrequencyHandler = (projectName) => {
    const projects = [...this.state.projects]
    const index = projects.findIndex((el) => el.name === projectName);

    projects[index].frequency ++
    this.setState({projects: projects})
  }

  onDownProjectFrequencyHandler = (projectName) => {
    const projects = [...this.state.projects]
    const index = projects.findIndex((el) => el.name === projectName);

    if(projects[index].frequency !== 0) {
      projects[index].frequency --
      this.setState({projects: projects})
    }
  }

  pickNextFocusItem = (focusItems = this.state.focusItems) => {
    if(areProjectsPending(this.state.projects, focusItems)) {
      this.props.history.push('/projects')
      return null
    } else {
      this.props.history.push('/')
      const contractItems = getNextContractItems(focusItems, this.state.projects)
      const chronoItems = getChronoItems(contractItems)
      const items = chronoItems.length !== 0 ? chronoItems : contractItems

      if(items.length) {
        return (
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
    focusItems[index].dates = {...focusItems[index].dates, [dateType]: null, modified: Date.now()}

    this.sortMutable(focusItems)

    this.setState({focusItems: focusItems})
  }

  /**
  * Helpers
  */

  isCaretAtEdges = () => {
   return isCaretAtBeginningFieldItem() || isCaretAtEndFieldItem()
  }

  shiftDate = (datesObj, operator, offset) => {
    const dates = {...datesObj}
    let dateType = null;
    if(isCaretAtBeginningFieldItem()) {
      dateType = 'start';
    } else if (isCaretAtEndFieldItem()) {
      dateType = 'due';
    }
    if(dateType !== null) {
      let refTime = dates[dateType] ? DateTime.fromISO(dates[dateType]) : DateTime.local();
      dates[dateType] = refTime[operator](offset).toISODate()
      dates.modified = Date.now()
    }
    return dates;
  }

  sortMutable = debounce((focusItems) => {
    focusItems.sort((itemA, itemB) => itemB.dates.modified - itemA.dates.modified)
  }, 2000, {leading: true, trailing: false})

  initSearch = () => {
    this.onResetSearchHandler()
  }

}

export default withRouter(App);
