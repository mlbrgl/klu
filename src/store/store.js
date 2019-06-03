import SearchApi from 'js-worker-search';
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

const getNewProject = name => ({ name, frequency: 0, status: PROJECT_ACTIVE });

const searchApi = new SearchApi();

const buildIndex = (focusItems) => {
  focusItems.forEach((item) => {
    searchApi.indexDocument(item.id, item.value);
  });
};

export {
  getNewFocusItem, getNewProject, buildIndex, searchApi,
};
