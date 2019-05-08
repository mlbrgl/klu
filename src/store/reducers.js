/* eslint-disable no-param-reassign */
import produce from 'immer';
import { getInitialState } from './store';
import {
  TOGGLE_DATE_FILTER,
  UPDATE_PROJECTS,
  UP_PROJECT_FREQUENCY,
  SET_PROJECT_STATUS,
  DOWN_PROJECT_FREQUENCY,
  SET_PROJECT_FILTER,
} from './actionTypes';
import { getUpdatedProjects } from '../selectors/selectors';
import { PROJECT_COMPLETED, PROJECT_PAUSED } from '../helpers/constants';

const rootReducer = produce((draft, action) => {
  switch (action.type) {
    case TOGGLE_DATE_FILTER: {
      const { type } = action.payload;
      draft.filters[type] = !draft.filters[type];
      return draft;
    }
    case UPDATE_PROJECTS: {
      const { focusItems } = action.payload;
      draft.projects = getUpdatedProjects(draft.projects, focusItems);
      return draft;
    }
    case UP_PROJECT_FREQUENCY: {
      const { name } = action.payload;
      const { projects } = draft;
      const index = projects.findIndex(el => el.name === name);
      projects[index].frequency += 1;
      return draft;
    }
    case DOWN_PROJECT_FREQUENCY: {
      const { name } = action.payload;
      const { projects } = draft;
      const index = projects.findIndex(el => el.name === name);
      if (projects[index].frequency !== 0) {
        projects[index].frequency -= 1;
      }
      return draft;
    }
    case SET_PROJECT_STATUS: {
      const { name, status } = action.payload;
      const { projects } = draft;
      const index = projects.findIndex(el => el.name === name);
      projects[index].status = status;
      if (status === PROJECT_COMPLETED || status === PROJECT_PAUSED) {
        projects[index].frequency = 0;
      }
      return draft;
    }
    case SET_PROJECT_FILTER: {
      const { name } = action.payload;
      draft.projectName = name || null;
      return draft;
    }
    // not necessary, added for lisibility
    default:
      return draft;
  }
}, getInitialState());

export default rootReducer;
