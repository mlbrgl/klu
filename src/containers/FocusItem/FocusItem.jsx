import React, { useState } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './FocusItem.module.css';
import { isItemEligible } from '../../selectors/selectors';
import Dates from '../Dates/Dates';
import Editable from '../../components/Editable/Editable';
import Category from '../../components/Category/Category';

const FocusItem = (props) => {
  let focusItemStyles = [styles.focusitem];
  const {
    isFocusOn,
    focusItemId,
    item: {
      dates, category, id, value,
    },
    history,
    onInputEditableItemHandler,
  } = props;
  const now = DateTime.local();
  const [isDeleteOn, setDeleteOn] = useState(false);
  const isFocusOnItem = !!(id === focusItemId && isFocusOn);

  if (isDeleteOn) {
    focusItemStyles.push(styles.delete);
  } else if (dates.done !== null) {
    focusItemStyles.push(styles.done);
  } else if (isItemEligible(now, { category, dates })) {
    focusItemStyles.push(styles.eligible);
  } else if (category.name !== 'inbox') {
    focusItemStyles.push(styles.processed);
  }
  if (isFocusOnItem) {
    focusItemStyles.push(styles.focused);
  }

  focusItemStyles = focusItemStyles.join(' ');
  return (
    <div className={focusItemStyles}>
      <Category name={category.name} icon={category.icon} isDeleteOn={isDeleteOn} />

      <Editable
        onInputHandler={onInputEditableItemHandler}
        isDeleteOn={isDeleteOn}
        setDeleteOn={setDeleteOn}
        itemId={id}
        history={history}
      >
        {value}
      </Editable>

      <Dates startdate={dates.start} duedate={dates.due} donedate={dates.done} itemId={id} />
    </div>
  );
};

FocusItem.defaultProps = {
  focusItemId: null,
};

FocusItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    value: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
    }).isRequired,
    dates: PropTypes.shape({
      done: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isFocusOn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  focusItemId: PropTypes.number,
  onInputEditableItemHandler: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
  focusItemId: state.app.focusItemId,
});

export default connect(mapStateToProps)(FocusItem);
