import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import debounce from 'lodash.debounce';
import styled from 'styled-components/macro';
import * as actionCreatorsFocusItems from '../../store/focusItems/actionCreators';
import * as actionsCreatorsApp from '../../store/app/actionCreators';
import { CATEGORIES } from '../../helpers/constants';
import {
  isCaretAtEndFieldItem,
  setCaretPosition,
  isCaretAtBeginningFieldItem,
} from '../../helpers/common';
import { getProjectNameFromItem } from '../../selectors/selectors';

const StyledEditable = styled.div`
  outline: none;
  word-wrap: break-word;
  margin-left: 3rem;
`;

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
    return nextProps.value !== this.ref.innerHTML;
  }

  componentDidUpdate() {
    this.updateInnerHtml();
  }

  onInputEditableItemHandler = debounce((innerHTML, itemId) => {
    const { editFocusItem } = this.props;
    editFocusItem(DateTime.local(), innerHTML, itemId);
  }, 250);

  onInputHandler(event) {
    const { itemId } = this.props;
    this.onInputEditableItemHandler(event.target.innerHTML, itemId);
  }

  onKeyDownHandler(event) {
    const {
      itemId,
      history,
      setProjectFilter,
      markDoneFocusItem,
      setFocus,
      toggleFocus,
      deleteFocusItem,
      isDeleteOn,
      setDeleteOn,
      value,
    } = this.props;

    switch (event.key) {
      case 'Escape':
        if (isDeleteOn) {
          event.stopPropagation();
          setDeleteOn(false);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (event.metaKey || event.ctrlKey) {
          if (event.shiftKey) {
            markDoneFocusItem(history, itemId);
          } else {
            setProjectFilter(getProjectNameFromItem(value));
          }
        } else if (isDeleteOn) {
          deleteFocusItem(history, itemId);
        } else {
          setFocus({ focusItemId: itemId });
          toggleFocus();
        }
        break;

      case 'Backspace':
      case 'Delete':
        if (value.length === 0) {
          event.preventDefault();
          deleteFocusItem(history, itemId);
        } else if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          setDeleteOn(true);
        }
        break;

      case 'ArrowUp':
        if (event.metaKey || event.ctrlKey) {
          const { incStartDateFocusItem, incDueDateFocusItem } = this.props;
          event.preventDefault();
          if (isCaretAtBeginningFieldItem()) {
            incStartDateFocusItem(
              DateTime.local(),
              event.altKey ? { weeks: 1 } : { days: 1 },
              itemId,
            );
          } else if (isCaretAtEndFieldItem()) {
            incDueDateFocusItem(
              DateTime.local(),
              event.altKey ? { weeks: 1 } : { days: 1 },
              itemId,
            );
          }
        }
        break;

      case 'ArrowDown':
        if (event.metaKey || event.ctrlKey) {
          const { decStartDateFocusItem, decDueDateFocusItem } = this.props;
          event.preventDefault();
          if (isCaretAtBeginningFieldItem()) {
            decStartDateFocusItem(
              DateTime.local(),
              event.altKey ? { weeks: 1 } : { days: 1 },
              itemId,
            );
          } else if (isCaretAtEndFieldItem()) {
            decDueDateFocusItem(
              DateTime.local(),
              event.altKey ? { weeks: 1 } : { days: 1 },
              itemId,
            );
          }
        }
        break;

      case 'ArrowRight':
        if (!event.shiftKey) {
          if (event.metaKey || event.ctrlKey) {
            if (event.target.childNodes[0]) {
              // field not empty
              setCaretPosition(event.target.childNodes[0], event.target.childNodes[0].length);
            }
          } else if (isCaretAtEndFieldItem()) {
            const { nextCategoryFocusItem } = this.props;
            nextCategoryFocusItem(DateTime.local(), itemId, CATEGORIES);
          }
        }
        break;

      case 'ArrowLeft':
        if (!event.shiftKey) {
          if (event.metaKey || event.ctrlKey) {
            setCaretPosition(event.target.childNodes[0], 0);
          } else if (isCaretAtBeginningFieldItem()) {
            setDeleteOn(true);
          }
        }
        break;
      default:
    }
  }

  // Whole story here https://codepen.io/mlbrgl/pen/QQVMRP
  updateInnerHtml() {
    const { value } = this.props;
    this.ref.innerHTML = value;
  }

  render() {
    return (
      <StyledEditable
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
  value: PropTypes.string.isRequired,
  decDueDateFocusItem: PropTypes.func.isRequired,
  decStartDateFocusItem: PropTypes.func.isRequired,
  deleteFocusItem: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  incDueDateFocusItem: PropTypes.func.isRequired,
  incStartDateFocusItem: PropTypes.func.isRequired,
  isDeleteOn: PropTypes.bool.isRequired,
  itemId: PropTypes.number.isRequired,
  markDoneFocusItem: PropTypes.func.isRequired,
  nextCategoryFocusItem: PropTypes.func.isRequired,
  setDeleteOn: PropTypes.func.isRequired,
  setFocus: PropTypes.func.isRequired,
  toggleFocus: PropTypes.func.isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  editFocusItem: PropTypes.func.isRequired,
};

export default connect(
  null,
  { ...actionCreatorsFocusItems, ...actionsCreatorsApp },
)(Editable);
