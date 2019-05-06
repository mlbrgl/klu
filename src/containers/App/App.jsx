import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { DateTime } from 'luxon';
import { Route, Switch, withRouter } from 'react-router-dom';
import SearchApi from 'js-worker-search';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  isCaretAtBeginningFieldItem,
  isCaretAtEndFieldItem,
  setCaretPosition,
  getRandomElement,
  isCaretAtEdges,
  shiftDate,
  sortMutable,
} from '../../helpers/common';
import Frame from '../Frame/Frame';
import ContentWrapper from '../ContentWrapper/ContentWrapper';
import Filters from '../Filters/Filters';
import FocusItem from '../FocusItem/FocusItem';
import Projects from '../Projects/Projects';
import Dates from '../Dates/Dates';
import QuickEntry from '../../components/QuickEntry/QuickEntry';
import Project from '../../components/Project/Project';
import Editable from '../../components/Editable/Editable';
import Actions from '../../components/Actions/Actions';
import Category from '../../components/Category/Category';
// import localforage from 'localforage';

import { loadFromStorage, commitToStorage } from '../../helpers/storage';
import { getInitialState, getNewFocusItem, buildIndex } from '../../store/store';

import {
  pickOverdue,
  pickDueTodayTomorrow,
  pickDueNextTwoWeeks,
  isItemDone,
  isItemActionable,
  isItemFuture,
  getProjectNameFromItem,
  getNextContractItems,
  getChronoItems,
  isItemWithinProject,
  areProjectsPending,
} from '../../selectors/selectors';

