import React from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import Button from '../Button/Button';
import * as actionCreatorsFocusItems from '../../store/focusItems/actionCreators';
import { formatRelativeTimeFromNow } from '../../helpers/dates';

const DateButton = styled(Button)`
  display: flex;
  align-items: flex-start;
  margin-right: 2rem;
  font-size: 1rem;
  color: inherit;
  border: none;

  &:hover {
    color: red;
  }
`;

const Icon = styled.span`
  ${DateButton} & {
    padding: 0.22rem 0.8rem 0 0;
  }
`;

const Date = (props) => {
  const onRemoveDateHandler = () => {
    const { removeDateFocusItem, itemId, type } = props;
    const now = DateTime.local();
    removeDateFocusItem(now, type, itemId);
  };

  const now = DateTime.local();
  const { icon, date } = props;
  const parsedDate = DateTime.fromISO(date);
  const locale = 'en-gb';
  const format = { weekday: 'short', month: 'numeric', day: '2-digit' };

  return (
    <DateButton onClick={onRemoveDateHandler}>
      <Icon className={icon} />
      <span>
        {parsedDate.setLocale(locale).toLocaleString(format)}
        {' '}
(
        {formatRelativeTimeFromNow(now, parsedDate)}
)
      </span>
    </DateButton>
  );
};

Date.propTypes = {
  date: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  itemId: PropTypes.number.isRequired,
  removeDateFocusItem: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default connect(
  null,
  actionCreatorsFocusItems,
)(Date);
