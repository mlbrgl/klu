import React, {Component} from 'react';
import './FocusItem.css';

class FocusItem extends Component {

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
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.focus === nextProps.id) {
      this.setCaretEnd(this.ref);
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // From https://github.com/lovasoa/react-contenteditable/blob/master/src/react-contenteditable.js
    // "We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump"
    return nextProps.index === 0 && nextProps.children === '';
  }

  render() {
    return (
      <div className="focus-item">
        <span className="icon-right-open-big" onClick={this.props.deleted}></span>
        <div
          className="edit"
          dangerouslySetInnerHTML={{__html: this.props.children}}
          onKeyDown={this.props.keypressed}
          onInput={this.props.changed}
          ref={el => this.ref = el}
          spellCheck="false"
          contentEditable>
        </div>
      </div>
    )
  }

  componentDidMount() {
    // A bit of an overkill but covers both initial load and subsequent adds.
    // Will focus on the last element during the initial load sequence.
    this.setCaretEnd(this.ref);
  }

  componentDidUpdate() {
    // No idea why this is required. Even though the render does happen, and this.props.children
    // is saying holding the right value at console.log() time, the DOM is not being updated.
    // Demo of the issue: https://codepen.io/mlbrgl/pen/QQVMRP
    // Arrived at the same solution as https://github.com/lovasoa/react-contenteditable/blob/master/src/react-contenteditable.js
    this.ref.innerHTML = this.props.children;
  }

}

export default FocusItem;