import './App.css';
import { SET_PROJECT_FILTER } from '../../store/actionTypes';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.categories = [
      { name: 'inbox', icon: 'inbox' },
      { name: 'peak', icon: 'area-graph' },
      { name: 'trough', icon: 'calculator' },
      { name: 'recovery', icon: 'palette' },
    ];
    this.initSearch();
  }

  componentWillMount() {
    loadFromStorage()
      .then((state) => {
        // EXPORT (on prod)
        // localStorage.setItem('state', JSON.stringify(state))
        // IMPORT (on local)
        // state = JSON.parse(localStorage.getItem('state'))
        // for(let item in state){
        //   localforage.setItem(item, state[item])
        //   .catch((err) => { console.error(err) })
        // }
        this.searchApi = new SearchApi();
        if (state !== null) {
          // const filters = { done: false, actionable: true, future: false };
          this.setState(state);
          buildIndex(this.searchApi, state.focusItems);
        } else {
          this.setState(getInitialState());
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      const { deleteItemId } = this.state;
      switch (event.key) {
        case 'Escape':
          if (deleteItemId !== null) {
            this.setState({ deleteItemId: null });
          } else {
            const { history } = this.props;
            this.onToggleFocusItemHandler();
            history.push('/');
          }
          break;
        default:
      }
    });

    // Makes sure multiple instances of the app remain in sync
    // Two caveats:
    // - sync will only happen when the window regains focus, even if it is not hidden
    // - if the focus was not on the app frame before moving onto another tab / window,
    // coming back to that tab will not trigger onfocus. Once the app regains focus
    // (e.g. click within the app frame), onfocus is triggered and the app updates.
    window.onfocus = () => {
      loadFromStorage().then((state) => {
        // No need to check for state === null since the app has at least been
        // mounted once (before it lost focus) and the state initialized in componentWillMount
        this.setState(state);
        // the index needs to be rebuilt here as it is not saved to the state
        buildIndex(this.searchApi, state.focusItems);
      });
    };
  }

  componentDidUpdate() {
    commitToStorage(this.state);
  }

  /*
   * HANDLERS: QUICK ENTRY
   */

  onEnterQuickEntryHandler = (itemValue) => {
    const newItem = getNewFocusItem(itemValue);
    let { focusItems } = this.state;
    focusItems = [newItem, ...focusItems];
    this.onResetSearchHandler();

    this.searchApi.indexDocument(newItem.id, newItem.value);
    this.setState({ focusItems });
  };

  onRemoveProjectFilterHandler = () => {
    const { history } = this.props;
    history.push('/');
  };

  onResetSearchHandler = () => {
    this.searchQuery = '';
    this.searchResults = [];
  };

  onSearchHandler = (searchQuery) => {
    if (searchQuery) {
      this.searchApi.search(searchQuery).then((results) => {
        this.searchResults = results;
        this.searchQuery = searchQuery;
        this.forceUpdate();
      });
    } else {
      this.onResetSearchHandler();
      this.forceUpdate();
    }
  };

  /*
   * HANDLERS: ITEMS
   */

  onKeyDownEditableItemHandler = (event, itemId) => {
    const { focusItems, deleteItemId } = this.state;
    const { setProjectFilter } = this.props;
    const index = focusItems.findIndex(el => el.id === itemId);

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (event.metaKey || event.ctrlKey) {
          if (event.shiftKey) {
            this.onDoneItemHandler(itemId);
          } else {
            setProjectFilter(getProjectNameFromItem(focusItems[index]));
          }
        } else if (deleteItemId === null) {
          this.onToggleFocusItemHandler(itemId);
        } else if (deleteItemId !== null) {
          this.onDeletedItemHandler(itemId, event.key);
        }
        break;

      case 'Backspace':
      case 'Delete':
        if (focusItems[index].value.length === 0) {
          event.preventDefault();
          this.onDeletedItemHandler(itemId, event.key);
        } else if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          this.setState({ deleteItemId: itemId });
        }
        break;

      case 'ArrowUp':
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          if (isCaretAtEdges()) {
            focusItems[index].dates = shiftDate(
              focusItems[index].dates,
              'plus',
              event.altKey ? { weeks: 1 } : { days: 1 },
            );

            sortMutable(focusItems);
            this.setState({ focusItems });
          }
        }
        break;

      case 'ArrowDown':
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          if (isCaretAtEdges()) {
            focusItems[index].dates = shiftDate(
              focusItems[index].dates,
              'minus',
              event.altKey ? { weeks: 1 } : { days: 1 },
            );
            sortMutable(focusItems);
            this.setState({ focusItems });
          }
        }
        break;

      case 'ArrowRight':
        if (!event.shiftKey) {
          if (event.metaKey || event.ctrlKey) {
            if (event.target.childNodes[0]) {
              // field not empty
              setCaretPosition(event.target.childNodes[0], event.target.childNodes[0].length);
            }
          } else if (isCaretAtEndFieldItem()) {
            // cycle through categories
            const idxOfCurrentCategory = focusItems[index].category !== null
              ? this.categories
                .map(category => category.name)
                .indexOf(focusItems[index].category.name)
              : 0;
            const idxOfNextCategory = (idxOfCurrentCategory + 1) % this.categories.length;
            focusItems[index].category = this.categories[idxOfNextCategory];
            this.setState({ focusItems });
          }
        }
        break;

      case 'ArrowLeft':
        if (!event.shiftKey) {
          if (event.metaKey || event.ctrlKey) {
            setCaretPosition(event.target.childNodes[0], 0);
          } else if (isCaretAtBeginningFieldItem()) {
            this.setState({ deleteItemId: itemId });
          }
        }
        break;
      default:
    }
  };

  onInputEditableItemHandler = debounce((innerHTML, itemId) => {
    const { focusItems } = this.state;
    const index = focusItems.findIndex(el => el.id === itemId);
    focusItems[index].value = innerHTML;
    focusItems[index].dates.modified = Date.now();
    sortMutable(focusItems);

    this.searchApi.indexDocument(itemId, innerHTML);
    this.setState({ focusItems });
  }, 250);

  onDeletedItemHandler = (itemId) => {
    const { focusItems, isFocusOn } = this.state;
    let { focusItemId } = this.state;

    const index = focusItems.findIndex(el => el.id === itemId);

    focusItems.splice(index, 1);
    if (focusItems.length === 0) {
      focusItems[0] = getNewFocusItem();
      focusItemId = null;
    } else if (focusItemId === itemId) {
      focusItemId = this.pickNextFocusItem(focusItems);
    }

    this.setState({
      focusItems,
      deleteItemId: null,
      focusItemId,
      isFocusOn: focusItemId === null ? false : isFocusOn,
    });
  };

  // eslint-disable-next-line react/destructuring-assignment
  onToggleFocusItemHandler = (itemId = this.state.focusItemId) => {
    const { isFocusOn } = this.state;
    this.setState({
      focusItemId: itemId,
      isFocusOn: itemId === null ? false : !isFocusOn,
    });
  };

  onFocusNextItemHandler = () => {
    const newItemId = this.pickNextFocusItem();

    this.setState({
      focusItemId: newItemId,
      isFocusOn: newItemId !== null,
    });
  };

  onDoneItemHandler = (itemId) => {
    const { focusItems, isFocusOn } = this.state;
    const index = focusItems.findIndex(el => el.id === itemId);

    if (!focusItems[index].dates.done) {
      focusItems[index].dates = {
        ...focusItems[index].dates,
        done: DateTime.local().toISODate(),
        modified: Date.now(),
      };
      let { focusItemId } = this.state;
      focusItemId = focusItemId === itemId ? this.pickNextFocusItem(focusItems) : focusItemId;

      sortMutable(focusItems);

      this.setState({
        focusItems,
        focusItemId,
        isFocusOn: focusItemId === null ? false : isFocusOn,
      });
    }
  };

  onDoneAndWaitingItemHandler = (itemId) => {
    const { focusItems } = this.state;
    const index = focusItems.findIndex(el => el.id === itemId);
    const { category } = focusItems[index];

    focusItems[index].dates = {
      ...focusItems[index].dates,
      done: DateTime.local().toISODate(),
      modified: Date.now(),
    };

    const newItem = getNewFocusItem(`@qw ${focusItems[index].value}`);
    const futureDate = DateTime.local()
      .plus({ days: 3 })
      .toISODate();
    focusItems.unshift(newItem);
    focusItems[0].dates = { ...focusItems[0].dates, start: futureDate, due: futureDate };
    focusItems[0].category = category;
    const focusItemId = newItem.id;

    sortMutable(focusItems);

    this.setState({
      focusItems,
      focusItemId,
    });
  };

  onRemoveDateHandler = (itemId, dateType) => {
    const { focusItems } = this.state;
    const index = focusItems.findIndex(el => el.id === itemId);
    focusItems[index].dates = {
      ...focusItems[index].dates,
      [dateType]: null,
      modified: Date.now(),
    };

    sortMutable(focusItems);

    this.setState({ focusItems });
  };

  // eslint-disable-next-line react/destructuring-assignment
  pickNextFocusItem(focusItems = this.state.focusItems) {
    const { projects } = this.state;
    const { history } = this.props;
    if (areProjectsPending(projects, focusItems)) {
      history.push('/projects');
      return null;
    }
    history.push('/');
    const contractItems = getNextContractItems(focusItems, projects);
    const chronoItems = getChronoItems(contractItems);
    const items = chronoItems.length !== 0 ? chronoItems : contractItems;

    if (items.length) {
      return (
        pickOverdue(items)
        || pickDueTodayTomorrow(items)
        || pickDueNextTwoWeeks(items)
        || getRandomElement(items).id
      );
    }
    return null;
  }

  initSearch() {
    this.onResetSearchHandler();
  }

  /*
   * COMPONENT TREES
   */

  renderQuickEntry = () => {
    const { isFocusOn } = this.state;
    if (!isFocusOn) {
      return (
        <QuickEntry
          initValue={this.searchQuery}
          onEnterHandler={this.onEnterQuickEntryHandler}
          onResetSearchHandler={this.onResetSearchHandler}
          onSearchHandler={this.onSearchHandler}
        />
      );
    }
    return null;
  };

  renderFilters = () => {
    const { isFocusOn } = this.state;
    return !isFocusOn ? <Filters /> : null;
  };

  renderFocusItems = () => {
    const { projectName } = this.props;
    const {
      focusItems, isFocusOn, focusItemId, deleteItemId,
    } = this.state;

    const { filters } = this.props;

    return focusItems
      .filter((item) => {
        if (isFocusOn) {
          return item.id === focusItemId;
        }
        if (!this.searchQuery || this.searchResults.find(res => item.id === res)) {
          return (
            (!projectName || isItemWithinProject(item, { name: projectName }))
            && ((filters.done && isItemDone(item))
              || (filters.actionable && isItemActionable(item))
              || (filters.future && isItemFuture(item)))
          );
        }
        return false;
      })
      .slice(0, projectName || this.searchQuery ? Infinity : 20)
      .map((item) => {
        const isFocusOnItem = !!(item.id === focusItemId && isFocusOn);
        const isDeleteOnItem = deleteItemId === item.id;

        return (
          <FocusItem
            isFocusOn={isFocusOnItem}
            key={item.id}
            category={item.category}
            dates={item.dates}
            isDeleteOn={isDeleteOnItem}
          >
            <Category
              name={item.category.name}
              icon={item.category.icon}
              isFocusOn={isFocusOn}
              isDeleteOn={isDeleteOnItem}
            />

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
              itemId={item.id}
            />
          </FocusItem>
        );
      });
  };

  renderProjects = () => {
    const { focusItems } = this.state;
    return <Projects focusItems={focusItems} />;
  };

  render() {
    // before the state is loaded from external storage, it is null
    if (this.state !== null) {
      const { isFocusOn, focusItemId } = this.state;
      return (
        <div className="app">
          <Frame>
            <Route path="/" exact render={this.renderQuickEntry} />
            <Route path="/" exact render={this.renderFilters} />
            <ContentWrapper isFocusOn={isFocusOn}>
              <Switch>
                <Route path="/" exact render={this.renderFocusItems} />
                <Route path="/projects" render={this.renderProjects} />
              </Switch>
              <Actions
                onDoneItem={this.onDoneItemHandler}
                onDoneAndWaitingItem={this.onDoneAndWaitingItemHandler}
                onFocusNextItem={this.onFocusNextItemHandler}
                itemId={focusItemId}
                isFocusOn={isFocusOn}
              />
            </ContentWrapper>
          </Frame>
        </div>
      );
    }
    return null;
  }
}

App.defaultProps = {
  projectName: null,
};

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  filters: PropTypes.shape({
    done: PropTypes.bool,
    actionable: PropTypes.bool,
    future: PropTypes.bool,
  }).isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  projectName: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { filters, projectName } = state;
  return {
    filters,
    projectName,
  };
};

const mapDispatchToProps = dispatch => ({
  setProjectFilter: name => dispatch({ type: SET_PROJECT_FILTER, payload: { name } }),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
