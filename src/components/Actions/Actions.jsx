import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import Button from '../Button/Button';
import * as actionCreatorsFocusItems from '../../store/focusItems/actionCreators';

import styles from './Actions.module.css';

class Actions extends PureComponent {
  onDoneItemHandler = () => {
    const { history, markingDoneFocusItem, itemId } = this.props;
    markingDoneFocusItem(history, itemId);
  };

  onDoneAndWaitingItemHandler = () => {
    const {
      markingDoneFocusItem, addingFutureWaitingFocusItem, history, itemId,
    } = this.props;
    const now = DateTime.local();

    addingFutureWaitingFocusItem(now, itemId);
    markingDoneFocusItem(history, itemId);
  };

  onFocusingNextFocusItem = () => {
    const { focusingNextFocusItem, history } = this.props;
    focusingNextFocusItem(history);
  };

  render() {
    const { isFocusOn } = this.props;
    return (
      <div className={styles.actions}>
        <Button onClick={this.onFocusingNextFocusItem}>next up?</Button>
        {isFocusOn ? <Button onClick={this.onDoneItemHandler}>did it!</Button> : null}
        {isFocusOn ? (
          <Button onClick={this.onDoneAndWaitingItemHandler}>done &amp; waiting</Button>
        ) : null}
      </div>
    );
  }
}

Actions.defaultProps = {
  itemId: null,
};

Actions.propTypes = {
  addingFutureWaitingFocusItem: PropTypes.func.isRequired,
  focusingNextFocusItem: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFocusOn: PropTypes.bool.isRequired,
  itemId: PropTypes.number,
  markingDoneFocusItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
  itemId: state.app.focusItemId,
});

export default connect(
  mapStateToProps,
  actionCreatorsFocusItems,
)(Actions);
