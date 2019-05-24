import React, { useEffect } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Project from '../../components/Project/Project';
import * as actionCreators from '../../store/projects/actionCreators';

const Projects = (props) => {
  const { updateProjects, projects } = props;

  useEffect(() => {
    updateProjects(DateTime.local());
  }, [updateProjects]);

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
  focusItems: state.focusItems,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(Projects);
