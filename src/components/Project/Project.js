import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { PROJECT_ACTIVE, PROJECT_PENDING, PROJECT_PAUSED, PROJECT_COMPLETED} from '../../helpers/constants'

import styles from './Project.module.css'

class Project extends Component {

  render() {
    let projectStyles = [styles.project];
    if (this.props.status === PROJECT_PENDING) {
      projectStyles = styles.pending
    } else if(this.props.status === PROJECT_PAUSED) {
      projectStyles = styles.paused
    } else if(this.props.status === PROJECT_COMPLETED) {
      projectStyles = styles.completed
    }

    return (
      <div className={projectStyles} onClick={this.onFilterProjectHandler}>
        {this.props.name}

        {this.props.status === PROJECT_ACTIVE ?
          <div className={styles.frequency}>
            <span className="icon-circle-with-plus" onClick={this.onUpProjectFrequencyHandler}></span>
            <span className="icon-circle-with-minus" onClick={this.onDownProjectFrequencyHandler}></span>
          </div>
          : null
        }

        {this.renderInfo()}
      </div>
    )
  }

  renderInfo = () => {
    let label, actions = null;
    if(this.props.status === PROJECT_PENDING) {
      label = <span>anything left?</span>
      actions = this.renderActions()
    } else if(this.props.status === PROJECT_PAUSED) {
      label = 'paused'
    } else if(this.props.frequency > 0) {
      label = this.props.frequency + 'X a day';
    }

    if(label) {
      return (
        <div className={styles.info}>
          <div className={styles.label}>
            {label}
          </div>
          {actions}
        </div>
      )
    }
  }

  renderActions = () => {
    return(
      <div className={styles.actions}>
        <span onClick={this.onAddWorkProjectHandler}>yep</span>
        <span onClick={this.onPauseProjectHandler}>nothing for now</span>
        <span onClick={this.onCompleteProjectHandler}>nothing at all</span>
      </div>
    )
  }

  onFilterProjectHandler = () => {
    this.props.history.push('/?project=' + this.props.name)
  }

  onUpProjectFrequencyHandler = (event) => {
    event.stopPropagation()
    this.props.onUpProjectFrequency(this.props.name)
  }

  onDownProjectFrequencyHandler = (event) => {
    event.stopPropagation()
    this.props.onDownProjectFrequency(this.props.name)
  }

  onAddWorkProjectHandler = (event) => {
    this.props.history.push('/?project=' + this.props.name)
  }

  onPauseProjectHandler = (event) => {
    event.stopPropagation()
    this.props.onSetProjectStatus(this.props.name, PROJECT_PAUSED)
  }

  onCompleteProjectHandler = (event) => {
    event.stopPropagation()
    this.props.onSetProjectStatus(this.props.name, PROJECT_COMPLETED)
  }
}


export default withRouter(Project)
