import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../Button/Button';
import * as actionCreators from '../../store/actionCreators';

import styles from './ProjectFilter.module.css';

const ProjectFilter = (props) => {
  const { name, resetProjectFilter } = props;

  return name ? (
    <Button className={styles.project} onClick={resetProjectFilter}>
      {`+${name}`}
    </Button>
  ) : null;
};

ProjectFilter.defaultProps = {
  name: null,
};

ProjectFilter.propTypes = {
  name: PropTypes.string,
  resetProjectFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  name: state.projectName,
});

export default withRouter(
  connect(
    mapStateToProps,
    actionCreators,
  )(ProjectFilter),
);
