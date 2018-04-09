import React, { Component } from 'react';
import styles from './Editable.module.css';

class Editable extends Component {

  // Whole story here https://codepen.io/mlbrgl/pen/QQVMRP
  updateInnerHtml() {
    this.ref.innerHTML = this.props.children;
  }

  onInputHandler = (event) => {
    this.props.onInputHandler(event.target.innerHTML, this.props.itemId)
  }

  onKeyDownHandler = (event) => {
    this.props.onKeyDownHandler(event, this.props.itemId)
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // From https://github.com/lovasoa/react-contenteditable/blob/master/src/react-contenteditable.js
    // "We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump"
    // return nextProps.index === 0 && nextProps.children === '';
    return nextProps.children !== this.ref.innerHTML;
  }

  render() {
    return (
      <div
        className={styles.editable}
        onKeyDown={this.onKeyDownHandler}
        onInput={this.onInputHandler}
        ref={el => this.ref = el}
        spellCheck="false"
        contentEditable="plaintext-only">
      </div>
    )
  }

  componentDidMount() {
    this.updateInnerHtml();
  }

  componentDidUpdate() {
    this.updateInnerHtml();
  }

}

export default Editable;
