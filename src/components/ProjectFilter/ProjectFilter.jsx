import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '../Button/Button';
import * as actionCreatorsApp from '../../store/app/actionCreators';

import styles from './ProjectFilter.module.css';

const ProjectFilter = (props) => {
  const { projectFilter, resetProjectFilter } = props;

  return projectFilter ? (
    <Button className={styles.project} onClick={resetProjectFilter}>
      {`+${projectFilter}`}
    </Button>
  ) : null;
};

ProjectFilter.defaultProps = {
  projectFilter: null,
};

ProjectFilter.propTypes = {
  projectFilter: PropTypes.string,
  resetProjectFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  projectFilter: state.app.projectFilter,
});

export default connect(
  mapStateToProps,
  actionCreatorsApp,
)(ProjectFilter);
