import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import Date from '../Date/Date';

const StyledDates = styled.div`
  display: flex;
  align-items: flex-start;
  margin-left: 3rem;
  padding-right: 1rem;
`;

class Dates extends PureComponent {
  render() {
    const dates = [];
    const { startdate, duedate, donedate } = this.props;

    if (donedate) {
      dates.push({ date: donedate, type: 'done', icon: 'icon-aircraft-landing' });
    } else if (!!startdate || !!duedate) {
      if (startdate) {
        dates.push({ date: startdate, type: 'start', icon: 'icon-aircraft-take-off' });
      }
      if (duedate) {
        dates.push({ date: duedate, type: 'due', icon: 'icon-aircraft-landing' });
      }
    }

    if (dates.length) {
      const { itemId } = this.props;
      return (
        <StyledDates>
          {dates.map(date => (
            <Date key={date.icon} itemId={itemId} {...date} />
          ))}
        </StyledDates>
      );
    }
    return null;
  }
}

Dates.defaultProps = {
  donedate: null,
  duedate: null,
  startdate: null,
};

Dates.propTypes = {
  donedate: PropTypes.string,
  duedate: PropTypes.string,
  startdate: PropTypes.string,
  itemId: PropTypes.number.isRequired,
};

export default Dates;
