import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

import styles from './Actions.module.css';

class Actions extends PureComponent {
  onDoneItemHandler = () => {
    const { onDoneItem, itemId } = this.props;
    onDoneItem(itemId);
  };

  onDoneAndWaitingItemHandler = () => {
    const { onDoneAndWaitingItem, itemId } = this.props;
    onDoneAndWaitingItem(itemId);
  };

  render() {
    const { onFocusNextItem, isFocusOn } = this.props;
    return (
      <div className={styles.actions}>
        <Button onClick={onFocusNextItem}>next up?</Button>
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
  isFocusOn: PropTypes.bool.isRequired,
  itemId: PropTypes.number,
  onDoneAndWaitingItem: PropTypes.func.isRequired,
  onDoneItem: PropTypes.func.isRequired,
  onFocusNextItem: PropTypes.func.isRequired,
};

export default withRouter(Actions);
