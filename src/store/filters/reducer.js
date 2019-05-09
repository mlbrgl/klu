/* eslint-disable no-param-reassign */
import produce from 'immer';
import { TOGGLE_DATE_FILTER } from '../actionTypes';

const reducer = produce(
  (filters, action) => {
    switch (action.type) {
      case TOGGLE_DATE_FILTER: {
        const { type } = action.payload;
        filters[type] = !filters[type];
        return filters;
      }
      // not necessary, added for lisibility
      default:
        return filters;
    }
  },
  { done: false, actionable: true, future: false },
);

export default reducer;
