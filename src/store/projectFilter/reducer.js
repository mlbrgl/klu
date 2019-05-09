/* eslint-disable no-param-reassign */
import produce from 'immer';
import { SET_PROJECT_FILTER } from '../actionTypes';

const reducer = produce((projectFilter, action) => {
  switch (action.type) {
    case SET_PROJECT_FILTER: {
      const { projectName } = action.payload;
      return projectName || null;
    }
    // not necessary, added for lisibility
    default:
      return projectFilter;
  }
}, null);

export default reducer;
