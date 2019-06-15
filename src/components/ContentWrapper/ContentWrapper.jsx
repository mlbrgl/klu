import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';

const ViewLink = styled(Link)`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0 0 1rem 1.5rem;
  font-size: 1.5rem;
  color: gray;
  transition: 0.5s;
  text-decoration: none;

  &:hover {
    color: white;
  }
`;

const StyledContentWrapper = styled.div`
  overflow: auto;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;

  &::-webkit-scrollbar {
    width: 0.8rem;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb {
    background-color: #fff;
  }
`;

const renderViewLinks = pathname => (pathname === '/projects' ? (
  <ViewLink to="/">Items</ViewLink>
) : (
  <ViewLink to="/projects">Projects</ViewLink>
));

const ContentWrapper = (props) => {
  const {
    children,
    isFocusOn,
    location: { pathname },
  } = props;
  return (
    <StyledContentWrapper>
      {children}
      {!isFocusOn ? renderViewLinks(pathname) : null}
    </StyledContentWrapper>
  );
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isFocusOn: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
});

export default withRouter(connect(mapStateToProps)(ContentWrapper));
