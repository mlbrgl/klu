import {
  TOGGLE_DATE_FILTER, SET_FOCUS, TOGGLE_FOCUS, RESET_SEARCH, SEARCH,
} from '../actionTypes';

export const toggleDateFilter = type => ({ type: TOGGLE_DATE_FILTER, payload: { type } });

export const setFocus = ({ isFocusOn, focusItemId }) => ({
  type: SET_FOCUS,
  payload: { isFocusOn, focusItemId },
});

export const toggleFocus = () => ({
  type: TOGGLE_FOCUS,
});

export const resetSearch = () => ({
  type: RESET_SEARCH,
});

export const searching = (searchQuery, searchApi) => (dispatch) => {
  if (searchQuery) {
    searchApi.search(searchQuery).then((searchResults) => {
      dispatch({
        type: SEARCH,
        payload: { searchQuery, searchResults },
      });
    });
  } else {
    dispatch(resetSearch());
  }
};
