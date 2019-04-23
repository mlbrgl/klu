import React from 'react';
import PropTypes from 'prop-types';

import styles from './Filters.module.css';

const filters = (props) => {
  const { children } = props;
  return <div className={styles.filters}>{children}</div>;
};

filters.propTypes = {
  children: PropTypes.node.isRequired,
};

export default filters;
