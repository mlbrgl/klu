import { getInitialState } from './store';
import { TOGGLE_DATE_FILTER } from './actionTypes';

const rootReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case TOGGLE_DATE_FILTER: {
      const { type } = action.payload;
      const filters = { ...state.filters };
      filters[type] = !filters[type];
      return { ...state, filters };
    }

    default:
      return state;
  }
};

export default rootReducer;
