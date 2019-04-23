import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './ContentWrapper.module.css';

const renderViewLinks = pathname => (pathname === '/projects' ? (
  <Link className={styles.viewLink} to="/">
      Items
  </Link>
) : (
  <Link className={styles.viewLink} to="/projects">
      Projects
  </Link>
));

const contentWrapper = (props) => {
  const {
    children,
    isFocusOn,
    location: { pathname },
  } = props;
  return (
    <div className={styles.contentWrapper}>
      {children}
      {!isFocusOn ? renderViewLinks(pathname) : null}
    </div>
  );
};

contentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isFocusOn: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(contentWrapper);
