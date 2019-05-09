/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  UPDATE_PROJECTS,
  UP_PROJECT_FREQUENCY,
  SET_PROJECT_STATUS,
  DOWN_PROJECT_FREQUENCY,
} from '../actionTypes';
import { getUpdatedProjects } from '../../selectors/selectors';
import { PROJECT_COMPLETED, PROJECT_PAUSED } from '../../helpers/constants';

const reducer = produce((projects, action) => {
  switch (action.type) {
    case UPDATE_PROJECTS: {
      const { focusItems } = action.payload;
      return getUpdatedProjects(projects, focusItems);
    }
    case UP_PROJECT_FREQUENCY: {
      const { name } = action.payload;
      const index = projects.findIndex(el => el.name === name);
      projects[index].frequency += 1;
      return projects;
    }
    case DOWN_PROJECT_FREQUENCY: {
      const { name } = action.payload;
      const index = projects.findIndex(el => el.name === name);
      if (projects[index].frequency !== 0) {
        projects[index].frequency -= 1;
      }
      return projects;
    }
    case SET_PROJECT_STATUS: {
      const { name, status } = action.payload;
      const index = projects.findIndex(el => el.name === name);
      projects[index].status = status;
      if (status === PROJECT_COMPLETED || status === PROJECT_PAUSED) {
        projects[index].frequency = 0;
      }
      return projects;
    }
    // not necessary, added for lisibility
    default:
      return projects;
  }
}, []);

export default reducer;
