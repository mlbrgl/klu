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
import { loadFromStorage, commitToStorage } from '../../helpers/storage';
import { searchApi } from '../../store/store';
import * as actionCreatorsApp from '../../store/app/actionCreators';
import * as actionCreatorsFocusItems from '../../store/focusItems/actionCreators';

import './App.css';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }

class App extends Component {
  async componentDidMount() {
    const { setFocusItems } = this.props;
    await loadFromStorage(setFocusItems);
    // EXPORT (on prod)
    // localStorage.setItem('state', JSON.stringify(state))
    // IMPORT (on local)
    // state = JSON.parse(localStorage.getItem('state'))
    // for(let item in state){
    //   localforage.setItem(item, state[item])
    //   .catch((err) => { console.error(err) })
    // }

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
    window.onfocus = async () => {
      await loadFromStorage(setFocusItems);
    };
  }

  componentDidUpdate(prevProps) {
    const { focusItems } = this.props;
    if (focusItems !== prevProps.focusItems) {
      commitToStorage({ focusItems });
    }
  }

  render() {
    const { history, isFocusOn } = this.props;
    return (
      <div className="app">
        <Frame>
          {!isFocusOn ? (
            <>
              <Route path="/" exact render={() => <QuickEntry searchApi={searchApi} />} />
              <Route path="/" exact component={Filters} />
            </>
          ) : null}
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
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFocusOn: PropTypes.bool.isRequired,
  toggleFocus: PropTypes.func.isRequired,
  setFocusItems: PropTypes.func.isRequired,
  focusItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
  focusItems: state.focusItems,
});

export default withRouter(
  connect(
    mapStateToProps,
    { ...actionCreatorsApp, ...actionCreatorsFocusItems },
  )(App),
);
