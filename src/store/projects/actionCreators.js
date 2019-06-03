import {
  UPDATE_PROJECTS,
  UP_PROJECT_FREQUENCY,
  DOWN_PROJECT_FREQUENCY,
  SET_PROJECT_STATUS,
  SET_PROJECTS,
} from '../actionTypes';

export const setProjects = projectsFromStorage => ({
  type: SET_PROJECTS,
  payload: { projectsFromStorage },
});

export const updateProjects = now => (dispatch, getState) => {
  const { focusItems } = getState();
  dispatch({
    type: UPDATE_PROJECTS,
    payload: { now, focusItems },
  });
};

export const upFrequency = name => ({ type: UP_PROJECT_FREQUENCY, payload: { name } });

export const downFrequency = name => ({ type: DOWN_PROJECT_FREQUENCY, payload: { name } });

export const setStatus = (name, status) => ({
  type: SET_PROJECT_STATUS,
  payload: { name, status },
});
