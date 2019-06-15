import React, { useState } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import { isItemEligible } from '../../selectors/selectors';
import Dates from '../Dates/Dates';
import Editable from '../Editable/Editable';
import Category from '../Category/Category';
import StyledListItem from '../StyledListItem/StyledListItem';

const StyledFocusItem = styled(StyledListItem)`
  color: yellow;

  ${props => (props.isFocused
    ? `
    margin-top: 15vh;
    font-size: 4rem;
  `
    : null)};

  ${(props) => {
    const {
      isDeleteOn, isDone, isEligible, isProcessed,
    } = props;
    if (isDeleteOn) {
      return 'color: red;';
    }
    if (isDone) {
      return `
      color: grey;
      text-decoration: line-through;`;
    }
    if (isEligible) {
      return `
      color: white;
      opacity: 1;
      `;
    }
    if (isProcessed) {
      return 'color: grey;';
    }
    return null;
  }}
`;

const FocusItem = (props) => {
  const {
    isFocusOn,
    focusItemId,
    item: {
      dates, category, id, value,
    },
    history,
  } = props;
  const now = DateTime.local();
  const [isDeleteOn, setDeleteOn] = useState(false);
  const isFocused = !!(id === focusItemId && isFocusOn);
  const isDone = dates.done !== null;
  const isEligible = isItemEligible(now, { category, dates });
  const isProcessed = category.name !== 'inbox';

  return (
    <StyledFocusItem
      isDeleteOn={isDeleteOn}
      isEligible={isEligible}
      isFocused={isFocused}
      isDone={isDone}
      isProcessed={isProcessed}
    >
      <Category name={category.name} icon={category.icon} isDeleteOn={isDeleteOn} />

      <Editable
        isDeleteOn={isDeleteOn}
        setDeleteOn={setDeleteOn}
        itemId={id}
        history={history}
        value={value}
      />

      <Dates startdate={dates.start} duedate={dates.due} donedate={dates.done} itemId={id} />
    </StyledFocusItem>
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
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
  focusItemId: state.app.focusItemId,
});

export default connect(mapStateToProps)(FocusItem);
