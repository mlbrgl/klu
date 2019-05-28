import React, { Component } from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Frame from '../Frame/Frame';
import ContentWrapper from '../ContentWrapper/ContentWrapper';
import Filters from '../Filters/Filters';
import FocusItems from '../FocusItems/FocusItems';
import Projects from '../Projects/Projects';
import QuickEntry from '../QuickEntry/QuickEntry';
import Actions from '../Actions/Actions';
// import localforage from 'localforage';
// import { loadFromStorage, commitToStorage } from '../../helpers/storage';
// import { getInitialState, getNewFocusItem, buildIndex } from '../../store/store';
import { getInitialState } from '../../store/store';
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
    // this.searchApi = new SearchApi();
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
   * COMPONENT TREES
   */

  renderQuickEntry = () => {
    const { isFocusOn, searchApi } = this.props;
    if (!isFocusOn) {
      return <QuickEntry searchApi={searchApi} />;
    }
    return null;
  };

  renderFilters = () => {
    const { isFocusOn } = this.props;
    return !isFocusOn ? <Filters /> : null;
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
              <Route path="/" exact render={() => <FocusItems history={history} />} />
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

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFocusOn: PropTypes.bool.isRequired,
  toggleFocus: PropTypes.func.isRequired,
  searchApi: PropTypes.shape({
    search: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
});

export default withRouter(
  connect(
    mapStateToProps,
    { ...actionCreatorsApp },
  )(App),
);
