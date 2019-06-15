import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled from 'styled-components/macro';
import Button from '../Button/Button';
import * as actionCreators from '../../store/app/actionCreators';

const StyledFilter = styled(Button)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  background-color: white;
  opacity: ${props => (props.isActive ? 1 : 0.3)};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin: 0 0.5rem;
`;
const Filter = (props) => {
  const { type, active, toggleDateFilter } = props;

  return <StyledFilter isActive={active} onClick={() => toggleDateFilter(type)} />;
};

Filter.propTypes = {
  active: PropTypes.bool.isRequired,
  toggleDateFilter: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { filters } = state.app;
  const { type } = ownProps;

  return {
    active: filters[type],
  };
};

export default connect(
  mapStateToProps,
  actionCreators,
)(Filter);
