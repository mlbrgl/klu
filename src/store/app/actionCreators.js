import { TOGGLE_DATE_FILTER, SET_FOCUS, TOGGLE_FOCUS } from '../actionTypes';

export const toggleDateFilter = type => ({ type: TOGGLE_DATE_FILTER, payload: { type } });

export const setFocus = ({ isFocusOn, focusItemId }) => ({
  type: SET_FOCUS,
  payload: { isFocusOn, focusItemId },
});

export const toggleFocus = () => ({
  type: TOGGLE_FOCUS,
});
