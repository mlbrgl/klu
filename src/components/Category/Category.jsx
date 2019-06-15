import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';

const StyledCategory = styled.span`
  font-size: 1.5rem;
  line-height: 3rem;
  float: left;

  ${props => (props.isFocusOn
    ? `
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem 1rem 0 0;
  line-height: 1;`
    : '')}
`;

const Category = (props) => {
  const { isDeleteOn, isFocusOn, icon } = props;

  return <StyledCategory isFocusOn={isFocusOn} className={`icon-${isDeleteOn ? 'trash' : icon}`} />;
};

Category.propTypes = {
  icon: PropTypes.string.isRequired,
  isDeleteOn: PropTypes.bool.isRequired,
  isFocusOn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
});

export default connect(mapStateToProps)(Category);
