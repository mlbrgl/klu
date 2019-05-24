import debounce from 'lodash.debounce';

const getRandomElement = arr => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);

// The maximum is inclusive and the minimum is inclusive
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomIntInclusive = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const isCaretAtBeginningFieldItem = () => window.getSelection().anchorOffset === 0;

// Warning: doesn't work as expected with multiple spaces at the end of the field,
// as they are translated into &nbsp;
const isCaretAtEndFieldItem = () => {
  const { getSelection } = window;
  return getSelection().anchorOffset === getSelection().anchorNode.length;
};

const setCaretPosition = (element, position) => {
  const range = document.createRange();
  range.setStart(element, position);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

const sortMutable = debounce((focusItems) => {
  focusItems.sort((itemA, itemB) => itemB.dates.modified - itemA.dates.modified);
}, 2000);

const nonEmptyArrayOrNull = arr => (arr.length === 0 ? null : arr);

export {
  getRandomElement,
  getRandomIntInclusive,
  isCaretAtBeginningFieldItem,
  isCaretAtEndFieldItem,
  setCaretPosition,
  sortMutable,
  nonEmptyArrayOrNull,
};
