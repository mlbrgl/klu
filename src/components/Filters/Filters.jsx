import React from 'react';
import styled from 'styled-components/macro';
import Filter from '../Filter/Filter';

const StyledFilters = styled.div`
  display: flex;
  flex-shrink: 0;
  max-width: 960px;
  width: 100%;
  margin: 1rem auto;
  justify-content: center;
`;

const Filters = () => (
  <StyledFilters>
    <Filter type="done" />
    <Filter type="actionable" />
    <Filter type="future" />
  </StyledFilters>
);

export default Filters;
