import localforage from 'localforage';
import debounce from 'lodash.debounce';

const loadFromStorage = () => {
  let state = {}
  return localforage.iterate((value, key, index) => {
    // localforage stores null in first level keys as undefined
    // When returned and passed through setState(key: undefined), these
    // keys are not turned back into null by setState and are ignored.
    // As some app behaviors require the presence of these null values, I am
    // casting them back into null manually
    value = value === undefined ? null : value
    state[key] = value
  })
  .then(() => {
    return Object.keys(state).length !== 0 ? state : null
  })
  .catch((err) => { console.log(err) })
}

const commitToStorage = debounce((state) => {
  for(let item in state){
    localforage.setItem(item, state[item])
    .catch((err) => { console.error(err) })
  }
}, 250);

export {
  loadFromStorage,
  commitToStorage
}
