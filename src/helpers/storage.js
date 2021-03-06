import localforage from 'localforage';
import debounce from 'lodash.debounce';
import { buildIndex } from '../store/store';

const loadFromStorage = async (setFocusItems, setProjects) => {
  try {
    const focusItems = await localforage.getItem('focusItems');
    if (focusItems) {
      setFocusItems(focusItems);
      buildIndex(focusItems);
    }
    const projects = await localforage.getItem('projects');
    if (projects) {
      setProjects(projects);
    }
  } catch (err) {
    console.error(err);
  }
  return null;
};

const commitToStorage = debounce((state) => {
  const keys = Object.keys(state);
  keys.forEach((key) => {
    localforage.setItem(key, state[key]).catch((err) => {
      console.error(err);
    });
  });
}, 250);

export { loadFromStorage, commitToStorage };
