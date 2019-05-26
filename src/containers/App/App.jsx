import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { DateTime } from 'luxon';
import { Route, Switch, withRouter } from 'react-router-dom';
import SearchApi from 'js-worker-search';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  isItemDone,
  isItemActionable,
  isItemFuture,
  isItemWithinProject,
} from '../../selectors/selectors';

import Frame from '../Frame/Frame';
import ContentWrapper from '../ContentWrapper/ContentWrapper';
import Filters from '../Filters/Filters';
import FocusItem from '../FocusItem/FocusItem';
import Projects from '../Projects/Projects';
import QuickEntry from '../../components/QuickEntry/QuickEntry';
import Actions from '../../components/Actions/Actions';
// import localforage from 'localforage';
// import { loadFromStorage, commitToStorage } from '../../helpers/storage';
// import { getInitialState, getNewFocusItem, buildIndex } from '../../store/store';
import { getNewFocusItem, getInitialState } from '../../store/store';
import * as actionCreatorsFocusItems from '../../store/focusItems/actionCreators';
import * as actionCreatorsApp from '../../store/app/actionCreators';

import './App.css';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

class App extends Component {
  constructor(props) {
    super(props);
    // TODO: remove state init (done in redux)
    this.state = getInitialState();
  }

  componentWillMount() {
    //   loadFromStorage()
    //     .then((state) => {
    //       // EXPORT (on prod)
    //       // localStorage.setItem('state', JSON.stringify(state))
    //       // IMPORT (on local)
    //       // state = JSON.parse(localStorage.getItem('state'))
    //       // for(let item in state){
    //       //   localforage.setItem(item, state[item])
    //       //   .catch((err) => { console.error(err) })
    //       // }
    this.searchApi = new SearchApi();
    //       if (state !== null) {
    //         // const filters = { done: false, actionable: true, future: false };
    //         this.setState(state);
    //         buildIndex(this.searchApi, state.focusItems);
    //       } else {
    //         this.setState(getInitialState());
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Escape': {
          const { history, toggleFocus } = this.props;
          toggleFocus();
          history.push('/');
          break;
        }
        default:
      }
    });

    //   // Makes sure multiple instances of the app remain in sync
    //   // Two caveats:
    //   // - sync will only happen when the window regains focus, even if it is not hidden
    //   // - if the focus was not on the app frame before moving onto another tab / window,
    //   // coming back to that tab will not trigger onfocus. Once the app regains focus
    //   // (e.g. click within the app frame), onfocus is triggered and the app updates.
    //   window.onfocus = () => {
    //     loadFromStorage().then((state) => {
    //       // No need to check for state === null since the app has at least been
    //       // mounted once (before it lost focus) and the state initialized in componentWillMount
    //       this.setState(state);
    //       // the index needs to be rebuilt here as it is not saved to the state
    //       buildIndex(this.searchApi, state.focusItems);
    //     });
    //   };
  }

  // componentDidUpdate() {
  //   commitToStorage(this.state);
  // }

  /*
   * HANDLERS: QUICK ENTRY
   */

  onEnterQuickEntryHandler = (itemValue) => {
    const newItem = getNewFocusItem(DateTime.local(), itemValue);
    const { addFocusItem } = this.props;
    addFocusItem(newItem);

    this.searchApi.indexDocument(newItem.id, newItem.value);
    this.setState({ searchQuery: '', searchResults: [] });
  };

  onInputQuickEntryHandler = (value) => {
    this.setState({ searchQuery: value });
  };

  onResetSearchHandler = () => {
    this.setState({ searchQuery: '', searchResults: [] });
  };

  onSearchHandler = () => {
    const { searchQuery } = this.state;
    if (searchQuery) {
      this.searchApi.search(searchQuery).then((results) => {
        this.setState({ searchResults: results });
      });
    } else {
      this.onResetSearchHandler();
    }
  };

  /*
   * HANDLERS: ITEMS
   */

  onInputEditableItemHandler = debounce(
    (innerHTML, itemId) => {
      const { editFocusItem } = this.props;
      editFocusItem(DateTime.local(), innerHTML, itemId);
      this.searchApi.indexDocument(itemId, innerHTML);
    },
    250,
    // leading: updating modified date straightaway so that next item
    // created appears on top of the list (only really necessary for high speed tests)
    { leading: true, trailing: true },
  );

  /*
   * COMPONENT TREES
   */

  renderQuickEntry = () => {
    const { searchQuery } = this.state;
    const { isFocusOn } = this.props;
    if (!isFocusOn) {
      return (
        <QuickEntry
          value={searchQuery}
          onInputHandler={this.onInputQuickEntryHandler}
          onEnterHandler={this.onEnterQuickEntryHandler}
          onResetSearchHandler={this.onResetSearchHandler}
          onSearchHandler={this.onSearchHandler}
        />
      );
    }
    return null;
  };

  renderFilters = () => {
    const { isFocusOn } = this.props;
    return !isFocusOn ? <Filters /> : null;
  };

  renderFocusItems = () => {
    const {
      filters, isFocusOn, focusItemId, projectName, focusItems, history,
    } = this.props;
    const { searchQuery, searchResults } = this.state;
    const now = DateTime.local();

    return focusItems
      .filter((item) => {
        if (isFocusOn) {
          return item.id === focusItemId;
        }
        if (!searchQuery || searchResults.find(res => item.id === res)) {
          return (
            (!projectName || isItemWithinProject(item, { name: projectName }))
            && ((filters.done && isItemDone(item))
              || (filters.actionable && isItemActionable(now, item))
              || (filters.future && isItemFuture(now, item)))
          );
        }
        return false;
      })
      .slice(0, projectName || searchQuery ? Infinity : 20)
      .map(item => (
        <FocusItem
          key={item.id}
          onInputEditableItemHandler={this.onInputEditableItemHandler}
          item={item}
          history={history}
        />
      ));
  };

  render() {
    // // before the state is loaded from external storage, it is null
    // if (this.state !== null) {
    const { history } = this.props;
    return (
      <div className="app">
        <Frame>
          <Route path="/" exact render={this.renderQuickEntry} />
          <Route path="/" exact render={this.renderFilters} />
          <ContentWrapper>
            <Switch>
              <Route path="/" exact render={this.renderFocusItems} />
              <Route path="/projects" component={Projects} />
            </Switch>
          </ContentWrapper>
          <Actions history={history} />
        </Frame>
      </div>
    );
    // }
    // return null;
  }
}

App.defaultProps = {
  projectName: null,
  focusItemId: null,
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
  isFocusOn: PropTypes.bool.isRequired,
  focusItemId: PropTypes.number,
  projectName: PropTypes.string,
  addFocusItem: PropTypes.func.isRequired,
  focusItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
  editFocusItem: PropTypes.func.isRequired,
  toggleFocus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  focusItems: state.focusItems,
  isFocusOn: state.app.isFocusOn,
  focusItemId: state.app.focusItemId,
  filters: state.app.filters,
  projectName: state.projectFilter,
});

export default withRouter(
  connect(
    mapStateToProps,
    { ...actionCreatorsFocusItems, ...actionCreatorsApp },
  )(App),
);
