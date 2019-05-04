import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../Button/Button';
import { TOGGLE_DATE_FILTER } from '../../store/actionTypes';

import styles from './Filter.module.css';

const Filter = (props) => {
  const { type, active, onToggleDateFilter } = props;
  const stylesFilter = active ? styles.active : styles.filter;

  return <Button className={stylesFilter} onClick={() => onToggleDateFilter(type)} />;
};

Filter.propTypes = {
  active: PropTypes.bool.isRequired,
  onToggleDateFilter: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { filters } = state;
  const { type } = ownProps;

  return {
    active: filters[type],
  };
};

const mapDispatchToProps = dispatch => ({
  // eslint-disable-next-line max-len
  onToggleDateFilter: type => dispatch({ type: TOGGLE_DATE_FILTER, payload: { type } }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Filter);
