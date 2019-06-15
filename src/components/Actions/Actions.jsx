import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import styled from 'styled-components/macro';
import Button from '../Button/Button';
import * as actionCreatorsFocusItems from '../../store/focusItems/actionCreators';

const StyledActions = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0 1.5rem 1rem 0;
`;

const StyledButton = styled(Button)`
  ${StyledActions} & {
    margin-left: 1rem;
    font-size: 1.5rem;
    color: grey;
    border: 1px solid;
  }

  ${StyledActions} &:hover {
    color: white;
  }
`;

class Actions extends PureComponent {
  onDoneItemHandler = () => {
    const { history, markDoneFocusItem, itemId } = this.props;
    markDoneFocusItem(history, itemId);
  };

  onDoneAndWaitingItemHandler = () => {
    const {
      markDoneFocusItem, addingFutureWaitingFocusItem, history, itemId,
    } = this.props;
    const now = DateTime.local();

    addingFutureWaitingFocusItem(now, itemId);
    markDoneFocusItem(history, itemId);
  };

  onFocusingNextFocusItem = () => {
    const { focusingNextFocusItem, history } = this.props;
    focusingNextFocusItem(history);
  };

  render() {
    const { isFocusOn } = this.props;
    return (
      <StyledActions>
        <StyledButton onClick={this.onFocusingNextFocusItem}>next up?</StyledButton>
        {isFocusOn ? <StyledButton onClick={this.onDoneItemHandler}>did it!</StyledButton> : null}
        {isFocusOn ? (
          <StyledButton onClick={this.onDoneAndWaitingItemHandler}>done &amp; waiting</StyledButton>
        ) : null}
      </StyledActions>
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
  markDoneFocusItem: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
  itemId: state.app.focusItemId,
});

export default connect(
  mapStateToProps,
  actionCreatorsFocusItems,
)(Actions);
