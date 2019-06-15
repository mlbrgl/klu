import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled from 'styled-components/macro';
import Button from '../Button/Button';
import * as actionCreatorsApp from '../../store/app/actionCreators';


const StyledProjectFilter = styled(Button)`
  padding: 0 0 0 1rem;
  border: none;
  border-left: 1px solid grey;
  font-size: inherit;
  color: inherit;

  &:hover {
    color: red;
    cursor: pointer;
  }
`;

const ProjectFilter = (props) => {
  const { projectFilter, resetProjectFilter } = props;

  return projectFilter ? (
    <StyledProjectFilter onClick={resetProjectFilter}>{`+${projectFilter}`}</StyledProjectFilter>
  ) : null;
};

ProjectFilter.defaultProps = {
  projectFilter: null,
};

ProjectFilter.propTypes = {
  projectFilter: PropTypes.string,
  resetProjectFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  projectFilter: state.app.projectFilter,
});

export default connect(
  mapStateToProps,
  actionCreatorsApp,
)(ProjectFilter);
