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
  ADD_FUTURE_WAITING_FOCUS_ITEM,
  REMOVE_DATE_FOCUS_ITEM,
  NEXT_CATEGORY_FOCUS_ITEM,
} from '../actionTypes';
import { getNewFocusItem } from '../store';

export const pickNextFocusItemId = history => (dispatch, getState) => {
  const now = DateTime.local();
  dispatch(updateProjects(now));

  const { projects } = getState();
  if (areProjectsPending(projects)) {
    history.push('/projects');
    return null;
  }
  history.push('/');
  const { focusItems } = getState();
  const nextEligibleItems = getNextEligibleItems(now, focusItems, projects);
  return nextEligibleItems.length !== 0 ? getRandomElement(nextEligibleItems).id : null;
};

export const addFocusItem = focusItem => ({
  type: ADD_FOCUS_ITEM,
  payload: { focusItem },
});

export const addFutureWaitingFocusItem = (now, itemId) => ({
  type: ADD_FUTURE_WAITING_FOCUS_ITEM,
  payload: { now, itemId },
});

export const editFocusItem = (now, value, itemId) => ({
  type: EDIT_FOCUS_ITEM,
  payload: { now, value, itemId },
});

export const deleteFocusItem = itemId => ({
  type: DELETE_FOCUS_ITEM,
  payload: { itemId },
});

export const deletingFocusItem = (history, focusItemId, itemId) => (dispatch, getState) => {
  dispatch(deleteFocusItem(itemId));
  let newFocusItemId = focusItemId;
  const { focusItems } = getState();
  if (focusItems.length === 0) {
    dispatch(addFocusItem(getNewFocusItem(DateTime.local())));
    newFocusItemId = null;
  } else if (focusItemId === itemId) {
    newFocusItemId = dispatch(pickNextFocusItemId(history));
  }
  return newFocusItemId;
};

export const markDoneFocusItem = (now, itemId) => ({
  type: MARK_DONE_FOCUS_ITEM,
  payload: { now, itemId },
});

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
