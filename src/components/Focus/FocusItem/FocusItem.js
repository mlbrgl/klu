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
    // return nextProps.index === 0 && nextProps.children === '';
    return nextProps.children !== this.ref.innerHTML;
  }

  render() {
    return (
      <div className="focus-item">
        <span className="icon-right-open-big" onClick={this.props.deleted}></span>
        <div
          className="edit"
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
    // Whole story here https://codepen.io/mlbrgl/pen/QQVMRP
    this.updateInnerHtml();
    // A bit of an overkill but covers both initial load and subsequent adds.
    // Will focus on the last element during the initial load sequence.
    this.setCaretEnd(this.ref);
  }

  componentDidUpdate() {
    // Whole story here https://codepen.io/mlbrgl/pen/QQVMRP
    this.updateInnerHtml();
  }

  updateInnerHtml() {
    this.ref.innerHTML = this.props.children;
  }

}

export default FocusItem;
