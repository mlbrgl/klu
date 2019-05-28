import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '../Button/Button';
import * as actionCreators from '../../store/projectFilter/actionCreators';

import styles from './ProjectFilter.module.css';

const ProjectFilter = (props) => {
  const { projectName, resetProjectFilter } = props;

  return projectName ? (
    <Button className={styles.project} onClick={resetProjectFilter}>
      {`+${projectName}`}
    </Button>
  ) : null;
};

ProjectFilter.defaultProps = {
  projectName: null,
};

ProjectFilter.propTypes = {
  projectName: PropTypes.string,
  resetProjectFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  projectName: state.projectFilter,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(ProjectFilter);
