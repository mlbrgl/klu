import {
  UPDATE_PROJECTS,
  UP_PROJECT_FREQUENCY,
  DOWN_PROJECT_FREQUENCY,
  SET_PROJECT_STATUS,
} from '../actionTypes';

export const updateProjects = (now, focusItems) => ({
  // TODO: get focusItems from state
  type: UPDATE_PROJECTS,
  payload: { now, focusItems },
});

export const upFrequency = name => ({ type: UP_PROJECT_FREQUENCY, payload: { name } });

export const downFrequency = name => ({ type: DOWN_PROJECT_FREQUENCY, payload: { name } });

export const setStatus = (name, status) => ({
  type: SET_PROJECT_STATUS,
  payload: { name, status },
});
