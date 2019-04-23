import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const button = (props) => {
  const { className, children, ...otherProps } = props;
  const allStyles = [styles.button, className];

  return (
    <button className={allStyles.join(' ')} type="button" {...otherProps}>
      {children}
    </button>
  );
};

button.defaultProps = {
  className: null,
  children: null,
};

button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default button;
