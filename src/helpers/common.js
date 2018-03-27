const getRandomElementId = (arr) => {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)].id : null;
}

// The maximum is inclusive and the minimum is inclusive
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isCaretAtBeginningFieldItem = () => {
  return window.getSelection().anchorOffset === 0;
}

// Warning: doesn't work as expected with multiple spaces at the end of the field,
// as they are translated into &nbsp;
const isCaretAtEndFieldItem = () => {
  return window.getSelection().anchorOffset === window.getSelection().anchorNode.length;
}

const setCaretPosition = (element, position) => {
  let range = document.createRange();
  range.setStart(element, position);
  range.collapse(true);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

export {
  getRandomElementId,
  getRandomIntInclusive,
  isCaretAtBeginningFieldItem,
  isCaretAtEndFieldItem,
  setCaretPosition
};
