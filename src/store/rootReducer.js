import { combineReducers } from 'redux';
import app from './app/reducer';
import projects from './projects/reducer';
import focusItems from './focusItems/reducer';

const rootReducer = combineReducers({
  app,
  projects,
  focusItems,
});

export default rootReducer;
