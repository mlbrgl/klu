import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Editable.module.css';

class Editable extends Component {
  constructor(props) {
    super(props);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onInputHandler = this.onInputHandler.bind(this);
  }

  componentDidMount() {
    this.updateInnerHtml();
  }

  shouldComponentUpdate(nextProps) {
    // From https://github.com/lovasoa/react-contenteditable/blob/master/src/react-contenteditable.js
    // "We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump"
    // return nextProps.index === 0 && nextProps.children === '';
    return nextProps.children !== this.ref.innerHTML;
  }

  componentDidUpdate() {
    this.updateInnerHtml();
  }

  onKeyDownHandler(event) {
    const { onKeyDownHandler, itemId } = this.props;
    onKeyDownHandler(event, itemId);
  }

  onInputHandler(event) {
    const { onInputHandler, itemId } = this.props;
    onInputHandler(event.target.innerHTML, itemId);
  }

  // Whole story here https://codepen.io/mlbrgl/pen/QQVMRP
  updateInnerHtml() {
    const { children } = this.props;
    this.ref.innerHTML = children;
  }

  render() {
    return (
      <div
        className={styles.editable}
        onKeyDown={this.onKeyDownHandler}
        onInput={this.onInputHandler}
        ref={(el) => {
          this.ref = el;
        }}
        spellCheck="false"
        contentEditable="plaintext-only"
        role="textbox"
        tabIndex="0"
      />
    );
  }
}

Editable.propTypes = {
  children: PropTypes.node.isRequired,
  itemId: PropTypes.number.isRequired,
  onInputHandler: PropTypes.func.isRequired,
  onKeyDownHandler: PropTypes.func.isRequired,
};

export default Editable;
