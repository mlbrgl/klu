/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  UPDATE_PROJECTS,
  UP_PROJECT_FREQUENCY,
  SET_PROJECT_STATUS,
  DOWN_PROJECT_FREQUENCY,
} from '../actionTypes';
import { getProjectsInfo } from '../../selectors/selectors';
import {
  PROJECT_COMPLETED,
  PROJECT_PAUSED,
  PROJECT_ACTIVE,
  PROJECT_PENDING,
} from '../../helpers/constants';
import { getNewProject } from '../store';

const reducer = produce((projects, action) => {
  switch (action.type) {
    case UPDATE_PROJECTS: {
      const { now, focusItems } = action.payload;

      const projectsInfo = getProjectsInfo(now, focusItems);

      const updatedProjects = projectsInfo
        .map((projectInfo) => {
          let project = projects.find(p => p.name === projectInfo.name);
          // create a copy of project since we are returning a new state
          // (immer only allows mutating the state XOR returning a new one)
          project = project ? { ...project } : getNewProject(projectInfo.name);

          if (projectInfo.hasActionableItems) {
            project.status = PROJECT_ACTIVE;
          } else if (
            project.status !== PROJECT_PAUSED
            && project.status !== PROJECT_COMPLETED
          ) {
            project.status = PROJECT_PENDING;
          }
          return project;
        })
        .sort((p1, p2) => {
          if (p2.frequency - p1.frequency !== 0) {
            return p2.frequency - p1.frequency;
          }
          return p2.name < p1.name ? 1 : -1;
        });
      return updatedProjects;
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
