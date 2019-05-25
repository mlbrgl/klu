import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './Category.module.css';

const category = (props) => {
  const { isDeleteOn, isFocusOn, icon } = props;
  const categoryStyles = isFocusOn ? styles.focused : styles.category;

  return <span className={`${categoryStyles} icon-${isDeleteOn ? 'trash' : icon}`} />;
};

category.propTypes = {
  icon: PropTypes.string.isRequired,
  isDeleteOn: PropTypes.bool.isRequired,
  isFocusOn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isFocusOn: state.app.isFocusOn,
});

export default connect(mapStateToProps)(category);
