import {
  TOGGLE_DATE_FILTER,
  UPDATE_PROJECTS,
  SET_PROJECT_FILTER,
  UP_PROJECT_FREQUENCY,
  DOWN_PROJECT_FREQUENCY,
  SET_PROJECT_STATUS,
} from './actionTypes';

export const toggleDateFilter = type => ({ type: TOGGLE_DATE_FILTER, payload: { type } });

export const updateProjects = focusItems => ({
  // TODO: get focusItems from state
  type: UPDATE_PROJECTS,
  payload: { focusItems },
});

export const setProjectFilter = name => ({ type: SET_PROJECT_FILTER, payload: { name } });

export const resetProjectFilter = () => setProjectFilter(null);

export const upFrequency = name => ({ type: UP_PROJECT_FREQUENCY, payload: { name } });

export const downFrequency = name => ({ type: DOWN_PROJECT_FREQUENCY, payload: { name } });

export const setStatus = (name, status) => ({
  type: SET_PROJECT_STATUS,
  payload: { name, status },
});
