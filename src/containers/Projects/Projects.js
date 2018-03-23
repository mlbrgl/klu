import { Component } from 'react';

class Projects extends Component {

  componentWillMount() {
    this.props.onMount();
  }

  render() {
    return this.props.children
  }
}

export default Projects;
