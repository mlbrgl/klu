import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { getRandomIntInclusive } from '../../helpers/common';

const StyledFrame = styled.div`
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url('${process.env.PUBLIC_URL}/images/${getRandomIntInclusive(1, 8)}.jpg');
`;

const Inner = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: 1rem;
  padding: 3rem 3rem 4rem;
  border: 0.75rem solid white;
  background-color: rgba(0, 0, 0, 0.6);
`;

const Frame = (props) => {
  const { children } = props;
  return (
    <StyledFrame>
      <Inner>{children}</Inner>
    </StyledFrame>
  );
};

Frame.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Frame;
