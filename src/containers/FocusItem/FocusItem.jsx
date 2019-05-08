import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './FocusItem.module.css';
import { isItemEligible } from '../../selectors/selectors';

class FocusItem extends PureComponent {
  render() {
    let focusItemStyles = [styles.focusitem];
    const {
      isDeleteOn, dates, category, isFocusOn, children,
    } = this.props;

    if (isDeleteOn) {
      focusItemStyles.push(styles.delete);
    } else if (dates.done !== null) {
      focusItemStyles.push(styles.done);
    } else if (isItemEligible(this.props)) {
      focusItemStyles.push(styles.eligible);
    } else if (category.name !== 'inbox') {
      focusItemStyles.push(styles.processed);
    }
    if (isFocusOn) {
      focusItemStyles.push(styles.focused);
    }

    focusItemStyles = focusItemStyles.join(' ');
    return <div className={focusItemStyles}>{children}</div>;
  }
}

FocusItem.propTypes = {
  isDeleteOn: PropTypes.bool.isRequired,
  dates: PropTypes.shape({
    done: PropTypes.string,
  }).isRequired,
  category: PropTypes.shape({ name: PropTypes.string, icon: PropTypes.string }).isRequired,
  isFocusOn: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default FocusItem;