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
import * as actionCreatorsProjects from '../../store/projects/actionCreators';

import './App.css';

class App extends Component {
  async componentDidMount() {
    const { setFocusItems, setProjects } = this.props;
    await loadFromStorage(setFocusItems, setProjects);
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
      await loadFromStorage(setFocusItems, setProjects);
    };
  }

  componentDidUpdate(prevProps) {
    const { focusItems, projects } = this.props;
    const stateToPersist = [{ focusItems }, { projects }];
    stateToPersist.forEach((slice) => {
      const sliceKey = Object.keys(slice)[0];
      // Only commit to storage if relevant slices of state have been changed
      if (slice[sliceKey].length !== 0 && slice[sliceKey] !== prevProps[sliceKey]) {
        commitToStorage(slice);
      }
    });
  }

  render() {
    const { history, isFocusOn } = this.props;
    return (
      <div>
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
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      frequency: PropTypes.number,
      status: PropTypes.number,
    }),
  ).isRequired,
  setProjects: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
  focusItems: state.focusItems,
  projects: state.projects,
});

export default withRouter(
  connect(
    mapStateToProps,
    { ...actionCreatorsApp, ...actionCreatorsFocusItems, ...actionCreatorsProjects },
  )(App),
);
