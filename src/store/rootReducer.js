import { combineReducers } from 'redux';
import filters from './filters/reducer';
import projects from './projects/reducer';
import projectFilter from './projectFilter/reducer';

const rootReducer = combineReducers({
  filters,
  projectFilter,
  projects,
});

export default rootReducer;
