import { PROJECT_ACTIVE } from '../helpers/constants';

const getNewFocusItem = (value = '') => {
  const currentDate = Date.now();
  return {
    id: currentDate,
    value,
    category: { name: 'inbox', icon: 'inbox' },
    dates: {
      start: null,
      done: null,
      due: null,
      modified: currentDate,
    },
  };
};

const getInitialState = () => ({
  focusItems: [getNewFocusItem()],
  projects: [],
  isFocusOn: false,
  focusItemId: null,
  deleteItemId: null,
  filters: { done: false, actionable: true, future: false },
  projectFilter: null,
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
