import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../Button/Button';
import * as actionCreatorsProjects from '../../store/projects/actionCreators';
import * as actionCreatorsProjectFilter from '../../store/projectFilter/actionCreators';
import {
  PROJECT_ACTIVE,
  PROJECT_PENDING,
  PROJECT_PAUSED,
  PROJECT_COMPLETED,
} from '../../helpers/constants';

import styles from './Project.module.css';

class Project extends Component {
  onSetProjectFilter = () => {
    const { name, history, setProjectFilter } = this.props;
    history.push('/');
    setProjectFilter(name);
  };

  onUpProjectFrequencyHandler = (event) => {
    event.stopPropagation();
    const { upFrequency, name } = this.props;
    upFrequency(name);
  };

  onDownProjectFrequencyHandler = (event) => {
    event.stopPropagation();
    const { downFrequency, name } = this.props;
    downFrequency(name);
  };

  onPauseProjectHandler = (event) => {
    event.stopPropagation();
    const { setStatus, name } = this.props;
    setStatus(name, PROJECT_PAUSED);
  };

  onCompleteProjectHandler = (event) => {
    event.stopPropagation();
    const { setStatus, name } = this.props;
    setStatus(name, PROJECT_COMPLETED);
  };

  renderInfo() {
    let label;
    let actions = null;
    const { status, frequency } = this.props;

    if (status === PROJECT_PENDING) {
      label = <span>anything left?</span>;
      actions = this.renderActions();
    } else if (status === PROJECT_PAUSED) {
      label = 'paused';
    } else if (frequency > 0) {
      label = `${frequency}X a day`;
    }

    return label ? (
      <div className={styles.info}>
        <div className={styles.label}>{label}</div>
        {actions}
      </div>
    ) : null;
  }

  renderActions() {
    return (
      <div className={styles.actions}>
        <Button onClick={this.onSetProjectFilter}>yep</Button>
        <Button onClick={this.onPauseProjectHandler}>nothing for now</Button>
        <Button onClick={this.onCompleteProjectHandler}>nothing at all</Button>
      </div>
    );
  }

  render() {
    let projectStyles = styles.project;
    const { status, name } = this.props;
    if (status === PROJECT_PENDING) {
      projectStyles = styles.pending;
    } else if (status === PROJECT_PAUSED) {
      projectStyles = styles.paused;
    } else if (status === PROJECT_COMPLETED) {
      projectStyles = styles.completed;
    }

    return (
      <div
        className={projectStyles}
        onClick={this.onSetProjectFilter}
        onKeyPress={this.onSetProjectFilter}
        role="link"
        tabIndex="0"
        data-test="project"
      >
        {name}

        {status === PROJECT_ACTIVE ? (
          <div className={styles.frequency}>
            <Button className="icon-circle-with-plus" onClick={this.onUpProjectFrequencyHandler} />
            <Button
              className="icon-circle-with-minus"
              onClick={this.onDownProjectFrequencyHandler}
            />
          </div>
        ) : null}

        {this.renderInfo()}
      </div>
    );
  }
}

Project.propTypes = {
  downFrequency: PropTypes.func.isRequired,
  frequency: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  status: PropTypes.number.isRequired,
  upFrequency: PropTypes.func.isRequired,
};

export default withRouter(
  connect(
    null,
    { ...actionCreatorsProjects, ...actionCreatorsProjectFilter },
  )(Project),
);
