import { DateTime } from 'luxon';
import { PROJECT_ACTIVE } from '../helpers/constants';

const getNewFocusItem = (now, value = '') => {
  const timestamp = now.toMillis();
  return {
    id: timestamp,
    value,
    category: { name: 'inbox', icon: 'inbox' },
    dates: {
      start: null,
      done: null,
      due: null,
      modified: timestamp,
    },
  };
};

const getInitialState = () => ({
  focusItems: [getNewFocusItem(DateTime.local())],
  projects: [],
  isFocusOn: false,
  focusItemId: null,
  deleteItemId: null,
  filters: { done: false, actionable: true, future: false },
  projectFilter: null,
  searchQuery: '',
  searchResults: [],
});

const getNewProject = name => ({ name, frequency: 0, status: PROJECT_ACTIVE });

const buildIndex = (searchApi, focusItems) => {
  focusItems.forEach((item) => {
    searchApi.indexDocument(item.id, item.value);
  });
};

export {
  getInitialState, getNewFocusItem, getNewProject, buildIndex,
};
