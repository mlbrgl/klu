import React, { Component } from 'react';
import styles from './Editable.module.css';

class Editable extends Component {

  setCaretEnd = (el) => {
    // @TODO use props rather ?
    if(this.ref.innerHTML.length === 0) {
      this.ref.focus();
    } else {
      let range = document.createRange();
      // We start the range at the first (and only in our case) text node
      range.setStart(el.childNodes[0], el.childNodes[0].length);
      // No end, since we are not really creating a range but just a position
      range.collapse(true);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    this.props.resetInputFocus(); // Otherwise we can't edit in the middle of the text
  }

  // Whole story here https://codepen.io/mlbrgl/pen/QQVMRP
  updateInnerHtml() {
    this.ref.innerHTML = this.props.children;
  }

  componentWillReceiveProps = (nextProps) => {
    // Covers cases when deleted an element, so that focus is regained somewhere
    if(nextProps.inputFocus === true) {
      this.setCaretEnd(this.ref);
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // From https://github.com/lovasoa/react-contenteditable/blob/master/src/react-contenteditable.js
    // "We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump"
    // return nextProps.index === 0 && nextProps.children === '';
    return nextProps.children !== this.ref.innerHTML;
  }

  render() {
    let stylesEditable = this.props.isFocusOn ? styles.focused : styles.editable;
    return (
      <div
        className={stylesEditable}
        onKeyDown={this.props.onKeyDown}
        onInput={this.props.onInput}
        ref={el => this.ref = el}
        spellCheck="false"
        contentEditable="true">
      </div>
    )
  }

  componentDidMount() {
    this.updateInnerHtml();

    if(this.props.inputFocus === true) {
      this.setCaretEnd(this.ref);
    }
  }

  componentDidUpdate() {
    this.updateInnerHtml();
  }

}

export default Editable;
