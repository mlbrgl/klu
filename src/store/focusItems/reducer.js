/* eslint-disable no-param-reassign */
import produce from 'immer';
import { DateTime } from 'luxon';
import {
  ADD_FOCUS_ITEM,
  INC_START_DATE_FOCUS_ITEM,
  INC_DUE_DATE_FOCUS_ITEM,
  EDIT_FOCUS_ITEM,
  DELETE_FOCUS_ITEM,
  DEC_START_DATE_FOCUS_ITEM,
  DEC_DUE_DATE_FOCUS_ITEM,
  MARK_DONE_FOCUS_ITEM,
  ADD_FUTURE_WAITING_FOCUS_ITEM,
  REMOVE_DATE_FOCUS_ITEM,
  NEXT_CATEGORY_FOCUS_ITEM,
} from '../actionTypes';
import { getNewFocusItem } from '../store';

export const addFutureWaitingFocusItem = (now, itemId, focusItems) => {
  const futureDate = now.plus({ days: 3 }).toISODate();
  const baseFocusItem = focusItems.find(item => item.id === itemId);
  const newFocusItem = getNewFocusItem(now, `@qw ${baseFocusItem.value}`);
  newFocusItem.category = baseFocusItem.category;

  focusItems.unshift(newFocusItem);
  const { dates } = focusItems[0];
  dates.start = futureDate;
  dates.due = futureDate;
};

export const shiftDateFocusItem = (dateType, operator, now, quantity, itemId, focusItems) => {
  const focusItem = focusItems.find(item => item.id === itemId);
  const { dates } = focusItem;
  const refTime = dates[dateType] ? DateTime.fromISO(dates[dateType]) : now;
  dates[dateType] = refTime[operator](quantity).toISODate();
  dates.modified = now.toMillis();
};

export const editFocusItem = (now, value, itemId, focusItems) => {
  const focusItem = focusItems.find(item => item.id === itemId);
  focusItem.value = value;
  focusItem.dates.modified = now.toMillis();
};

export const deleteFocusItem = (itemId, focusItems) => {
  const index = focusItems.findIndex(item => item.id === itemId);
  focusItems.splice(index, 1);
};

export const markDoneFocusItem = (now, itemId, focusItems) => {
  const index = focusItems.findIndex(item => item.id === itemId);
  const { dates } = focusItems[index];

  if (!dates.done) {
    dates.done = now.toISODate();
    dates.modified = now.toMillis();
  }
};

export const removeDateFocusItem = (now, dateType, itemId, focusItems) => {
  const focusItem = focusItems.find(item => item.id === itemId);
  const { dates } = focusItem;
  dates[dateType] = null;
  dates.modified = now.toMillis();
};

export const nextCategoryFocusItem = (now, itemId, categories, focusItems) => {
  const focusItem = focusItems.find(item => item.id === itemId);
  const idxOfCurrentCategory = focusItem.category !== null
    ? categories.map(category => category.name).indexOf(focusItem.category.name)
    : 0;
  const idxOfNextCategory = (idxOfCurrentCategory + 1) % categories.length;
  focusItem.category = categories[idxOfNextCategory];
};

const reducer = produce(
  (focusItems, action) => {
    switch (action.type) {
      case ADD_FOCUS_ITEM: {
        const { focusItem } = action.payload;
        focusItems.unshift(focusItem);
        return focusItems;
      }
      case ADD_FUTURE_WAITING_FOCUS_ITEM: {
        const { now, itemId } = action.payload;
        addFutureWaitingFocusItem(now, itemId, focusItems);
        return focusItems;
      }
      case EDIT_FOCUS_ITEM: {
        const { now, value, itemId } = action.payload;
        editFocusItem(now, value, itemId, focusItems);
        return focusItems;
      }
      case DELETE_FOCUS_ITEM: {
        const { itemId } = action.payload;
        deleteFocusItem(itemId, focusItems);
        return focusItems;
      }
      case MARK_DONE_FOCUS_ITEM: {
        const { now, itemId } = action.payload;
        markDoneFocusItem(now, itemId, focusItems);
        return focusItems;
      }
      case INC_START_DATE_FOCUS_ITEM: {
        const { now, itemId, quantity } = action.payload;
        shiftDateFocusItem('start', 'plus', now, quantity, itemId, focusItems);
        return focusItems;
      }
      case INC_DUE_DATE_FOCUS_ITEM: {
        const { now, itemId, quantity } = action.payload;
        shiftDateFocusItem('due', 'plus', now, quantity, itemId, focusItems);
        return focusItems;
      }
      case DEC_START_DATE_FOCUS_ITEM: {
        const { now, itemId, quantity } = action.payload;
        shiftDateFocusItem('start', 'minus', now, quantity, itemId, focusItems);
        return focusItems;
      }
      case DEC_DUE_DATE_FOCUS_ITEM: {
        const { now, itemId, quantity } = action.payload;
        shiftDateFocusItem('due', 'minus', now, quantity, itemId, focusItems);
        return focusItems;
      }
      case REMOVE_DATE_FOCUS_ITEM: {
        const { now, dateType, itemId } = action.payload;
        removeDateFocusItem(now, dateType, itemId, focusItems);
        return focusItems;
      }
      case NEXT_CATEGORY_FOCUS_ITEM: {
        const { now, itemId, categories } = action.payload;
        nextCategoryFocusItem(now, itemId, categories, focusItems);
        return focusItems;
      }
      // not necessary, added for lisibility
      default:
        return focusItems;
    }
  },
  [getNewFocusItem(DateTime.local())],
);

export default reducer;
