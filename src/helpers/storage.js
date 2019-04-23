import localforage from 'localforage';
import debounce from 'lodash.debounce';

const loadFromStorage = async () => {
  const state = {};
  try {
    await localforage.iterate((value, key) => {
      // localforage stores null in first level keys as undefined
      // When returned and passed through setState(key: undefined), these
      // keys are not turned back into null by setState and are ignored.
      // As some app behaviors require the presence of these null values, I am
      // casting them back into null manually
      const valueSafe = value === undefined ? null : value;
      state[key] = valueSafe;
    });
    return Object.keys(state).length !== 0 ? state : null;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const commitToStorage = debounce((state) => {
  const keys = Object.keys(state);
  keys.forEach((key) => {
    localforage.setItem(key, state[key]).catch((err) => {
      console.err(err);
    });
  });
}, 250);

export { loadFromStorage, commitToStorage };
