import { getInitialState } from './store';
import {
  TOGGLE_DATE_FILTER,
  UPDATE_PROJECTS,
  UP_PROJECT_FREQUENCY,
  SET_PROJECT_STATUS,
  DOWN_PROJECT_FREQUENCY,
} from './actionTypes';
import { getUpdatedProjects } from '../selectors/selectors';
import { PROJECT_COMPLETED, PROJECT_PAUSED } from '../helpers/constants';

const rootReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case TOGGLE_DATE_FILTER: {
      const { type } = action.payload;
      const filters = { ...state.filters };
      filters[type] = !filters[type];
      return { ...state, filters };
    }
    case UPDATE_PROJECTS: {
      const { focusItems } = action.payload;
      return { ...state, projects: getUpdatedProjects(state.projects, focusItems) };
    }
    case UP_PROJECT_FREQUENCY: {
      const { name } = action.payload;
      const projects = [...state.projects];
      const index = projects.findIndex(el => el.name === name);
      projects[index].frequency += 1;
      return { ...state, projects };
    }
    case DOWN_PROJECT_FREQUENCY: {
      const { name } = action.payload;
      const projects = [...state.projects];
      const index = projects.findIndex(el => el.name === name);
      if (projects[index].frequency !== 0) {
        projects[index].frequency -= 1;
      }
      return { ...state, projects };
    }
    case SET_PROJECT_STATUS: {
      const { name, status } = action.payload;
      const projects = [...state.projects];
      const index = projects.findIndex(el => el.name === name);
      // TODO check equality here
      projects[index].status = status;
      if (status === PROJECT_COMPLETED || status === PROJECT_PAUSED) {
        projects[index].frequency = 0;
      }
      return { ...state, projects };
    }

    default:
      return state;
  }
};

export default rootReducer;
