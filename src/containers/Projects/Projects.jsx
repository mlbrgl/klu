import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Project from '../../components/Project/Project';
import * as actionCreators from '../../store/actionCreators';

const Projects = (props) => {
  const { focusItems, updateProjects, projects } = props;

  useEffect(() => {
    updateProjects(focusItems);
  }, [updateProjects, focusItems]);

  return projects.map(project => (
    <Project
      key={project.name}
      frequency={project.frequency}
      status={project.status}
      name={project.name}
    />
  ));
};

Projects.propTypes = {
  focusItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      frequency: PropTypes.number,
      status: PropTypes.number,
    }),
  ).isRequired,
  updateProjects: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  projects: state.projects,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(Projects);
