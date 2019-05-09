import { SET_PROJECT_FILTER } from '../actionTypes';

export const setProjectFilter = projectName => ({
  type: SET_PROJECT_FILTER,
  payload: { projectName },
});

export const resetProjectFilter = () => setProjectFilter(null);
