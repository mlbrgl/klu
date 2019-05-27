import { DateTime } from 'luxon';
import { areProjectsPending, getNextEligibleItems } from '../../selectors/selectors';
import { updateProjects } from '../projects/actionCreators';
import { getRandomElement } from '../../helpers/common';
import {
  ADD_FOCUS_ITEM,
  INC_START_DATE_FOCUS_ITEM,
  INC_DUE_DATE_FOCUS_ITEM,
  DEC_START_DATE_FOCUS_ITEM,
  DEC_DUE_DATE_FOCUS_ITEM,
  EDIT_FOCUS_ITEM,
  DELETE_FOCUS_ITEM,
  MARK_DONE_FOCUS_ITEM,
  REMOVE_DATE_FOCUS_ITEM,
  NEXT_CATEGORY_FOCUS_ITEM,
} from '../actionTypes';
import { getNewFocusItem } from '../store';
import { setFocus } from '../app/actionCreators';

export const focusingNextFocusItem = history => (dispatch, getState) => {
  const now = DateTime.local();
  dispatch(updateProjects(now));

  const { projects } = getState();
  if (areProjectsPending(projects)) {
    history.push('/projects');
    return;
  }
  history.push('/');
  const { focusItems } = getState();
  const nextEligibleItems = getNextEligibleItems(now, focusItems, projects);
  if (nextEligibleItems.length) {
    dispatch(setFocus({ isFocusOn: true, focusItemId: getRandomElement(nextEligibleItems).id }));
  } else {
    dispatch(setFocus({ focusItemId: null }));
  }
};

export const addFocusItem = focusItem => ({
  type: ADD_FOCUS_ITEM,
  payload: { focusItem },
});

export const addingFutureWaitingFocusItem = (now, itemId) => (dispatch, getState) => {
  const baseFocusItem = getState().focusItems.find(item => item.id === itemId);
  const futureDate = now.plus({ days: 3 }).toISODate();

  const newFocusItem = getNewFocusItem(now);
  newFocusItem.value = `@qw ${baseFocusItem.value}`;
  newFocusItem.category = baseFocusItem.category;
  newFocusItem.dates.start = futureDate;
  newFocusItem.dates.due = futureDate;

  dispatch(addFocusItem(newFocusItem));
  dispatch(setFocus({ focusItemId: newFocusItem.id }));
};

export const editFocusItem = (now, value, itemId) => ({
  type: EDIT_FOCUS_ITEM,
  payload: { now, value, itemId },
});

export const _deleteFocusItem = itemId => ({
  type: DELETE_FOCUS_ITEM,
  payload: { itemId },
});

export const deletingFocusItem = (history, itemId) => (dispatch, getState) => {
  dispatch(_deleteFocusItem(itemId));
  const {
    app: { focusItemId },
  } = getState();
  if (focusItemId === itemId) {
    dispatch(focusingNextFocusItem(history));
  }
};

export const _markDoneFocusItem = (now, itemId) => ({
  type: MARK_DONE_FOCUS_ITEM,
  payload: { now, itemId },
});

export const markingDoneFocusItem = (history, itemId) => (dispatch, getState) => {
  dispatch(_markDoneFocusItem(DateTime.local(), itemId));
  const {
    app: { focusItemId },
  } = getState();
  if (focusItemId === itemId) {
    dispatch(focusingNextFocusItem(history));
  }
};

export const incStartDateFocusItem = (now, quantity, itemId) => ({
  type: INC_START_DATE_FOCUS_ITEM,
  payload: { now, quantity, itemId },
});

export const incDueDateFocusItem = (now, quantity, itemId) => ({
  type: INC_DUE_DATE_FOCUS_ITEM,
  payload: { now, quantity, itemId },
});

export const decStartDateFocusItem = (now, quantity, itemId) => ({
  type: DEC_START_DATE_FOCUS_ITEM,
  payload: { now, quantity, itemId },
});

export const decDueDateFocusItem = (now, quantity, itemId) => ({
  type: DEC_DUE_DATE_FOCUS_ITEM,
  payload: { now, quantity, itemId },
});

export const removeDateFocusItem = (now, dateType, itemId) => ({
  type: REMOVE_DATE_FOCUS_ITEM,
  payload: { now, dateType, itemId },
});
export const nextCategoryFocusItem = (now, itemId, categories) => ({
  type: NEXT_CATEGORY_FOCUS_ITEM,
  payload: { now, itemId, categories },
});
