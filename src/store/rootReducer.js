import { combineReducers } from 'redux';
import app from './app/reducer';
import projects from './projects/reducer';
import projectFilter from './projectFilter/reducer';
import focusItems from './focusItems/reducer';

const rootReducer = combineReducers({
  app,
  projectFilter,
  projects,
  focusItems,
});

export default rootReducer;
