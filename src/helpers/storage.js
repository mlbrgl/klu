import localforage from 'localforage';
import debounce from 'lodash.debounce';

const localStorageKey = 'klu';

const loadFromStorage = () => {
  return localforage.getItem(localStorageKey);
}

const commitToStorage = debounce((state) => {
  localforage.setItem(localStorageKey, state).catch((err) => {
    console.error(err);
  })
}, 250);

export {
  loadFromStorage,
  commitToStorage
}
