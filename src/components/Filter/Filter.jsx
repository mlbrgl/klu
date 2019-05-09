import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '../Button/Button';
import * as actionCreators from '../../store/filters/actionCreators';

import styles from './Filter.module.css';

const Filter = (props) => {
  const { type, active, toggleDateFilter } = props;
  const stylesFilter = active ? styles.active : styles.filter;

  return <Button className={stylesFilter} onClick={() => toggleDateFilter(type)} />;
};

Filter.propTypes = {
  active: PropTypes.bool.isRequired,
  toggleDateFilter: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { filters } = state;
  const { type } = ownProps;

  return {
    active: filters[type],
  };
};

export default connect(
  mapStateToProps,
  actionCreators,
)(Filter);
