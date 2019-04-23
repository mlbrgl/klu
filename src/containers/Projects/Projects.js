import { Component } from 'react';
import PropTypes from 'prop-types';

class Projects extends Component {
  componentWillMount() {
    const { onMount } = this.props;
    onMount();
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

Projects.propTypes = {
  children: PropTypes.node.isRequired,
  onMount: PropTypes.func.isRequired,
};

export default Projects;
