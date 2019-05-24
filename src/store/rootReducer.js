import { combineReducers } from 'redux';
import filters from './filters/reducer';
import projects from './projects/reducer';
import projectFilter from './projectFilter/reducer';
import focusItems from './focusItems/reducer';

const rootReducer = combineReducers({
  filters,
  projectFilter,
  projects,
  focusItems,
});

export default rootReducer;
