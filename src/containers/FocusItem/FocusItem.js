import React, { PureComponent } from 'react';
import styles from './FocusItem.module.css';
import { isItemEligible } from '../../selectors/selectors'

class FocusItem extends PureComponent {

  render(){
    let focusItemStyles = [styles.focusitem];

    if (this.props.isDeleteOn) {
      focusItemStyles.push(styles.delete);
    } else if (this.props.dates.done !== null) {
      focusItemStyles.push(styles.done);
    } else if (isItemEligible(this.props)) {
        focusItemStyles.push(styles.eligible);
    } else if (this.props.category.name !== 'inbox') {
      focusItemStyles.push(styles.processed);
    }
    if (this.props.isFocusOn) {
      focusItemStyles.push(styles.focused);
    }

    focusItemStyles = focusItemStyles.join(' ');

    return (
      <div className={focusItemStyles}>
        {this.props.children}
      </div>
    )
  }

}

export default FocusItem;
