/* eslint-disable no-param-reassign */
import produce from 'immer';
import { TOGGLE_DATE_FILTER, SET_FOCUS, TOGGLE_FOCUS } from '../actionTypes';

export const setFocus = (isFocusOn, focusItemId, app) => {
  isFocusOn = isFocusOn === undefined ? app.isFocusOn : isFocusOn;
  focusItemId = focusItemId === undefined ? app.focusItemId : focusItemId;

  app.isFocusOn = isFocusOn ? focusItemId !== null : isFocusOn;
  app.focusItemId = focusItemId;
};

const reducer = produce(
  (app, action) => {
    switch (action.type) {
      case TOGGLE_DATE_FILTER: {
        const { type } = action.payload;
        const { filters } = app;
        filters[type] = !filters[type];
        return app;
      }
      case SET_FOCUS: {
        const { isFocusOn, focusItemId } = action.payload;
        setFocus(isFocusOn, focusItemId, app);

        return app;
      }
      case TOGGLE_FOCUS: {
        app.isFocusOn = !app.isFocusOn ? app.focusItemId !== null : !app.isFocusOn;

        return app;
      }
      // not necessary, added for lisibility
      default:
        return app;
    }
  },
  {
    isFocusOn: false,
    focusItemId: null,
    filters: { done: false, actionable: true, future: false },
  },
);

export default reducer;
