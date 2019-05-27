import { ADD_FOCUS_ITEM, EDIT_FOCUS_ITEM } from './actionTypes';

export const index = searchApi => () => next => (action) => {
  let itemId = null;
  let value = null;

  switch (action.type) {
    case ADD_FOCUS_ITEM:
      ({ id: itemId } = action.payload.focusItem);
      ({ value } = action.payload.focusItem);
      searchApi.indexDocument(itemId, value);
      break;
    case EDIT_FOCUS_ITEM:
      ({ itemId } = action.payload);
      ({ value } = action.payload);
      searchApi.indexDocument(itemId, value);
      break;
    default:
  }
  return next(action);
};

export default index;
