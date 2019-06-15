import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

const StyledButton = styled.button`
  transition: 0.3s;
  cursor: pointer;
  font-family: inherit;
  background: none;
`;

const Button = (props) => {
  const { children, ...otherProps } = props;

  return (
    <StyledButton type="button" {...otherProps}>
      {children}
    </StyledButton>
  );
};

Button.defaultProps = {
  children: null,
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
