import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import SearchApi from 'js-worker-search';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './store/rootReducer';
import { index } from './store/middlewares';

const searchApi = new SearchApi();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, index(searchApi))));

ReactDOM.render(
  <Provider store={store}>
    <MemoryRouter>
      <App searchApi={searchApi} />
    </MemoryRouter>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
